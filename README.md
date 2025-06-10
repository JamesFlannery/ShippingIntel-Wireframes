# ShippingIntel Platform - Wireframe

This wireframe demonstrates a Bloomberg Terminal-inspired user flow for a maritime intelligence platform that helps users understand trends in the maritime industry through interactive, personalized storytelling.

## Core Concept

The platform uses three interconnected schemas to create intelligent, contextual guidance:

1. **story-connection-mapping.yaml** - Maps relationships between maritime events, companies, and market trends
2. **recommendation-engine-logic.yaml** - Scores and suggests relevant content based on user role and behavior
3. **pathway-prompting-system.yaml** - Generates contextual prompts and navigation guidance

## Bloomberg Terminal-Inspired Flow

### 1. Central Entity → Radiating Analysis
- Start with a maritime story/trend (e.g., "GCA Plant Startup")
- Everything branches from this central focus
- Users stay "in context" while exploring different perspectives

### 2. Function-Based Drill-Down
Similar to Bloomberg's function keys, users can switch between views:
- **STORY** - Main narrative content
- **DATA** - Supporting metrics, charts, pricing data  
- **CONNECTIONS** - Visual network of related stories and events
- **IMPACT** - Effects on specific ship types, routes, companies
- **GEOGRAPHY** - Regional implications and trade routes
- **TIMELINE** - Story evolution and future projections
- **PLAYERS** - Companies, ports, stakeholders involved

### 3. Discovery Through Cross-Reference
- Reading about one event reveals connections to others
- Each data point becomes a potential jumping-off point
- Intelligent recommendations based on user role (Ship Owner, Trader, etc.)

## Key Features Demonstrated

### Main Dashboard (`index.html`)
- **Three-panel layout**: Story context (left), main content (center), contextual intelligence (right)
- **Function navigation**: Bloomberg-style view switching
- **Inline prompts**: Smart suggestions embedded in content
- **Connection callouts**: Highlight relationships between stories
- **Role-based relevance**: Content scored for user type

### Connections View (`connections-view.html`)
- **Neural network visualization**: Interactive graph of story relationships
- **Connection types**: Causal (strong), Thematic (medium), Weak (peripheral)
- **Filtering controls**: Time range, connection types, relevance threshold
- **Node details**: Deep dive on selected stories/events
- **Exploration paths**: Suggested routes through the data

## Design Philosophy

### Visual Hierarchy
- **Dark theme** with high contrast for extended reading
- **Color coding** for different connection strengths and content types
- **Typography** focused on data density and readability
- **Minimal chrome** to maximize content focus

### Information Architecture
- **Context preservation** - always know where you are in the story network
- **Progressive disclosure** - start broad, drill down to specifics
- **Cross-referencing** - seamless jumping between related content
- **Personalization** - content relevance based on user role and preferences

## User Flow Examples

1. **Market Analysis Flow**:
   GCA Plant (STORY) → Pricing Impact (DATA) → Fleet Impact (IMPACT) → Route Changes (GEOGRAPHY)

2. **Discovery Flow**:
   Reading about Tampa pricing → Connection callout → Chemical tanker earnings → Your fleet analysis

3. **Comparative Flow**:
   Current plant startup → Historical plant startups (TIMELINE) → Pattern analysis (DATA)

## Technical Implementation Notes

- Responsive grid layout using CSS Grid
- SVG-based connection visualization
- Smooth transitions and hover states
- Keyboard shortcut support (⌘K global search)
- Modular CSS architecture for different view types

The wireframe demonstrates how maritime professionals can efficiently navigate complex market intelligence through Bloomberg Terminal-style function navigation while maintaining story context and discovering relevant connections. 