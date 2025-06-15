/**
 * Story Explorer Engine
 * Handles interactive story exploration in the center column
 * Follows same architectural patterns as platform-hub.js
 */

class StoryExplorer {
    constructor(containerId = 'story-explorer-container') {
        this.container = document.getElementById(containerId);
        this.activeCards = new Map(); // Track active story cards
        this.storyContext = null; // Current story context
        this.commandHistory = []; // Command history for context
        
        // Story card types and their configurations
        this.cardTypes = {
            timeline: {
                title: 'Timeline Analysis',
                icon: '📅',
                expandable: true,
                tools: ['zoom', 'filter', 'annotate']
            },
            map: {
                title: 'Geographic Analysis',
                icon: '🗺️',
                expandable: true,
                tools: ['layers', 'routes', 'vessels']
            },
            impact: {
                title: 'Impact Assessment',
                icon: '📊',
                expandable: true,
                tools: ['calculator', 'scenarios', 'forecast']
            },
            news: {
                title: 'Related News',
                icon: '📰',
                expandable: true,
                tools: ['search', 'filter', 'sentiment']
            },
            data: {
                title: 'Data Analysis',
                icon: '📈',
                expandable: true,
                tools: ['chart', 'table', 'export']
            },
            vessels: {
                title: 'Vessel Tracking',
                icon: '🚢',
                expandable: true,
                tools: ['track', 'compare', 'alerts']
            }
        };

        this.init();
    }

    init() {
        if (!this.container) {
            console.error('Story Explorer: Container not found');
            return;
        }

        this.createStoryInterface();
        this.initializeEventListeners();
        this.setupCommandInterface();
        
        console.log('Story Explorer initialized');
    }

