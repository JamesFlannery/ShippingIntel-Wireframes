// Global Header Component
window.GlobalHeader = {
    render(options = {}) {
        const {
            currentPage = '',
            showCategories = false,
            searchPlaceholder = 'Search reports, companies, routes... (⌘K)',
            userName = 'Abe Vigoda'
        } = options;

        return `
            <nav class="top-nav">
                <div class="nav-left">
                    <a href="/" class="logo">SHIPPINGINTEL</a>
                    <div class="search-bar">
                        <input type="search" class="global-search" placeholder="${searchPlaceholder}">
                    </div>
                    ${showCategories ? this.renderCategories() : ''}
                </div>
                <div class="nav-right">
                    <button class="profile-button">
                        <div class="profile-avatar">${this.getInitials(userName)}</div>
                        <span>${userName}</span>
                    </button>
                </div>
            </nav>
        `;
    },

    renderCategories() {
        return `
            <div class="header-categories">
                <button class="category-tab active" data-category="market-events">
                    Market Events
                    <span class="new-badge">12</span>
                </button>
                <button class="category-tab" data-category="technology">
                    Technology
                    <span class="new-badge">3</span>
                </button>
                <button class="category-tab" data-category="analysis">
                    Analysis
                    <span class="new-badge">5</span>
                </button>
                <button class="category-tab" data-category="regulatory">
                    Regulatory
                    <span class="new-badge">2</span>
                </button>
            </div>
        `;
    },

    getInitials(name) {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    },

    // Initialize header functionality
    init() {
        // Global search functionality
        document.addEventListener('keydown', (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.querySelector('.global-search');
                if (searchInput) {
                    searchInput.focus();
                    searchInput.select();
                }
            }
        });

        // Search input handling
        const searchInput = document.querySelector('.global-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });

            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch(e.target.value);
                }
            });
        }

        // Category tabs (if present)
        const categoryTabs = document.querySelectorAll('.category-tab');
        categoryTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.handleCategoryChange(e.target);
            });
        });

        // Profile button
        const profileButton = document.querySelector('.profile-button');
        if (profileButton) {
            profileButton.addEventListener('click', (e) => {
                this.handleProfileClick(e);
            });
        }

        console.log('Global Header initialized');
    },

    handleSearch(query) {
        if (query.length < 2) return;
        
        // Dispatch custom event for search
        window.dispatchEvent(new CustomEvent('global-search', {
            detail: { query }
        }));
    },

    performSearch(query) {
        if (!query.trim()) return;
        
        // Navigate to search results or dispatch search event
        if (window.location.pathname.includes('/reports/')) {
            // If on reports pages, search within reports
            window.location.href = `/reports/index.html?search=${encodeURIComponent(query)}`;
        } else {
            // If on dashboard, search globally
            window.dispatchEvent(new CustomEvent('global-search-execute', {
                detail: { query }
            }));
        }
    },

    handleCategoryChange(tab) {
        // Remove active from all tabs
        document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
        
        // Add active to clicked tab
        tab.classList.add('active');
        
        // Dispatch category change event
        window.dispatchEvent(new CustomEvent('category-change', {
            detail: { category: tab.dataset.category }
        }));
    },

    handleProfileClick(e) {
        e.preventDefault();
        // For now, just show a notification
        console.log('Profile menu clicked');
        
        // Could implement dropdown menu here
        // this.toggleProfileMenu();
    },

    // Utility method to load header into page
    loadInto(selector, options = {}) {
        const container = document.querySelector(selector);
        if (container) {
            container.innerHTML = this.render(options);
            // Initialize after DOM update
            setTimeout(() => this.init(), 0);
        }
    }
};

// Auto-load header if container exists
document.addEventListener('DOMContentLoaded', () => {
    const headerContainer = document.getElementById('global-header');
    if (headerContainer) {
        // Determine page type and configuration
        const isReportsPage = window.location.pathname.includes('/reports/');
        const isDashboard = window.location.pathname === '/' || window.location.pathname.includes('index.html');
        
        const options = {
            showCategories: isDashboard,
            searchPlaceholder: isReportsPage 
                ? 'Search reports, companies, routes... (⌘K)'
                : 'Search intelligence reports...'
        };
        
        window.GlobalHeader.loadInto('#global-header', options);
    }
}); 