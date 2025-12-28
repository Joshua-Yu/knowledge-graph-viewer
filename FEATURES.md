# Features & Functionality

## Overview
This Knowledge Graph Viewer is a full-stack web application designed for visualizing and analyzing knowledge graphs extracted from essays, along with question-answering evaluation results.

---

## 🎯 Core Features

### 1. **Folder & File Management**
- **Dynamic Folder Browsing**: Browse any directory on the server
- **Automatic File Discovery**: Scans folders for matching JSON files
- **Smart ID Detection**: Automatically pairs `{id}.json` with `{id}_results.json`
- **Default Locations**: Pre-configured for common data directories

**User Interaction:**
- Select folder from dropdown
- Choose essay ID from dynamically populated list
- Instant loading of essay and evaluation data

---

### 2. **Essay Display**
- **Full Text Rendering**: Complete essay text displayed with proper formatting
- **Scrollable View**: 30% viewport height with overflow scrolling
- **Clean Typography**: Readable font with optimal line spacing
- **Markdown Support**: Handles code blocks and special formatting

**Visual Design:**
- White background for readability
- Professional typography
- Responsive container

---

### 3. **Interactive Knowledge Graph**

#### Visualization Engine
- **Cytoscape.js**: Professional graph visualization library
- **Dagre Layout**: Hierarchical directed graph layout
- **Automatic Positioning**: Optimized node placement
- **Smooth Animations**: Transitions when focusing/zooming

#### Node Features
- **Visual States**:
  - Blue: Default state
  - Red: Selected (user clicked)
  - Yellow: Highlighted (retrieved for question)
- **Labels**: Node IDs displayed with text wrapping
- **Sizing**: Dynamic based on label length
- **Shape**: Rounded rectangles for better aesthetics

#### Edge Features
- **Directional Arrows**: Show relationship direction
- **Edge Labels**: Relationship types displayed
- **Auto-rotation**: Labels follow edge angles
- **Visual States**:
  - Gray: Default
  - Red: Selected edge type
  - Yellow: Highlighted edges

#### Interaction Controls
- **Click Node**: Select and center
- **Click Edge**: Highlight all of that type
- **Pan**: Drag background to move view
- **Zoom**: Mouse wheel to zoom in/out
- **Auto-fit**: Double-click to fit all nodes
- **Animate**: Smooth transitions for all movements

---

### 4. **Node & Edge Lists**

#### Node List (Right Panel, Top)
- **Alphabetical Sorting**: Easy to find specific nodes
- **Scrollable**: Handles hundreds of nodes
- **Click to Select**: Highlights node on graph
- **Visual Feedback**:
  - Blue background: Selected
  - Yellow background: Highlighted (in question context)
- **Auto-scroll**: Scrolls to selected item
- **Bidirectional Sync**: Clicking graph updates list

#### Edge List (Right Panel, Bottom)
- **Unique Edge Types**: Shows relationship vocabulary
- **Click to Highlight**: Shows all edges of that type
- **Visual States**: Same as nodes
- **Type Filtering**: Easy to explore relationship patterns

---

### 5. **Question Evaluation Interface**

#### Question List (Left Panel)
- **Scrollable List**: All questions accessible
- **Visual Indicators**:
  - Green border: Correctly answered (evaluation = 1)
  - Red border: Incorrectly answered (evaluation = 0)
- **Selection Highlighting**: Selected question in light green
- **Question Preview**: Shows answer text in list
- **Numbered**: Q1, Q2, etc. for easy reference

#### Question Details (Right Panel, Bottom)
When a question is selected, displays:
- **Correct Answer**: Full answer text
- **Evaluation Status**: Visual ✓ or ✗ with color coding
- **Retrieved Nodes**: Chip-style display of nodes
- **Node Chips**: Yellow badges with node names

#### Graph Integration
- **Automatic Highlighting**: Retrieved nodes highlighted in yellow
- **Context Visualization**: See which nodes were used
- **Focus Animation**: Graph zooms to show highlighted nodes
- **Clear Previous**: Removes highlights when switching questions

---

## 🔧 Technical Implementation

### Backend (Node.js/Express)

#### API Endpoints
```
GET /api/folders              - List available folders
GET /api/files/:folderPath    - List essay IDs in folder
GET /api/essay/:folder/:id    - Get essay JSON
GET /api/results/:folder/:id  - Get results JSON
```

#### Features
- **CORS Enabled**: Cross-origin requests allowed
- **Static Serving**: Public folder served automatically
- **Error Handling**: Proper error responses
- **Path Encoding**: URL-safe path handling

### Frontend Architecture

#### Technologies
- **Vanilla JavaScript**: No framework dependencies
- **Cytoscape.js 3.28.1**: Graph visualization
- **Dagre 0.8.5**: Layout algorithm
- **Cytoscape-Dagre**: Layout integration

#### Code Organization
- **State Management**: Global state for current data
- **Event Handlers**: Clean event delegation
- **API Abstraction**: Centralized fetch calls
- **Modular Functions**: Single-responsibility functions

