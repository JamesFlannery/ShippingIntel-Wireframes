# 🔍 Product Discovery Analytics - Maritime Intelligence

## Overview
This system captures and analyzes user behavioral patterns to identify product opportunities in the maritime intelligence domain. It goes beyond basic analytics to understand **business decision-making patterns** and **domain-specific needs**.

## 🚀 Getting Started

1. **Start the server**: `python3 -m http.server 8001`
2. **Generate test data**: Visit `http://localhost:8001/test-tracking.html` and interact with elements
3. **View analytics**: Visit `http://localhost:8001/analytics-dashboard.html`

## 📊 New Features Added

### **Behavioral Visualizations**
- **🛤️ User Journey Flow**: Visual representation of how users navigate between views
- **📈 Intent Patterns Timeline**: Shows when users attempt calculations, exports, comparisons
- **🎯 Behavioral Heatmap**: Click pattern visualization (placeholder for now)

### **🧠 Maritime Domain Insights**
- **Market Analysis Patterns**: Connects behavioral data to ammonia market decisions
- **User Segment Profiles**: Identifies trader, buyer, logistics, analyst personas
- **Product Opportunities**: Maps user frustrations to potential new features

## 🚢 Domain-Specific Tracking

The system now captures **maritime business context**:

### **Market Focus Detection**
- Pricing analysis behavior (interactions with $435/mt, Tampa pricing)
- Geographic comparisons (USG vs Trinidad routes)
- Timeline interest (Dancing Brave cargo, production ramp-up)
- Capacity analysis (1.3M t/y plant discussions)

### **User Segment Classification**
- **Analytical Trader**: Data view + calculation attempts
- **Logistics Coordinator**: Geography + timeline focus
- **Market Researcher**: Export attempts + data extraction
- **Strategic Analyst**: Impact + connections analysis

### **Decision Context Analysis**
- **Strategic Decision Making**: Calculation + comparison patterns
- **Information Gathering**: Export-focused behavior
- **Quantitative Analysis**: Heavy calculation attempts
- **Option Evaluation**: Comparison-heavy patterns
- **Exploratory Research**: General browsing patterns

## 💡 Product Opportunities Identified

The system automatically identifies opportunities based on user behavior:

### **High Priority**
- **Ammonia Price Calculator**: Users double-clicking on prices, trying to calculate impacts
- **Side-by-Side Route Comparison**: Users rapidly switching between data/geography views
- **Data Export Suite**: Users attempting Ctrl+C, right-clicks on data

### **Medium Priority**
- **Guided Analysis Wizard**: Users showing analysis paralysis (long dwell times)
- **Real-time Pricing Alerts**: Users frequently checking pricing updates
- **Historical Trend Analysis**: Users engaging with timeline data

## 📈 Analytics Dashboard Views

### **1. Overview**
- Basic usage metrics
- Intent signal counts
- Friction point detection
- Popular view analysis

### **2. 📊 Visualizations** (NEW!)
- User journey flow diagrams
- Intent patterns over time
- Interaction heatmaps

### **3. 🧠 Domain Insights** (NEW!)
- Maritime market analysis patterns
- User segment business profiles
- Product opportunity prioritization

### **4. Event Stream**
- Real-time behavioral events
- Intent signals as they occur
- Friction points detected

## 🎯 Key Insights for Maritime Intelligence

### **Ammonia Market Behavior Patterns**
- Users focus heavily on $435/mt Tampa pricing impact
- Strong interest in USG vs Trinidad competitive positioning
- Timeline analysis shows supply chain planning concerns
- Geographic analysis indicates route optimization needs

### **Business Decision Workflows**
- **Traders**: Price → Geography → Calculations (competitive positioning)
- **Buyers**: Data → Impact → Timeline (supply security assessment)  
- **Logistics**: Geography → Timeline → Players (operational planning)
- **Analysts**: Multiple views + Export attempts (research workflows)

### **Product-Market Fit Indicators**
- High calculation intent = Need for pricing tools
- Export attempts = Need for data access/APIs
- Navigation friction = Need for integrated dashboards
- Analysis paralysis = Need for guided workflows

## 🔧 Technical Implementation

### **Behavioral Tracking**
- Mouse movement patterns
- Click/interaction sequences
- Dwell time analysis
- Text selection monitoring
- Navigation pattern detection

### **Domain Context Extraction**
- Maritime terminology detection
- Business decision stage classification
- Market event correlation
- Geographic focus identification

### **Intent Detection Engine**
- Calculation attempts (double-clicks, right-clicks on numbers)
- Export attempts (Ctrl+C, Ctrl+S, context menus)
- Comparison patterns (rapid view switching)
- Data extraction (text selection, highlighting)

## 📊 Sample Insights

After just a few interactions, the system might detect:

```
🚢 Maritime Domain Analysis:
- Pricing Focus: High interest in $435/mt Tampa pricing (5x interactions)
  → Users focused on current pricing impact
  💡 Price calculator/scenarios tool

- Competitive Analysis: Data → Geography view switching (3x)
  → Users comparing USG vs Trinidad trade routes  
  💡 Side-by-side route comparison tool

👥 User Segments Detected:
- Analytical Trader (2 users): Market share defense concerns
  → Needs: Price calculators, competitive dashboards
  
- Logistics Coordinator (1 user): Fleet positioning decisions
  → Needs: Route optimization, vessel tracking integration

💡 Product Opportunities:
1. Ammonia Price Calculator (Priority: 50)
   - Interactive calculator for price scenarios
   - Market Size: High - All trading participants
   
2. Data Export Suite (Priority: 32)
   - Comprehensive data export and API access
   - Market Size: Medium - Analytics teams
```

## 🎮 Testing the System

Visit the test page and try these behaviors:

1. **Trigger Calculation Intent**: Double-click on prices like "$435/mt"
2. **Test Export Intent**: Try Ctrl+C on data, click "Export Data" button
3. **Create Comparison Pattern**: Quickly switch between Data → Geography → Data views
4. **Generate Friction**: Click on elements that look interactive but aren't
5. **Show Analysis Paralysis**: Stay on a page for 30+ seconds without clicking

Then check the analytics dashboard to see how these behaviors are captured and interpreted!

## 🔮 Next Steps

1. **Collect real user data** for 1-2 weeks
2. **Analyze domain patterns** to validate user segments
3. **Prioritize product opportunities** based on behavior frequency
4. **Conduct user interviews** with high-intent users
5. **Build MVPs** for top-priority opportunities

The goal is to discover what users are **trying** to do that your current platform doesn't support - that's where the biggest product opportunities lie! 🚀 