    createStoryInterface() {
        this.container.innerHTML = `
            <div class="story-explorer-wrapper">
                <div class="story-header">
                    <div class="story-breadcrumb">
                        <span class="breadcrumb-item active">Story Analysis</span>
                    </div>
                    <div class="story-actions">
                        <button class="story-action-btn" data-action="close">
                            <span class="action-icon">←</span>
                            Back to Dashboard
                        </button>
                        <button class="story-action-btn" data-action="reset">
                            <span class="action-icon">🔄</span>
                            Reset View
                        </button>
                        <button class="story-action-btn" data-action="save">
                            <span class="action-icon">💾</span>
                            Save Analysis
                        </button>
                    </div>
                </div>
                
                <div class="story-cards-container" id="story-cards">
                    <div class="story-welcome">
                        <div class="welcome-icon">🔍</div>
                        <h3>Explore This Story</h3>
                        <p>Use the command interface below to analyze this story in depth. Try commands like:</p>
                        <div class="example-commands">
                            <span class="example-cmd">show timeline</span>
                            <span class="example-cmd">map routes</span>
                            <span class="example-cmd">analyze impact</span>
                            <span class="example-cmd">search news</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    setupCommandInterface() {
        // Create command interface at bottom of viewport
        const commandInterface = document.createElement('div');
        commandInterface.id = 'story-command-interface';
        commandInterface.className = 'command-interface inactive';
        
        commandInterface.innerHTML = `
            <div class="command-wrapper">
                <div class="command-trigger" id="command-trigger">
                    <span class="command-hint">Ask about this story...</span>
                    <span class="command-shortcut">Press / to start</span>
                </div>
                <div class="command-input-container" id="command-input-container">
                    <div class="command-input-wrapper">
                        <span class="command-prompt">></span>
                        <input type="text" 
                               id="command-input" 
                               class="command-input" 
                               placeholder="What would you like to explore?"
                               autocomplete="off">
                        <button class="command-submit" id="command-submit">
                            <span>⏎</span>
                        </button>
                    </div>
                    <div class="command-suggestions" id="command-suggestions"></div>
                </div>
            </div>
        `;

        document.body.appendChild(commandInterface);
        this.commandInterface = commandInterface;
        this.setupCommandEventListeners();
    }

    setupCommandEventListeners() {
        const trigger = document.getElementById('command-trigger');
        const input = document.getElementById('command-input');
        const submit = document.getElementById('command-submit');
        const suggestions = document.getElementById('command-suggestions');

        // Activate command interface
        trigger.addEventListener('click', () => this.activateCommand());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === '/' && !this.isCommandActive()) {
                e.preventDefault();
                this.activateCommand();
            }
            if (e.key === 'Escape' && this.isCommandActive()) {
                this.deactivateCommand();
            }
        });

        // Command input handling
        input.addEventListener('input', (e) => this.handleCommandInput(e.target.value));
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.executeCommand(e.target.value);
            }
        });

        submit.addEventListener('click', () => {
            this.executeCommand(input.value);
        });

        // Click outside to deactivate
        document.addEventListener('click', (e) => {
            if (this.isCommandActive() && !this.commandInterface.contains(e.target)) {
                this.deactivateCommand();
            }
        });
    }

    initializeEventListeners() {
        // Story card interactions
        this.container.addEventListener('click', (e) => {
            if (e.target.matches('.story-card')) {
                this.handleCardClick(e.target);
            }
            if (e.target.matches('.card-expand-btn')) {
                this.toggleCardExpansion(e.target.closest('.story-card'));
            }
            if (e.target.matches('.card-tool-btn')) {
                this.handleCardTool(e.target);
            }
            if (e.target.matches('.story-action-btn')) {
                this.handleStoryAction(e.target.dataset.action);
            }
        });

        // Card expansion/collapse
        this.container.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.target.matches('.story-card')) {
                this.toggleCardExpansion(e.target);
            }
        });
    }

    // Command Interface Methods
    activateCommand() {
        this.commandInterface.classList.remove('inactive');
        this.commandInterface.classList.add('active');
        
        setTimeout(() => {
            document.getElementById('command-input').focus();
        }, 150);
    }

    deactivateCommand() {
        this.commandInterface.classList.remove('active');
        this.commandInterface.classList.add('inactive');
        
        document.getElementById('command-input').value = '';
        document.getElementById('command-suggestions').innerHTML = '';
    }

    isCommandActive() {
        return this.commandInterface.classList.contains('active');
    }

    handleCommandInput(value) {
        if (!value.trim()) {
            this.clearSuggestions();
            return;
        }

        const suggestions = this.generateSuggestions(value);
        this.displaySuggestions(suggestions);
    }

    generateSuggestions(input) {
        const commands = [
            { text: 'show timeline', description: 'Display chronological events' },
            { text: 'map routes', description: 'Show geographic analysis' },
            { text: 'analyze impact', description: 'Calculate economic effects' },
            { text: 'search news', description: 'Find related news articles' },
            { text: 'track vessels', description: 'Monitor ship movements' },
            { text: 'compare events', description: 'Compare with similar incidents' },
            { text: 'forecast scenarios', description: 'Predict potential outcomes' },
            { text: 'export data', description: 'Download analysis results' }
        ];

        return commands.filter(cmd => 
            cmd.text.toLowerCase().includes(input.toLowerCase()) ||
            cmd.description.toLowerCase().includes(input.toLowerCase())
        ).slice(0, 5);
    }

    displaySuggestions(suggestions) {
        const container = document.getElementById('command-suggestions');
        
        if (suggestions.length === 0) {
            container.innerHTML = '';
            return;
        }

        container.innerHTML = suggestions.map(suggestion => `
            <div class="suggestion-item" data-command="${suggestion.text}">
                <span class="suggestion-text">${suggestion.text}</span>
                <span class="suggestion-desc">${suggestion.description}</span>
            </div>
        `).join('');

        // Add click handlers for suggestions
        container.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', () => {
                this.executeCommand(item.dataset.command);
            });
        });
    }

    clearSuggestions() {
        document.getElementById('command-suggestions').innerHTML = '';
    }

    executeCommand(command) {
        if (!command.trim()) return;

        this.commandHistory.push(command);
        this.deactivateCommand();
        
        // Parse and execute command
        this.parseCommand(command.toLowerCase().trim());
        
        // Track analytics
        this.trackEvent('command_executed', { command });
    }

    parseCommand(command) {
        // Simple command parsing - can be enhanced with NLP
        if (command.includes('timeline') || command.includes('time')) {
            this.createStoryCard('timeline', { query: command });
        } else if (command.includes('map') || command.includes('route')) {
            this.createStoryCard('map', { query: command });
        } else if (command.includes('impact') || command.includes('effect')) {
            this.createStoryCard('impact', { query: command });
        } else if (command.includes('news') || command.includes('article')) {
            this.createStoryCard('news', { query: command });
        } else if (command.includes('vessel') || command.includes('ship')) {
            this.createStoryCard('vessels', { query: command });
        } else if (command.includes('data') || command.includes('chart')) {
            this.createStoryCard('data', { query: command });
        } else {
            // Default to general analysis
            this.createStoryCard('impact', { query: command });
        }
    }

    // Story Card Management
    createStoryCard(type, options = {}) {
        const cardId = `story-card-${type}-${Date.now()}`;
        const cardConfig = this.cardTypes[type];
        
        if (!cardConfig) {
            console.error('Unknown card type:', type);
            return;
        }

        const cardElement = this.buildCardElement(cardId, type, cardConfig, options);
        this.insertCard(cardElement);
        this.activeCards.set(cardId, { type, element: cardElement, options });
        
        // Animate card entrance
        setTimeout(() => {
            cardElement.classList.add('visible');
        }, 100);

        return cardId;
    }

    buildCardElement(cardId, type, config, options) {
        const card = document.createElement('div');
        card.className = 'story-card';
        card.id = cardId;
        card.dataset.type = type;
        
        card.innerHTML = `
            <div class="story-card-header">
                <div class="card-title-section">
                    <span class="card-icon">${config.icon}</span>
                    <h4 class="card-title">${config.title}</h4>
                    ${options.query ? `<span class="card-query">"${options.query}"</span>` : ''}
                </div>
                <div class="card-controls">
                    <button class="card-expand-btn" title="Expand/Collapse">
                        <span class="expand-icon">⌄</span>
                    </button>
                    <button class="card-close-btn" title="Close">
                        <span class="close-icon">×</span>
                    </button>
                </div>
            </div>
            
            <div class="story-card-content">
                <div class="card-summary">
                    ${this.generateCardContent(type, options)}
                </div>
                
                <div class="card-expanded-content" style="display: none;">
                    <div class="card-tools">
                        ${config.tools.map(tool => `
                            <button class="card-tool-btn" data-tool="${tool}">
                                ${this.getToolIcon(tool)} ${this.getToolLabel(tool)}
                            </button>
                        `).join('')}
                    </div>
                    <div class="card-interactive-area">
                        ${this.generateExpandedContent(type, options)}
                    </div>
                </div>
            </div>
        `;

        return card;
    }

    generateCardContent(type, options) {
        // Generate initial card content based on type
        switch (type) {
            case 'timeline':
                return `
                    <div class="timeline-preview">
                        <div class="timeline-item">
                            <span class="timeline-time">2 days ago</span>
                            <span class="timeline-event">Initial disruption reported</span>
                        </div>
                        <div class="timeline-item">
                            <span class="timeline-time">1 day ago</span>
                            <span class="timeline-event">Traffic rerouting initiated</span>
                        </div>
                        <div class="timeline-item active">
                            <span class="timeline-time">Now</span>
                            <span class="timeline-event">Ongoing impact assessment</span>
                        </div>
                    </div>
                `;
            case 'map':
                return `
                    <div class="map-preview">
                        <div class="map-placeholder">
                            🗺️ Interactive map loading...
                            <div class="map-stats">
                                <span>3 alternative routes identified</span>
                                <span>12 vessels affected</span>
                            </div>
                        </div>
                    </div>
                `;
            case 'impact':
                return `
                    <div class="impact-preview">
                        <div class="impact-metric">
                            <span class="metric-label">Economic Impact</span>
                            <span class="metric-value negative">-$2.4B daily</span>
                        </div>
                        <div class="impact-metric">
                            <span class="metric-label">Vessels Affected</span>
                            <span class="metric-value">847 ships</span>
                        </div>
                        <div class="impact-metric">
                            <span class="metric-label">Delay Average</span>
                            <span class="metric-value">+12 days</span>
                        </div>
                    </div>
                `;
            case 'news':
                return `
                    <div class="news-preview">
                        <div class="news-item">
                            <span class="news-time">2h ago</span>
                            <span class="news-headline">Canal Authority Updates Reopening Timeline</span>
                        </div>
                        <div class="news-item">
                            <span class="news-time">4h ago</span>
                            <span class="news-headline">Shipping Rates Surge Amid Disruption</span>
                        </div>
                        <div class="news-item">
                            <span class="news-time">6h ago</span>
                            <span class="news-headline">Alternative Routes See 300% Traffic Increase</span>
                        </div>
                    </div>
                `;
            case 'vessels':
                return `
                    <div class="vessels-preview">
                        <div class="vessel-item">
                            <span class="vessel-name">EVER FORWARD</span>
                            <span class="vessel-status waiting">Waiting</span>
                        </div>
                        <div class="vessel-item">
                            <span class="vessel-name">MSC GULSUN</span>
                            <span class="vessel-status rerouted">Rerouted</span>
                        </div>
                        <div class="vessel-item">
                            <span class="vessel-name">OOCL HONG KONG</span>
                            <span class="vessel-status delayed">Delayed</span>
                        </div>
                    </div>
                `;
            case 'data':
                return `
                    <div class="data-preview">
                        <div class="chart-placeholder">
                            📈 Loading data visualization...
                            <div class="data-stats">
                                <span>1,247 data points</span>
                                <span>Real-time updates</span>
                            </div>
                        </div>
                    </div>
                `;
            default:
                return '<div class="loading">Loading content...</div>';
        }
    }

    generateExpandedContent(type, options) {
        // Generate expanded interactive content
        return `
            <div class="expanded-placeholder">
                <p>Interactive ${type} analysis would appear here</p>
                <p>This would include detailed charts, maps, data tables, and interactive tools</p>
            </div>
        `;
    }

    getToolIcon(tool) {
        const icons = {
            zoom: '🔍',
            filter: '🔽',
            annotate: '✏️',
            layers: '📋',
            routes: '🛣️',
            vessels: '🚢',
            calculator: '🧮',
            scenarios: '🎯',
            forecast: '📊',
            search: '🔍',
            sentiment: '😊',
            chart: '📈',
            table: '📋',
            export: '💾',
            track: '📍',
            compare: '⚖️',
            alerts: '🔔'
        };
        return icons[tool] || '🔧';
    }

    getToolLabel(tool) {
        const labels = {
            zoom: 'Zoom',
            filter: 'Filter',
            annotate: 'Annotate',
            layers: 'Layers',
            routes: 'Routes',
            vessels: 'Vessels',
            calculator: 'Calculate',
            scenarios: 'Scenarios',
            forecast: 'Forecast',
            search: 'Search',
            sentiment: 'Sentiment',
            chart: 'Chart',
            table: 'Table',
            export: 'Export',
            track: 'Track',
            compare: 'Compare',
            alerts: 'Alerts'
        };
        return labels[tool] || tool;
    }

    insertCard(cardElement) {
        const container = document.getElementById('story-cards');
        const welcome = container.querySelector('.story-welcome');
        
        // Hide welcome message when first card is added
        if (welcome && this.activeCards.size === 0) {
            welcome.style.display = 'none';
        }
        
        container.appendChild(cardElement);
    }

    // Card Interaction Methods
    handleCardClick(card) {
        // Handle card selection/focus
        document.querySelectorAll('.story-card').forEach(c => c.classList.remove('focused'));
        card.classList.add('focused');
    }

    toggleCardExpansion(card) {
        const expandedContent = card.querySelector('.card-expanded-content');
        const expandIcon = card.querySelector('.expand-icon');
        
        if (expandedContent.style.display === 'none') {
            expandedContent.style.display = 'block';
            expandIcon.textContent = '⌃';
            card.classList.add('expanded');
        } else {
            expandedContent.style.display = 'none';
            expandIcon.textContent = '⌄';
            card.classList.remove('expanded');
        }
    }

    handleCardTool(toolButton) {
        const tool = toolButton.dataset.tool;
        const card = toolButton.closest('.story-card');
        const cardType = card.dataset.type;
        
        console.log(`Executing tool: ${tool} on card: ${cardType}`);
        
        // Tool-specific logic would go here
        this.showNotification(`${tool} tool activated for ${cardType} analysis`);
        
        // Track analytics
        this.trackEvent('tool_used', { tool, cardType });
    }

    handleStoryAction(action) {
        switch (action) {
            case 'close':
                this.closeStoryExplorer();
                break;
            case 'reset':
                this.resetStoryView();
                break;
            case 'save':
                this.saveStoryAnalysis();
                break;
        }
    }

    closeStoryExplorer() {
        // Call platform hub to hide story explorer
        if (window.platformHub) {
            window.platformHub.hideStoryExplorer();
        }
        
        // Reset story state
        this.resetStoryView();
        
        this.trackEvent('story_explorer_closed_by_user');
    }

    resetStoryView() {
        // Clear all active cards
        this.activeCards.clear();
        const container = document.getElementById('story-cards');
        container.innerHTML = `
            <div class="story-welcome">
                <div class="welcome-icon">🔍</div>
                <h3>Explore This Story</h3>
                <p>Use the command interface below to analyze this story in depth. Try commands like:</p>
                <div class="example-commands">
                    <span class="example-cmd">show timeline</span>
                    <span class="example-cmd">map routes</span>
                    <span class="example-cmd">analyze impact</span>
                    <span class="example-cmd">search news</span>
                </div>
            </div>
        `;
        
        this.showNotification('Story view reset');
    }

    saveStoryAnalysis() {
        const analysisData = {
            timestamp: new Date().toISOString(),
            activeCards: Array.from(this.activeCards.keys()),
            commandHistory: this.commandHistory,
            storyContext: this.storyContext
        };
        
        // In a real implementation, this would save to backend
        console.log('Saving story analysis:', analysisData);
        this.showNotification('Analysis saved successfully');
    }

    // Utility Methods
    setStoryContext(context) {
        this.storyContext = context;
        console.log('Story context updated:', context);
    }

    setActiveTab(tabName) {
        // Update story explorer based on active tab
        console.log('Story explorer tab changed to:', tabName);
        
        // Clear existing welcome message and show tab-specific content
        const container = document.getElementById('story-cards');
        if (container && container.querySelector('.story-welcome')) {
            container.querySelector('.story-welcome').style.display = 'none';
            
            // Add tab-specific initial content
            this.addTabSpecificContent(tabName);
        }
    }

    addTabSpecificContent(tabName) {
        // Add initial cards based on the active tab
        switch (tabName) {
            case 'overview':
                // Overview tab - show executive summary
                break;
            case 'data':
                this.createStoryCard('data', { query: 'show data overview', tab: tabName });
                break;
            case 'connections':
                this.createStoryCard('vessels', { query: 'show connections', tab: tabName });
                break;
            case 'impact':
                this.createStoryCard('impact', { query: 'analyze impact', tab: tabName });
                break;
            case 'geography':
                this.createStoryCard('map', { query: 'show geography', tab: tabName });
                break;
            case 'timeline':
                this.createStoryCard('timeline', { query: 'show timeline', tab: tabName });
                break;
            case 'players':
                this.createStoryCard('vessels', { query: 'show key players', tab: tabName });
                break;
        }
    }

    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'story-notification';
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '100px',
            right: '20px',
            background: '#00d4ff',
            color: '#0a0a0a',
            padding: '12px 20px',
            borderRadius: '6px',
            fontWeight: '500',
            fontSize: '13px',
            zIndex: '10000',
            animation: 'slideIn 0.3s ease-out'
        });

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    trackEvent(eventType, data) {
        // Analytics tracking
        console.log('Story Explorer Event:', eventType, data);
        
        // In a real implementation, this would send data to analytics service
        if (window.platformHub) {
            window.platformHub.trackEvent(`story_${eventType}`, data);
        }
    }
}

// Initialize story explorer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if the story explorer container exists
    if (document.getElementById('story-explorer-container')) {
        window.storyExplorer = new StoryExplorer();
        console.log('Story Explorer ready');
    }
}); 