# Knowledge Graph & Question Evaluation Viewer

A web-based application for visualizing knowledge graphs extracted from essays and evaluating question-answering performance.

## Features

- **Folder & File Selection**: Browse directories and select essay files
- **Essay Display**: View the full essay text
- **Interactive Graph Visualization**: Cytoscape.js-powered knowledge graph with nodes and edges
- **Node & Edge Lists**: Clickable lists to highlight graph elements
- **Question Evaluation**: View questions with their correct answers and evaluation results
- **Retrieved Node Highlighting**: Automatically highlights nodes retrieved for each question

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Prepare Your Data

The application expects JSON files in the following format:

**{id}.json** (Essay data):
```json
{
  "essay": "The essay text...",
  "nodes": ["node1", "node2", ...],
  "edges": ["edge_type1", "edge_type2", ...],
  "relations": [
    ["source_node", "edge_type", "target_node"],
    ...
  ]
}
```

**{id}_results.json** (Question evaluation):
```json
[
  {
    "correct_answer": "The answer text",
    "retrieved_nodes": ["node1", "node2"],
    "retrieved_context": "Context text...",
    "evaluation": 1  // 1 for correct, 0 for incorrect
  },
  ...
]
```

Place your data files in a directory (e.g., `/home/test_data/test1` or `/mnt/user-data/uploads/test2`).

Open a terminal window: 

```bash
export BASE_DIR=YOUR_TEST_DATA_ROOT
```

### 3. Start the Server

```bash
npm start
```

Or use the startup script:
```bash
./start_server.sh
```

The server will start on http://localhost:3000

## Usage

1. **Select Folder**: Choose a folder containing your JSON files from the dropdown
2. **Select Essay ID**: Pick an essay ID (files will be named like `1.json` and `1_results.json`)
3. **View Essay**: The essay text appears in the top section
4. **Explore Graph**: 
   - The knowledge graph visualizes nodes and their relationships
   - Click nodes or edges to select them
   - Use the node/edge lists on the right to navigate
5. **Review Questions**:
   - Questions appear on the left side (green border = correct, red = incorrect)
   - Click a question to view details and highlight retrieved nodes
   - Retrieved nodes are highlighted in yellow on the graph

## Graph Controls

- **Click node/edge**: Select and focus
- **Pan**: Click and drag on empty space
- **Zoom**: Mouse wheel or pinch
- **Fit**: Double-click empty space

## Color Legend

### Nodes
- **Blue**: Normal node
- **Red**: Selected node (clicked)
- **Yellow**: Highlighted node (retrieved for current question)

### Edges
- **Gray**: Normal edge
- **Red**: Selected edge type
- **Yellow**: Highlighted edge (connected to retrieved nodes)

## File Structure

```
/home/claude/
├── server.js           # Node.js/Express backend
├── package.json        # Dependencies
├── start_server.sh     # Startup script
├── public/
│   ├── index.html      # Main UI
│   └── app.js          # Frontend JavaScript
└── test_data/          # Sample data directory
    ├── 1.json
    └── 1_results.json
```

## API Endpoints

- `GET /api/folders?path=/path` - List folders in directory
- `GET /api/files/:folderPath` - List essay IDs in folder
- `GET /api/essay/:folderPath/:id` - Get essay data
- `GET /api/results/:folderPath/:id` - Get results data

## Technologies Used

- **Backend**: Node.js, Express.js
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Graph Visualization**: Cytoscape.js with Dagre layout
- **Styling**: Custom CSS with responsive design

## Troubleshooting

**Server won't start**: Make sure port 3000 is available or change the PORT variable in server.js

**Files not loading**: Ensure your JSON files are properly formatted and located in an accessible directory

**Graph not rendering**: Check browser console for errors and ensure Cytoscape.js CDN links are accessible

## Sample Data

Sample data files (1.json and 1_results.json) are included in the `test_data/` directory demonstrating the butterfly life cycle knowledge graph.

## License

MIT
