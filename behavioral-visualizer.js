/**
 * Behavioral Visualization Engine
 * Creates visual representations of user behavior patterns
 * Connects behavioral data to maritime domain insights
 */

class BehavioralVisualizer {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.interactions = [];
        this.journeyPaths = [];
        this.domainContext = 'ammonia-plant-analysis';
    }
    
    // ============ HEATMAP VISUALIZATION ============
    
    createInteractionHeatmap(containerId, events) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        // Create canvas for heatmap
        const canvas = document.createElement('canvas');
        canvas.width = container.offsetWidth || 800;
        canvas.height = container.offsetHeight || 600;
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '1000';
        
        container.style.position = 'relative';
        container.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        
        // Process click events
        const clickEvents = events.filter(e => 
            e.eventType === 'interaction' && 
            e.eventData.action === 'click' &&
            e.eventData.coordinates
        );
        
        // Create heatmap points
        clickEvents.forEach(event => {
            const x = event.eventData.coordinates.x;
            const y = event.eventData.coordinates.y;
            
            // Draw heat point
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, 30);
            gradient.addColorStop(0, 'rgba(255, 0, 0, 0.3)');
            gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(x - 30, y - 30, 60, 60);
        });
        
        return canvas;
    }
    
    // ============ USER JOURNEY FLOW ============
    
    createJourneyFlow(containerId, events) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        // Process navigation events into journey
        const journeyData = this.processJourneyData(events);
        
        // Create SVG for journey flow
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '400');
        svg.style.background = '#1a1a1a';
        svg.style.borderRadius = '8px';
        
        this.drawJourneyFlow(svg, journeyData);
        
        container.appendChild(svg);
        return svg;
    }
    
    processJourneyData(events) {
        console.log('🛤️ Processing journey data from', events.length, 'events');
        
        const sessions = {};
        
        // Group events by session
        events.forEach(event => {
            if (!sessions[event.sessionId]) {
                sessions[event.sessionId] = [];
            }
            sessions[event.sessionId].push(event);
        });
        
        console.log('🛤️ Found', Object.keys(sessions).length, 'sessions');
        
        // Process each session into journey steps
        const journeys = Object.values(sessions).map(sessionEvents => {
            const journey = [];
            let currentView = null;
            let viewStartTime = null;
            
            sessionEvents.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
            
            sessionEvents.forEach(event => {
                if (event.currentView && event.currentView !== currentView) {
                    if (currentView) {
                        const stepEvents = sessionEvents.filter(e => 
                            e.currentView === currentView &&
                            new Date(e.timestamp) >= viewStartTime &&
                            new Date(e.timestamp) < new Date(event.timestamp)
                        );
                        
                        journey.push({
                            view: currentView,
                            duration: new Date(event.timestamp) - viewStartTime,
                            events: stepEvents
                        });
                    }
                    currentView = event.currentView;
                    viewStartTime = new Date(event.timestamp);
                }
            });
            
            // Add the final view if we have one
            if (currentView) {
                const finalEvents = sessionEvents.filter(e => 
                    e.currentView === currentView &&
                    new Date(e.timestamp) >= viewStartTime
                );
                
                journey.push({
                    view: currentView,
                    duration: Date.now() - viewStartTime.getTime(), // Duration to now
                    events: finalEvents
                });
            }
            
            return journey;
        }).filter(journey => journey.length > 0); // Only return non-empty journeys
        
        console.log('🛤️ Generated', journeys.length, 'journeys');
        journeys.forEach((journey, i) => {
            console.log(`Journey ${i + 1}:`, journey.map(step => step.view).join(' → '));
        });
        
        // If no complex journeys, create simple ones from individual events
        if (journeys.length === 0 || journeys.every(j => j.length < 2)) {
            console.log('🛤️ No multi-step journeys found, creating simple view patterns');
            
            // Create simple patterns from all events
            const viewCounts = {};
            events.forEach(event => {
                if (event.currentView) {
                    viewCounts[event.currentView] = (viewCounts[event.currentView] || 0) + 1;
                }
            });
            
            // Convert to simple journey format
            const simpleJourneys = Object.entries(viewCounts).map(([view, count]) => ({
                path: [view],
                count: count,
                avgDuration: 60000, // Default 1 minute
                intentions: new Set(),
                frictions: new Set()
            }));
            
            console.log('🛤️ Created', simpleJourneys.length, 'simple view patterns');
            return simpleJourneys;
        }
        
        return this.aggregateJourneyPatterns(journeys);
    }
    
    aggregateJourneyPatterns(journeys) {
        const patterns = {};
        
        journeys.forEach(journey => {
            if (!journey || journey.length === 0) return;
            
            const pathKey = journey.map(step => step.view).join(' → ');
            if (!patterns[pathKey]) {
                patterns[pathKey] = {
                    path: journey.map(step => step.view),
                    count: 0,
                    avgDuration: 0,
                    intentions: new Set(),
                    frictions: new Set()
                };
            }
            patterns[pathKey].count++;
            
            // Calculate average duration
            const totalDuration = journey.reduce((acc, step) => acc + (step.duration || 0), 0);
            patterns[pathKey].avgDuration = (patterns[pathKey].avgDuration + totalDuration) / 2;
            
            // Collect intentions and frictions
            journey.forEach(step => {
                if (step.events && Array.isArray(step.events)) {
                    step.events.forEach(event => {
                        if (event.eventType === 'intent_signal') {
                            patterns[pathKey].intentions.add(event.eventData.intentType);
                        }
                        if (event.eventType === 'friction_detected') {
                            patterns[pathKey].frictions.add(event.eventData.frictionType);
                        }
                    });
                }
            });
        });
        
        return Object.values(patterns).sort((a, b) => b.count - a.count);
    }
    
    drawJourneyFlow(svg, journeyData) {
        const width = 800;
        const height = 400;
        const margin = 50;
        
        if (journeyData.length === 0) {
            // Show placeholder when no journey data
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', width / 2);
            text.setAttribute('y', height / 2);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('fill', '#888');
            text.setAttribute('font-size', '16');
            text.textContent = 'No user journey patterns detected yet';
            svg.appendChild(text);
            return;
        }
        
        journeyData.slice(0, 5).forEach((journey, index) => {
            const y = margin + index * 60;
            const pathLength = journey.path.length;
            const stepWidth = (width - 2 * margin) / Math.max(pathLength - 1, 1);
            
            // Draw path
            journey.path.forEach((view, stepIndex) => {
                const x = margin + stepIndex * stepWidth;
                
                // Draw node
                const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                circle.setAttribute('cx', x);
                circle.setAttribute('cy', y);
                circle.setAttribute('r', 20);
                circle.setAttribute('fill', this.getViewColor(view));
                circle.setAttribute('stroke', '#fff');
                circle.setAttribute('stroke-width', '2');
                svg.appendChild(circle);
                
                // Draw label
                const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                text.setAttribute('x', x);
                text.setAttribute('y', y + 35);
                text.setAttribute('text-anchor', 'middle');
                text.setAttribute('fill', '#fff');
                text.setAttribute('font-size', '12');
                text.textContent = view.toUpperCase();
                svg.appendChild(text);
                
                // Draw arrow to next step
                if (stepIndex < pathLength - 1) {
                    const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    arrow.setAttribute('x1', x + 20);
                    arrow.setAttribute('y1', y);
                    arrow.setAttribute('x2', x + stepWidth - 20);
                    arrow.setAttribute('y2', y);
                    arrow.setAttribute('stroke', '#666');
                    arrow.setAttribute('stroke-width', '2');
                    arrow.setAttribute('marker-end', 'url(#arrowhead)');
                    svg.appendChild(arrow);
                }
            });
            
            // Draw journey info
            const info = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            info.setAttribute('x', width - margin);
            info.setAttribute('y', y);
            info.setAttribute('text-anchor', 'end');
            info.setAttribute('fill', '#ccc');
            info.setAttribute('font-size', '10');
            info.textContent = `${journey.count} users, ${this.formatDuration(journey.avgDuration)}`;
            svg.appendChild(info);
        });
        
        // Add arrow marker definition
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
        marker.setAttribute('id', 'arrowhead');
        marker.setAttribute('markerWidth', '10');
        marker.setAttribute('markerHeight', '7');
        marker.setAttribute('refX', '9');
        marker.setAttribute('refY', '3.5');
        marker.setAttribute('orient', 'auto');
        
        const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        polygon.setAttribute('points', '0 0, 10 3.5, 0 7');
        polygon.setAttribute('fill', '#666');
        
        marker.appendChild(polygon);
        defs.appendChild(marker);
        svg.appendChild(defs);
    }
    
    // ============ INTENT PATTERNS TIMELINE ============
    
    createIntentTimeline(containerId, events) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const intentEvents = events.filter(e => e.eventType === 'intent_signal');
        if (intentEvents.length === 0) {
            container.innerHTML = '<div style="color: #888; text-align: center; padding: 20px;">No intent signals detected yet</div>';
            return;
        }
        
        // Group by time periods
        const timeGroups = this.groupEventsByTime(intentEvents);
        
        // Create timeline visualization
        const timeline = document.createElement('div');
        timeline.className = 'intent-timeline';
        timeline.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 10px;
            padding: 20px;
            background: #1a1a1a;
            border-radius: 8px;
            max-height: 300px;
            overflow-y: auto;
        `;
        
        Object.entries(timeGroups).forEach(([timeKey, intents]) => {
            const timeBlock = document.createElement('div');
            timeBlock.style.cssText = `
                padding: 10px;
                background: #2a2a2a;
                border-radius: 4px;
                border-left: 4px solid #0066cc;
            `;
            
            const timeLabel = document.createElement('div');
            timeLabel.style.cssText = 'color: #ccc; font-size: 12px; margin-bottom: 5px;';
            timeLabel.textContent = timeKey;
            
            const intentList = document.createElement('div');
            intentList.style.cssText = 'display: flex; flex-wrap: wrap; gap: 5px;';
            
            intents.forEach(intent => {
                const intentTag = document.createElement('span');
                intentTag.style.cssText = `
                    background: ${this.getIntentColor(intent.eventData.intentType)};
                    color: white;
                    padding: 2px 8px;
                    border-radius: 12px;
                    font-size: 11px;
                    font-weight: bold;
                `;
                intentTag.textContent = intent.eventData.intentType;
                intentList.appendChild(intentTag);
            });
            
            timeBlock.appendChild(timeLabel);
            timeBlock.appendChild(intentList);
            timeline.appendChild(timeBlock);
        });
        
        container.appendChild(timeline);
        return timeline;
    }
    
    // ============ DOMAIN INSIGHTS ENGINE ============
    
    generateDomainInsights(events) {
        const insights = {
            ammoniaMarketAnalysis: this.analyzeAmmoniaMarketBehavior(events),
            userSegmentProfiles: this.identifyUserSegments(events),
            productOpportunities: this.identifyProductOpportunities(events)
        };
        
        return insights;
    }
    
    analyzeAmmoniaMarketBehavior(events) {
        const insights = {
            pricingFocusPatterns: [],
            competitiveAnalysisSignals: [],
            supplyChainConcerns: [],
            routeOptimizationQueries: []
        };
        
        // Analyze interactions with pricing data
        const pricingInteractions = events.filter(e => 
            e.eventType === 'interaction' &&
            e.eventData.target?.elementText?.includes('$') &&
            (e.eventData.target?.elementText?.includes('435') || 
             e.eventData.target?.elementText?.includes('25'))
        );
        
        if (pricingInteractions.length > 0) {
            insights.pricingFocusPatterns.push({
                pattern: 'High interest in $435/mt Tampa pricing',
                count: pricingInteractions.length,
                businessImplication: 'Users are focused on current pricing impact',
                productOpportunity: 'Price calculator/scenarios tool'
            });
        }
        
        // Look for Trinidad vs USG comparison patterns
        const viewSequences = this.extractViewSequences(events);
        const comparisonPatterns = viewSequences.filter(seq => 
            seq.includes('data') && seq.includes('geography')
        );
        
        if (comparisonPatterns.length > 0) {
            insights.competitiveAnalysisSignals.push({
                pattern: 'Data → Geography view switching',
                count: comparisonPatterns.length,
                businessImplication: 'Users comparing USG vs Trinidad trade routes',
                productOpportunity: 'Side-by-side route comparison tool'
            });
        }
        
        // Analyze timeline interests
        const timelineEvents = events.filter(e => e.currentView === 'timeline');
        if (timelineEvents.length > 0) {
            insights.supplyChainConcerns.push({
                pattern: 'Timeline view engagement',
                count: timelineEvents.length,
                businessImplication: 'Interest in supply ramp-up timeline',
                productOpportunity: 'Production forecast modeling'
            });
        }
        
        return insights;
    }
    
    identifyUserSegments(events) {
        const segments = {};
        
        // Group events by session to analyze user behavior patterns
        const sessions = this.groupEventsBySession(events);
        
        Object.values(sessions).forEach(session => {
            const profile = this.analyzeSessionProfile(session);
            const segmentKey = this.classifyUserSegment(profile);
            
            if (!segments[segmentKey]) {
                segments[segmentKey] = {
                    count: 0,
                    behaviorProfile: profile,
                    businessContext: this.getSegmentBusinessContext(segmentKey),
                    productNeeds: this.getSegmentProductNeeds(segmentKey)
                };
            }
            segments[segmentKey].count++;
        });
        
        return segments;
    }
    
    analyzeSessionProfile(sessionEvents) {
        const profile = {
            dominantViews: [],
            intentTypes: [],
            dataFocus: [],
            dwellPatterns: [],
            interactionStyle: 'exploratory'
        };
        
        // Analyze view preferences
        const viewCounts = {};
        sessionEvents.forEach(event => {
            if (event.currentView) {
                viewCounts[event.currentView] = (viewCounts[event.currentView] || 0) + 1;
            }
        });
        
        profile.dominantViews = Object.entries(viewCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([view, count]) => ({view, count}));
        
        // Analyze intent patterns
        const intentEvents = sessionEvents.filter(e => e.eventType === 'intent_signal');
        profile.intentTypes = [...new Set(intentEvents.map(e => e.eventData.intentType))];
        
        // Analyze data focus
        const dataInteractions = sessionEvents.filter(e => 
            e.eventData?.target?.elementText && 
            (e.eventData.target.elementText.includes('$') || 
             e.eventData.target.elementText.includes('%') ||
             e.eventData.target.elementText.includes('t/y'))
        );
        
        profile.dataFocus = dataInteractions.map(e => ({
            type: this.classifyDataType(e.eventData.target.elementText),
            value: e.eventData.target.elementText
        }));
        
        return profile;
    }
    
    classifyUserSegment(profile) {
        // Business logic to classify user segments based on behavior
        const views = profile.dominantViews.map(v => v.view);
        const intents = profile.intentTypes;
        
        if (views.includes('data') && intents.includes('calculation_attempt')) {
            return 'analytical_trader';
        } else if (views.includes('geography') && views.includes('timeline')) {
            return 'logistics_coordinator';
        } else if (intents.includes('export_attempt') || intents.includes('data_extraction_attempt')) {
            return 'market_researcher';
        } else if (views.includes('impact') || views.includes('connections')) {
            return 'strategic_analyst';
        } else {
            return 'general_user';
        }
    }
    
    getSegmentBusinessContext(segmentKey) {
        const contexts = {
            'analytical_trader': {
                role: 'Ammonia Trader/Supplier',
                concerns: 'Market share, pricing strategy, competitive positioning',
                decisions: 'Pricing adjustments, route optimization, inventory management'
            },
            'logistics_coordinator': {
                role: 'Shipping/Logistics Manager',
                concerns: 'Vessel positioning, route economics, capacity planning',
                decisions: 'Fleet deployment, charter rates, voyage planning'
            },
            'market_researcher': {
                role: 'Market Analyst/Intelligence',
                concerns: 'Market trends, competitive analysis, forecasting',
                decisions: 'Report generation, client advisory, strategy recommendations'
            },
            'strategic_analyst': {
                role: 'Strategic Planner/Executive',
                concerns: 'Long-term market implications, investment decisions',
                decisions: 'Market entry, capacity expansion, partnership strategies'
            },
            'general_user': {
                role: 'General Market Participant',
                concerns: 'Market awareness, general intelligence',
                decisions: 'Information gathering, market monitoring'
            }
        };
        
        return contexts[segmentKey] || contexts['general_user'];
    }
    
    getSegmentProductNeeds(segmentKey) {
        const needs = {
            'analytical_trader': [
                'Price scenario calculator',
                'Competitive analysis dashboard',
                'Margin impact calculator',
                'Real-time pricing alerts'
            ],
            'logistics_coordinator': [
                'Route optimization tool',
                'Vessel tracking integration',
                'Freight rate calculator',
                'Port congestion data'
            ],
            'market_researcher': [
                'Data export capabilities',
                'Custom report builder',
                'Historical trend analysis',
                'API access for integration'
            ],
            'strategic_analyst': [
                'Long-term forecast modeling',
                'Investment impact analysis',
                'Scenario planning tools',
                'Executive dashboard'
            ],
            'general_user': [
                'Simplified dashboards',
                'Key metrics summary',
                'Alert notifications',
                'Mobile access'
            ]
        };
        
        return needs[segmentKey] || needs['general_user'];
    }
    
    identifyProductOpportunities(events) {
        const opportunities = [];
        
        // Calculate intent-based opportunities
        const intentCounts = {};
        events.filter(e => e.eventType === 'intent_signal').forEach(event => {
            const intent = event.eventData.intentType;
            intentCounts[intent] = (intentCounts[intent] || 0) + 1;
        });
        
        // Map intents to product opportunities
        Object.entries(intentCounts).forEach(([intent, count]) => {
            const opportunity = this.mapIntentToOpportunity(intent, count);
            if (opportunity) {
                opportunities.push(opportunity);
            }
        });
        
        // Calculate friction-based opportunities
        const frictionEvents = events.filter(e => e.eventType === 'friction_detected');
        frictionEvents.forEach(friction => {
            const opportunity = this.mapFrictionToOpportunity(friction);
            if (opportunity) {
                opportunities.push(opportunity);
            }
        });
        
        return opportunities.sort((a, b) => b.priority - a.priority);
    }
    
    mapFrictionToOpportunity(friction) {
        // Map friction points to product opportunities
        const frictionType = friction.eventData.frictionType;
        
        if (frictionType === 'failed_interaction') {
            return {
                product: 'UX Enhancement Suite',
                description: 'Fix interactive elements and improve user experience',
                priority: 5,
                marketSize: 'High - Affects all users',
                implementation: 'Low complexity - UI/UX improvements'
            };
        }
        
        if (frictionType === 'analysis_paralysis') {
            return {
                product: 'Guided Analysis Wizard',
                description: 'Step-by-step analysis guidance and recommendations',
                priority: 7,
                marketSize: 'Medium - New and occasional users',
                implementation: 'Medium complexity - Decision tree logic'
            };
        }
        
        return null;
    }
    
    mapIntentToOpportunity(intent, count) {
        const mapping = {
            'calculation_attempt': {
                product: 'Ammonia Price Calculator',
                description: 'Interactive calculator for price scenarios and impact analysis',
                priority: count * 10,
                marketSize: 'High - All trading participants need pricing tools',
                implementation: 'Medium complexity - Formula-based calculations'
            },
            'export_attempt': {
                product: 'Data Export Suite',
                description: 'Comprehensive data export and API access',
                priority: count * 8,
                marketSize: 'Medium - Analytics and research teams',
                implementation: 'Low complexity - Standard export functionality'
            },
            'comparison_attempt': {
                product: 'Side-by-Side Analysis Tool',
                description: 'Compare routes, prices, and market conditions',
                priority: count * 7,
                marketSize: 'High - Decision makers need comparison tools',
                implementation: 'Medium complexity - Multi-panel interface'
            },
            'data_extraction_attempt': {
                product: 'Smart Data Extraction',
                description: 'One-click data extraction and formatting',
                priority: count * 6,
                marketSize: 'Medium - Research and analysis users',
                implementation: 'High complexity - NLP and data processing'
            }
        };
        
        return mapping[intent];
    }
    
    // ============ UTILITY METHODS ============
    
    groupEventsByTime(events) {
        const groups = {};
        
        events.forEach(event => {
            const time = new Date(event.timestamp);
            const timeKey = `${time.getHours()}:${time.getMinutes().toString().padStart(2, '0')}`;
            
            if (!groups[timeKey]) {
                groups[timeKey] = [];
            }
            groups[timeKey].push(event);
        });
        
        return groups;
    }
    
    groupEventsBySession(events) {
        const sessions = {};
        
        events.forEach(event => {
            if (!sessions[event.sessionId]) {
                sessions[event.sessionId] = [];
            }
            sessions[event.sessionId].push(event);
        });
        
        return sessions;
    }
    
    extractViewSequences(events) {
        const sessions = this.groupEventsBySession(events);
        const sequences = [];
        
        Object.values(sessions).forEach(sessionEvents => {
            const views = [];
            let lastView = null;
            
            sessionEvents
                .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
                .forEach(event => {
                    if (event.currentView && event.currentView !== lastView) {
                        views.push(event.currentView);
                        lastView = event.currentView;
                    }
                });
            
            if (views.length > 1) {
                sequences.push(views);
            }
        });
        
        return sequences;
    }
    
    classifyDataType(text) {
        if (text.includes('$')) return 'pricing';
        if (text.includes('%')) return 'percentage';
        if (text.includes('t/y')) return 'capacity';
        if (text.includes('mt')) return 'volume';
        return 'other';
    }
    
    getViewColor(view) {
        const colors = {
            'index': '#0066cc',
            'data': '#00cc66',
            'geography': '#cc6600',
            'timeline': '#6600cc',
            'impact': '#cc0066',
            'connections': '#66cc00',
            'players': '#cc0000'
        };
        return colors[view] || '#666666';
    }
    
    getIntentColor(intent) {
        const colors = {
            'calculation_attempt': '#ff6b6b',
            'export_attempt': '#4ecdc4',
            'comparison_attempt': '#45b7d1',
            'data_extraction_attempt': '#96ceb4',
            'save_attempt': '#ffeaa7',
            'sharing_attempt': '#dda0dd'
        };
        return colors[intent] || '#74b9ff';
    }
    
    formatDuration(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
        return `${seconds}s`;
    }
}

// ============ DOMAIN INSIGHTS FORMATTER ============

class DomainInsightsFormatter {
    static formatAmmoniaInsights(insights) {
        let html = '<div class="domain-insights">';
        
        if (insights.pricingFocusPatterns.length > 0) {
            html += '<div class="insight-section">';
            html += '<h4>💰 Pricing Analysis Patterns</h4>';
            insights.pricingFocusPatterns.forEach(pattern => {
                html += `
                    <div class="insight-item">
                        <div class="insight-pattern">${pattern.pattern} (${pattern.count}x)</div>
                        <div class="insight-implication">→ ${pattern.businessImplication}</div>
                        <div class="insight-opportunity">💡 ${pattern.productOpportunity}</div>
                    </div>
                `;
            });
            html += '</div>';
        }
        
        if (insights.competitiveAnalysisSignals.length > 0) {
            html += '<div class="insight-section">';
            html += '<h4>⚔️ Competitive Analysis Signals</h4>';
            insights.competitiveAnalysisSignals.forEach(signal => {
                html += `
                    <div class="insight-item">
                        <div class="insight-pattern">${signal.pattern} (${signal.count}x)</div>
                        <div class="insight-implication">→ ${signal.businessImplication}</div>
                        <div class="insight-opportunity">💡 ${signal.productOpportunity}</div>
                    </div>
                `;
            });
            html += '</div>';
        }
        
        html += '</div>';
        return html;
    }
    
    static formatUserSegments(segments) {
        let html = '<div class="user-segments">';
        
        Object.entries(segments).forEach(([segmentKey, segment]) => {
            html += `
                <div class="segment-card">
                    <div class="segment-header">
                        <h4>${segment.businessContext.role}</h4>
                        <span class="segment-count">${segment.count} users</span>
                    </div>
                    <div class="segment-concerns">
                        <strong>Key Concerns:</strong> ${segment.businessContext.concerns}
                    </div>
                    <div class="segment-decisions">
                        <strong>Decisions:</strong> ${segment.businessContext.decisions}
                    </div>
                    <div class="segment-needs">
                        <strong>Product Needs:</strong>
                        <ul>
                            ${segment.productNeeds.map(need => `<li>${need}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        return html;
    }
    
    static formatProductOpportunities(opportunities) {
        let html = '<div class="product-opportunities">';
        
        opportunities.forEach(opportunity => {
            html += `
                <div class="opportunity-card">
                    <div class="opportunity-header">
                        <h4>${opportunity.product}</h4>
                        <span class="opportunity-priority">Priority: ${opportunity.priority}</span>
                    </div>
                    <div class="opportunity-description">${opportunity.description}</div>
                    <div class="opportunity-details">
                        <div><strong>Market Size:</strong> ${opportunity.marketSize}</div>
                        <div><strong>Implementation:</strong> ${opportunity.implementation}</div>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        return html;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BehavioralVisualizer, DomainInsightsFormatter };
} else {
    window.BehavioralVisualizer = BehavioralVisualizer;
    window.DomainInsightsFormatter = DomainInsightsFormatter;
} 