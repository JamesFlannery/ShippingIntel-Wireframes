/**
 * Product Discovery Analytics - Maritime Intelligence Platform
 * Captures behavioral patterns to identify product opportunities
 */

class ProductDiscoveryTracker {
    constructor(config = {}) {
        this.config = {
            apiEndpoint: config.apiEndpoint || '/api/analytics/events',
            sessionTimeout: config.sessionTimeout || 30 * 60 * 1000, // 30 minutes
            dwellThreshold: config.dwellThreshold || 30, // seconds
            debugMode: config.debugMode || false,
            ...config
        };
        
        this.sessionId = this.generateSessionId();
        this.userId = this.getUserId();
        this.sessionStartTime = Date.now();
        this.events = [];
        this.dwellTimer = null;
        this.currentDwell = null;
        this.mousePattern = [];
        this.viewSequence = [];
        this.backtrackCount = 0;
        
        // Intent detection engines
        this.intentDetector = new IntentDetector(this);
        this.frictionDetector = new FrictionDetector(this);
        
        this.init();
        this.log('ProductDiscoveryTracker initialized', {sessionId: this.sessionId});
    }
    
    generateSessionId() {
        return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    getUserId() {
        let userId = localStorage.getItem('pd_user_id');
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('pd_user_id', userId);
        }
        return userId;
    }
    
    init() {
        // Core interaction tracking
        document.addEventListener('click', (e) => this.trackInteraction(e, 'click'));
        document.addEventListener('dblclick', (e) => this.trackInteraction(e, 'double_click'));
        document.addEventListener('contextmenu', (e) => this.trackInteraction(e, 'right_click'));
        document.addEventListener('mousemove', (e) => this.trackMousePattern(e));
        document.addEventListener('keydown', (e) => this.trackKeyboard(e));
        document.addEventListener('scroll', (e) => this.trackScroll(e));
        
        // Text selection tracking
        document.addEventListener('selectstart', (e) => this.trackTextSelection(e));
        document.addEventListener('selectionchange', () => this.trackSelectionChange());
        
        // Advanced behavior detection
        this.startDwellTracking();
        this.detectNavigationPatterns();
        this.monitorFailedInteractions();
        this.detectCalculationAttempts();
        this.detectComparisonAttempts();
        this.detectExportAttempts();
        
        // Page lifecycle
        window.addEventListener('beforeunload', () => this.trackExit());
        window.addEventListener('popstate', () => this.trackNavigation());
        window.addEventListener('focus', () => this.trackPageFocus());
        window.addEventListener('blur', () => this.trackPageBlur());
        
        // Track initial page load
        this.trackPageLoad();
    }
    
    // ============ CORE EVENT TRACKING ============
    
    trackInteraction(event, actionType) {
        const target = event.target;
        const context = this.getContentContext();
        const elementInfo = this.getElementInfo(target);
        
        const interactionEvent = {
            sessionId: this.sessionId,
            userId: this.userId,
            timestamp: new Date().toISOString(),
            eventType: "interaction",
            currentView: this.getCurrentView(),
            contentContext: context,
            sessionDuration: this.getSessionDuration(),
            eventData: {
                action: actionType,
                target: elementInfo,
                coordinates: {x: event.clientX, y: event.clientY},
                modifiers: this.getModifiers(event),
                mouseButton: event.button
            }
        };
        
        // Analyze for intent and friction
        this.intentDetector.analyze(interactionEvent);
        this.frictionDetector.analyze(interactionEvent);
        
        this.sendEvent(interactionEvent);
        this.log('Interaction tracked', {action: actionType, element: elementInfo.element});
    }
    
    trackMousePattern(event) {
        const now = Date.now();
        this.mousePattern.push({
            x: event.clientX,
            y: event.clientY,
            timestamp: now
        });
        
        // Keep only last 10 seconds of mouse data
        this.mousePattern = this.mousePattern.filter(p => now - p.timestamp < 10000);
        
        // Detect mouse patterns
        if (this.mousePattern.length > 10) {
            const pattern = this.analyzeBehaviorPattern();
            if (pattern) {
                this.trackIntent('mouse_behavior_pattern', {
                    pattern: pattern,
                    duration: now - this.mousePattern[0].timestamp
                });
            }
        }
    }
    
