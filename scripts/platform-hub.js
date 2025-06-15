// Platform Hub JavaScript
class PlatformHub {
    constructor() {
        this.isAuthenticated = this.checkAuthStatus();
        this.initializeEventListeners();
        // Layouts with auth card (restricted space)
        this.restrictedLayouts = {
            'market-events': [
                { id: 'featured-ammonia', position: 'position-0-0', size: 'size-2x3' },
                { id: 'market-pulse', position: 'position-0-6', size: 'size-1x1' },
                { id: 'breaking-news', position: 'position-2-6', size: 'size-1x1' },
                { id: 'trade-volume', position: 'position-4-0', size: 'size-2x2' },
                { id: 'port-congestion', position: 'position-4-4', size: 'size-2x2' },
                { id: 'panama-canal-rates', position: 'position-6-0', size: 'size-2x2' },
                { id: 'lng-carrier-shortage', position: 'position-6-3', size: 'size-2x2' },
                { id: 'red-sea-disruption', position: 'position-6-6', size: 'size-2x2' }
            ],
            'technology': [
                { id: 'autonomous-vessel', position: 'position-0-0', size: 'size-2x3' },
                { id: 'blockchain-cargo', position: 'position-0-6', size: 'size-1x1' },
                { id: 'green-fuel-tech', position: 'position-2-6', size: 'size-1x1' },
                { id: 'port-automation', position: 'position-4-0', size: 'size-2x2' },
                { id: 'iot-sensors', position: 'position-4-4', size: 'size-2x2' }
            ],
            'analysis': [
                { id: 'container-rates', position: 'position-0-0', size: 'size-2x3' },
                { id: 'supply-chain-risk', position: 'position-0-6', size: 'size-1x1' },
                { id: 'fuel-price-forecast', position: 'position-2-6', size: 'size-1x1' },
                { id: 'trade-flow-analysis', position: 'position-4-0', size: 'size-2x2' },
                { id: 'demand-forecast', position: 'position-4-4', size: 'size-2x2' }
            ],
            'regulatory': [
                { id: 'imo-standards', position: 'position-0-0', size: 'size-2x3' },
                { id: 'eu-carbon-tax', position: 'position-0-6', size: 'size-1x1' },
                { id: 'ballast-water-compliance', position: 'position-2-6', size: 'size-1x1' },
                { id: 'us-customs-update', position: 'position-4-0', size: 'size-2x2' },
                { id: 'flag-state-inspection', position: 'position-4-4', size: 'size-2x2' },
                { id: 'cyber-security-mandate', position: 'position-6-0', size: 'size-2x2' }
            ]
        };

        // Full width layouts (authenticated)
        this.fullLayouts = {
            'market-events': [
                { id: 'featured-ammonia', position: 'position-full-0-0', size: 'size-2x3' },
                { id: 'market-pulse', position: 'position-full-0-9', size: 'size-1x1' },
                { id: 'breaking-news', position: 'position-full-2-9', size: 'size-1x1' },
                { id: 'trade-volume', position: 'position-full-4-0', size: 'size-2x2' },
                { id: 'port-congestion', position: 'position-full-4-6', size: 'size-2x2' },
                { id: 'panama-canal-rates', position: 'position-full-6-0', size: 'size-2x2' },
                { id: 'lng-carrier-shortage', position: 'position-full-6-4', size: 'size-2x2' },
                { id: 'red-sea-disruption', position: 'position-full-6-8', size: 'size-2x2' }
            ],
            'technology': [
                { id: 'autonomous-vessel', position: 'position-full-0-0', size: 'size-2x3' },
                { id: 'blockchain-cargo', position: 'position-full-0-9', size: 'size-1x1' },
                { id: 'green-fuel-tech', position: 'position-full-2-9', size: 'size-1x1' },
                { id: 'port-automation', position: 'position-full-4-0', size: 'size-2x2' },
                { id: 'iot-sensors', position: 'position-full-4-6', size: 'size-2x2' }
            ],
            'analysis': [
                { id: 'container-rates', position: 'position-full-0-0', size: 'size-2x3' },
                { id: 'supply-chain-risk', position: 'position-full-0-9', size: 'size-1x1' },
                { id: 'fuel-price-forecast', position: 'position-full-2-9', size: 'size-1x1' },
                { id: 'trade-flow-analysis', position: 'position-full-4-0', size: 'size-2x2' },
                { id: 'demand-forecast', position: 'position-full-4-6', size: 'size-2x2' }
            ],
            'regulatory': [
                { id: 'imo-standards', position: 'position-full-0-0', size: 'size-2x3' },
                { id: 'eu-carbon-tax', position: 'position-full-0-9', size: 'size-1x1' },
                { id: 'ballast-water-compliance', position: 'position-full-2-9', size: 'size-1x1' },
                { id: 'us-customs-update', position: 'position-full-4-0', size: 'size-2x2' },
                { id: 'flag-state-inspection', position: 'position-full-4-6', size: 'size-2x2' },
                { id: 'cyber-security-mandate', position: 'position-full-6-0', size: 'size-2x2' }
            ]
        };
    }

