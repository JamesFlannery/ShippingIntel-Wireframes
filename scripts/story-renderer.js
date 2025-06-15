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
                    ${this.renderExecutiveSummary(centerZone.executive_summary)}
                    ${this.renderKeyTakeaways(centerZone.key_takeaways)}
                    ${this.renderMarketImpact(centerZone.market_impact)}
                    ${this.renderPricingAnalysis(centerZone.pricing_analysis)}
                    ${this.renderIndustryImplications(centerZone.industry_implications)}
                    ${this.renderStrategicImplications(centerZone.strategic_implications)}
                    ${this.renderLookingAhead(centerZone.looking_ahead)}
                    ${this.renderNextChapter(centerZone.next_chapter)}
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
                    <span class="read-time">${storyHeader.meta_bar.read_time}</span>
                </div>
            </div>
        `;
    }

    renderExecutiveSummary(executiveSummary) {
        const semanticClasses = this.renderSemanticClasses(executiveSummary.semantic_tags);
        
        return `
            <div class="content-section executive-summary ${semanticClasses}">
                <h2>${executiveSummary.title}</h2>
                <p class="summary-content">${executiveSummary.content}</p>
            </div>
        `;
    }

    renderKeyTakeaways(keyTakeaways) {
        const semanticClasses = this.renderSemanticClasses(keyTakeaways.semantic_tags);
        const takeawayItems = keyTakeaways.items.map(item => `<li>${item}</li>`).join('');
        
        return `
            <div class="content-section key-takeaways ${semanticClasses}" data-concept="key_takeaways">
                <h3>${keyTakeaways.title}</h3>
                <div class="takeaways-box">
                    <ul>
                        ${takeawayItems}
                    </ul>
                </div>
            </div>
        `;
    }

    renderMarketImpact(marketImpact) {
        const semanticClasses = this.renderSemanticClasses(marketImpact.semantic_tags);
        const promptSemanticClasses = this.renderSemanticClasses(marketImpact.inline_prompt.semantic_tags);
        
        return `
            <div class="content-section market-impact ${semanticClasses}" data-concept="market_impact">
                <h3>${marketImpact.title}</h3>
                <p>${marketImpact.content}</p>
                    <div class="inline-prompt ${promptSemanticClasses}">
                    <span class="prompt-icon">${marketImpact.inline_prompt.icon}</span>
                    <span class="prompt-text">${marketImpact.inline_prompt.text}</span>
                    <a href="${marketImpact.inline_prompt.link}" class="prompt-link">${marketImpact.inline_prompt.link_text} →</a>
                </div>
            </div>
        `;
    }

    renderPricingAnalysis(pricingAnalysis) {
        const semanticClasses = this.renderSemanticClasses(pricingAnalysis.semantic_tags);
        
        return `
            <div class="content-section pricing-analysis ${semanticClasses}" data-concept="pricing_analysis">
                <p>${pricingAnalysis.content}</p>
                    </div>
                `;
            }
            
    renderIndustryImplications(industryImplications) {
        const semanticClasses = this.renderSemanticClasses(industryImplications.semantic_tags);
        const calloutSemanticClasses = this.renderSemanticClasses(industryImplications.connection_callout.semantic_tags);
        
        return `
            <div class="content-section industry-implications ${semanticClasses}" data-concept="industry_implications">
                <h3>${industryImplications.title}</h3>
                <p>${industryImplications.content}</p>
                    <div class="connection-callout ${calloutSemanticClasses}">
                    <div class="connection-type">${industryImplications.connection_callout.type}</div>
                    <div class="connection-text">${industryImplications.connection_callout.description}</div>
                    <button class="explore-connection">${industryImplications.connection_callout.button_text}</button>
                </div>
                    </div>
                `;
            }

    renderStrategicImplications(strategicImplications) {
        const semanticClasses = this.renderSemanticClasses(strategicImplications.semantic_tags);
        const promptSemanticClasses = this.renderSemanticClasses(strategicImplications.inline_prompt.semantic_tags);
            
            return `
            <div class="content-section strategic-implications ${semanticClasses}" data-concept="strategic_implications">
                <p>${strategicImplications.content}</p>
                <div class="inline-prompt ${promptSemanticClasses}">
                    <span class="prompt-icon">${strategicImplications.inline_prompt.icon}</span>
                    <span class="prompt-text">${strategicImplications.inline_prompt.text}</span>
                    <a href="${strategicImplications.inline_prompt.link}" class="prompt-link">${strategicImplications.inline_prompt.link_text} →</a>
                </div>
            </div>
        `;
    }

    renderLookingAhead(lookingAhead) {
        const semanticClasses = this.renderSemanticClasses(lookingAhead.semantic_tags);
        
        return `
            <div class="content-section looking-ahead ${semanticClasses}" data-concept="looking_ahead">
                <h3>${lookingAhead.title}</h3>
                <p>${lookingAhead.content}</p>
                </div>
            `;
    }

    renderNextChapter(nextChapter) {
        const semanticClasses = this.renderSemanticClasses(nextChapter.semantic_tags);

        return `
            <div class="content-section next-chapter ${semanticClasses}" data-concept="next_chapter">
                <div class="chapter-preview">
                    <h4>${nextChapter.title}</h4>
                    <p class="chapter-description">${nextChapter.description}</p>
                    <button class="chapter-button">${nextChapter.button_text}</button>
                </div>
            </div>
        `;
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

    // Initialize analytics tracking for rendered content
    initializeAnalytics() {
        // Track story view
        const storyId = this.data.story_meta ? this.data.story_meta.story_id : 'unknown';
        console.log('📈 Analytics: Story viewed -', storyId);
        
        // Track semantic concepts available for measurement
        const concepts = this.data.semantic_tags ? this.data.semantic_tags.content_concepts : [];
        console.log('🏷️ Content concepts available for tracking:', concepts);
        
        // Track user journey markers
        const journeyMarkers = this.data.semantic_tags ? this.data.semantic_tags.user_journey_markers : [];
        console.log('🎯 Journey markers for comprehension tracking:', journeyMarkers);
        
        // Initialize click tracking for all semantic elements
        setTimeout(() => {
            document.querySelectorAll('[data-concept]').forEach(element => {
                const concept = element.getAttribute('data-concept');
                element.addEventListener('click', () => {
                    console.log('🎯 Content Analytics: Concept engaged -', concept);
                    // Real implementation would send to analytics service:
                    // analytics.track('concept_engagement', { concept, story_id: storyId });
                });
            });
            
            // Track semantic class interactions
            document.querySelectorAll('[class*="semantic-"]').forEach(element => {
                const semanticClasses = Array.from(element.classList)
                    .filter(cls => cls.startsWith('semantic-'))
                    .map(cls => cls.replace('semantic-', ''));
                
                element.addEventListener('click', () => {
                    console.log('🏷️ Semantic Analytics: Tags engaged -', semanticClasses);
                });
            });
        }, 100);
    }
}

// Export for use in templates
window.StoryRenderer = StoryRenderer; 