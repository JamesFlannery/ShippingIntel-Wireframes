// Right Column: Recommendation Engine & Next Topic Navigation
class RightColumnEngine {
    constructor() {
        this.contextItems = [];
        this.recommendations = [];
        this.nextTopics = [];
        this.userPreferences = {
            topicsFilter: 'all',
            priorityLevel: 'medium',
            autoRefresh: true
        };
        this.aiAssistant = {
            isOnline: true,
            suggestions: []
        };
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadSmartContext();
        this.loadRecommendations();
        this.loadNextTopics();
        this.initializeAI();
        this.startContextEngine();
        this.listenToOtherColumns();
    }

    // Smart Context Engine
    loadSmartContext() {
        // Initialize context items with high relevance
        const initialContext = [
            {
                type: 'company',
                relevance: 97,
                title: 'Gulf Coast Ammonia',
                description: 'Gulf Coast Ammonia operates a 750,000 mt/year facility in Texas',
                actions: ['View Profile', 'Track']
            },
            {
                type: 'vessel',
                relevance: 89,
                title: 'Dancing Brave',
                description: '35,000 dwt chemical tanker, built 2019',
                actions: ['Track Vessel', 'Route Map']
            },
            {
                type: 'route',
                relevance: 84,
                title: 'US Gulf Coast to Norway',
                description: 'US Gulf Coast to Norway: 4,200 nautical miles, 18-day voyage',
                actions: ['View Route', 'Compare']
            }
        ];
        
        this.contextItems = initialContext;
        this.updateContextDisplay();
    }

    updateContextDisplay() {
        const contextFeed = document.getElementById('context-feed');
        if (!contextFeed) return;
        
        contextFeed.innerHTML = '';
        
        this.contextItems.forEach(item => {
            const contextElement = this.createContextElement(item);
            contextFeed.appendChild(contextElement);
        });
    }

    createContextElement(item) {
        const div = document.createElement('div');
        div.className = `context-item priority-${this.getPriorityClass(item.relevance)}`;
        
        const typeIcons = {
            company: '🏢',
            vessel: '🚢',
            route: '🗺️',
            market: '📊',
            news: '📰'
        };
        
        div.innerHTML = `
            <div class="context-header">
                <div class="context-type">${item.type}</div>
                <div class="context-relevance">${item.relevance}%</div>
            </div>
            <div class="context-content">
                <h4 class="context-title">${item.title}</h4>
                <p class="context-description">${item.description}</p>
                <div class="context-actions">
                    ${item.actions.map(action => 
                        `<button class="context-btn ${action.includes('View') || action.includes('Track') ? 'primary' : 'secondary'}" 
                         data-action="${action.toLowerCase().replace(' ', '_')}" 
                         data-item="${item.title}">
                            ${action}
                        </button>`
                    ).join('')}
                </div>
            </div>
        `;
        
        return div;
    }

    getPriorityClass(relevance) {
        if (relevance >= 90) return 'high';
        if (relevance >= 70) return 'medium';
        return 'low';
    }

    // Recommendation Engine
    loadRecommendations() {
        const initialRecommendations = [
            {
                type: 'price_monitoring',
                priority: 'urgent',
                title: 'Monitor Price Trends',
                description: 'Track CFR NWE ammonia prices for continued weakness',
                actions: ['Set Alert', 'Details'],
                confidence: 95
            },
            {
                type: 'export_tracking',
                priority: 'important',
                title: 'Track Exports',
                description: 'Monitor additional Gulf Coast Ammonia shipments',
                actions: ['Create Alert', 'View History'],
                confidence: 88
            },
            {
                type: 'competitor_analysis',
                priority: 'suggested',
                title: 'Analyze Impact',
                description: 'Assess impact on Caribbean and Eastern European suppliers',
                actions: ['View Analysis', 'Compare'],
                confidence: 76
            }
        ];
        
        this.recommendations = initialRecommendations;
        this.updateRecommendationsDisplay();
    }

