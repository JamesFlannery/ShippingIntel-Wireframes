// Left Column Component - Context, Awareness and Controls (Platform Hub Style)

class LeftColumnComponent {
    constructor() {
        this.currentStory = null;
        this.readingProgress = 0;
        this.chapters = [
            { id: 'overview', title: 'Overview', icon: '📊', completed: true },
            { id: 'market-data', title: 'Market Data', icon: '📈', completed: false },
            { id: 'trade-connections', title: 'Trade Connections', icon: '🔗', completed: false },
            { id: 'market-impact', title: 'Market Impact', icon: '💥', completed: false },
            { id: 'geography', title: 'Geography', icon: '🌍', completed: false },
            { id: 'timeline', title: 'Timeline', icon: '⏱️', completed: false },
            { id: 'key-players', title: 'Key Players', icon: '👥', completed: false }
        ];
        this.init();
    }

    init() {
        console.log('Left Column Component initialized');
        this.setupEventListeners();
        this.initializeProgress();
        this.setupLiveUpdates();
        this.loadMarketData();
    }

    setupEventListeners() {
        // Story actions
        const bookmarkBtn = document.getElementById('bookmark-story');
        const shareBtn = document.getElementById('share-story');
        
        if (bookmarkBtn) {
            bookmarkBtn.addEventListener('click', () => this.bookmarkStory());
        }
        
        if (shareBtn) {
            shareBtn.addEventListener('click', () => this.shareStory());
        }

        // Navigation items
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const chapter = e.currentTarget.dataset.chapter;
                this.navigateToChapter(chapter);
            });
        });

        // Reading mode controls
        const modeButtons = document.querySelectorAll('.option-btn[data-mode]');
        modeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setReadingMode(e.target.dataset.mode);
            });
        });

        // Live updates toggle
        const liveUpdatesToggle = document.getElementById('live-updates');
        if (liveUpdatesToggle) {
            liveUpdatesToggle.addEventListener('change', (e) => {
                this.toggleLiveUpdates(e.target.checked);
            });
        }

        // Tool buttons
        const toolButtons = {
            'export-report': () => this.exportReport(),
            'print-report': () => this.printReport(),
            'annotate-report': () => this.showAnnotations(),
            'create-watchlist': () => this.createWatchlist(),
            'set-alerts': () => this.setupAlerts(),
            'compare-data': () => this.compareData()
        };

        Object.entries(toolButtons).forEach(([id, handler]) => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.addEventListener('click', handler);
            }
        });

        // Refresh button
        const refreshBtn = document.getElementById('refresh-context');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refreshMarketData());
        }

        // Listen for external events
        this.setupExternalEventListeners();
    }

    setupExternalEventListeners() {
        // Listen for tab changes from center column
        document.addEventListener('tabChange', (e) => {
            this.handleTabChange(e.detail.tab);
        });

        // Listen for reading progress updates
        document.addEventListener('progressUpdate', (e) => {
            this.updateProgress(e.detail.progress);
        });

        // Listen for story changes
        document.addEventListener('storyChange', (e) => {
            this.updateStory(e.detail.story);
        });
    }

    navigateToChapter(chapterId) {
        // Update navigation state
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        const targetItem = document.querySelector(`[data-chapter="${chapterId}"]`);
        if (targetItem) {
            targetItem.classList.add('active');
        }

        // Emit navigation event
        this.emitEvent('navigationChange', { chapter: chapterId });
        
        // Update chapter completion
        this.markChapterAsVisited(chapterId);
    }

    markChapterAsVisited(chapterId) {
        const chapter = this.chapters.find(c => c.id === chapterId);
        if (chapter) {
            chapter.visited = true;
            
            // Update UI
            const navItem = document.querySelector(`[data-chapter="${chapterId}"] .nav-status`);
            if (navItem && !chapter.completed) {
                navItem.classList.add('visited');
            }
        }
    }

    setReadingMode(mode) {
        // Update button states
        document.querySelectorAll('.option-btn[data-mode]').forEach(btn => {
            btn.classList.remove('active');
        });
        
        document.querySelector(`[data-mode="${mode}"]`).classList.add('active');

        // Apply mode to body
        document.body.classList.remove('standard-mode', 'focus-mode', 'speed-mode');
        document.body.classList.add(`${mode}-mode`);

        // Emit mode change event
        this.emitEvent('readingModeChange', { mode });
    }

    toggleLiveUpdates(enabled) {
        if (enabled) {
            this.startLiveUpdates();
        } else {
            this.stopLiveUpdates();
        }
        
        this.emitEvent('liveUpdatesToggle', { enabled });
    }

    initializeProgress() {
        this.updateProgress(14); // Initial progress
    }

    updateProgress(percentage) {
        this.readingProgress = percentage;
        
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');
        const readingProgressValue = document.getElementById('reading-progress');
        
        if (progressFill) {
            progressFill.style.width = `${percentage}%`;
        }
        
        if (progressText) {
            progressText.textContent = `${percentage}% Complete`;
        }
        
        if (readingProgressValue) {
            readingProgressValue.textContent = `${percentage}%`;
        }
    }

    setupLiveUpdates() {
        this.liveUpdateInterval = setInterval(() => {
            this.simulateLiveUpdate();
        }, 30000); // Every 30 seconds
    }

    startLiveUpdates() {
        if (!this.liveUpdateInterval) {
            this.setupLiveUpdates();
        }
        
        // Update pulse indicator
        const pulseDot = document.querySelector('.pulse-dot');
        if (pulseDot) {
            pulseDot.style.animationPlayState = 'running';
        }
    }

    stopLiveUpdates() {
        if (this.liveUpdateInterval) {
            clearInterval(this.liveUpdateInterval);
            this.liveUpdateInterval = null;
        }
        
        // Stop pulse animation
        const pulseDot = document.querySelector('.pulse-dot');
        if (pulseDot) {
            pulseDot.style.animationPlayState = 'paused';
        }
    }

    simulateLiveUpdate() {
        // Simulate live market updates
        const updates = [
            'Price Alert: CFR NWE Down 15%',
            'Volume Spike: Tampa Route +8%',
            'New Cargo: Dancing Brave Loading',
            'Market Alert: Supply Disruption',
            'Price Update: Urea Markets Stable'
        ];
        
        const randomUpdate = updates[Math.floor(Math.random() * updates.length)];
        this.showLiveUpdateNotification(randomUpdate);
    }

    showLiveUpdateNotification(message) {
        // Update the live update card
        const liveUpdateCard = document.querySelector('.live-update');
        const titleElement = liveUpdateCard?.querySelector('.card-title');
        const timestampElement = liveUpdateCard?.querySelector('.card-timestamp');
        
        if (titleElement) {
            titleElement.textContent = message;
        }
        
        if (timestampElement) {
            timestampElement.textContent = 'Just now';
        }
        
        // Add visual emphasis
        if (liveUpdateCard) {
            liveUpdateCard.style.transform = 'scale(1.02)';
            setTimeout(() => {
                liveUpdateCard.style.transform = 'scale(1)';
            }, 300);
        }
    }

    loadMarketData() {
        // Simulate loading market indicators
        const indicators = [
            { label: 'CFR Price', value: '$435/mt', trend: 'down' },
            { label: 'Volume', value: '+12%', trend: 'up' },
            { label: 'Freight', value: '$45/mt', trend: 'down' },
            { label: 'Demand', value: '-8%', trend: 'down' }
        ];
        
        this.updateMarketIndicators(indicators);
    }

    updateMarketIndicators(indicators) {
        const container = document.querySelector('.market-indicators');
        if (!container) return;
        
        container.innerHTML = '';
        
        indicators.slice(0, 2).forEach(indicator => {
            const indicatorEl = document.createElement('div');
            indicatorEl.className = 'market-indicator';
            indicatorEl.innerHTML = `
                <div class="indicator-label">${indicator.label}</div>
                <div class="indicator-value ${indicator.trend}">${indicator.value}</div>
            `;
            container.appendChild(indicatorEl);
        });
    }

    refreshMarketData() {
        const refreshBtn = document.getElementById('refresh-context');
        if (refreshBtn) {
            refreshBtn.style.transform = 'rotate(180deg)';
            setTimeout(() => {
                refreshBtn.style.transform = 'rotate(0deg)';
            }, 300);
        }
        
        // Reload market data
        setTimeout(() => {
            this.loadMarketData();
        }, 500);
    }

    // Story actions
    bookmarkStory() {
        this.emitEvent('storyBookmarked', { 
            storyId: this.currentStory?.id || 'current-story' 
        });
        
        // Visual feedback
        const btn = document.getElementById('bookmark-story');
        if (btn) {
            const originalText = btn.textContent;
            btn.textContent = 'Bookmarked!';
            btn.style.background = '#00ff88';
            btn.style.color = '#000';
            
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
                btn.style.color = '';
            }, 2000);
        }
    }

    shareStory() {
        if (navigator.share) {
            navigator.share({
                title: 'Gulf Coast Ammonia Plant Export Analysis',
                text: 'Check out this maritime intelligence report',
                url: window.location.href
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            
            const btn = document.getElementById('share-story');
            if (btn) {
                const originalText = btn.textContent;
                btn.textContent = 'Copied!';
                setTimeout(() => {
                    btn.textContent = originalText;
                }, 2000);
            }
        }
    }

    // Tool actions
    exportReport() {
        this.emitEvent('exportRequested', { format: 'pdf' });
        this.showToolFeedback('export-report', 'Exporting...');
    }

    printReport() {
        window.print();
        this.showToolFeedback('print-report', 'Printing...');
    }

    showAnnotations() {
        this.emitEvent('annotationsToggled', { show: true });
        this.showToolFeedback('annotate-report', 'Notes opened');
    }

    createWatchlist() {
        this.emitEvent('watchlistCreated', { 
            items: ['Gulf Coast Routes', 'Ammonia Pricing', 'Chemical Tankers'] 
        });
        this.showToolFeedback('create-watchlist', 'Added to watchlist');
    }

    setupAlerts() {
        this.emitEvent('alertsSetup', { 
            triggers: ['price_change', 'volume_spike', 'route_disruption'] 
        });
        this.showToolFeedback('set-alerts', 'Alerts configured');
    }

    compareData() {
        this.emitEvent('comparisonRequested', { 
            baseline: 'current_story',
            compare_with: 'historical_data'
        });
        this.showToolFeedback('compare-data', 'Opening comparison');
    }

    showToolFeedback(toolId, message) {
        const tool = document.getElementById(toolId);
        if (!tool) return;
        
        const originalContent = tool.innerHTML;
        tool.innerHTML = `<div class="tool-icon">✓</div><div class="tool-text">${message}</div>`;
        tool.style.background = 'rgba(0, 255, 136, 0.1)';
        tool.style.borderColor = '#00ff88';
        tool.style.color = '#00ff88';
        
        setTimeout(() => {
            tool.innerHTML = originalContent;
            tool.style.background = '';
            tool.style.borderColor = '';
            tool.style.color = '';
        }, 2000);
    }

    // Event handling
    handleTabChange(tab) {
        // Update navigation to match center column tab
        this.navigateToChapter(tab);
    }

    updateStory(story) {
        this.currentStory = story;
        
        // Update story card
        const titleEl = document.getElementById('story-title');
        const summaryEl = document.getElementById('story-summary');
        const timestampEl = document.getElementById('story-timestamp');
        
        if (titleEl && story.title) {
            titleEl.textContent = story.title;
        }
        
        if (summaryEl && story.summary) {
            summaryEl.textContent = story.summary;
        }
        
        if (timestampEl && story.date) {
            timestampEl.textContent = story.date;
        }
    }

    emitEvent(eventName, detail) {
        const event = new CustomEvent(eventName, { detail });
        document.dispatchEvent(event);
        console.log(`Left Column Event: ${eventName}`, detail);
    }

    destroy() {
        if (this.liveUpdateInterval) {
            clearInterval(this.liveUpdateInterval);
        }
    }
}

// Initialize the component when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.left-column-container')) {
        window.leftColumnComponent = new LeftColumnComponent();
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LeftColumnComponent;
} 