#### Performance
- **Efficient Rendering**: Only re-render on data change
- **Smooth Animations**: GPU-accelerated transitions
- **Lazy Loading**: Load data on demand
- **Memory Management**: Proper cleanup of elements

---

## 🎨 UI/UX Design

### Layout
- **Three-panel Design**: Questions | Essay+Graph | Lists+Details
- **Responsive Flex**: Adapts to different sizes
- **Fixed Header**: Controls always visible
- **Scrollable Sections**: Individual scroll areas

### Color Scheme
- **Header**: Dark blue-gray (#2c3e50)
- **Backgrounds**: White and light gray
- **Accents**: 
  - Success: Green (#28a745)
  - Error: Red (#dc3545)
  - Highlight: Yellow (#ffc107)
  - Primary: Blue (#3498db)

### Typography
- **Font**: Segoe UI (system font)
- **Sizes**: Responsive (10px-20px)
- **Weights**: Normal and bold for hierarchy
- **Line Height**: 1.5-1.6 for readability

### Interactive Elements
- **Hover Effects**: Subtle background changes
- **Click Feedback**: Immediate visual response
- **Transitions**: 0.2s smooth transitions
- **Focus States**: Clear selection indicators

---

## 📊 Data Format Support

### Essay JSON Structure
```json
{
  "essay": "Full essay text...",
  "nodes": ["node1", "node2", ...],
  "edges": ["edge_type1", "edge_type2", ...],
  "relations": [
    ["source", "edge_type", "target"],
    ...
  ]
}
```

### Results JSON Structure
```json
[
  {
    "correct_answer": "Answer text",
    "retrieved_nodes": ["node1", "node2"],
    "retrieved_context": "Context...",
    "evaluation": 1
  },
  ...
]
```

---

## 🚀 Advanced Features

### Graph Navigation
- **Zoom Levels**: 0.5x to 3x
- **Fit to View**: Automatic viewport adjustment
- **Center on Node**: Click to center and zoom
- **Fit Selection**: Zoom to highlighted nodes
- **Animated Transitions**: Smooth camera movement

### Multi-state Visualization
- **Three Visual States**: Normal, Selected, Highlighted
- **State Combinations**: Can be selected and highlighted
- **Clear Hierarchy**: Visual priority clear
- **Consistent Styling**: Same states across elements

### Data Synchronization
- **Bidirectional Binding**: Graph ↔ Lists
- **Real-time Updates**: Instant UI updates
- **State Persistence**: Selection maintained until changed
- **Context Awareness**: Appropriate highlights per view

### Error Handling
- **User-friendly Messages**: Clear error descriptions
- **Auto-dismissal**: Errors fade after 5 seconds
- **Graceful Degradation**: Partial data still displayed
- **Loading States**: Loading indicators shown

---

## 🔍 Use Cases

### Research & Analysis
- Explore knowledge graph structure
- Analyze question-answering performance
- Identify missing connections
- Evaluate graph completeness

### Education
- Visualize concept relationships
- Understand essay structure
- Learn graph theory concepts
- Study NLP extraction results

### Development
- Debug knowledge extraction
- Test graph algorithms
- Validate data quality
- Compare extraction methods

### Presentation
- Demo knowledge graphs
- Show evaluation results
- Explain graph concepts
- Interactive demonstrations

---

## 📈 Scalability

### Performance Characteristics
- **Small Graphs** (<100 nodes): Instant rendering
- **Medium Graphs** (100-500 nodes): <1s rendering
- **Large Graphs** (500+ nodes): Progressive loading possible

### Optimization Opportunities
- Virtual scrolling for large lists
- Graph clustering for large datasets
- Lazy loading of question details
- Caching of rendered states

---

## 🎓 Educational Value

### Learning Objectives
1. **Knowledge Graphs**: Understand nodes, edges, relations
2. **NLP Evaluation**: See how QA systems work
3. **Graph Visualization**: Learn Cytoscape.js
4. **Full-stack Development**: Node.js + Frontend integration

### Teaching Applications
- Computer Science courses
- NLP/ML workshops
- Data visualization classes
- Web development tutorials

---

## 🔮 Future Enhancements

### Potential Features
- [ ] Export graph as image (PNG/SVG)
- [ ] Filter nodes/edges by type
- [ ] Search functionality
- [ ] Compare multiple graphs
- [ ] Edit mode for corrections
- [ ] Statistical analysis dashboard
- [ ] Graph diff visualization
- [ ] Batch processing of files
- [ ] Custom layout algorithms
- [ ] Annotation tools

### Integration Possibilities
- Graph databases (Neo4j, ArangoDB)
- ML model APIs
- Cloud storage (S3, GCS)
- Collaboration features
- Version control

---

## 📚 Documentation

Complete documentation available:
- **README.md**: Full setup and usage guide
- **QUICK_START.md**: Get started in 3 steps
- **FEATURES.md**: This document
- **Inline Comments**: Code documentation

---

**Built with ❤️ for knowledge graph visualization and analysis**
