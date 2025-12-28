const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const BASE_DIR = process.env.BASE_DIR || 'TestDataSets/results';
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Get list of folders in a directory
app.get('/api/folders', async (req, res) => {
  try {
    const baseDir = BASE_DIR;
    const items = await fs.readdir(baseDir, { withFileTypes: true });
    const folders = items
      .filter(item => item.isDirectory() && !item.name.startsWith('.'))
      .map(item => ({
        name: item.name,
        path: path.join(baseDir, item.name)
      }));
    res.json({ folders, currentPath: baseDir });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get list of file IDs in a folder
app.get('/api/files/:folderPath(*)', async (req, res) => {
  try {
    const folderPath = '/' + req.params.folderPath;
    const files = await fs.readdir(folderPath);
    
    // Find all .json files and extract IDs
    const jsonFiles = files.filter(f => f.endsWith('.json') && !f.endsWith('_results.json'));
    const ids = jsonFiles.map(f => f.replace('.json', '')).sort();
    
    res.json({ ids });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get essay data
app.get('/api/essay/:folderPath(*)/:id', async (req, res) => {
  try {
    const folderPath = '/' + req.params.folderPath;
    const id = req.params.id;
    const filePath = path.join(folderPath, `${id}.json`);
    
    const data = await fs.readFile(filePath, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get results data
app.get('/api/results/:folderPath(*)/:id', async (req, res) => {
  try {
    const folderPath = '/' + req.params.folderPath;
    const id = req.params.id;
    const filePath = path.join(folderPath, `${id}_results.json`);
    
    const data = await fs.readFile(filePath, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