    trackKeyboard(event) {
        const keyData = {
            key: event.key,
            ctrlKey: event.ctrlKey,
            metaKey: event.metaKey,
            shiftKey: event.shiftKey,
            altKey: event.altKey
        };
        
        // Detect common intent signals
        if ((event.ctrlKey || event.metaKey)) {
            switch(event.key.toLowerCase()) {
                case 'c':
                    this.trackIntent('copy_attempt', {
                        activeElement: this.getElementInfo(document.activeElement),
                        selectedText: window.getSelection().toString()
                    });
                    break;
                case 's':
                    event.preventDefault(); // Prevent browser save
                    this.trackIntent('save_attempt', {
                        currentView: this.getCurrentView(),
                        activeElement: this.getElementInfo(document.activeElement)
                    });
                    break;
                case 'f':
                    this.trackIntent('search_attempt', {
                        currentView: this.getCurrentView()
                    });
                    break;
            }
        }
        
        this.sendEvent({
            sessionId: this.sessionId,
            userId: this.userId,
            timestamp: new Date().toISOString(),
            eventType: "keyboard",
            currentView: this.getCurrentView(),
            eventData: keyData
        });
    }
    
    trackTextSelection(event) {
        const target = event.target;
        const elementInfo = this.getElementInfo(target);
        
        setTimeout(() => {
            const selectedText = window.getSelection().toString();
            if (selectedText && selectedText.length > 3) {
                this.trackIntent('data_extraction_attempt', {
                    selectedText: selectedText.substring(0, 200), // Limit length
                    sourceElement: elementInfo,
                    selectionLength: selectedText.length
                });
            }
        }, 100); // Small delay to capture actual selection
    }
    
    // ============ DWELL TIME TRACKING ============
    
