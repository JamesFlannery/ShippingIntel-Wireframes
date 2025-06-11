/**
 * Maritime Story Renderer
 * Converts YAML story data into HTML with semantic CSS classes
 * Enables: Content analytics, UX pattern configuration, Visual consistency
 */

class StoryRenderer {
    constructor(storyData) {
        this.data = storyData;
    }

    // Render semantic CSS classes from tags
    renderSemanticClasses(semanticTags) {
        if (!semanticTags || !Array.isArray(semanticTags)) return '';
        return semanticTags.map(tag => `semantic-${tag}`).join(' ');
    }

    // Track content interaction for analytics
    trackContentInteraction(element, concept, action = 'viewed') {
        element.addEventListener('click', () => {
            // Analytics tracking
            console.log(`Content Analytics: ${concept} - ${action}`);
            // Real implementation would send to analytics service
        });
    }

    // Render Left Zone Components
    renderLeftZone() {
        const leftZone = this.data.left_zone;
        
        return `
            <aside class="left-sidebar">
                ${this.renderCurrentStory(leftZone.current_story)}
                ${this.renderKeyMetrics(leftZone.key_metrics)}
                ${this.renderRelatedStories(leftZone.related_stories)}
                ${this.renderRecommendations(leftZone.recommendations)}
            </aside>
        `;
    }

    renderCurrentStory(currentStory) {
        const semanticClasses = this.renderSemanticClasses(currentStory.semantic_tags);
        
        return `
            <div class="current-story">
                <h3>Current Analysis</h3>
                <div class="story-card active ${semanticClasses}" data-story="ammonia">
                    <div class="story-title">${currentStory.title}</div>
                    <div class="story-meta">${currentStory.meta}</div>
                    <div class="connection-strength">
                        <span class="causal">●</span> ${currentStory.connection_label}
                    </div>
                </div>
            </div>
        `;
    }

    renderKeyMetrics(keyMetrics) {
        const metricsHtml = Object.entries(keyMetrics.metrics).map(([key, metric]) => {
            const semanticClasses = this.renderSemanticClasses(metric.semantic_tags);
            
            return `
                <div class="metric-item ${semanticClasses}" data-concept="${key}">
                    <div class="metric-label">${metric.label}</div>
                    <div class="metric-value ${metric.class}">${metric.value}</div>
                </div>
            `;
        }).join('');

        return `
            <div class="key-metrics">
                <h4>${keyMetrics.section_title}</h4>
                ${metricsHtml}
            </div>
        `;
    }

    renderRelatedStories(relatedStories) {
        const storiesHtml = Object.entries(relatedStories.stories).map(([key, story]) => {
            const semanticClasses = this.renderSemanticClasses(story.semantic_tags);
            const activeClass = story.active ? 'active' : '';
            
            return `
                <div class="thread-item ${activeClass} ${semanticClasses}" data-concept="${key}">
                    <div class="connection-strength ${story.connection_type}"></div>
                    <div class="thread-label">${story.title}</div>
                </div>
            `;
        }).join('');

        return `
            <div class="related-threads">
                <h4>${relatedStories.section_title}</h4>
                ${storiesHtml}
            </div>
        `;
    }

    renderRecommendations(recommendations) {
        const recsHtml = Object.entries(recommendations.items).map(([key, rec]) => {
            const semanticClasses = this.renderSemanticClasses(rec.semantic_tags);
            
            return `
                <div class="rec-item ${semanticClasses}" data-concept="${key}">
                    <div class="rec-score">${rec.score}</div>
                    <div class="rec-content">${rec.text}</div>
                </div>
            `;
        }).join('');

        return `
            <div class="recommendations">
                <h4>${recommendations.section_title}</h4>
                ${recsHtml}
            </div>
        `;
    }

    // Render Center Zone Components
    renderCenterZone() {
        const centerZone = this.data.center_zone;
        
        return `
            <main class="content-area">
                ${this.renderNavigation()}
                <div class="view-container story-view active">
                    ${this.renderStoryHeader(centerZone.story_header)}
                    ${this.renderContentBlocks(centerZone.content_blocks)}
                </div>
            </main>
        `;
    }

    renderNavigation() {
        const nav = this.data.navigation;
        const navItems = Object.entries(nav.views).map(([view, url]) => {
            const activeClass = view === nav.active_view ? 'active' : '';
            return `<a href="${url}" class="function-btn ${activeClass}" data-view="${view}">${view.toUpperCase()}</a>`;
        }).join('');

        return `
            <div class="function-nav">
                ${navItems}
            </div>
        `;
    }

    renderStoryHeader(storyHeader) {
        const semanticClasses = this.renderSemanticClasses(storyHeader.semantic_tags);
        
        return `
            <div class="story-header ${semanticClasses}">
                <h1>${storyHeader.headline}</h1>
                <div class="story-meta-bar">
                    <span class="impact-level high">${storyHeader.meta_bar.impact_level}</span>
                    <span class="relevance">${storyHeader.meta_bar.relevance}</span>
                    <span class="last-updated">${storyHeader.meta_bar.last_updated}</span>
                </div>
            </div>
        `;
    }