    updateRecommendationsDisplay() {
        const recList = document.getElementById('recommendation-list');
        if (!recList) return;
        
        recList.innerHTML = '';
        
        this.recommendations.forEach(rec => {
            const recElement = this.createRecommendationElement(rec);
            recList.appendChild(recElement);
        });
    }

    createRecommendationElement(rec) {
        const div = document.createElement('div');
        div.className = `recommendation-item ${rec.priority}`;
        
        div.innerHTML = `
            <div class="rec-header">
                <div class="rec-type">${rec.type.replace('_', ' ')}</div>
                <div class="rec-priority">${rec.priority}</div>
            </div>
            <div class="rec-content">
                <h4 class="rec-title">${rec.title}</h4>
                <p class="rec-description">${rec.description}</p>
                <div class="rec-actions">
                    ${rec.actions.map(action => 
                        `<button class="rec-btn ${action.includes('Set') || action.includes('Create') || action.includes('View') ? 'primary' : 'secondary'}" 
                         data-action="${action.toLowerCase().replace(' ', '_')}" 
                         data-rec-type="${rec.type}">
                            ${action}
                        </button>`
                    ).join('')}
                </div>
            </div>
        `;
        
        return div;
    }

    // Next Topics Navigation
    loadNextTopics() {
        const initialTopics = [
            {
                type: 'market_report',
                relevance: 92,
                title: 'European Ammonia Import Shifts',
                preview: 'How new US exports reshape European import patterns...',
                expectedDate: 'Apr 2, 2025',
                readTime: '6 min read',
                status: 'upcoming'
            },
            {
                type: 'analysis',
                relevance: 87,
                title: 'Caribbean Supplier Response',
                preview: 'Traditional Caribbean suppliers adjust pricing strategies...',
                expectedDate: 'Apr 5, 2025',
                readTime: '4 min read',
                status: 'upcoming'
            },
            {
                type: 'market_data',
                relevance: 81,
                title: 'Q2 2025 Trade Flow Forecast',
                preview: 'Projected ammonia trade patterns for Q2 2025...',
                expectedDate: 'Apr 8, 2025',
                readTime: '8 min read',
                status: 'upcoming'
            }
        ];
        
        this.nextTopics = initialTopics;
        this.updateTopicsDisplay();
    }

    updateTopicsDisplay() {
        const topicsList = document.getElementById('topics-list');
        if (!topicsList) return;
        
        // Filter topics based on user preference
        const filteredTopics = this.filterTopics(this.nextTopics);
        
        topicsList.innerHTML = '';
        
        filteredTopics.forEach(topic => {
            const topicElement = this.createTopicElement(topic);
            topicsList.appendChild(topicElement);
        });
    }

    filterTopics(topics) {
        const filter = this.userPreferences.topicsFilter;
        
        switch (filter) {
            case 'related':
                return topics.filter(t => t.relevance >= 85);
            case 'trending':
                return topics.filter(t => t.type === 'market_report');
            case 'recommended':
                return topics.filter(t => t.relevance >= 90);
            default:
                return topics;
        }
    }

    createTopicElement(topic) {
        const div = document.createElement('div');
        div.className = 'topic-item';
        
        div.innerHTML = `
            <div class="topic-header">
                <div class="topic-type">${topic.type.replace('_', ' ')}</div>
                <div class="topic-relevance">${topic.relevance}%</div>
            </div>
            <div class="topic-content">
                <h4 class="topic-title">${topic.title}</h4>
                <p class="topic-preview">${topic.preview}</p>
                <div class="topic-meta">
                    <span class="topic-date">Expected: ${topic.expectedDate}</span>
                    <span class="topic-readtime">${topic.readTime}</span>
                </div>
                <div class="topic-actions">
                    <button class="topic-btn primary" data-action="read_topic" data-topic="${topic.title}">
                        ${topic.status === 'available' ? 'Read' : 'Preview'}
                    </button>
                    <button class="topic-btn secondary" data-action="track_topic" data-topic="${topic.title}">
                        ${topic.status === 'available' ? 'Track' : 'Subscribe'}
                    </button>
                </div>
            </div>
        `;
        
        return div;
    }