    startDwellTracking() {
        let lastActivity = Date.now();
        
        const updateActivity = () => {
            lastActivity = Date.now();
        };
        
        // Reset activity timer on any interaction
        ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
            document.addEventListener(event, updateActivity, true);
        });
        
        // Check for dwell patterns every 5 seconds
        setInterval(() => {
            const now = Date.now();
            const idleTime = now - lastActivity;
            
            if (idleTime > this.config.dwellThreshold * 1000) {
                this.trackDwellPattern(idleTime);
            }
        }, 5000);
    }
    
    trackDwellPattern(idleTime) {
        const currentView = this.getCurrentView();
        const context = this.getContentContext();
        
        this.sendEvent({
            sessionId: this.sessionId,
            userId: this.userId,
            timestamp: new Date().toISOString(),
            eventType: "dwell_pattern",
            currentView: currentView,
            contentContext: context,
            eventData: {
                dwellDuration: idleTime,
                viewportVisible: this.isViewportVisible(),
                activeElement: this.getElementInfo(document.activeElement)
            }
        });
        
        // Check for analysis paralysis
        if (idleTime > 60000) { // 1 minute
            this.frictionDetector.detectAnalysisParalysis(currentView, context, idleTime);
        }
    }
    
    // ============ INTENT DETECTION ============
    
    trackIntent(intentType, evidence) {
        this.sendEvent({
            sessionId: this.sessionId,
            userId: this.userId,
            timestamp: new Date().toISOString(),
            eventType: "intent_signal",
            currentView: this.getCurrentView(),
            contentContext: this.getContentContext(),
            eventData: {
                intentType: intentType,
                evidence: evidence,
                confidence: this.calculateIntentConfidence(intentType, evidence)
            }
        });
        
        this.log('Intent detected', {type: intentType, confidence: this.calculateIntentConfidence(intentType, evidence)});
    }
    
    detectCalculationAttempts() {
        // Track interactions with numerical data
        const numberElements = document.querySelectorAll('[data-price], [data-value], .forecast-value, .bar-item');
        
        numberElements.forEach(element => {
            element.addEventListener('click', (e) => {
                if (e.detail > 1) { // Double click
                    this.trackIntent('calculation_attempt', {
                        method: 'double_click_number',
                        value: element.textContent?.trim(),
                        context: this.getElementContext(element)
                    });
                }
            });
            
            element.addEventListener('contextmenu', (e) => {
                this.trackIntent('calculation_attempt', {
                    method: 'right_click_number',
                    value: element.textContent?.trim(),
                    context: this.getElementContext(element)
                });
            });
        });
    }
    
    detectComparisonAttempts() {
        let viewSequence = [];
        const maxSequenceLength = 10;
        
        // Track navigation patterns
        const trackViewChange = () => {
            const currentView = this.getCurrentView();
            const timestamp = Date.now();
            
            viewSequence.push({view: currentView, timestamp});
            
            // Keep sequence manageable
            if (viewSequence.length > maxSequenceLength) {
                viewSequence = viewSequence.slice(-maxSequenceLength);
            }
            
            // Detect rapid switching between similar views
            if (this.isComparisonPattern(viewSequence)) {
                this.trackIntent('comparison_attempt', {
                    method: 'rapid_view_switching',
                    viewSequence: viewSequence.slice(-5), // Last 5 views
                    pattern: 'data_comparison'
                });
            }
        };
        
        // Monitor hash changes and navigation
        window.addEventListener('hashchange', trackViewChange);
        window.addEventListener('popstate', trackViewChange);
        
        // Monitor function nav clicks
        document.querySelectorAll('.function-btn').forEach(btn => {
            btn.addEventListener('click', trackViewChange);
        });
    }
    
    detectExportAttempts() {
        // Track export button interactions
        document.querySelectorAll('.export-btn, [class*="export"], [class*="download"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.trackIntent('export_attempt', {
                    method: 'export_button_click',
                    buttonText: btn.textContent?.trim(),
                    context: this.getContentContext()
                });
            });
        });
        
        // Track Print attempts
        window.addEventListener('beforeprint', () => {
            this.trackIntent('export_attempt', {
                method: 'browser_print',
                context: this.getContentContext()
            });
        });
    }
    
    // ============ HELPER METHODS ============
    
    getCurrentView() {
        const path = window.location.pathname.split('/').pop() || 'index.html';
        return path.replace('.html', '');
    }
    
    getContentContext() {
        const context = {
            storyId: 'gulf-coast-ammonia-plant', // Hard-coded for this implementation
            url: window.location.href,
            referrer: document.referrer,
            timestamp: new Date().toISOString(),
            domainContext: this.extractDomainContext()
        };
        
        // Extract visible content indicators
        const activeElements = document.querySelectorAll('.active, .current, .highlight');
        if (activeElements.length > 0) {
            context.activeContent = Array.from(activeElements).map(el => ({
                class: el.className,
                text: el.textContent?.trim().substring(0, 100)
            }));
        }
        
        return context;
    }
    
    extractDomainContext() {
        const currentView = this.getCurrentView();
        const domainContext = {
            marketFocus: 'ammonia',
            analysisType: this.getAnalysisType(currentView),
            businessStage: this.getBusinessStage(),
            decisionContext: this.getDecisionContext()
        };
        
        // Extract maritime-specific data points
        const visibleText = document.body.textContent || '';
        
        // Pricing context
        if (visibleText.includes('$435') || visibleText.includes('Tampa')) {
            domainContext.pricingFocus = 'tampa_contract_pricing';
        }
        
        // Geographic context
        if (visibleText.includes('Trinidad') || visibleText.includes('USG')) {
            domainContext.geographicComparison = true;
        }
        
        // Timeline context
        if (visibleText.includes('Dancing Brave') || visibleText.includes('March 28')) {
            domainContext.eventFocus = 'first_cargo_shipment';
        }
        
        // Supply chain context
        if (visibleText.includes('1.3M t/y') || visibleText.includes('capacity')) {
            domainContext.capacityAnalysis = true;
        }
        
        return domainContext;
    }
    
    getAnalysisType(currentView) {
        const analysisTypes = {
            'data': 'quantitative_analysis',
            'geography': 'spatial_analysis', 
            'timeline': 'temporal_analysis',
            'impact': 'impact_assessment',
            'connections': 'relationship_analysis',
            'players': 'competitive_analysis',
            'story': 'narrative_analysis',
            'index': 'overview_analysis'
        };
        
        return analysisTypes[currentView] || 'general_analysis';
    }
    
    getBusinessStage() {
        const sessionDuration = this.getSessionDuration();
        if (sessionDuration < 60000) return 'initial_exploration';
        if (sessionDuration < 300000) return 'active_analysis';
        return 'deep_investigation';
    }
    
    getDecisionContext() {
        const events = this.events.filter(e => e.eventType === 'intent_signal');
        const hasCalculation = events.some(e => e.eventData.intentType?.includes('calculation'));
        const hasExport = events.some(e => e.eventData.intentType?.includes('export'));
        const hasComparison = events.some(e => e.eventData.intentType?.includes('comparison'));
        
        if (hasCalculation && hasComparison) return 'strategic_decision_making';
        if (hasExport) return 'information_gathering';
        if (hasCalculation) return 'quantitative_analysis';
        if (hasComparison) return 'option_evaluation';
        return 'exploratory_research';
    }
    
    getElementInfo(element) {
        if (!element) return null;
        
        return {
            element: element.tagName.toLowerCase() + (element.id ? '#' + element.id : ''),
            elementText: element.textContent?.trim().substring(0, 100),
            className: element.className,
            type: element.type || null,
            href: element.href || null,
            context: this.getElementContext(element)
        };
    }
    
    getElementContext(element) {
        // Find the semantic context of the element
        const parent = element.closest('[class*="section"], [class*="panel"], [class*="card"], [class*="item"]');
        if (parent) {
            return {
                section: parent.className,
                sectionText: parent.querySelector('h1, h2, h3, h4')?.textContent?.trim(),
                dataContext: this.extractDataContext(element)
            };
        }
        return {dataContext: this.extractDataContext(element)};
    }
    
    extractDataContext(element) {
        // Extract pricing, dates, and other domain-specific data around the element
        const text = element.textContent || '';
        const context = {};
        
        // Extract prices
        const priceMatch = text.match(/\$\d+(?:,\d{3})*(?:\.\d{2})?/);
        if (priceMatch) {
            context.price = priceMatch[0];
        }
        
        // Extract percentages
        const percentMatch = text.match(/[-+]?\d+(?:\.\d+)?%/);
        if (percentMatch) {
            context.percentage = percentMatch[0];
        }
        
        // Extract dates
        const dateMatch = text.match(/\b\d{1,2}\/\d{1,2}\/\d{4}\b|\b\w+ \d{1,2}, \d{4}\b/);
        if (dateMatch) {
            context.date = dateMatch[0];
        }
        
        return context;
    }
    
    getModifiers(event) {
        return {
            ctrl: event.ctrlKey || false,
            meta: event.metaKey || false,
            shift: event.shiftKey || false,
            alt: event.altKey || false
        };
    }
    
    getSessionDuration() {
        return Date.now() - this.sessionStartTime;
    }
    
    isViewportVisible() {
        return document.visibilityState === 'visible';
    }
    
    calculateIntentConfidence(intentType, evidence) {
        // Simple confidence scoring based on evidence strength
        let confidence = 0.5; // Base confidence
        
        if (evidence.method) confidence += 0.2;
        if (evidence.context) confidence += 0.1;
        if (evidence.value || evidence.selectedText) confidence += 0.2;
        
        return Math.min(confidence, 1.0);
    }
    
    analyzeBehaviorPattern() {
        if (this.mousePattern.length < 5) return null;
        
        // Simple pattern detection
        const recent = this.mousePattern.slice(-5);
        const avgDistance = this.calculateAverageDistance(recent);
        
        if (avgDistance < 50) return 'focused';
        if (avgDistance > 200) return 'searching';
        return 'exploring';
    }
    
    calculateAverageDistance(points) {
        if (points.length < 2) return 0;
        
        let totalDistance = 0;
        for (let i = 1; i < points.length; i++) {
            const dx = points[i].x - points[i-1].x;
            const dy = points[i].y - points[i-1].y;
            totalDistance += Math.sqrt(dx*dx + dy*dy);
        }
        
        return totalDistance / (points.length - 1);
    }
    
    isComparisonPattern(sequence) {
        if (sequence.length < 3) return false;
        
        // Look for A -> B -> A patterns (comparison behavior)
        const recent = sequence.slice(-3);
        return recent[0].view === recent[2].view && recent[0].view !== recent[1].view;
    }
    
    // ============ EVENT TRANSMISSION ============
    
    sendEvent(eventData) {
        this.events.push(eventData);
        
        if (this.config.debugMode) {
            console.log('📊 Product Discovery Event:', eventData);
        }
        
        // Send to analytics endpoint
        this.transmitEvents([eventData]);
        
        // Keep events array manageable
        if (this.events.length > 100) {
            this.events = this.events.slice(-50);
        }
    }
    
    async transmitEvents(events) {
        try {
            // For now, store in localStorage and console log
            // Later replace with actual API call
            const storedEvents = JSON.parse(localStorage.getItem('pd_events') || '[]');
            const allEvents = [...storedEvents, ...events];
            
            // Keep only last 1000 events in localStorage
            const recentEvents = allEvents.slice(-1000);
            localStorage.setItem('pd_events', JSON.stringify(recentEvents));
            
            // TODO: Replace with actual API call
            /*
            const response = await fetch(this.config.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    events: events,
                    sessionId: this.sessionId,
                    userId: this.userId
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            */
            
        } catch (error) {
            console.error('Failed to transmit analytics events:', error);
        }
    }
    
    trackPageLoad() {
        this.sendEvent({
            sessionId: this.sessionId,
            userId: this.userId,
            timestamp: new Date().toISOString(),
            eventType: "page_load",
            currentView: this.getCurrentView(),
            contentContext: this.getContentContext(),
            eventData: {
                referrer: document.referrer,
                loadTime: performance.now(),
                userAgent: navigator.userAgent
            }
        });
    }
    
    trackExit() {
        this.sendEvent({
            sessionId: this.sessionId,
            userId: this.userId,
            timestamp: new Date().toISOString(),
            eventType: "session_exit",
            currentView: this.getCurrentView(),
            eventData: {
                sessionDuration: this.getSessionDuration(),
                totalEvents: this.events.length,
                exitType: 'beforeunload'
            }
        });
    }
    
    trackNavigation() {
        this.backtrackCount++;
        this.sendEvent({
            sessionId: this.sessionId,
            userId: this.userId,
            timestamp: new Date().toISOString(),
            eventType: "navigation",
            currentView: this.getCurrentView(),
            eventData: {
                backtrackCount: this.backtrackCount,
                navigationType: 'browser_back_forward'
            }
        });
    }
    
    trackPageFocus() {
        this.sendEvent({
            sessionId: this.sessionId,
            userId: this.userId,
            timestamp: new Date().toISOString(),
            eventType: "page_focus",
            currentView: this.getCurrentView(),
            eventData: {}
        });
    }
    
    trackPageBlur() {
        this.sendEvent({
            sessionId: this.sessionId,
            userId: this.userId,
            timestamp: new Date().toISOString(),
            eventType: "page_blur",
            currentView: this.getCurrentView(),
            eventData: {}
        });
    }
    
    log(message, data = {}) {
        if (this.config.debugMode) {
            console.log(`🔍 ProductDiscovery: ${message}`, data);
        }
    }
    
    // ============ PUBLIC API ============
    
    getStoredEvents() {
        return JSON.parse(localStorage.getItem('pd_events') || '[]');
    }
    
    clearStoredEvents() {
        localStorage.removeItem('pd_events');
        this.events = [];
    }
    
    getSessionSummary() {
        const events = this.events;
        const interactions = events.filter(e => e.eventType === 'interaction');
        const intentSignals = events.filter(e => e.eventType === 'intent_signal');
        
        return {
            sessionId: this.sessionId,
            duration: this.getSessionDuration(),
            eventCount: events.length,
            interactionCount: interactions.length,
            intentSignals: intentSignals.map(e => e.eventData.intentType),
            currentView: this.getCurrentView()
        };
    }
}

