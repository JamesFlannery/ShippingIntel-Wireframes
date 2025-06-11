/**
 * Maritime Intelligence Platform - Navigation Module
 * Shared navigation functionality
 */

// Global search functionality
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('.global-search');
    
    if (searchInput) {
        // Keyboard shortcut for search (⌘K or Ctrl+K)
        document.addEventListener('keydown', function(e) {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                searchInput.focus();
            }
        });
        
        // Search input handling
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                performSearch(this.value);
            }
        });
    }
});

// Simple search functionality (placeholder)
function performSearch(query) {
    console.log('Searching for:', query);
    // In a real implementation, this would trigger search logic
}

// Story navigation helper
function navigateToStory(storyId, view = 'story') {
    const url = `${view}-${storyId}.html`;
    window.location.href = url;
}

// Active navigation state management
function updateActiveNav(activeView) {
    document.querySelectorAll('.function-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.view === activeView) {
            btn.classList.add('active');
        }
    });
} 