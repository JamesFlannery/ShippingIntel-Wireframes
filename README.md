# Maritime Intelligence - YAML-Driven Content System

## Project Overview

This project is building a sophisticated maritime intelligence platform with a **data-driven content architecture** that separates content from presentation. The goal is to enable:

1. **Story Ontology**: Content structured as semantic maritime knowledge
2. **Dual Analytics**: Track both click behavior AND concept engagement  
3. **UX Flexibility**: Easy visual pattern changes without touching content

## Current Architecture

### Three-Zone Layout
- **Left Zone**: Context & Control (metrics, related stories, recommendations)
- **Center Zone**: Primary Analysis (story content, prompts, connections) 
- **Right Zone**: Decision Support (context panel, alerts, intelligence)

### Key Files Structure
```
maritime-intelligence-wireframe/
├── pages/stories/
│   └── ammonia.html                    # Target implementation file
├── data/stories/
│   └── ammonia-plant.yaml             # Structured story data
├── scripts/
│   └── story-renderer.js              # YAML → HTML renderer
└── styles/
    ├── main.css
    └── story.css
```

## What We're Building

### 1. Content Extraction & Structure
- **From**: Hardcoded HTML content in story pages
- **To**: Structured YAML data with semantic tags
- **Result**: `ammonia-plant.yaml` (227 lines) with full story content

### 2. Template Rendering System  
- **Component**: `StoryRenderer` class in `story-renderer.js`
- **Function**: Converts YAML data → HTML with semantic CSS classes
- **Features**: 
  - Semantic CSS classes for visual patterns
  - Analytics tracking for content engagement
  - Component-based rendering (left/center/right zones)

### 3. Analytics Foundation
- **Click Analytics**: Traditional user interaction tracking
- **Concept Analytics**: Semantic content comprehension tracking
- **Implementation**: `data-concept` attributes + semantic CSS classes

## Current Implementation Status

### ✅ Completed
- [x] Content extracted from HTML into `ammonia-plant.yaml`
- [x] YAML structure designed with semantic tags
- [x] `StoryRenderer` class created with zone-based rendering
- [x] `ammonia.html` set up as template loader
- [x] Analytics tracking framework designed

### 🚧 Current Issue
The `ammonia.html` page loads but doesn't render content from YAML. The integration between:
1. `ammonia.html` (loads YAML + calls renderer)
2. `story-renderer.js` (StoryRenderer class)  
3. `ammonia-plant.yaml` (structured content)

**Problem**: Content not appearing on page load.

## File Details

### ammonia.html
```html
<!-- Loads js-yaml + story-renderer.js -->
<!-- Fetches ammonia-plant.yaml -->
<!-- Calls StoryRenderer.render() -->
<!-- Injects result into <div id="app"> -->
```

### ammonia-plant.yaml Structure
```yaml
story_meta:
  story_id: "ammonia-plant-export-2025"
  commodity: "ammonia"
  
semantic_tags:
  commodity: "ammonia"
  content_concepts: [...]
  user_journey_markers: [...]

left_zone:
  current_story: {...}
  key_metrics: {...}
  related_stories: {...}
  recommendations: {...}

center_zone:
  story_header: {...}
  content_blocks: {...}

right_zone:
  context_panel: {...}
  active_alerts: {...}
  related_intelligence: {...}

navigation: {...}
status_bar: {...}
```

### StoryRenderer Class
```javascript
class StoryRenderer {
  constructor(storyData) { /* YAML data */ }
  
  render() { 
    // Returns complete HTML for injection
    // Combines: nav + main-container + status-bar
  }
  
  renderLeftZone() { /* Sidebar components */ }
  renderCenterZone() { /* Story content */ }
  renderRightZone() { /* Context panels */ }
}
```

## Questions Answered

### "Will the content be in a story ontology?"
**Yes** - Every piece of content knows where it fits in maritime domain knowledge through:
- Semantic tags for commodity, market dynamics, operational concepts
- Content concept tracking for comprehension analytics
- Structured relationships between story elements

### "Can we track user analytics both clicks and concepts?"
**Yes** - Dual analytics system:
- **Click Analytics**: `addEventListener('click')` on interactive elements
- **Concept Analytics**: `data-concept` attributes track semantic engagement
- **Visual Analytics**: Semantic CSS classes enable pattern-based tracking

### "Can we tweak the UX easily?"
**Yes** - Complete separation of concerns:
- **Content**: Managed in YAML files
- **Logic**: JavaScript rendering templates  
- **Visuals**: CSS semantic classes for consistent patterns
- **UX Changes**: Modify CSS classes without touching content

## Next Steps

1. **Debug Current Integration**: Fix why content isn't rendering
2. **Test Full Pipeline**: YAML → Renderer → Display
3. **Validate Analytics**: Ensure tracking works for both clicks and concepts
4. **Scale Pattern**: Apply to other maritime stories

## Benefits Achieved

When working, this system provides:
- **Content Scalability**: Add stories without HTML coding
- **Analytics Depth**: Measure comprehension, not just interaction  
- **UX Agility**: Visual changes without content modification
- **Knowledge Structure**: Maritime domain ontology in data
- **AI-Ready Foundation**: Structured content for AI assistance

---

*This README captures our progress toward a sophisticated, data-driven maritime intelligence platform where content, analytics, and UX are independently manageable.* 