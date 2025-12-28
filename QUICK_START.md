# Quick Start Guide

## 🚀 Getting Started in 3 Steps

### Step 1: Navigate to the project directory
```bash
cd /mnt/user-data/outputs
```

### Step 2: Start the server
```bash
npm start
```

You should see:
```
Server running at http://localhost:3000
```

### Step 3: Open your browser
Navigate to: **http://localhost:3000**

## 📁 What to Expect

When you open the application:

1. **Folder Selection**: The app will default to `/mnt/user-data/uploads` folder
   - Or select `test_data` from the dropdown to see sample data

2. **Essay ID Selection**: Choose `1` to load the butterfly lifecycle essay

3. **View the Interface**:
   - **Left Panel**: List of 15 questions (green border = correct, red = incorrect)
   - **Center Top**: Full essay text about butterfly lifecycle
   - **Center Bottom**: Interactive knowledge graph with nodes and edges
   - **Right Panel**: Lists of all nodes and edges, plus question details

## 🎯 Try These Actions

### Explore the Graph
- Click on any node to highlight it
- Click on any edge type to highlight all edges of that type
- Scroll to zoom in/out
- Drag to pan around

### Review Questions
- Click a question on the left to see its details
- Retrieved nodes will highlight in **yellow** on the graph
- Check if the evaluation is correct (✓) or incorrect (✗)

### Navigate with Lists
- Click any node name in the right panel to focus on it
- Click any edge type to highlight all matching edges
- Selected items turn **red**, highlighted items turn **yellow**

## 📊 Understanding the Data

### Sample Data Included
The `test_data` directory contains:
- **1.json**: Butterfly lifecycle essay with 60 nodes and 83 relations
- **1_results.json**: 15 questions with evaluation results (66.67% accuracy)

### Add Your Own Data
Place files in the format:
- `{id}.json` - Your essay with nodes, edges, and relations
- `{id}_results.json` - Your questions and evaluation results

## 🔧 Troubleshooting

**Port already in use?**
```bash
# Find and kill the process on port 3000
lsof -ti:3000 | xargs kill -9
```

**Need to restart?**
```bash
# Stop with Ctrl+C, then restart
npm start
```

**Graph not showing?**
- Check browser console (F12) for errors
- Ensure internet connection for CDN resources

## 📝 Project Structure

```
/mnt/user-data/outputs/
├── server.js              # Backend API server
├── package.json           # Dependencies
├── README.md              # Full documentation
├── QUICK_START.md         # This file
├── public/
│   ├── index.html         # Main UI
│   └── app.js             # Frontend logic
└── test_data/             # Sample data
    ├── 1.json
    └── 1_results.json
```

## 🎨 Features Showcase

✅ **Multi-folder support** - Browse any directory
✅ **Interactive graph** - Cytoscape.js with Dagre layout
✅ **Question evaluation** - Visual feedback on correctness
✅ **Node highlighting** - See which nodes were retrieved
✅ **Dual selection** - Click graph or lists to navigate
✅ **Responsive design** - Works on different screen sizes

## 🌐 Next Steps

1. **Add more essays**: Place your JSON files in `test_data/` or any folder
2. **Customize styling**: Edit `public/index.html` styles
3. **Enhance functionality**: Modify `public/app.js` for new features
4. **Deploy**: Use PM2 or similar for production deployment

## 💡 Tips

- **Double-click** empty graph space to fit all nodes
- **Scroll down** in the essay section to read the full text
- **Watch the accuracy** shown at the bottom of results
- **Compare questions** by clicking through them sequentially

---

**Happy Exploring! 🦋**

For detailed documentation, see [README.md](README.md)