    renderContentBlocks(contentBlocks) {
        const blocksHtml = Object.entries(contentBlocks).map(([key, block]) => {
            const semanticClasses = this.renderSemanticClasses(block.semantic_tags);
            let blockContent = `<p>${block.content}</p>`;
            
            // Add inline prompts if present
            if (block.inline_prompt) {
                const promptSemanticClasses = this.renderSemanticClasses(block.inline_prompt.semantic_tags);
                blockContent += `
                    <div class="inline-prompt ${promptSemanticClasses}">
                        <span class="prompt-icon">${block.inline_prompt.icon}</span>
                        <span class="prompt-text">${block.inline_prompt.text}</span>
                        <a href="${block.inline_prompt.link}" class="prompt-link">${block.inline_prompt.link_text} →</a>
                    </div>
                `;
            }
            
            // Add connection callouts if present
            if (block.connection_callout) {
                const calloutSemanticClasses = this.renderSemanticClasses(block.connection_callout.semantic_tags);
                blockContent += `
                    <div class="connection-callout ${calloutSemanticClasses}">
                        <div class="connection-type">${block.connection_callout.type}</div>
                        <div class="connection-text">${block.connection_callout.description}</div>
                        <button class="explore-connection">${block.connection_callout.button_text}</button>
                    </div>
                `;
            }
            
            return `
                <div class="content-block ${semanticClasses}" data-concept="${key}">
                    ${blockContent}
                </div>
            `;
        }).join('');

        return `<div class="story-content">${blocksHtml}</div>`;
    }

    // Render Right Zone Components
    renderRightZone() {
        const rightZone = this.data.right_zone;
        
        return `
            <aside class="right-sidebar">
                ${this.renderContextPanel(rightZone.context_panel)}
                ${this.renderActiveAlerts(rightZone.active_alerts)}
                ${this.renderRelatedIntelligence(rightZone.related_intelligence)}
            </aside>
        `;
    }

    renderContextPanel(contextPanel) {
        const itemsHtml = Object.entries(contextPanel.items).map(([key, item]) => {
            const semanticClasses = this.renderSemanticClasses(item.semantic_tags);
            
            return `
                <div class="context-item ${semanticClasses}" data-concept="${key}">
                    <div class="context-type">${item.type}</div>
                    <div class="context-detail">${item.detail}</div>
                </div>
            `;
        }).join('');

        return `
            <div class="context-panel">
                <h4>${contextPanel.section_title}</h4>
                ${itemsHtml}
            </div>
        `;
    }

    renderActiveAlerts(activeAlerts) {
        const alertsHtml = Object.entries(activeAlerts.items).map(([key, alert]) => {
            const semanticClasses = this.renderSemanticClasses(alert.semantic_tags);
            
            return `
                <div class="prompt-item urgency-${alert.urgency} ${semanticClasses}" data-concept="${key}">
                    <div class="prompt-text">${alert.text}</div>
                    <div class="prompt-action">${alert.action} →</div>
                </div>
            `;
        }).join('');

        return `
            <div class="active-prompts">
                <h4>${activeAlerts.section_title}</h4>
                ${alertsHtml}
            </div>
        `;
    }

    renderRelatedIntelligence(relatedIntelligence) {
        const intelHtml = Object.entries(relatedIntelligence.items).map(([key, intel]) => {
            const semanticClasses = this.renderSemanticClasses(intel.semantic_tags);
            
            return `
                <div class="related-item ${semanticClasses}" data-concept="${key}">
                    <div class="related-title">${intel.title}</div>
                    <div class="related-connection">${intel.connection}</div>
                </div>
            `;
        }).join('');

        return `
            <div class="related-stories">
                <h4>${relatedIntelligence.section_title}</h4>
                ${intelHtml}
            </div>
        `;
    }

    // Render Status Bar
    renderStatusBar() {
        const statusBar = this.data.status_bar;
        const semanticClasses = this.renderSemanticClasses(statusBar.semantic_tags);
        
        return `
            <div class="status-bar ${semanticClasses}">
                <div class="status-left">
                    <span>${statusBar.left_status}</span>
                    <span class="connection-status">●</span>
                </div>
                <div class="status-right">
                    <span>${statusBar.right_status}</span>
                </div>
            </div>
        `;
    }

    // Main render function
    render() {
        const semanticTags = this.data.semantic_tags;
        const bodyClasses = `story-${semanticTags.commodity}`;
        
        const fullPage = `
            <body class="${bodyClasses}">
                <nav class="top-nav">
                    <div class="nav-left">
                        <a href="../../index.html" class="logo">ShippingIntel</a>
                        <div class="search-bar">
                            <input type="text" placeholder="Search stories, ships, ports, companies... (⌘K)" class="global-search">
                        </div>
                    </div>
                    <div class="nav-right">
                        <div class="user-role">Abe Vigoda</div>
                        <div class="notifications">●</div>
                    </div>
                </nav>
                
                <div class="main-container">
                    ${this.renderLeftZone()}
                    ${this.renderCenterZone()}
                    ${this.renderRightZone()}
                </div>
                
                ${this.renderStatusBar()}
                
                <script>
                    // Initialize content analytics tracking
                    document.addEventListener('DOMContentLoaded', function() {
                        // Track all semantic-tagged elements
                        document.querySelectorAll('[data-concept]').forEach(element => {
                            const concept = element.getAttribute('data-concept');
                            element.addEventListener('click', () => {
                                console.log('Content Analytics:', concept, 'clicked');
                                // Real implementation would send to analytics service
                            });
                        });
                    });
                </script>
            </body>
        `;
        
        return fullPage;
    }
}

// Export for use in templates
window.StoryRenderer = StoryRenderer; 