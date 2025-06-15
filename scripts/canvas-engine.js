// Maritime Intelligence Canvas Engine
// Inspired by Cisco AI Canvas - AgenticOps for Maritime Intelligence

class CanvasEngine {
    constructor() {
        this.isInitialized = false;
        this.collaborationMode = true;
        this.aiAgent = new AIAgent();
        this.collaborationEngine = new CollaborationEngine();
        this.dynamicCardGenerator = new DynamicCardGenerator();
        this.dataVisualizationEngine = new DataVisualizationEngine();
        
        this.init();
    }

    init() {
        console.log('🚀 Maritime Intelligence Canvas Engine Starting...');
        
        // Initialize components
        this.initializeEventListeners();
        this.initializeAICommands();
        this.initializeCollaboration();
        this.initializeDynamicContent();
        this.startRealTimeUpdates();
        
        this.isInitialized = true;
        console.log('✅ Canvas Engine Initialized');
        
        // Show welcome animation
        this.showWelcomeSequence();
    }

    initializeEventListeners() {
        // Canvas control buttons
        document.getElementById('generate-layout').addEventListener('click', () => {
            this.generateAILayout();
        });

        document.getElementById('add-data-source').addEventListener('click', () => {
            this.addDataSource();
        });

        document.getElementById('collaborate').addEventListener('click', () => {
            this.toggleCollaborationMode();
        });

        // AI command input
        document.getElementById('ai-command').addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.processAICommand(e.target.value);
                e.target.value = '';
            }
        });

        document.getElementById('submit-command').addEventListener('click', () => {
            const input = document.getElementById('ai-command');
            this.processAICommand(input.value);
            input.value = '';
        });

        // Quick command buttons
        document.querySelectorAll('.quick-cmd').forEach(btn => {
            btn.addEventListener('click', () => {
                this.processAICommand(btn.dataset.command);
            });
        });

        // AI Generate Cards
        document.getElementById('ai-generate-cards').addEventListener('click', () => {
            this.generateDynamicCards();
        });

        // Chat functionality
        this.initializeChatPanel();
        
        // Section controls
        this.initializeSectionControls();
    }

    initializeChatPanel() {
        const chatInput = document.querySelector('.chat-input');
        const chatSend = document.querySelector('.chat-send');
        const chatToggle = document.getElementById('chat-toggle');
        const chatPanel = document.getElementById('ai-chat-panel');

        chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.sendChatMessage(chatInput.value);
                chatInput.value = '';
            }
        });

        chatSend.addEventListener('click', () => {
            this.sendChatMessage(chatInput.value);
            chatInput.value = '';
        });

        chatToggle.addEventListener('click', () => {
            chatPanel.classList.toggle('minimized');
        });
    }

    initializeSectionControls() {
        // Refresh buttons
        document.querySelectorAll('.section-btn.refresh').forEach(btn => {
            btn.addEventListener('click', () => {
                this.refreshSection(btn.closest('.canvas-section'));
            });
        });

        // Expand buttons
        document.querySelectorAll('.section-btn.expand').forEach(btn => {
            btn.addEventListener('click', () => {
                this.expandSection(btn.closest('.canvas-section'));
            });
        });

        // Data source selector
        document.querySelector('.data-source-selector').addEventListener('change', (e) => {
            this.updateVisualization(e.target.value);
        });
    }

    generateAILayout() {
        this.showProcessingOverlay('Generating AI-optimized layout...');
        
        setTimeout(() => {
            // Simulate AI layout generation
            const layouts = [
                'analytics-focused',
                'collaboration-heavy',
                'real-time-monitoring',
                'executive-summary'
            ];
            
            const selectedLayout = layouts[Math.floor(Math.random() * layouts.length)];
            this.applyAILayout(selectedLayout);
            this.hideProcessingOverlay();
            
            this.showNotification(`Applied ${selectedLayout.replace('-', ' ')} layout`);
        }, 2000);
    }

    applyAILayout(layoutType) {
        const grid = document.getElementById('canvas-grid');
        
        // Apply different grid configurations based on AI recommendation
        switch(layoutType) {
            case 'analytics-focused':
                grid.style.gridTemplateColumns = '2fr 1fr';
                grid.style.gridTemplateRows = '1fr 1fr auto';
                break;
            case 'collaboration-heavy':
                grid.style.gridTemplateColumns = '1fr 1fr';
                grid.style.gridTemplateRows = 'auto 1fr auto';
                break;
            case 'real-time-monitoring':
                grid.style.gridTemplateColumns = '1fr';
                grid.style.gridTemplateRows = 'auto auto 1fr auto';
                break;
            case 'executive-summary':
                grid.style.gridTemplateColumns = '3fr 2fr';
                grid.style.gridTemplateRows = 'auto 1fr';
                break;
        }
        
        // Add animation effect
        grid.style.transition = 'all 0.5s ease';
        grid.classList.add('layout-updating');
        
        setTimeout(() => {
            grid.classList.remove('layout-updating');
        }, 500);
    }

    processAICommand(command) {
        if (!command.trim()) return;
        
        this.showProcessingOverlay(`Processing: "${command}"`);
        this.addChatMessage('user', command);
        
        // Simulate AI processing
        setTimeout(() => {
            const response = this.aiAgent.processCommand(command);
            this.addChatMessage('ai', response.message);
            
            // Execute AI actions
            if (response.actions) {
                response.actions.forEach(action => {
                    this.executeAIAction(action);
                });
            }
            
            this.hideProcessingOverlay();
        }, 1500);
    }

    executeAIAction(action) {
        switch(action.type) {
            case 'generate_insights':
                this.generateNewInsights(action.params);
                break;
            case 'update_visualization':
                this.updateVisualization(action.params.dataSource);
                break;
            case 'create_cards':
                this.generateDynamicCards(action.params);
                break;
            case 'collaborate':
                this.initiateCollaboration(action.params);
                break;
        }
    }

    generateNewInsights(params = {}) {
        const insightTypes = [
            { type: 'Market Pattern', confidence: 94, color: 'var(--canvas-success)' },
            { type: 'Risk Alert', confidence: 87, color: 'var(--canvas-warning)' },
            { type: 'Opportunity', confidence: 91, color: 'var(--canvas-accent)' },
            { type: 'Anomaly Detection', confidence: 83, color: 'var(--canvas-danger)' }
        ];
        
        const insights = [
            {
                title: 'Emerging Trade Route Optimization',
                description: 'AI analysis indicates 23% efficiency gain potential in Pacific-Atlantic routing through Panama Canal optimization.',
                impact: 'High'
            },
            {
                title: 'Supply Chain Vulnerability Detected',
                description: 'Cross-domain analysis reveals potential bottlenecks in ammonia supply chain affecting 3 major trade lanes.',
                impact: 'Critical'
            },
            {
                title: 'Price Correlation Discovery',
                description: 'New correlation found between Baltic Dry Index and LNG carrier rates with 89% accuracy.',
                impact: 'Medium'
            },
            {
                title: 'Seasonal Pattern Shift',
                description: 'Maritime traffic patterns showing unusual seasonal deviation in Southeast Asian routes.',
                impact: 'High'
            }
        ];
        
        const randomInsight = insights[Math.floor(Math.random() * insights.length)];
        const randomType = insightTypes[Math.floor(Math.random() * insightTypes.length)];
        
        this.addInsightCard(randomInsight, randomType);
    }

    addInsightCard(insight, type) {
        const insightCards = document.querySelector('.insight-cards');
        
        const cardElement = document.createElement('div');
        cardElement.className = 'insight-card new-card';
        cardElement.innerHTML = `
            <div class="insight-header">
                <span class="insight-type">${type.type}</span>
                <span class="confidence-score">${type.confidence}% confidence</span>
            </div>
            <h4>${insight.title}</h4>
            <p>${insight.description}</p>
            <div class="insight-actions">
                <button class="insight-btn">Explore Pattern</button>
                <button class="insight-btn secondary">Add to Report</button>
            </div>
        `;
        
        // Add with animation
        cardElement.style.opacity = '0';
        cardElement.style.transform = 'translateY(20px)';
        insightCards.appendChild(cardElement);
        
        setTimeout(() => {
            cardElement.style.transition = 'all 0.5s ease';
            cardElement.style.opacity = '1';
            cardElement.style.transform = 'translateY(0)';
        }, 100);
        
        // Remove old cards if too many
        const cards = insightCards.children;
        if (cards.length > 4) {
            cards[0].remove();
        }
    }

    generateDynamicCards(params = {}) {
        const cardGrid = document.querySelector('.dynamic-cards-grid');
        this.showProcessingOverlay('AI is generating intelligent cards...');
        
        setTimeout(() => {
            // Clear existing cards
            cardGrid.innerHTML = '';
            
            // Generate new cards based on AI analysis
            const cardTypes = [
                this.createAnalyticsCard(),
                this.createTrendCard(),
                this.createAlertCard(),
                this.createForecastCard()
            ];
            
            cardTypes.forEach((card, index) => {
                setTimeout(() => {
                    cardGrid.appendChild(card);
                    card.style.animation = 'slideInUp 0.5s ease forwards';
                }, index * 200);
            });
            
            this.hideProcessingOverlay();
            this.showNotification('Generated 4 new intelligence cards');
        }, 2000);
    }

    createAnalyticsCard() {
        const card = document.createElement('div');
        card.className = 'intel-card analytics-widget';
        card.innerHTML = `
            <div class="widget-title">AI Analytics</div>
            <div class="widget-value">${Math.floor(Math.random() * 100)}%</div>
            <div class="widget-change positive">+${Math.floor(Math.random() * 10)}% efficiency</div>
        `;
        return card;
    }

    createTrendCard() {
        const card = document.createElement('div');
        card.className = 'intel-card';
        card.innerHTML = `
            <div class="card-header">
                <div class="card-tags">
                    <span class="card-tag">AI Trend</span>
                </div>
                <span class="card-timestamp">AI Generated</span>
            </div>
            <h3 class="card-title">Market Trend Analysis</h3>
            <p class="card-summary">AI detected emerging patterns in global shipping rates with potential 15% impact on Q2 forecasts.</p>
        `;
        return card;
    }

    createAlertCard() {
        const card = document.createElement('div');
        card.className = 'intel-card live-update urgent';
        card.innerHTML = `
            <div class="card-header">
                <span class="card-timestamp">AI Alert</span>
                <span class="impact-badge high">High Priority</span>
            </div>
            <h3 class="card-title">Automated Risk Detection</h3>
            <div class="feed-status">
                <span class="pulse-dot"></span>
                <span>AI Monitoring</span>
            </div>
        `;
        return card;
    }

    createForecastCard() {
        const card = document.createElement('div');
        card.className = 'intel-card';
        card.innerHTML = `
            <div class="card-header">
                <div class="card-tags">
                    <span class="card-tag">AI Forecast</span>
                </div>
                <span class="card-timestamp">Predictive</span>
            </div>
            <h3 class="card-title">30-Day Outlook</h3>
            <div class="card-metrics">
                <div class="metric">
                    <span class="metric-label">Confidence</span>
                    <span class="metric-value positive">92%</span>
                </div>
            </div>
        `;
        return card;
    }

    updateVisualization(dataSource) {
        const vizContainer = document.querySelector('.visualization-container');
        const vizPlaceholder = vizContainer.querySelector('.viz-placeholder');
        
        // Show loading
        vizPlaceholder.innerHTML = `
            <div class="viz-loading">
                <div class="loading-spinner"></div>
                <span>Loading ${dataSource} visualization...</span>
            </div>
        `;
        
        setTimeout(() => {
            // Create mock visualization based on data source
            vizContainer.innerHTML = this.createVisualization(dataSource);
        }, 1500);
    }

    createVisualization(dataSource) {
        const visualizations = {
            'Trade Flows': `
                <div class="viz-chart">
                    <div class="chart-title">${dataSource} - Real-time Analysis</div>
                    <div class="chart-placeholder" style="background: linear-gradient(45deg, var(--canvas-accent) 0%, var(--canvas-accent-secondary) 100%); height: 150px; display: flex; align-items: center; justify-content: center; color: white; border-radius: 8px;">
                        Interactive ${dataSource} Chart
                    </div>
                </div>
            `,
            'Price Indices': `
                <div class="viz-chart">
                    <div class="chart-title">${dataSource} - Market Overview</div>
                    <div class="chart-placeholder" style="background: linear-gradient(45deg, var(--canvas-success) 0%, var(--canvas-warning) 100%); height: 150px; display: flex; align-items: center; justify-content: center; color: white; border-radius: 8px;">
                        ${dataSource} Dashboard
                    </div>
                </div>
            `,
            'Vessel Tracking': `
                <div class="viz-chart">
                    <div class="chart-title">${dataSource} - Live Map</div>
                    <div class="chart-placeholder" style="background: linear-gradient(45deg, var(--canvas-ai) 0%, var(--canvas-collaboration) 100%); height: 150px; display: flex; align-items: center; justify-content: center; color: white; border-radius: 8px;">
                        Real-time ${dataSource}
                    </div>
                </div>
            `,
            'Port Congestion': `
                <div class="viz-chart">
                    <div class="chart-title">${dataSource} - Global Status</div>
                    <div class="chart-placeholder" style="background: linear-gradient(45deg, var(--canvas-danger) 0%, var(--canvas-warning) 100%); height: 150px; display: flex; align-items: center; justify-content: center; color: white; border-radius: 8px;">
                        ${dataSource} Monitoring
                    </div>
                </div>
            `
        };
        
        return visualizations[dataSource] || visualizations['Trade Flows'];
    }

    addChatMessage(sender, message) {
        const chatMessages = document.getElementById('chat-messages');
        const messageElement = document.createElement('div');
        messageElement.className = `chat-message ${sender}`;
        
        messageElement.innerHTML = `
            <div class="message-avatar ${sender}">${sender === 'ai' ? 'AI' : 'U'}</div>
            <div class="message-content">
                <p>${message}</p>
            </div>
        `;
        
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    sendChatMessage(message) {
        if (!message.trim()) return;
        
        this.addChatMessage('user', message);
        
        // Simulate AI response
        setTimeout(() => {
            const aiResponse = this.aiAgent.generateChatResponse(message);
            this.addChatMessage('ai', aiResponse);
        }, 1000);
    }

    showProcessingOverlay(status) {
        const overlay = document.getElementById('ai-processing');
        const statusElement = document.getElementById('processing-status');
        
        statusElement.textContent = status;
        overlay.classList.add('active');
    }

    hideProcessingOverlay() {
        const overlay = document.getElementById('ai-processing');
        overlay.classList.remove('active');
    }

    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'canvas-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">✓</span>
                <span class="notification-message">${message}</span>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--canvas-success);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 2000;
            opacity: 0;
            transform: translateX(100px);
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after delay
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100px)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    showWelcomeSequence() {
        // Animate elements in sequence
        const elements = [
            '.canvas-toolbar',
            '.ai-command-bar',
            '.canvas-section'
        ];
        
        elements.forEach((selector, index) => {
            setTimeout(() => {
                const element = document.querySelector(selector);
                if (element) {
                    element.style.opacity = '0';
                    element.style.transform = 'translateY(20px)';
                    element.style.transition = 'all 0.5s ease';
                    
                    setTimeout(() => {
                        element.style.opacity = '1';
                        element.style.transform = 'translateY(0)';
                    }, 100);
                }
            }, index * 200);
        });
        
        // Show welcome message
        setTimeout(() => {
            this.showNotification('Welcome to Maritime Intelligence Canvas!');
        }, 1000);
    }

    startRealTimeUpdates() {
        // Simulate real-time updates
        setInterval(() => {
            this.updateRealTimeIndicators();
        }, 30000); // Update every 30 seconds
    }

    updateRealTimeIndicators() {
        // Update timestamps
        const timestamps = document.querySelectorAll('.card-timestamp');
        timestamps.forEach(timestamp => {
            if (timestamp.textContent.includes('min ago')) {
                const minutes = parseInt(timestamp.textContent) + 1;
                timestamp.textContent = `${minutes}min ago`;
            }
        });
        
        // Update live indicators
        const liveUpdates = document.querySelectorAll('.live-update');
        liveUpdates.forEach(update => {
            update.style.animation = 'pulse 2s ease-in-out';
            setTimeout(() => {
                update.style.animation = '';
            }, 2000);
        });
    }

    initializeCollaboration() {
        this.collaborationEngine.init();
    }

    initializeAICommands() {
        this.aiAgent.init();
    }

    initializeDynamicContent() {
        this.dynamicCardGenerator.init();
    }

    addDataSource() {
        this.showNotification('Data source integration coming soon!');
    }

    toggleCollaborationMode() {
        this.collaborationMode = !this.collaborationMode;
        this.showNotification(
            this.collaborationMode ? 'Collaboration mode enabled' : 'Collaboration mode disabled'
        );
    }

    refreshSection(section) {
        const sectionId = section.id;
        section.style.opacity = '0.5';
        
        setTimeout(() => {
            // Refresh section content
            if (sectionId === 'insights-section') {
                this.generateNewInsights();
            } else if (sectionId === 'visualization-section') {
                this.updateVisualization('Trade Flows');
            }
            
            section.style.opacity = '1';
            this.showNotification('Section refreshed');
        }, 1000);
    }

    expandSection(section) {
        section.classList.toggle('expanded');
        this.showNotification('Section layout updated');
    }
}