// ============ INTENT DETECTION ENGINE ============

class IntentDetector {
    constructor(tracker) {
        this.tracker = tracker;
        this.patterns = {
            calculation: [],
            comparison: [],
            export: [],
            collaboration: []
        };
    }
    
    analyze(event) {
        // Detect calculation intent
        if (this.isCalculationSignal(event)) {
            this.tracker.trackIntent('calculation_need', {
                trigger: 'number_interaction',
                element: event.eventData.target,
                confidence: 0.7
            });
        }
        
        // Detect data exploration patterns
        if (this.isExplorationPattern(event)) {
            this.tracker.trackIntent('data_exploration', {
                trigger: 'rapid_navigation',
                pattern: 'view_switching',
                confidence: 0.6
            });
        }
    }
    
    isCalculationSignal(event) {
        const target = event.eventData.target;
        if (!target || !target.elementText) return false;
        
        // Look for interactions with numbers, especially prices
        const hasNumbers = /\$\d+|\d+%|\d+\.\d+/.test(target.elementText);
        const isDoubleClick = event.eventData.action === 'double_click';
        const isRightClick = event.eventData.action === 'right_click';
        
        return hasNumbers && (isDoubleClick || isRightClick);
    }
    
    isExplorationPattern(event) {
        // Simple heuristic: rapid clicking on navigation elements
        return event.eventData.target?.className?.includes('function-btn');
    }
}