    // AI Assistant
    initializeAI() {
        this.aiAssistant.suggestions = [
            {
                type: 'analysis',
                text: 'Would you like me to analyze the impact on your portfolio?',
                action: 'analyze_portfolio'
            }
        ];
        
        this.updateAIDisplay();
        this.startAIMonitoring();
    }

    updateAIDisplay() {
        const aiSuggestions = document.getElementById('ai-suggestions');
        if (!aiSuggestions) return;
        
        aiSuggestions.innerHTML = '';
        
        this.aiAssistant.suggestions.forEach(suggestion => {
            const suggestionElement = this.createAISuggestion(suggestion);
            aiSuggestions.appendChild(suggestionElement);
        });
    }

    createAISuggestion(suggestion) {
        const div = document.createElement('div');
        div.className = 'ai-suggestion';
        
        div.innerHTML = `
            <div class="suggestion-icon">🤖</div>
            <div class="suggestion-text">"${suggestion.text}"</div>
            <button class="suggestion-btn" data-action="${suggestion.action}">
                Yes, ${suggestion.action.replace('_', ' ')}
            </button>
        `;
        
        return div;
    }

    startAIMonitoring() {
        // Simulate AI generating new suggestions based on user behavior
        setInterval(() => {
            if (Math.random() < 0.2) { // 20% chance every 30 seconds
                this.generateAISuggestion();
            }
        }, 30000);
    }

    generateAISuggestion() {
        const suggestions = [
            {
                type: 'insight',
                text: 'I found a related market trend. Want to see it?',
                action: 'show_trend'
            },
            {
                type: 'alert',
                text: 'Should I set up price alerts for similar events?',
                action: 'setup_alerts'
            },
            {
                type: 'recommendation',
                text: 'I can recommend similar reports. Interested?',
                action: 'recommend_reports'
            }
        ];
        
        const newSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
        this.aiAssistant.suggestions = [newSuggestion]; // Replace with new suggestion
        this.updateAIDisplay();
    }

    // Context Engine
    startContextEngine() {
        // Continuously update context based on user interactions
        setInterval(() => {
            this.refreshContextRelevance();
            this.checkForNewContext();
        }, 15000); // Every 15 seconds
    }

    refreshContextRelevance() {
        // Simulate context relevance updates
        this.contextItems.forEach(item => {
            item.relevance += (Math.random() - 0.5) * 5; // +/- 2.5%
            item.relevance = Math.max(50, Math.min(100, item.relevance));
        });
        
        // Sort by relevance
        this.contextItems.sort((a, b) => b.relevance - a.relevance);
        this.updateContextDisplay();
    }

    checkForNewContext() {
        if (Math.random() < 0.3) { // 30% chance of new context
            const newContextTypes = ['news', 'market', 'regulatory'];
            const type = newContextTypes[Math.floor(Math.random() * newContextTypes.length)];
            
            const newContext = {
                type: type,
                relevance: Math.floor(Math.random() * 30) + 70, // 70-100%
                title: this.generateContextTitle(type),
                description: this.generateContextDescription(type),
                actions: ['View Details', 'Track']
            };
            
            this.contextItems.unshift(newContext);
            
            // Keep only top 5 items
            if (this.contextItems.length > 5) {
                this.contextItems = this.contextItems.slice(0, 5);
            }
            
            this.updateContextDisplay();
        }
    }

    generateContextTitle(type) {
        const titles = {
            news: ['Breaking: New Trade Agreement', 'Market News Alert', 'Industry Update'],
            market: ['Price Movement Detected', 'Volume Surge Alert', 'Market Shift'],
            regulatory: ['New IMO Regulation', 'Policy Update', 'Compliance Alert']
        };
        
        const typeOptions = titles[type] || ['General Update'];
        return typeOptions[Math.floor(Math.random() * typeOptions.length)];
    }