// AI Agent Class
class AIAgent {
    constructor() {
        this.commands = {
            'trade flow': this.handleTradeFlowAnalysis,
            'risk assessment': this.handleRiskAssessment,
            'comparative analysis': this.handleComparativeAnalysis,
            'forecast': this.handleForecast,
            'insights': this.handleInsightGeneration
        };
    }

    init() {
        console.log('🤖 AI Agent initialized');
    }

    processCommand(command) {
        const lowerCommand = command.toLowerCase();
        
        // Find matching command
        for (const [key, handler] of Object.entries(this.commands)) {
            if (lowerCommand.includes(key)) {
                return handler.call(this, command);
            }
        }
        
        // Default response
        return {
            message: `I've analyzed your request: "${command}". Based on current maritime data, I recommend focusing on supply chain optimization and risk mitigation strategies.`,
            actions: [
                { type: 'generate_insights', params: { topic: command } }
            ]
        };
    }

    handleTradeFlowAnalysis(command) {
        return {
            message: "I've generated a comprehensive trade flow analysis. The data shows emerging patterns in Pacific-Atlantic routes with potential for 23% efficiency improvements.",
            actions: [
                { type: 'update_visualization', params: { dataSource: 'Trade Flows' } },
                { type: 'generate_insights', params: { topic: 'trade flows' } }
            ]
        };
    }

