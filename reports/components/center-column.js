// Center Column: Deep Dive and Interaction Engine
class CenterColumnEngine {
    constructor() {
        this.currentTab = 'overview';
        this.reportData = null;
        this.interactionMode = 'standard';
        this.annotations = new Map();
        this.bookmarks = new Set();
        this.highlights = new Map();
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadReportData();
        this.initializeInteractionTools();
        this.listenToOtherColumns();
    }

    // Tab Management
    switchTab(tabName) {
        if (this.currentTab === tabName) return;
        
        // Hide current tab content
        const currentContent = document.getElementById(`content-${this.currentTab}`);
        if (currentContent) {
            currentContent.classList.remove('active');
        }
        
        // Remove active from current tab button
        const currentTabBtn = document.getElementById(`tab-${this.currentTab}`);
        if (currentTabBtn) {
            currentTabBtn.classList.remove('active');
        }
        
        // Show new tab content
        const newContent = document.getElementById(`content-${tabName}`);
        if (newContent) {
            newContent.classList.add('active');
        }
        
        // Activate new tab button
        const newTabBtn = document.getElementById(`tab-${tabName}`);
        if (newTabBtn) {
            newTabBtn.classList.add('active');
        }
        
        this.currentTab = tabName;
        this.loadTabContent(tabName);
        this.notifyOtherColumns('tabChanged', tabName);
    }

    loadTabContent(tabName) {
        switch (tabName) {
            case 'overview':
                this.loadOverviewContent();
                break;
            case 'data':
                this.loadDataContent();
                break;
            case 'connections':
                this.loadConnectionsContent();
                break;
            case 'impact':
                this.loadImpactContent();
                break;
            case 'geography':
                this.loadGeographyContent();
                break;
            case 'timeline':
                this.loadTimelineContent();
                break;
            case 'players':
                this.loadPlayersContent();
                break;
        }
    }

    // Content Loading Methods
    loadReportData(reportData = null) {
        // Default report data or load from parameter
        this.reportData = reportData || {
            title: 'Gulf Coast Ammonia Plant Export Triggers $25/mt Price Decline',
            date: 'March 28, 2025',
            category: 'Market Analysis',
            readTime: '8 min read',
            keyInsight: 'Gulf Coast Ammonia Plant\'s inaugural export cargo on Dancing Brave to Norway marks a pivotal shift in global ammonia trade patterns, triggering immediate supply pressure and the fourth consecutive monthly price decline.',
            executiveSummary: 'The first export shipment from the newly operational Gulf Coast Ammonia Plant has sent ripples through global ammonia markets, with CFR prices falling $25/mt as traders reassess supply balances.',
            marketDynamics: 'The timing of this inaugural shipment coincides with already softening market conditions, amplifying the downward price pressure.',
            analysis: 'This new supply source is expected to capture market share from existing suppliers, particularly affecting traditional exporters in the Caribbean and Eastern Europe.',
            outlook: 'The plant\'s strategic location and competitive production costs position it favorably for sustained exports to Europe and potentially other Atlantic Basin markets.',
            metrics: {
                priceImpact: '-$25/mt CFR',
                volume: '35,000 mt',
                marketShare: '15%'
            }
        };
        
        this.updateReportDisplay();
    }

    updateReportDisplay() {
        // Update header information
        const titleEl = document.getElementById('report-title');
        const dateEl = document.getElementById('report-date');
        const categoryEl = document.getElementById('report-category');
        const readTimeEl = document.getElementById('read-time');
        
        if (titleEl) titleEl.textContent = this.reportData.title;
        if (dateEl) dateEl.textContent = this.reportData.date;
        if (categoryEl) categoryEl.textContent = this.reportData.category;
        if (readTimeEl) readTimeEl.textContent = this.reportData.readTime;
    }

    loadOverviewContent() {
        // Update overview content with report data
        const keyInsightEl = document.getElementById('key-insight');
        const summaryEl = document.getElementById('executive-summary');
        const dynamicsEl = document.getElementById('market-dynamics');
        const analysisEl = document.getElementById('analysis-content');
        const outlookEl = document.getElementById('outlook-content');
        
        if (keyInsightEl) keyInsightEl.textContent = this.reportData.keyInsight;
        if (summaryEl) summaryEl.innerHTML = `<p>${this.reportData.executiveSummary}</p>`;
        if (dynamicsEl) dynamicsEl.innerHTML = `<p>${this.reportData.marketDynamics}</p>`;
        if (analysisEl) analysisEl.innerHTML = `<p>${this.reportData.analysis}</p>`;
        if (outlookEl) outlookEl.innerHTML = `<p>${this.reportData.outlook}</p>`;
        
        // Update metrics
        this.updateMetrics();
    }