    initializeEventListeners() {
        // Category tab filtering
        const categoryTabs = document.querySelectorAll('.category-tab');
        categoryTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.handleCategoryChange(e.currentTarget);
            });
        });

        // Filter tab clicks
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.handleFilterClick(e.currentTarget);
            });
        });

        // Report action buttons
        document.querySelectorAll('[data-action]').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleReportAction(e.currentTarget);
            });
        });

        // Card action buttons
        document.querySelectorAll('.card-action-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleCardAction(e.currentTarget);
            });
        });

        // Report item clicks
        document.querySelectorAll('.report-item').forEach(item => {
            item.addEventListener('click', (e) => {
                this.handleReportItemClick(e.currentTarget);
            });
        });

        // Search functionality
        const searchInput = document.querySelector('.global-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }

        // Initialize with default category
        setTimeout(() => {
            // Ensure auth card is properly positioned first
            this.initializeAuthCard();
            
            const activeTab = document.querySelector('.category-tab.active');
            if (activeTab) {
                this.applyLayout(activeTab.dataset.category);
            } else {
                this.applyLayout('market-events');
            }
            
            // Apply restricted state to cards if not authenticated
            this.updateCardAccess();
        }, 100);
    }

    checkAuthStatus() {
        // Check localStorage for authentication
        const authData = localStorage.getItem('shippingIntel_auth');
        if (authData) {
            try {
                const parsed = JSON.parse(authData);
                // Check if auth is still valid (24 hours)
                const authTime = new Date(parsed.timestamp);
                const now = new Date();
                const hoursDiff = (now - authTime) / (1000 * 60 * 60);
                
                if (hoursDiff < 24) {
                    return true;
                }
            } catch (e) {
                // Invalid auth data
            }
        }
        return false;
    }

    createAuthCard() {
        const dashboardCards = document.querySelector('.dashboard-cards');
        if (!dashboardCards) return;

        const authCard = document.createElement('div');
        authCard.id = 'auth-card-dashboard';
        authCard.className = 'intel-card auth-dashboard-card visible';
        
        authCard.innerHTML = `
            <div class="auth-header">
                <h2 class="auth-title">Access ShippingIntel</h2>
                <p class="auth-subtitle">Sign in to access premium maritime intelligence, market analysis, and real-time trade data.</p>
            </div>

            <form class="auth-form" onsubmit="handleAuth(event)">
                <div class="form-group">
                    <label class="form-label">Email Address</label>
                    <input type="email" class="form-input" placeholder="your.email@company.com" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Company</label>
                    <input type="text" class="form-input" placeholder="Your Company Name">
                </div>

                <div class="auth-actions">
                    <button type="submit" class="auth-btn primary">Sign In / Sign Up</button>
                </div>
            </form>

            <div class="auth-features">
                <div class="features-title">What You'll Get</div>
                <div class="feature-list">
                    <div class="feature-item">
                        <div class="feature-icon">✓</div>
                        <span>Real-time market intelligence</span>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon">✓</div>
                        <span>Detailed commodity analysis</span>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon">✓</div>
                        <span>Trade route disruption alerts</span>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon">✓</div>
                        <span>Regulatory compliance updates</span>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon">✓</div>
                        <span>Price forecasting models</span>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon">✓</div>
                        <span>Supply chain risk assessment</span>
                    </div>
                </div>
            </div>

            <div class="auth-footer">
                <p class="auth-footer-text">Join 2,400+ maritime professionals already using ShippingIntel</p>
            </div>
        `;

        dashboardCards.appendChild(authCard);
        console.log('Auth card created and added to dashboard');
        return authCard;
    }

    initializeAuthCard() {
        if (!this.isAuthenticated) {
            // Create the auth card if it doesn't exist
            let authCard = document.getElementById('auth-card-dashboard');
            if (!authCard) {
                authCard = this.createAuthCard();
            }
            console.log('Auth card initialized for unauthenticated user');
        }
    }

    updateCardAccess() {
        const cards = document.querySelectorAll('.intel-card');
        cards.forEach(card => {
            if (!this.isAuthenticated) {
                // Add restricted state to certain cards
                if (card.classList.contains('featured') || 
                    card.classList.contains('analytics-widget') ||
                    Math.random() > 0.5) { // Randomly restrict some cards for demo
                    
                    card.classList.add('restricted');
                    
                    // Add restricted overlay
                    if (!card.querySelector('.restricted-overlay')) {
                        const overlay = document.createElement('div');
                        overlay.className = 'restricted-overlay';
                        overlay.textContent = 'Premium Access';
                        card.appendChild(overlay);
                    }
                }
            } else {
                // Remove restricted state
                card.classList.remove('restricted');
                const overlay = card.querySelector('.restricted-overlay');
                if (overlay) {
                    overlay.remove();
                }
            }
        });
    }

    handleCategoryChange(selectedTab) {
        // Update active tab
        document.querySelectorAll('.category-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        selectedTab.classList.add('active');

        const selectedCategory = selectedTab.dataset.category;
        this.transitionLayout(selectedCategory);
    }

    transitionLayout(category) {
        const cards = document.querySelectorAll('.intel-card[data-category]');
        
        // First fade out all category cards (auth card is not affected)
        cards.forEach(card => {
            card.classList.remove('visible');
            card.classList.add('fade-exit');
        });

        // Wait for fade out, then apply new layout
        setTimeout(() => {
            this.applyLayout(category);
        }, 300);
    }

    applyLayout(category) {
        // Choose layout based on authentication status
        const layouts = this.isAuthenticated ? this.fullLayouts : this.restrictedLayouts;
        const layout = layouts[category];
        
        if (!layout) {
            console.error('No layout found for category:', category);
            return;
        }

        // Only select cards that have data-category (exclude auth card completely)
        const cards = document.querySelectorAll('.intel-card[data-category]');

        // Reset all category cards
        cards.forEach(card => {
            card.classList.remove('fade-exit', 'fade-enter', 'visible');
            // Remove all position and size classes
            card.className = card.className.replace(/position-[\w-]+|size-\d+x\d+/g, '');
            card.style.display = 'none';
        });

        // Apply new layout - restricted layouts avoid columns 10-12 when auth card is present
        layout.forEach((item, index) => {
            const card = document.getElementById(item.id);
            if (card) {
                card.style.display = 'block';
                card.classList.add(item.position, item.size);
                
                // Stagger the entrance animations
                setTimeout(() => {
                    card.classList.add('visible', 'fade-enter');
                }, index * 100);
            }
        });
    }

    handleFilterClick(filterTab) {
        // Update active filter
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        filterTab.classList.add('active');

        // Apply filter
        const filter = filterTab.dataset.filter;
        this.filterReportsByType(filter);

        // Track analytics
        this.trackEvent('filter_applied', { filter });
    }

    filterReportsByType(filter) {
        const reportCards = document.querySelectorAll('.report-card');
        
        reportCards.forEach(card => {
            let show = false;
            
            switch (filter) {
                case 'all':
                    show = true;
                    break;
                case 'high-impact':
                    show = card.dataset.impact === 'high';
                    break;
                case 'breaking':
                    show = card.querySelector('.category-tag.market-events') !== null;
                    break;
                case 'analysis':
                    show = card.querySelector('.category-tag.technology, .category-tag.market-analysis') !== null;
                    break;
            }
            
            if (show) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.3s ease-in';
            } else {
                card.style.display = 'none';
            }
        });
    }

    handleReportAction(button) {
        const action = button.dataset.action;
        const reportCard = button.closest('.report-card');
        const reportTitle = reportCard.querySelector('.report-title a').textContent;

        switch (action) {
            case 'bookmark':
                this.toggleBookmark(button, reportTitle);
                break;
            case 'alert':
                this.setupAlert(button, reportTitle);
                break;
        }

        // Track analytics
        this.trackEvent('report_action', { action, report: reportTitle });
    }

    handleCardAction(button) {
        const card = button.closest('.intel-card');
        const cardTitle = card.querySelector('.card-title').textContent;
        const buttonText = button.textContent.trim();

        // Check if authentication is required
        if (!this.isAuthenticated) {
            this.showNotification('Please sign in to access premium features');
            return;
        }

        // Handle specific card actions
        if (card.id === 'featured-ammonia' && buttonText === 'Access Full Report') {
            // Navigate to the ammonia plant story page
            window.location.href = 'reports/ammonia-plant-export-2025/';
            return;
        }

        // Handle other card actions
        switch (buttonText) {
            case 'View Technical Details':
            case 'View Full Analysis':
            case 'Read Full Report':
                this.showNotification(`Opening detailed report: ${cardTitle}`);
                break;
            case 'View Related Analysis':
                this.showNotification(`Loading related analysis for: ${cardTitle}`);
                break;
            case 'Compare Solutions':
            case 'Download Data':
            case 'Impact Calculator':
                this.showNotification(`${buttonText} for: ${cardTitle}`);
                break;
            default:
                this.showNotification(`Action: ${buttonText}`);
        }

        // Track analytics
        this.trackEvent('card_action', { action: buttonText, card: cardTitle });
    }

    handleReportItemClick(item) {
        const reportTitle = item.querySelector('.item-title').textContent;
        
        // Map report titles to their IDs for routing
        const reportMapping = {
            'Gulf Coast Ammonia Plant Export': 'ammonia-plant-export-2025',
            // Add more mappings as needed for other reports
        };

        const reportId = reportMapping[reportTitle];
        
        if (reportId) {
            // Navigate through auth with report parameter
            window.location.href = `pages/auth/map.html?report=${reportId}`;
        } else {
            // For unmapped reports, show coming soon message
            this.showNotification(`Report "${reportTitle}" access coming soon`);
        }

        // Track analytics
        this.trackEvent('report_item_clicked', { report: reportTitle, reportId });
    }

    toggleBookmark(button, reportTitle) {
        const isBookmarked = button.classList.contains('bookmarked');
        
        if (isBookmarked) {
            button.classList.remove('bookmarked');
            button.textContent = 'Bookmark';
            this.showNotification(`Removed bookmark for "${reportTitle}"`);
        } else {
            button.classList.add('bookmarked');
            button.textContent = 'Bookmarked';
            this.showNotification(`Bookmarked "${reportTitle}"`);
        }
    }

    setupAlert(button, reportTitle) {
        const isAlertSet = button.classList.contains('alert-set');
        
        if (isAlertSet) {
            button.classList.remove('alert-set');
            button.textContent = 'Set Alert';
            this.showNotification(`Removed alert for "${reportTitle}"`);
        } else {
            button.classList.add('alert-set');
            button.textContent = 'Alert Set';
            this.showNotification(`Alert set for updates to "${reportTitle}"`);
        }
    }

    handleSearch(query) {
        if (query.length < 3) {
            this.clearSearch();
            return;
        }

        const reportCards = document.querySelectorAll('.report-card');
        let visibleCount = 0;

        reportCards.forEach(card => {
            const title = card.querySelector('.report-title a').textContent.toLowerCase();
            const summary = card.querySelector('.report-summary').textContent.toLowerCase();
            const searchTerms = query.toLowerCase();

            if (title.includes(searchTerms) || summary.includes(searchTerms)) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.3s ease-in';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        // Show search results count
        this.showSearchResults(visibleCount, query);

        // Track analytics
        this.trackEvent('search_performed', { query, results: visibleCount });
    }

    clearSearch() {
        const reportCards = document.querySelectorAll('.report-card');
        reportCards.forEach(card => {
            card.style.display = 'block';
        });
        this.hideSearchResults();
    }

    showSearchResults(count, query) {
        let resultsElement = document.querySelector('.search-results');
        if (!resultsElement) {
            resultsElement = document.createElement('div');
            resultsElement.className = 'search-results';
            document.querySelector('.featured-reports .section-header').appendChild(resultsElement);
        }
        
        resultsElement.innerHTML = `
            <span class="results-text">
                ${count} report${count !== 1 ? 's' : ''} found for "${query}"
                <button class="clear-search" onclick="platformHub.clearSearch()">Clear</button>
            </span>
        `;
    }

    hideSearchResults() {
        const resultsElement = document.querySelector('.search-results');
        if (resultsElement) {
            resultsElement.remove();
        }
    }

    hideAuthCard() {
        const authCard = document.getElementById('auth-card-dashboard');
        if (authCard) {
            authCard.style.display = 'none';
            authCard.classList.remove('visible');
        }
        
        // Add authenticated class to dashboard-cards for full width layout
        const dashboardCards = document.querySelector('.dashboard-cards');
        if (dashboardCards) {
            dashboardCards.classList.add('authenticated');
        }
        
        // Reapply current layout to fill the space
        const activeTab = document.querySelector('.category-tab.active');
        if (activeTab) {
            this.applyLayout(activeTab.dataset.category);
        }
    }

    enableNavigation() {
        // Remove any navigation restrictions
        const actionButtons = document.querySelectorAll('[data-action]');
        actionButtons.forEach(button => {
            button.style.pointerEvents = 'auto';
            button.style.opacity = '1';
        });

        // Remove restricted overlays from cards
        this.updateCardAccess();
    }

    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '80px',
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

        // Add to document
        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }



    trackEvent(eventType, data) {
        // Analytics tracking
        console.log('Platform Event:', eventType, data);
        
        // In a real implementation, this would send data to your analytics service
        // Example: analytics.track(eventType, data);
    }

    // Helper function to stagger animations
    staggerAnimations(elements, className, delay = 100) {
        elements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add(className);
            }, index * delay);
        });
    }

    // Helper function to get card dimensions based on size class
    getCardDimensions(sizeClass) {
        const sizes = {
            'size-1x1': { rows: 1, cols: 1 },
            'size-1x2': { rows: 1, cols: 2 },
            'size-2x2': { rows: 2, cols: 2 },
            'size-2x3': { rows: 2, cols: 3 },
            'size-3x3': { rows: 3, cols: 3 }
        };
        return sizes[sizeClass] || { rows: 1, cols: 1 };
    }
}

// Add CSS animations
const platformStyle = document.createElement('style');
platformStyle.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .search-results {
        margin-left: 20px;
        font-size: 12px;
        color: #888;
    }
    
    .clear-search {
        background: none;
        border: none;
        color: #00d4ff;
        cursor: pointer;
        margin-left: 8px;
        text-decoration: underline;
    }
    
    .btn.bookmarked {
        background: #00ff88 !important;
        color: #0a0a0a !important;
    }
    
    .btn.alert-set {
        background: #ffa500 !important;
        color: #0a0a0a !important;
    }
`;
document.head.appendChild(platformStyle);

// Global function for auth form submission
function handleAuth(event) {
    event.preventDefault();
    
    // Get the platform hub instance
    const platformHub = window.platformHub;
    if (platformHub) {
        platformHub.isAuthenticated = true;
        
        // Remove auth card completely
        const authCard = document.getElementById('auth-card-dashboard');
        if (authCard) {
            authCard.remove();
        }
        
        // Re-render dashboard with full access
        platformHub.renderDashboard();
        
        console.log('User authenticated successfully');
    }
    
    return false;
}

// Initialize platform hub when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.platformHub = new PlatformHub();
}); 