    handleRiskAssessment(command) {
        return {
            message: "Risk assessment complete. I've identified 3 critical vulnerability points in current supply chains, particularly around Suez Canal diversions.",
            actions: [
                { type: 'create_cards', params: { type: 'risk-analysis' } },
                { type: 'generate_insights', params: { topic: 'risk assessment' } }
            ]
        };
    }

    handleComparativeAnalysis(command) {
        return {
            message: "Comparative analysis shows ammonia shipping costs 15% higher than LNG on current routes. I recommend optimizing vessel scheduling for better efficiency.",
            actions: [
                { type: 'update_visualization', params: { dataSource: 'Price Indices' } },
                { type: 'create_cards', params: { type: 'comparative' } }
            ]
        };
    }

    handleForecast(command) {
        return {
            message: "30-day forecast indicates potential rate increases in container shipping. Confidence level: 92%. I suggest monitoring Baltic Dry Index closely.",
            actions: [
                { type: 'create_cards', params: { type: 'forecast' } },
                { type: 'generate_insights', params: { topic: 'forecast' } }
            ]
        };
    }

    handleInsightGeneration(command) {
        return {
            message: "I've generated new insights based on cross-domain analysis of maritime data. Key patterns identified in trade route optimization.",
            actions: [
                { type: 'generate_insights', params: { topic: 'general' } }
            ]
        };
    }