    generateContextDescription(type) {
        const descriptions = {
            news: ['Significant development in global trade policies', 'Breaking news affecting market conditions'],
            market: ['Unusual trading activity detected', 'Market volatility increasing'],
            regulatory: ['New regulations affecting maritime trade', 'Compliance requirements updated']
        };
        
        const typeOptions = descriptions[type] || ['General market update'];
        return typeOptions[Math.floor(Math.random() * typeOptions.length)];
    }

    // Inter-column Communication
    listenToOtherColumns() {
        // Listen to center column tab changes
        document.addEventListener('centerColumnAction', (e) => {
            const { action, data } = e.detail;
            
            switch (action) {
                case 'tabChanged':
                    this.updateRecommendationsForTab(data);
                    break;
                case 'progressUpdate':
                    this.updateProgressBasedRecommendations(data);
                    break;
            }
        });
        
        // Listen to left column context changes
        document.addEventListener('leftColumnAction', (e) => {
            const { action, data } = e.detail;
            
            switch (action) {
                case 'navigate':
                    this.adjustContextForSection(data);
                    break;
            }
        });
    }

    updateRecommendationsForTab(tabName) {
        // Adjust recommendations based on current tab
        console.log('Updating recommendations for tab:', tabName);
        
        // This would filter/prioritize recommendations based on the active tab
        const tabSpecificRecs = this.recommendations.filter(rec => {
            switch (tabName) {
                case 'data':
                    return rec.type.includes('monitoring') || rec.type.includes('tracking');
                case 'connections':
                    return rec.type.includes('analysis') || rec.type.includes('tracking');
                default:
                    return true;
            }
        });
        
        // Update display with filtered recommendations
        this.recommendations = tabSpecificRecs;
        this.updateRecommendationsDisplay();
    }

    updateProgressBasedRecommendations(progress) {
        if (progress > 75) {
            // User is near end, suggest next steps
            const nextStepRec = {
                type: 'next_action',
                priority: 'suggested',
                title: 'What\'s Next?',
                description: 'Explore related topics or set up monitoring',
                actions: ['Browse Topics', 'Set Alerts'],
                confidence: 85
            };
            
            // Add if not already present
            if (!this.recommendations.find(r => r.type === 'next_action')) {
                this.recommendations.push(nextStepRec);
                this.updateRecommendationsDisplay();
            }
        }
    }

    adjustContextForSection(section) {
        console.log('Adjusting context for section:', section);
        // This would adjust context relevance based on the current section
    }

    notifyOtherColumns(action, data) {
        const event = new CustomEvent('rightColumnAction', {
            detail: { action, data }
        });
        document.dispatchEvent(event);
    }

