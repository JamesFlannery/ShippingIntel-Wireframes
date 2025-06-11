/**
 * Maritime Intelligence Platform - Authentication Module
 * Shared authentication logic for all pages
 */

// Authentication check function
function checkAuth() {
    const isAuthenticated = sessionStorage.getItem('maritime-auth');
    const authTimestamp = sessionStorage.getItem('auth-timestamp');
    const currentTime = Date.now();
    const sessionDuration = 24 * 60 * 60 * 1000; // 24 hours
    
    if (!isAuthenticated || !authTimestamp || (currentTime - parseInt(authTimestamp)) > sessionDuration) {
        window.location.href = 'auth-map.html';
        return false;
    }
    return true;
}

// Set authentication
function setAuth(authVariant = 'default') {
    sessionStorage.setItem('maritime-auth', 'true');
    sessionStorage.setItem('auth-timestamp', Date.now().toString());
    sessionStorage.setItem('auth-variant', authVariant);
}

// Clear authentication
function clearAuth() {
    sessionStorage.removeItem('maritime-auth');
    sessionStorage.removeItem('auth-timestamp');
    sessionStorage.removeItem('auth-variant');
}

// Get auth variant for A/B testing
function getAuthVariant() {
    return sessionStorage.getItem('auth-variant') || 'default';
}

// Initialize authentication check when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    // Only check auth if we're not on an auth page
    if (!window.location.pathname.includes('auth')) {
        checkAuth();
    }
}); 