// ============ FRICTION DETECTION ENGINE ============

class FrictionDetector {
    constructor(tracker) {
        this.tracker = tracker;
        this.failedClicks = [];
        this.confusionSignals = [];
    }
    
    analyze(event) {
        // Detect failed interactions
        if (this.isFailedInteraction(event)) {
            this.trackFailedClick(event);
        }
        
        // Detect confusion patterns
        if (this.isConfusionSignal(event)) {
            this.trackConfusion(event);
        }
    }
    
    isFailedInteraction(event) {
        const target = event.eventData.target;
        if (!target) return false;
        
        // Clicking on elements that look interactive but aren't
        const looksInteractive = target.elementText?.includes('→') || 
                                target.className?.includes('link') ||
                                target.className?.includes('button');
        
        const actuallyInteractive = target.element?.includes('button') ||
                                   target.element?.includes('a') ||
                                   target.href;
        
        return looksInteractive && !actuallyInteractive;
    }
    
    isConfusionSignal(event) {
        // Rapid clicking on same element
        const now = Date.now();
        const recentSimilar = this.failedClicks.filter(click => 
            now - new Date(click.timestamp).getTime() < 5000 &&
            click.element === event.eventData.target?.element
        );
        
        return recentSimilar.length > 1;
    }
    
    trackFailedClick(event) {
        this.failedClicks.push({
            timestamp: event.timestamp,
            element: event.eventData.target?.element,
            context: event.contentContext
        });
        
        this.tracker.sendEvent({
            ...event,
            eventType: "friction_detected",
            eventData: {
                ...event.eventData,
                frictionType: "failed_interaction",
                severity: "medium"
            }
        });
    }
    
    trackConfusion(event) {
        this.tracker.sendEvent({
            ...event,
            eventType: "friction_detected", 
            eventData: {
                ...event.eventData,
                frictionType: "user_confusion",
                severity: "high"
            }
        });
    }
    
    detectAnalysisParalysis(currentView, context, dwellTime) {
        this.tracker.sendEvent({
            sessionId: this.tracker.sessionId,
            userId: this.tracker.userId,
            timestamp: new Date().toISOString(),
            eventType: "friction_detected",
            currentView: currentView,
            contentContext: context,
            eventData: {
                frictionType: "analysis_paralysis",
                dwellTime: dwellTime,
                severity: dwellTime > 120000 ? "high" : "medium" // 2 minutes
            }
        });
    }
}

// ============ INITIALIZATION ============

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.productDiscoveryTracker = new ProductDiscoveryTracker({
        debugMode: true, // Set to false in production
        dwellThreshold: 30 // seconds
    });
    
    console.log('🚀 Product Discovery Analytics initialized');
}); 