    // Event Bindings
    bindEvents() {
        // Context actions
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('context-btn')) {
                const action = e.target.dataset.action;
                const item = e.target.dataset.item;
                this.handleContextAction(action, item);
            }
        });

        // Recommendation actions
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('rec-btn')) {
                const action = e.target.dataset.action;
                const recType = e.target.dataset.recType;
                this.handleRecommendationAction(action, recType);
            }
        });

        // Topic actions
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('topic-btn')) {
                const action = e.target.dataset.action;
                const topic = e.target.dataset.topic;
                this.handleTopicAction(action, topic);
            }
        });

        // Filter changes
        document.addEventListener('change', (e) => {
            if (e.target.id === 'topics-filter') {
                this.userPreferences.topicsFilter = e.target.value;
                this.updateTopicsDisplay();
            }
        });

        // Quick actions
        document.addEventListener('click', (e) => {
            const quickActions = {
                'create-watchlist': () => this.createWatchlist(),
                'export-insights': () => this.exportInsights(),
                'schedule-update': () => this.scheduleUpdate(),
                'share-report': () => this.shareReport()
            };
            
            const action = quickActions[e.target.id];
            if (action) action();
        });

        // AI interactions
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('suggestion-btn')) {
                const action = e.target.dataset.action;
                this.handleAIAction(action);
            } else if (e.target.id === 'open-ai-chat') {
                this.openAIChat();
            }
        });

        // Settings
        document.addEventListener('click', (e) => {
            if (e.target.id === 'rec-settings') {
                this.openRecommendationSettings();
            }
        });
    }

    // Action Handlers
    handleContextAction(action, item) {
        console.log(`Context action: ${action} for ${item}`);
        
        switch (action) {
            case 'view_profile':
                this.viewCompanyProfile(item);
                break;
            case 'track':
                this.trackItem(item);
                break;
            case 'track_vessel':
                this.trackVessel(item);
                break;
            case 'route_map':
                this.showRouteMap(item);
                break;
            case 'view_route':
                this.viewRoute(item);
                break;
            case 'compare':
                this.compareRoutes(item);
                break;
        }
    }

    handleRecommendationAction(action, recType) {
        console.log(`Recommendation action: ${action} for ${recType}`);
        
        switch (action) {
            case 'set_alert':
                this.setPriceAlert();
                break;
            case 'create_alert':
                this.createExportAlert();
                break;
            case 'view_analysis':
                this.viewCompetitorAnalysis();
                break;
            case 'view_history':
                this.viewExportHistory();
                break;
        }
    }

    handleTopicAction(action, topic) {
        console.log(`Topic action: ${action} for ${topic}`);
        
        switch (action) {
            case 'read_topic':
                this.readTopic(topic);
                break;
            case 'track_topic':
                this.trackTopic(topic);
                break;
        }
    }

    handleAIAction(action) {
        console.log(`AI action: ${action}`);
        
        switch (action) {
            case 'analyze_portfolio':
                this.analyzePortfolio();
                break;
            case 'show_trend':
                this.showRelatedTrend();
                break;
            case 'setup_alerts':
                this.setupSmartAlerts();
                break;
            case 'recommend_reports':
                this.recommendSimilarReports();
                break;
        }
    }

    // Action Implementations (placeholders)
    viewCompanyProfile(company) { console.log('Viewing company profile:', company); }
    trackItem(item) { console.log('Tracking item:', item); }
    trackVessel(vessel) { console.log('Tracking vessel:', vessel); }
    showRouteMap(route) { console.log('Showing route map:', route); }
    viewRoute(route) { console.log('Viewing route:', route); }
    compareRoutes(route) { console.log('Comparing routes:', route); }
    
    setPriceAlert() { console.log('Setting price alert'); }
    createExportAlert() { console.log('Creating export alert'); }
    viewCompetitorAnalysis() { console.log('Viewing competitor analysis'); }
    viewExportHistory() { console.log('Viewing export history'); }
    
    readTopic(topic) { console.log('Reading topic:', topic); }
    trackTopic(topic) { console.log('Tracking topic:', topic); }
    
    analyzePortfolio() { console.log('Analyzing portfolio'); }
    showRelatedTrend() { console.log('Showing related trend'); }
    setupSmartAlerts() { console.log('Setting up smart alerts'); }
    recommendSimilarReports() { console.log('Recommending similar reports'); }
    
    createWatchlist() { console.log('Creating watchlist'); }
    exportInsights() { console.log('Exporting insights'); }
    scheduleUpdate() { console.log('Scheduling update'); }
    shareReport() { console.log('Sharing report'); }
    
    openAIChat() { console.log('Opening AI chat'); }
    openRecommendationSettings() { console.log('Opening recommendation settings'); }

    // Public API
    addContextItem(item) {
        this.contextItems.unshift(item);
        if (this.contextItems.length > 5) {
            this.contextItems = this.contextItems.slice(0, 5);
        }
        this.updateContextDisplay();
    }

    addRecommendation(rec) {
        this.recommendations.unshift(rec);
        this.updateRecommendationsDisplay();
    }

    updatePreferences(prefs) {
        this.userPreferences = { ...this.userPreferences, ...prefs };
        this.updateTopicsDisplay();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.rightColumnEngine = new RightColumnEngine();
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RightColumnEngine;
} 