    updateMetrics() {
        const priceImpactEl = document.getElementById('price-impact');
        const volumeEl = document.getElementById('volume-metric');
        const marketShareEl = document.getElementById('market-share');
        
        if (priceImpactEl) priceImpactEl.textContent = this.reportData.metrics.priceImpact;
        if (volumeEl) volumeEl.textContent = this.reportData.metrics.volume;
        if (marketShareEl) marketShareEl.textContent = this.reportData.metrics.marketShare;
    }

    loadDataContent() {
        const dataContent = document.getElementById('content-data');
        if (!dataContent) return;
        
        // Simulate loading data visualizations
        this.showLoadingState(dataContent);
        
        setTimeout(() => {
            const placeholder = dataContent.querySelector('.data-placeholder');
            if (placeholder) {
                placeholder.innerHTML = `
                    <div class="data-visualization">
                        <h3>Price Trend Analysis</h3>
                        <div class="chart-placeholder">
                            <div class="chart-bar" style="height: 60%"></div>
                            <div class="chart-bar" style="height: 45%"></div>
                            <div class="chart-bar" style="height: 30%"></div>
                            <div class="chart-bar" style="height: 25%"></div>
                        </div>
                        <p>CFR NWE Ammonia prices showing sustained decline over past 4 months</p>
                    </div>
                `;
            }
        }, 1000);
    }

    loadConnectionsContent() {
        const connectionsContent = document.getElementById('content-connections');
        if (!connectionsContent) return;
        
        this.showLoadingState(connectionsContent);
        
        setTimeout(() => {
            const placeholder = connectionsContent.querySelector('.data-placeholder');
            if (placeholder) {
                placeholder.innerHTML = `
                    <div class="connections-map">
                        <h3>Trade Flow Network</h3>
                        <div class="network-diagram">
                            <div class="node source">Gulf Coast</div>
                            <div class="connection-line"></div>
                            <div class="node destination">Norway</div>
                        </div>
                        <p>New trade route established: US Gulf Coast → Norway via Dancing Brave</p>
                    </div>
                `;
            }
        }, 1200);
    }

    loadImpactContent() {
        const impactContent = document.getElementById('content-impact');
        if (!impactContent) return;
        
        this.showLoadingState(impactContent);
        
        setTimeout(() => {
            const placeholder = impactContent.querySelector('.data-placeholder');
            if (placeholder) {
                placeholder.innerHTML = `
                    <div class="impact-analysis">
                        <h3>Market Impact Assessment</h3>
                        <div class="impact-grid">
                            <div class="impact-item">
                                <div class="impact-label">Price Impact</div>
                                <div class="impact-value negative">-6.8%</div>
                            </div>
                            <div class="impact-item">
                                <div class="impact-label">Supply Addition</div>
                                <div class="impact-value positive">+35,000 mt</div>
                            </div>
                        </div>
                        <p>Significant disruption to traditional trade patterns expected</p>
                    </div>
                `;
            }
        }, 800);
    }

    loadGeographyContent() {
        const geoContent = document.getElementById('content-geography');
        if (!geoContent) return;
        
        this.showLoadingState(geoContent);
        
        setTimeout(() => {
            const placeholder = geoContent.querySelector('.data-placeholder');
            if (placeholder) {
                placeholder.innerHTML = `
                    <div class="geography-analysis">
                        <h3>Geographic Trade Analysis</h3>
                        <div class="region-impact">
                            <div class="region">
                                <h4>US Gulf Coast</h4>
                                <p>New export capacity coming online</p>
                            </div>
                            <div class="region">
                                <h4>Norway/Europe</h4>
                                <p>Diversifying import sources</p>
                            </div>
                        </div>
                    </div>
                `;
            }
        }, 900);
    }

