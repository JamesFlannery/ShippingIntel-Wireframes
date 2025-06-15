// Global Footer Component
window.GlobalFooter = {
    render(options = {}) {
        const {
            showStats = true,
            showLinks = true,
            customStats = null,
            customMessage = null
        } = options;

        return `
            <footer class="platform-footer">
                ${showStats ? this.renderStats(customStats) : ''}
                ${customMessage ? `<div class="footer-message">${customMessage}</div>` : ''}
                ${showLinks ? this.renderLinks() : ''}
            </footer>
        `;
    },

    renderStats(customStats = null) {
        const stats = customStats || [
            { label: 'Market Data', value: 'Live', status: 'connected' },
            { label: 'Reports', value: '2,847', status: 'normal' },
            { label: 'Alerts', value: '12', status: 'active' },
            { label: 'Coverage', value: '247', status: 'normal' }
        ];

        return `
            <div class="footer-stats">
                ${stats.map(stat => `
                    <div class="footer-stat">
                        <span class="stat-label">${stat.label}:</span>
                        <span class="stat-value ${stat.status}">${stat.value}</span>
                    </div>
                `).join('')}
            </div>
        `;
    },

    renderLinks() {
        return `
            <div class="footer-links">
                <a href="/help" class="footer-link">Help</a>
                <a href="/docs" class="footer-link">API</a>
                <a href="/status" class="footer-link">Status</a>
                <a href="/contact" class="footer-link">Contact</a>
            </div>
        `;
    },

    // Initialize footer functionality
    init() {
        // Update timestamps
        this.updateTimestamp();
        
        // Set up periodic updates
        setInterval(() => {
            this.updateTimestamp();
            this.updateConnectionStatus();
        }, 30000); // Update every 30 seconds

        console.log('Global Footer initialized');
    },

    updateTimestamp() {
        const timestampElements = document.querySelectorAll('.footer-timestamp');
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { 
            hour12: false, 
            timeZone: 'GMT',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        timestampElements.forEach(el => {
            el.textContent = `Last Updated: ${timeString} GMT`;
        });
    },

    updateConnectionStatus() {
        const statusElements = document.querySelectorAll('.stat-value.connected');
        const isConnected = navigator.onLine;
        
        statusElements.forEach(el => {
            if (isConnected) {
                el.textContent = 'Live';
                el.className = 'stat-value connected';
            } else {
                el.textContent = 'Offline';
                el.className = 'stat-value disconnected';
            }
        });
    },

    // Preset configurations for different page types
    presets: {
        dashboard: {
            showStats: true,
            showLinks: true,
            customStats: [
                { label: 'Market Data', value: 'Live', status: 'connected' },
                { label: 'Active Reports', value: '847', status: 'normal' },
                { label: 'New Alerts', value: '23', status: 'active' },
                { label: 'Global Coverage', value: '247 ports', status: 'normal' }
            ]
        },
        
        reports: {
            showStats: true,
            showLinks: true,
            customStats: [
                { label: 'Data Connection', value: 'Live', status: 'connected' },
                { label: 'Report Library', value: '2,847', status: 'normal' },
                { label: 'Analysis Queue', value: '156', status: 'normal' }
            ]
        },
        
        minimal: {
            showStats: false,
            showLinks: true,
            customMessage: '<span class="footer-timestamp">Last Updated: --:-- GMT</span>'
        }
    },

    // Utility method to load footer into page
    loadInto(selector, preset = 'dashboard', customOptions = {}) {
        const container = document.querySelector(selector);
        if (container) {
            const options = { ...this.presets[preset], ...customOptions };
            container.innerHTML = this.render(options);
            // Initialize after DOM update
            setTimeout(() => this.init(), 0);
        }
    }
};

// Auto-load footer if container exists
document.addEventListener('DOMContentLoaded', () => {
    const footerContainer = document.getElementById('global-footer');
    if (footerContainer) {
        // Determine page type and preset
        let preset = 'dashboard';
        
        if (window.location.pathname.includes('/reports/')) {
            preset = 'reports';
        } else if (window.location.pathname.includes('/auth/') || 
                   window.location.pathname.includes('/pages/views/')) {
            preset = 'minimal';
        }
        
        window.GlobalFooter.loadInto('#global-footer', preset);
    }
}); 