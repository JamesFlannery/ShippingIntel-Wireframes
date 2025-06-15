/**
 * Story Page Controller
 * Handles story page interactions and integrates with story explorer
 * Follows same architectural patterns as platform-hub.js
 */

class StoryPageController {
    constructor() {
        this.activeTab = 'overview';
        this.storyContext = {
            title: 'Gulf Coast Ammonia Plant Export Triggers $25/mt Price Decline in Global Ammonia Markets',
            type: 'market-analysis',
            context: 'ammonia-plant-export-2025',
            facility: 'GCA Texas City Plant',
            route: 'USG → Norway (Glomfjord)',
            vessel: 'Dancing Brave (Ammonia Carrier)',
            commodity: 'ammonia',
            impact: 'high'
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.initializeStoryExplorer();
        console.log('Story page initialized:', this.storyContext.context);
    }
    
    setupEventListeners() {
        // Tab navigation
        document.addEventListener('click', (e) => {
            if (e.target.matches('.tab-btn')) {
                this.handleTabClick(e.target);
            }
            
            // Prompt buttons that switch tabs
            if (e.target.matches('.prompt-btn')) {
                const targetTab = e.target.dataset.tab;
                if (targetTab) {
                    this.switchToTab(targetTab);
                }
            }
            
            // Related story clicks
            if (e.target.closest('.related-story')) {
                this.handleRelatedStoryClick(e.target.closest('.related-story'));
            }
            
            // Recommendation clicks
            if (e.target.closest('.recommendation-item')) {
                this.handleRecommendationClick(e.target.closest('.recommendation-item'));
            }
            
            // Intelligence item clicks
            if (e.target.closest('.intelligence-item')) {
                this.handleIntelligenceClick(e.target.closest('.intelligence-item'));
            }
            
            // Alert item clicks
            if (e.target.closest('.alert-item')) {
                this.handleAlertClick(e.target.closest('.alert-item'));
            }
        });
        
        // Search functionality
        const searchInput = document.querySelector('.global-search');
        if (searchInput) {
            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    this.handleSearch(e.target.value);
                }
            });
        }
    }
    
    handleTabClick(tabBtn) {
        const tabName = tabBtn.dataset.tab;
        this.switchToTab(tabName);
    }
    
    switchToTab(tabName) {
        // Update active tab button
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const targetBtn = document.querySelector(`[data-tab="${tabName}"]`);
        if (targetBtn) {
            targetBtn.classList.add('active');
        }
        
        // Update active tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        const targetContent = document.getElementById(`${tabName}-content`);
        if (targetContent) {
            targetContent.classList.add('active');
        }
        
        this.activeTab = tabName;
        
        // Update story explorer context
        if (window.storyExplorer) {
            window.storyExplorer.setActiveTab(tabName);
        }
        
        console.log('Tab switched to:', tabName);
    }
    
    handleRelatedStoryClick(storyElement) {
        // Remove active class from all related stories
        document.querySelectorAll('.related-story').forEach(story => {
            story.classList.remove('active');
        });
        
        // Add active class to clicked story
        storyElement.classList.add('active');
        
        const storyTitle = storyElement.querySelector('.story-title').textContent;
        console.log('Related story selected:', storyTitle);
        
        // Could navigate to related story or update context
        this.updateStoryContext({ relatedStory: storyTitle });
    }
    
    handleRecommendationClick(recElement) {
        const recText = recElement.querySelector('.text').textContent;
        const score = recElement.querySelector('.score').textContent;
        
        console.log('Recommendation clicked:', recText, 'Score:', score);
        
        // Could trigger specific actions based on recommendation
        if (recText.includes('routes')) {
            this.switchToTab('geography');
        } else if (recText.includes('fleet')) {
            this.switchToTab('players');
        } else if (recText.includes('inventory')) {
            this.switchToTab('data');
        }
    }
    
    handleIntelligenceClick(intelElement) {
        const title = intelElement.querySelector('.intelligence-title').textContent;
        const connection = intelElement.querySelector('.intelligence-connection').textContent;
        
        console.log('Intelligence item clicked:', title, connection);
        
        // Could open detailed analysis or related content
        if (title.includes('Market Share')) {
            this.switchToTab('impact');
        } else if (title.includes('Oversupply')) {
            this.switchToTab('data');
        } else if (title.includes('Trade Lane')) {
            this.switchToTab('geography');
        }
    }
    
    handleAlertClick(alertElement) {
        const alertText = alertElement.querySelector('.alert-text').textContent;
        const action = alertElement.querySelector('.alert-action').textContent;
        
        console.log('Alert clicked:', alertText, action);
        
        // Could trigger monitoring setup or scheduling
        if (alertText.includes('Dancing Brave')) {
            this.switchToTab('geography');
        } else if (alertText.includes('capacity')) {
            this.switchToTab('timeline');
        }
    }
    
    handleSearch(query) {
        console.log('Search query:', query);
        
        // Could implement search functionality
        // For now, just pass to story explorer if available
        if (window.storyExplorer && query.trim()) {
            window.storyExplorer.handleCommand(query);
        }
    }
    
    initializeStoryExplorer() {
        // Wait for story explorer to be available
        const initExplorer = () => {
            if (window.storyExplorer) {
                window.storyExplorer.setStoryContext(this.storyContext);
                console.log('Story explorer initialized with context');
            } else {
                setTimeout(initExplorer, 100);
            }
        };
        
        initExplorer();
    }
    
    updateStoryContext(updates) {
        this.storyContext = { ...this.storyContext, ...updates };
        
        if (window.storyExplorer) {
            window.storyExplorer.setStoryContext(this.storyContext);
        }
    }
    
    // Public methods for external access
    getActiveTab() {
        return this.activeTab;
    }
    
    getStoryContext() {
        return this.storyContext;
    }
    
    setActiveTab(tabName) {
        this.switchToTab(tabName);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.storyPageController = new StoryPageController();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StoryPageController;
} 