    generateChatResponse(message) {
        const responses = [
            "That's an interesting perspective on maritime intelligence. Let me analyze the current data patterns.",
            "Based on real-time shipping data, I can provide insights on that topic.",
            "I've processed your request against our maritime database. Here's what I found:",
            "Cross-referencing with current market conditions, I recommend focusing on supply chain resilience.",
            "The data suggests several optimization opportunities in that area."
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }
}

// Collaboration Engine
class CollaborationEngine {
    constructor() {
        this.activeUsers = ['James F.', 'Sarah K.'];
        this.collaborationFeed = [];
    }

    init() {
        console.log('👥 Collaboration Engine initialized');
        this.simulateCollaboration();
    }

    simulateCollaboration() {
        // Simulate occasional collaborative messages
        setInterval(() => {
            if (Math.random() > 0.7) { // 30% chance every interval
                this.addCollaborativeMessage();
            }
        }, 45000); // Every 45 seconds
    }

    addCollaborativeMessage() {
        const messages = [
            "Sarah K.: The latest ammonia data looks promising for Q2 projections.",
            "James F.: Should we update our risk assessment based on these Red Sea developments?",
            "Sarah K.: AI recommendations align with our manual analysis - good validation.",
            "James F.: Port congestion data needs verification from Singapore office."
        ];
        
        const message = messages[Math.floor(Math.random() * messages.length)];
        console.log('📝 New collaboration message:', message);
        
        // Could add to UI collaboration feed here
        this.showCollaborationNotification(message);
    }

    showCollaborationNotification(message) {
        // Create small notification
        const notification = document.createElement('div');
        notification.className = 'collab-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            bottom: 100px;
            right: 24px;
            background: var(--canvas-collaboration);
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 12px;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.3s ease;
            z-index: 1500;
            max-width: 300px;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(20px)';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }
}

// Dynamic Card Generator
class DynamicCardGenerator {
    constructor() {
        this.cardTemplates = [];
    }

    init() {
        console.log('🎯 Dynamic Card Generator initialized');
    }
}

// Data Visualization Engine
class DataVisualizationEngine {
    constructor() {
        this.dataSources = ['Trade Flows', 'Price Indices', 'Vessel Tracking', 'Port Congestion'];
    }

    init() {
        console.log('📊 Data Visualization Engine initialized');
    }
}

// Export for global access
window.CanvasEngine = CanvasEngine;
window.AIAgent = AIAgent;
window.CollaborationEngine = CollaborationEngine; 