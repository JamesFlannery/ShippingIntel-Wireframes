// Maritime Intelligence Reports - Shared JavaScript

// Global state management
window.ReportsApp = {
    currentView: 'overview',
    searchIndex: [],
    isSearchVisible: false,
    
    // Initialize the application
    init() {
        this.initializeSearch();
        this.initializeNavigation();
        this.initializeChapterLinks();
        this.initializeReadingProgress();
        this.initializeKeyboardShortcuts();
        this.initializeStatusUpdates();
        
        console.log('Maritime Intelligence Reports initialized');
    },
    
    // Search functionality
    initializeSearch() {
        const searchInput = document.querySelector('.global-search');
        const searchResults = document.getElementById('search-results');
        
        if (searchInput) {
            // Build search index from page content
            this.buildSearchIndex();
            
            // Handle search input
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
            
            // Handle search shortcuts
            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    e.target.blur();
                    this.hideSearchResults();
                }
                if (e.key === 'Enter') {
                    this.selectFirstSearchResult();
                }
            });
        }
    },
    
    buildSearchIndex() {
        // Build search index from page content
        const contentElements = document.querySelectorAll('h1, h2, h3, p, .context-item');
        
        contentElements.forEach((element, index) => {
            const text = element.textContent.trim();
            if (text.length > 10) {
                this.searchIndex.push({
                    id: index,
                    text: text,
                    element: element,
                    type: element.tagName.toLowerCase()
                });
            }
        });
    },
    
    handleSearch(query) {
        if (query.length < 2) {
            this.hideSearchResults();
            return;
        }
        
        const results = this.searchIndex.filter(item => 
            item.text.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5);
        
        this.showSearchResults(results, query);
    },
    
    showSearchResults(results, query) {
        let searchResults = document.getElementById('search-results');
        
        if (!searchResults) {
            searchResults = document.createElement('div');
            searchResults.id = 'search-results';
            searchResults.className = 'search-results';
            document.querySelector('.search-bar').appendChild(searchResults);
        }
        
        if (results.length === 0) {
            searchResults.innerHTML = '<div class="search-result">No results found</div>';
        } else {
            searchResults.innerHTML = results.map(result => `
                <div class="search-result" data-element-id="${result.id}">
                    <div class="search-result-type">${result.type}</div>
                    <div class="search-result-text">${this.highlightQuery(result.text, query)}</div>
                </div>
            `).join('');
            
            // Add click handlers
            searchResults.querySelectorAll('.search-result').forEach(resultEl => {
                resultEl.addEventListener('click', () => {
                    const elementId = resultEl.dataset.elementId;
                    const targetElement = this.searchIndex[elementId].element;
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    this.hideSearchResults();
                    document.querySelector('.global-search').blur();
                });
            });
        }
        
        searchResults.style.display = 'block';
        this.isSearchVisible = true;
    },
    
    hideSearchResults() {
        const searchResults = document.getElementById('search-results');
        if (searchResults) {
            searchResults.style.display = 'none';
        }
        this.isSearchVisible = false;
    },
    
    highlightQuery(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    },
    
    selectFirstSearchResult() {
        const firstResult = document.querySelector('.search-result');
        if (firstResult) {
            firstResult.click();
        }
    },
    
    // Navigation management
    initializeNavigation() {
        // Handle tab navigation
        const tabNavItems = document.querySelectorAll('.tab-nav-item');
        
        tabNavItems.forEach(item => {
            if (!item.classList.contains('disabled')) {
                item.addEventListener('click', (e) => {
                    if (item.tagName === 'SPAN') {
                        e.preventDefault();
                        return;
                    }
                    
                    // Update active state
                    tabNavItems.forEach(tab => tab.classList.remove('active'));
                    item.classList.add('active');
                    
                    // Update current view
                    this.currentView = item.textContent.toLowerCase();
                    this.updateReadingProgress();
                });
            }
        });
        
        // Handle back navigation
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.view) {
                this.switchToView(e.state.view);
            }
        });
    },
    
    switchToView(viewName) {
        // Update tab navigation
        document.querySelectorAll('.tab-nav-item').forEach(tab => {
            tab.classList.remove('active');
            if (tab.textContent.toLowerCase() === viewName) {
                tab.classList.add('active');
            }
        });
        
        // Update content sections
        document.querySelectorAll('.content-section').forEach(section => {
            if (section.id === `${viewName}-content`) {
                section.style.display = 'block';
            } else {
                section.style.display = 'none';
            }
        });
        
        this.currentView = viewName;
        this.updateReadingProgress();
    },
    
    // Chapter navigation
    initializeChapterLinks() {
        const chapterLinks = document.querySelectorAll('.chapter-link');
        
        chapterLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Update active chapter
                chapterLinks.forEach(ch => ch.classList.remove('active'));
                link.classList.add('active');
                
                // Scroll to content if on same page
                if (link.getAttribute('href').startsWith('#')) {
                    e.preventDefault();
                    const targetId = link.getAttribute('href').substring(1);
                    const targetElement = document.getElementById(targetId);
                    if (targetElement) {
                        targetElement.scrollIntoView({ behavior: 'smooth' });
                    }
                }
                
                this.updateReadingProgress();
            });
        });
    },
    
    // Reading progress tracking
    initializeReadingProgress() {
        this.updateReadingProgress();
        
        // Track scroll progress
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.addEventListener('scroll', () => {
                this.updateScrollProgress();
            });
        }
    },
    
    updateReadingProgress() {
        const progressFill = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');
        
        if (!progressFill || !progressText) return;
        
        // Calculate progress based on current view and scroll position
        const views = ['overview', 'data', 'connections', 'impact', 'geography', 'timeline', 'players'];
        const currentIndex = views.indexOf(this.currentView);
        const baseProgress = (currentIndex / views.length) * 100;
        
        // Add scroll progress within current view
        const scrollProgress = this.getScrollProgress();
        const viewProgress = (scrollProgress / views.length);
        const totalProgress = Math.min(baseProgress + viewProgress, 100);
        
        progressFill.style.width = `${totalProgress}%`;
        progressText.textContent = `${Math.round(totalProgress)}% Complete`;
    },
    
    updateScrollProgress() {
        const mainContent = document.querySelector('.main-content');
        if (!mainContent) return;
        
        const scrollTop = mainContent.scrollTop;
        const scrollHeight = mainContent.scrollHeight - mainContent.clientHeight;
        const scrollPercent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        
        // Update reading progress
        this.updateReadingProgress();
    },
    
    getScrollProgress() {
        const mainContent = document.querySelector('.main-content');
        if (!mainContent) return 0;
        
        const scrollTop = mainContent.scrollTop;
        const scrollHeight = mainContent.scrollHeight - mainContent.clientHeight;
        return scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    },
    
    // Keyboard shortcuts
    initializeKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Cmd/Ctrl + K for search
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.querySelector('.global-search');
                if (searchInput) {
                    searchInput.focus();
                    searchInput.select();
                }
            }
            
            // Escape to close search
            if (e.key === 'Escape' && this.isSearchVisible) {
                this.hideSearchResults();
                document.querySelector('.global-search').blur();
            }
            
            // Arrow keys for navigation
            if (e.key === 'ArrowLeft' && e.altKey) {
                this.navigateToPreviousView();
            }
            if (e.key === 'ArrowRight' && e.altKey) {
                this.navigateToNextView();
            }
        });
    },
    
    navigateToPreviousView() {
        const views = ['overview', 'data', 'connections', 'impact', 'geography', 'timeline', 'players'];
        const currentIndex = views.indexOf(this.currentView);
        if (currentIndex > 0) {
            const previousView = views[currentIndex - 1];
            const tabLink = document.querySelector(`.tab-nav-item[data-view="${previousView}"]`);
            if (tabLink) {
                tabLink.click();
            }
        }
    },
    
    navigateToNextView() {
        const views = ['overview', 'data', 'connections', 'impact', 'geography', 'timeline', 'players'];
        const currentIndex = views.indexOf(this.currentView);
        if (currentIndex < views.length - 1) {
            const nextView = views[currentIndex + 1];
            const tabLink = document.querySelector(`.tab-nav-item[data-view="${nextView}"]`);
            if (tabLink) {
                tabLink.click();
            }
        }
    },
    
    // Status updates
    initializeStatusUpdates() {
        this.updateConnectionStatus();
        this.updateLastUpdatedTime();
        
        // Update connection status every 30 seconds
        setInterval(() => {
            this.updateConnectionStatus();
        }, 30000);
        
        // Update timestamp every minute
        setInterval(() => {
            this.updateLastUpdatedTime();
        }, 60000);
    },
    
    updateConnectionStatus() {
        const connectionStatus = document.querySelector('.connection-status');
        if (connectionStatus) {
            // Simulate connection check
            const isConnected = navigator.onLine;
            connectionStatus.style.color = isConnected ? '#22c55e' : '#ef4444';
            
            const statusText = connectionStatus.parentElement.querySelector('span');
            if (statusText) {
                statusText.textContent = isConnected ? 'Connected to Live Market Data' : 'Connection Lost';
            }
        }
    },
    
    updateLastUpdatedTime() {
        const statusRight = document.querySelector('.status-right span');
        if (statusRight) {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', { 
                hour12: false, 
                timeZone: 'GMT',
                hour: '2-digit',
                minute: '2-digit'
            });
            statusRight.textContent = `Last Updated: ${timeString} GMT`;
        }
    },
    
    // Utility functions
    scrollToTop() {
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.scrollTo({ top: 0, behavior: 'smooth' });
        }
    },
    
    exportData() {
        // Simulate data export
        console.log('Exporting report data...');
        // In a real application, this would trigger a download
    },
    
    shareReport() {
        // Simulate sharing functionality
        if (navigator.share) {
            navigator.share({
                title: document.title,
                url: window.location.href
            });
        } else {
            // Fallback: copy URL to clipboard
            navigator.clipboard.writeText(window.location.href).then(() => {
                console.log('Report URL copied to clipboard');
            });
        }
    }
};

// Additional CSS for search results (injected dynamically)
const searchStyles = `
    .search-results {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        max-height: 300px;
        overflow-y: auto;
        z-index: 1000;
        display: none;
    }
    
    .search-result {
        padding: 12px 16px;
        border-bottom: 1px solid #f1f5f9;
        cursor: pointer;
        transition: background-color 0.2s ease;
    }
    
    .search-result:last-child {
        border-bottom: none;
    }
    
    .search-result:hover {
        background: #f8fafc;
    }
    
    .search-result-type {
        font-size: 11px;
        color: #3b82f6;
        text-transform: uppercase;
        font-weight: 600;
        margin-bottom: 4px;
    }
    
    .search-result-text {
        font-size: 13px;
        color: #1e293b;
        line-height: 1.4;
    }
    
    .search-result-text mark {
        background: #fef3c7;
        color: #92400e;
        padding: 1px 2px;
        border-radius: 2px;
    }
`;

// Inject search styles
const styleSheet = document.createElement('style');
styleSheet.textContent = searchStyles;
document.head.appendChild(styleSheet);

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.ReportsApp.init();
    });
} else {
    window.ReportsApp.init();
}

// Export for use in other scripts
window.ReportsApp = window.ReportsApp; 