    loadTimelineContent() {
        const timelineContent = document.getElementById('content-timeline');
        if (!timelineContent) return;
        
        this.showLoadingState(timelineContent);
        
        setTimeout(() => {
            const placeholder = timelineContent.querySelector('.data-placeholder');
            if (placeholder) {
                placeholder.innerHTML = `
                    <div class="timeline-analysis">
                        <h3>Event Timeline</h3>
                        <div class="timeline-item">
                            <div class="timeline-date">March 28, 2025</div>
                            <div class="timeline-event">First export cargo departure</div>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-date">March 28, 2025</div>
                            <div class="timeline-event">CFR prices drop $25/mt</div>
                        </div>
                    </div>
                `;
            }
        }, 1100);
    }

    loadPlayersContent() {
        const playersContent = document.getElementById('content-players');
        if (!playersContent) return;
        
        this.showLoadingState(playersContent);
        
        setTimeout(() => {
            const placeholder = playersContent.querySelector('.data-placeholder');
            if (placeholder) {
                placeholder.innerHTML = `
                    <div class="players-analysis">
                        <h3>Key Market Players</h3>
                        <div class="player-item">
                            <h4>Gulf Coast Ammonia Plant</h4>
                            <p>New market entrant with 750,000 mt/year capacity</p>
                        </div>
                        <div class="player-item">
                            <h4>Dancing Brave (Vessel)</h4>
                            <p>35,000 dwt chemical tanker, built 2019</p>
                        </div>
                    </div>
                `;
            }
        }, 1000);
    }

    showLoadingState(container) {
        const placeholder = container.querySelector('.data-placeholder');
        if (placeholder) {
            placeholder.innerHTML = `
                <div class="loading-spinner">
                    <div class="spinner"></div>
                    <div class="loading-text">Loading content...</div>
                </div>
            `;
        }
    }

    // Interaction Tools
    initializeInteractionTools() {
        this.setupTextSelection();
        this.setupScrollProgress();
    }

    setupTextSelection() {
        // Enable text selection and highlighting
        document.addEventListener('mouseup', (e) => {
            const selection = window.getSelection();
            if (selection.toString().length > 0 && this.isInContentArea(selection)) {
                this.showSelectionTools(selection);
            }
        });
    }

    isInContentArea(selection) {
        const range = selection.getRangeAt(0);
        const container = range.commonAncestorContainer;
        return container.closest('.center-content-container') !== null;
    }

    showSelectionTools(selection) {
        // Create floating toolbar for selected text
        const toolbar = document.createElement('div');
        toolbar.className = 'selection-toolbar';
        toolbar.innerHTML = `
            <button class="selection-btn" data-action="highlight">🖍️</button>
            <button class="selection-btn" data-action="comment">💬</button>
            <button class="selection-btn" data-action="bookmark">🔖</button>
        `;
        
        // Position toolbar near selection
        const rect = selection.getRangeAt(0).getBoundingClientRect();
        toolbar.style.cssText = `
            position: fixed;
            top: ${rect.top - 50}px;
            left: ${rect.left + (rect.width / 2) - 60}px;
            background: #1a1a1a;
            border: 1px solid #333;
            border-radius: 6px;
            padding: 8px;
            display: flex;
            gap: 8px;
            z-index: 100;
        `;
        
        document.body.appendChild(toolbar);
        
        // Handle toolbar actions
        toolbar.addEventListener('click', (e) => {
            const action = e.target.dataset.action;
            if (action) {
                this.handleSelectionAction(action, selection);
                document.body.removeChild(toolbar);
                selection.removeAllRanges();
            }
        });
        
        // Remove toolbar when clicking elsewhere
        setTimeout(() => {
            document.addEventListener('click', function removeToolbar(e) {
                if (!toolbar.contains(e.target)) {
                    if (document.body.contains(toolbar)) {
                        document.body.removeChild(toolbar);
                    }
                    document.removeEventListener('click', removeToolbar);
                }
            });
        }, 100);
    }

    handleSelectionAction(action, selection) {
        const text = selection.toString();
        const range = selection.getRangeAt(0);
        
        switch (action) {
            case 'highlight':
                this.highlightText(range, text);
                break;
            case 'comment':
                this.addComment(range, text);
                break;
            case 'bookmark':
                this.bookmarkText(range, text);
                break;
        }
    }

    highlightText(range, text) {
        const highlightId = 'highlight_' + Date.now();
        const span = document.createElement('span');
        span.className = 'text-highlight';
        span.id = highlightId;
        span.style.backgroundColor = 'rgba(0, 212, 255, 0.3)';
        
        try {
            range.surroundContents(span);
            this.highlights.set(highlightId, { text, timestamp: new Date() });
            console.log('Text highlighted:', text);
        } catch (e) {
            console.log('Could not highlight selected text');
        }
    }

    addComment(range, text) {
        const comment = prompt('Add your comment:');
        if (comment) {
            const commentId = 'comment_' + Date.now();
            const span = document.createElement('span');
            span.className = 'text-comment';
            span.id = commentId;
            span.style.cssText = 'border-bottom: 2px solid #00ff88; cursor: help;';
            span.title = comment;
            
            try {
                range.surroundContents(span);
                this.annotations.set(commentId, { text, comment, timestamp: new Date() });
                console.log('Comment added:', comment);
            } catch (e) {
                console.log('Could not add comment to selected text');
            }
        }
    }

    bookmarkText(range, text) {
        const bookmarkId = 'bookmark_' + Date.now();
        this.bookmarks.add({ id: bookmarkId, text, timestamp: new Date() });
        console.log('Text bookmarked:', text);
    }

    setupScrollProgress() {
        const contentContainer = document.querySelector('.center-content-container');
        if (!contentContainer) return;
        
        contentContainer.addEventListener('scroll', () => {
            const { scrollTop, scrollHeight, clientHeight } = contentContainer;
            const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
            
            // Notify left column of reading progress
            this.notifyOtherColumns('progressUpdate', Math.min(100, Math.max(0, progress)));
        });
    }

    // View Controls
    toggleExpandView() {
        document.body.classList.toggle('expanded-center');
        console.log('Toggled expanded view');
    }

    toggleFocusMode() {
        document.body.classList.toggle('focus-mode');
        console.log('Toggled focus mode');
    }

    // Inter-column Communication
    listenToOtherColumns() {
        // Listen to left column navigation
        document.addEventListener('leftColumnAction', (e) => {
            const { action, data } = e.detail;
            
            switch (action) {
                case 'navigate':
                    this.switchTab(data);
                    break;
            }
        });
        
        // Listen to right column recommendations
        document.addEventListener('rightColumnAction', (e) => {
            const { action, data } = e.detail;
            
            switch (action) {
                case 'loadContent':
                    this.loadReportData(data);
                    break;
            }
        });
    }

    notifyOtherColumns(action, data) {
        const event = new CustomEvent('centerColumnAction', {
            detail: { action, data }
        });
        document.dispatchEvent(event);
    }

    // Event Bindings
    bindEvents() {
        // Tab navigation
        document.addEventListener('click', (e) => {
            if (e.target.closest('.tab-nav-item')) {
                const tabBtn = e.target.closest('.tab-nav-item');
                const tabName = tabBtn.dataset.tab;
                if (tabName) {
                    this.switchTab(tabName);
                }
            }
        });

        // View controls
        document.addEventListener('click', (e) => {
            const controlActions = {
                'expand-view': () => this.toggleExpandView(),
                'focus-mode': () => this.toggleFocusMode()
            };
            
            const action = controlActions[e.target.id];
            if (action) action();
        });

        // Interaction tools
        document.addEventListener('click', (e) => {
            const toolActions = {
                'comment-tool': () => this.activateCommentTool(),
                'highlight-tool': () => this.activateHighlightTool(),
                'bookmark-tool': () => this.activateBookmarkTool(),
                'share-tool': () => this.shareCurrentTab()
            };
            
            const action = toolActions[e.target.id];
            if (action) action();
        });
    }

    // Tool Activation Methods
    activateCommentTool() {
        console.log('Comment tool activated');
        // Toggle comment mode
    }

    activateHighlightTool() {
        console.log('Highlight tool activated');
        // Toggle highlight mode
    }

    activateBookmarkTool() {
        console.log('Bookmark tool activated');
        // Show bookmarks panel
    }

    shareCurrentTab() {
        console.log('Sharing current tab:', this.currentTab);
        // Implementation would open share dialog
    }

    // Public API
    setReportData(reportData) {
        this.loadReportData(reportData);
    }

    navigateToTab(tabName) {
        this.switchTab(tabName);
    }

    getAnnotations() {
        return {
            highlights: Array.from(this.highlights.entries()),
            comments: Array.from(this.annotations.entries()),
            bookmarks: Array.from(this.bookmarks)
        };
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.centerColumnEngine = new CenterColumnEngine();
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CenterColumnEngine;
} 