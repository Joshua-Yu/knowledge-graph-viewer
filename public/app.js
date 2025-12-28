// Global state
let cy = null;
let currentEssayData = null;
let currentResultsData = null;
let selectedFolder = null;
let currentLayout = 'dagre';
let isMaximized = false;

// API base URL
const API_BASE = 'http://localhost:3000/api';

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  initializeCytoscape();
  loadFolders();
  setupEventListeners();
  setupGraphControls();
});

// Initialize Cytoscape
function initializeCytoscape() {
  cy = cytoscape({
    container: document.getElementById('cy'),
    style: [
      {
        selector: 'node',
        style: {
          'label': 'data(label)',
          'background-color': '#89e1cb',
          'color': '#2c3e50',
          'text-valign': 'center',
          'text-halign': 'center',
          'font-size': '10px',
          'font-family': 'Arial Narrow',  
          'font-weight': 200,  
          'width': 'label',
          'height': 'label',
          'padding': '8px',
          'shape': 'roundrectangle',
          'text-wrap': 'wrap',
          'text-max-width': '80px',
          'border-width': 1,
          'border-color': '#2980b9',
          'transition-property': 'background-color, border-color, opacity',
          'transition-duration': '0.3s'
        }
      },
      {
        selector: 'node.highlighted',
        style: {
          'background-color': '#ffc107',
          'border-color': '#ff9800',
          'border-width': 2,
          'font-weight': 'bold',
          'font-family': 'Arial Narrow',  
          'font-weight': 200,  
          'opacity': 1,
          'z-index': 10
        }
      },
      {
        selector: 'node.dimmed',
        style: {
          'opacity': 0.2,
          'background-color': '#bdc3c7',
          'border-color': '#95a5a6',
          'text-opacity': 0.3
        }
      },
      {
        selector: 'node.selected',
        style: {
          'background-color': '#e74c3c',
          'border-color': '#c0392b',
          'border-width': 2
        }
      },
      {
        selector: 'edge',
        style: {
          'width': 1,
          'line-color': '#95a5a6',
          'target-arrow-color': '#95a5a6',
          'target-arrow-shape': 'triangle',
          'curve-style': 'bezier',
          'label': 'data(label)',
          'font-size': '8px',
          'font-family': 'Arial Narrow',  
          'font-weight': 200,  
          'text-rotation': 'autorotate',
          'text-margin-y': -10,
          'arrow-scale': 1.2,
          'transition-property': 'line-color, target-arrow-color, opacity, width',
          'transition-duration': '0.3s'
        }
      },
      {
        selector: 'edge.highlighted',
        style: {
          'line-color': '#ffc107',
          'target-arrow-color': '#ffc107',
          'width': 2,
          'font-weight': 'bold',
          'font-family': 'Arial Narrow',  
          'font-weight': 200,  
          'opacity': 1,
          'z-index': 10
        }
      },
      {
        selector: 'edge.dimmed',
        style: {
          'opacity': 0.15,
          'line-color': '#d5d8dc',
          'target-arrow-color': '#d5d8dc',
          'text-opacity': 0.2
        }
      },
      {
        selector: 'edge.selected',
        style: {
          'line-color': '#e74c3c',
          'target-arrow-color': '#e74c3c',
          'width': 2
        }
      }
    ],
    layout: {
      name: 'dagre',
      rankDir: 'TB',
      nodeSep: 50,
      rankSep: 80,
      padding: 20
    }
  });

  // Click event for nodes
  cy.on('tap', 'node', function(evt) {
    const node = evt.target;
    selectNodeInList(node.id());
  });

  // Click event for edges
  cy.on('tap', 'edge', function(evt) {
    const edge = evt.target;
    selectEdgeInList(edge.id());
  });
}

// Setup event listeners
function setupEventListeners() {
  document.getElementById('folderSelect').addEventListener('change', handleFolderChange);
  document.getElementById('idSelect').addEventListener('change', handleIdChange);
}

// Setup graph controls
function setupGraphControls() {
  // Layout buttons
  document.getElementById('layoutDagre').addEventListener('click', () => applyLayout('dagre'));
  document.getElementById('layoutCose').addEventListener('click', () => applyLayout('cose'));
  document.getElementById('layoutCircle').addEventListener('click', () => applyLayout('circle'));
  document.getElementById('layoutGrid').addEventListener('click', () => applyLayout('grid'));
  document.getElementById('layoutConcentric').addEventListener('click', () => applyLayout('concentric'));
  
  // Fit button
  document.getElementById('fitBtn').addEventListener('click', () => {
    if (cy) {
      cy.fit(null, 50);
    }
  });
  
  // Maximize/restore button
  document.getElementById('maximizeBtn').addEventListener('click', toggleMaximize);
  
  // Keyboard shortcut: ESC to exit maximized mode
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMaximized) {
      toggleMaximize();
    }
  });
  
  // Set default active layout button
  document.getElementById('layoutDagre').classList.add('active');
}

// Apply layout to graph
function applyLayout(layoutName) {
  if (!cy) return;
  
  currentLayout = layoutName;
  
  // Update active button
  document.querySelectorAll('.btn-control').forEach(btn => btn.classList.remove('active'));
  document.getElementById(`layout${layoutName.charAt(0).toUpperCase() + layoutName.slice(1)}`).classList.add('active');
  
  // Define layout options for each type
  const layoutOptions = {
    dagre: {
      name: 'dagre',
      rankDir: 'TB',
      nodeSep: 50,
      rankSep: 80,
      padding: 20,
      animate: true,
      animationDuration: 500
    },
    cose: {
      name: 'cose',
      animate: true,
      animationDuration: 500,
      nodeRepulsion: 20000,        // Increased from 8000 (push nodes apart more)
      idealEdgeLength: 150,        // Increased from 100 (longer edges)
      edgeElasticity: 100,
      nestingFactor: 5,
      gravity: 40,                 // Decreased from 80 (less pull to center)
      numIter: 1000,
      padding: 50                  // Increased from 30 (more padding around)
    },
    circle: {
      name: 'circle',
      animate: true,
      animationDuration: 500,
      padding: 50,
      avoidOverlap: true
    },
    grid: {
      name: 'grid',
      animate: true,
      animationDuration: 500,
      padding: 30,
      avoidOverlap: true,
      avoidOverlapPadding: 10
    },
    concentric: {
      name: 'concentric',
      animate: true,
      animationDuration: 500,
      padding: 30,
      minNodeSpacing: 50,
      avoidOverlap: true
    }
  };
  
  cy.layout(layoutOptions[layoutName]).run();
}

// Toggle maximize/restore graph panel
function toggleMaximize() {
  const centerPanel = document.querySelector('.center-panel');
  const maximizeBtn = document.getElementById('maximizeBtn');
  
  isMaximized = !isMaximized;
  
  if (isMaximized) {
    centerPanel.classList.add('maximized');
    maximizeBtn.textContent = '⊗';
    maximizeBtn.title = 'Restore (ESC)';
  } else {
    centerPanel.classList.remove('maximized');
    maximizeBtn.textContent = '⛶';
    maximizeBtn.title = 'Maximize Graph';
  }
  
  // Resize Cytoscape after transition
  setTimeout(() => {
    if (cy) {
      cy.resize();
      cy.fit(null, 50);
    }
  }, 300);
}

// Load folders
async function loadFolders() {
  try {
    const response = await fetch(`${API_BASE}/folders`);
    const data = await response.json();
    
    const folderSelect = document.getElementById('folderSelect');
    folderSelect.innerHTML = '<option value="">Select a folder...</option>';
    
    data.folders.forEach(folder => {
      const option = document.createElement('option');
      option.value = folder.path;
      option.textContent = folder.name;
      folderSelect.appendChild(option);
    });

    // Also add /mnt/user-data/uploads as default option
    const uploadsOption = document.createElement('option');
    uploadsOption.value = '/mnt/user-data/uploads';
    uploadsOption.textContent = 'uploads';
    uploadsOption.selected = true;
    folderSelect.appendChild(uploadsOption);
    
    // Trigger change to load files
    folderSelect.dispatchEvent(new Event('change'));
  } catch (error) {
    showError('Failed to load folders: ' + error.message);
  }
}

// Handle folder selection change
async function handleFolderChange(event) {
  const folderPath = event.target.value;
  selectedFolder = folderPath;
  
  if (!folderPath) {
    document.getElementById('idSelect').disabled = true;
    return;
  }

  try {
    // Encode the folder path for URL
    const encodedPath = folderPath.substring(1); // Remove leading slash
    const response = await fetch(`${API_BASE}/files/${encodedPath}`);
    const data = await response.json();
    
    const idSelect = document.getElementById('idSelect');
    idSelect.innerHTML = '<option value="">Select an ID...</option>';
    idSelect.disabled = false;
    
    data.ids.forEach(id => {
      const option = document.createElement('option');
      option.value = id;
      option.textContent = id;
      idSelect.appendChild(option);
    });
    
    // Auto-select first ID if available
    if (data.ids.length > 0) {
      idSelect.value = data.ids[0];
      idSelect.dispatchEvent(new Event('change'));
    }
  } catch (error) {
    showError('Failed to load files: ' + error.message);
  }
}

// Handle ID selection change
async function handleIdChange(event) {
  const id = event.target.value;
  
  if (!id || !selectedFolder) return;

  try {
    await Promise.all([
      loadEssayData(selectedFolder, id),
      loadResultsData(selectedFolder, id)
    ]);
  } catch (error) {
    showError('Failed to load data: ' + error.message);
  }
}

// Load essay data
async function loadEssayData(folderPath, id) {
  try {
    const encodedPath = folderPath.substring(1);
    const response = await fetch(`${API_BASE}/essay/${encodedPath}/${id}`);
    currentEssayData = await response.json();
    
    // Display essay
    const essayContent = currentEssayData.essay.replace(/```/g, '').trim();
    document.getElementById('essayContent').textContent = essayContent;
    
    // Build graph
    buildGraph(currentEssayData);
    
    // Populate node and edge lists
    populateNodesList(currentEssayData.nodes);
    populateEdgesList(currentEssayData.edges);
  } catch (error) {
    throw new Error('Failed to load essay: ' + error.message);
  }
}

// Load results data
async function loadResultsData(folderPath, id) {
  try {
    const encodedPath = folderPath.substring(1);
    const response = await fetch(`${API_BASE}/results/${encodedPath}/${id}`);
    currentResultsData = await response.json();
    
    // Calculate accuracy
    const questions = currentResultsData.filter(item => item.correct_answer);
    const correctCount = questions.filter(q => q.evaluation === 1).length;
    const accuracy = questions.length > 0 ? (correctCount / questions.length * 100).toFixed(2) : 0;
    
    // Display accuracy
    const accuracyDisplay = document.getElementById('accuracyDisplay');
    const accuracyValue = document.getElementById('accuracyValue');
    accuracyDisplay.style.display = 'flex';
    accuracyValue.textContent = `${accuracy}%`;
    
    // Color code accuracy
    if (accuracy >= 80) {
      accuracyValue.style.background = '#28a745'; // Green
    } else if (accuracy >= 60) {
      accuracyValue.style.background = '#ffc107'; // Yellow
      accuracyValue.style.color = '#000';
    } else {
      accuracyValue.style.background = '#dc3545'; // Red
    }
    
    // Display questions
    displayQuestions(currentResultsData);
  } catch (error) {
    throw new Error('Failed to load results: ' + error.message);
  }
}

// Build graph from essay data
function buildGraph(data) {
  if (!cy) return;
  
  cy.elements().remove();
  
  // Add nodes
  const nodes = data.nodes.map(node => ({
    data: { id: node, label: node }
  }));
  
  // Add edges
  const edges = data.relations.map((rel, idx) => ({
    data: {
      id: `edge-${idx}`,
      source: rel[0],
      target: rel[2],
      label: rel[1],
      edgeType: rel[1]
    }
  }));
  
  cy.add([...nodes, ...edges]);
  
  // Apply current layout
  applyLayout(currentLayout);
}

// Populate nodes list
function populateNodesList(nodes) {
  const nodesList = document.getElementById('nodesList');
  nodesList.innerHTML = '';
  
  nodes.sort().forEach(node => {
    const item = document.createElement('div');
    item.className = 'listbox-item';
    item.textContent = node;
    item.dataset.nodeId = node;
    item.addEventListener('click', () => selectNode(node));
    nodesList.appendChild(item);
  });
}

// Populate edges list
function populateEdgesList(edges) {
  const edgesList = document.getElementById('edgesList');
  edgesList.innerHTML = '';
  
  edges.sort().forEach((edge, idx) => {
    const item = document.createElement('div');
    item.className = 'listbox-item';
    item.textContent = edge;
    item.dataset.edgeType = edge;
    item.addEventListener('click', () => selectEdge(edge));
    edgesList.appendChild(item);
  });
}

// Select node
function selectNode(nodeId) {
  // Clear previous selections and dimmed state
  cy.elements().removeClass('selected dimmed');
  document.querySelectorAll('#nodesList .listbox-item').forEach(item => {
    item.classList.remove('selected');
  });
  
  // Highlight node in graph
  const node = cy.getElementById(nodeId);
  if (node.length > 0) {
    node.addClass('selected');
    cy.center(node);
    cy.animate({
      zoom: 1.5,
      center: { eles: node }
    }, {
      duration: 500
    });
  }
  
  // Highlight in list
  const listItem = document.querySelector(`#nodesList .listbox-item[data-node-id="${nodeId}"]`);
  if (listItem) {
    listItem.classList.add('selected');
    listItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

// Select edge
function selectEdge(edgeType) {
  // Clear previous selections and dimmed state
  cy.elements().removeClass('selected dimmed');
  document.querySelectorAll('#edgesList .listbox-item').forEach(item => {
    item.classList.remove('selected');
  });
  
  // Highlight edges in graph
  const edges = cy.edges(`[edgeType = "${edgeType}"]`);
  if (edges.length > 0) {
    edges.addClass('selected');
    cy.fit(edges, 50);
  }
  
  // Highlight in list
  const listItem = document.querySelector(`#edgesList .listbox-item[data-edge-type="${edgeType}"]`);
  if (listItem) {
    listItem.classList.add('selected');
    listItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

// Select node from list (when clicking on graph)
function selectNodeInList(nodeId) {
  // Clear dimmed state
  cy.elements().removeClass('dimmed');
  
  document.querySelectorAll('#nodesList .listbox-item').forEach(item => {
    item.classList.remove('selected');
  });
  
  const listItem = document.querySelector(`#nodesList .listbox-item[data-node-id="${nodeId}"]`);
  if (listItem) {
    listItem.classList.add('selected');
    listItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

// Select edge from list (when clicking on graph)
function selectEdgeInList(edgeId) {
  // Clear dimmed state
  cy.elements().removeClass('dimmed');
  
  const edge = cy.getElementById(edgeId);
  if (edge.length > 0) {
    const edgeType = edge.data('edgeType');
    
    document.querySelectorAll('#edgesList .listbox-item').forEach(item => {
      item.classList.remove('selected');
    });
    
    const listItem = document.querySelector(`#edgesList .listbox-item[data-edge-type="${edgeType}"]`);
    if (listItem) {
      listItem.classList.add('selected');
      listItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }
}

// Display questions
function displayQuestions(results) {
  const questionsList = document.getElementById('questionsList');
  questionsList.innerHTML = '';
  
  // Filter out the accuracy summary
  const questions = results.filter(item => item.correct_answer);
  
  questions.forEach((question, idx) => {
    const item = document.createElement('div');
    item.className = `question-item ${question.evaluation === 1 ? 'correct' : 'incorrect'}`;
    item.textContent = `Q${idx + 1}: ${question.correct_answer}`;
    item.dataset.questionIndex = idx;
    item.addEventListener('click', () => selectQuestion(idx, question));
    questionsList.appendChild(item);
  });
}

// Select question
function selectQuestion(idx, question) {
  // Clear previous selections
  document.querySelectorAll('.question-item').forEach(item => {
    item.classList.remove('selected');
  });
  
  // Highlight selected question
  const selectedItem = document.querySelector(`.question-item[data-question-index="${idx}"]`);
  if (selectedItem) {
    selectedItem.classList.add('selected');
  }
  
  // Display question details
  displayQuestionDetails(question);
  
  // Highlight retrieved nodes and edges on graph
  highlightRetrievedNodes(question.retrieved_nodes, question.retrieved_context);
}

// Display question details
function displayQuestionDetails(question) {
  const detailsDiv = document.getElementById('questionDetails');
  if (!detailsDiv) return;
  detailsDiv.style.maxHeight = '400px';
  detailsDiv.style.overflowY = 'auto';
  
  // Parse context to get detailed information
  const contextData = parseRetrievedContext(question.retrieved_context);
  
  // Create node chips
  const nodesHTML = Array.from(contextData.nodes)
    .map(node => `<span class="node-chip">${node}</span>`)
    .join('');
  
  // Create edge info
  let edgesHTML = '';
  if (contextData.edges.length > 0) {
    const edgesList = contextData.edges.map((e, idx) =>
      `<div style="margin-bottom: 4px;">${idx + 1}. ${e.source} → <span style="color: #3498db;">${e.edgeType}</span> → ${e.target}</div>`
    ).join('');
    
    edgesHTML = `
      <div class="retrieved-nodes" style="margin-top: 10px;">
        <div class="label">Retrieved Edges: ${contextData.edges.length}</div>
        <div style="font-size: 11px; color: #666; margin-top: 5px;">
          ${edgesList}
        </div>
      </div>
    `;
  }
  
  const evaluationText = question.evaluation === 1 ? 
    '<span style="color: #28a745; font-weight: bold;">✓ Correct</span>' : 
    '<span style="color: #dc3545; font-weight: bold;">✗ Incorrect</span>';
  
  detailsDiv.innerHTML = `
    <h3>Question Details</h3>
    <p><strong>Correct Answer:</strong> ${question.correct_answer}</p>
    <p><strong>Evaluation:</strong> ${evaluationText}</p>
    <div class="retrieved-nodes">
      <div class="label">Retrieved Nodes: ${contextData.nodes.size}</div>
      ${nodesHTML}
    </div>
    ${edgesHTML}
  `;
}

// Parse retrieved context to extract nodes and edges
function parseRetrievedContext(contextString) {
  const result = {
    nodes: new Set(),
    edges: []
  };
  
  if (!contextString) return result;
  
  const lines = contextString.split('\n');
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Extract node names from "Node: node_name" format
    if (trimmedLine.startsWith('Node:')) {
      const nodeName = trimmedLine.substring(5).trim();
      if (nodeName) {
        result.nodes.add(nodeName);
      }
    } else if (trimmedLine) {
      // Parse edge triples: "head_node edge_type tail_node"
      const parts = trimmedLine.split(/\s+/);
      if (parts.length >= 3) {
        const head = parts[0];
        const edge = parts[1];
        const tail = parts[2];
        
        // Add nodes from edge
        result.nodes.add(head);
        result.nodes.add(tail);
        
        // Add edge triple
        result.edges.push({
          source: head,
          edgeType: edge,
          target: tail
        });
      }
    }
  }
  
  return result;
}

// Highlight retrieved nodes and edges from context
function highlightRetrievedNodes(retrievedNodes, retrievedContext) {
  // Parse the retrieved context to get nodes and edges
  const contextData = parseRetrievedContext(retrievedContext);
  
  // Combine retrieved nodes with context nodes
  const allNodes = new Set([...retrievedNodes, ...contextData.nodes]);
  
  // Clear previous highlights and remove dimmed class
  cy.elements().removeClass('highlighted dimmed');
  document.querySelectorAll('#nodesList .listbox-item').forEach(item => {
    item.classList.remove('highlighted');
  });
  
  // First, dim all elements
  cy.elements().addClass('dimmed');
  
  // Highlight nodes in graph
  allNodes.forEach(nodeId => {
    const node = cy.getElementById(nodeId);
    if (node.length > 0) {
      node.removeClass('dimmed').addClass('highlighted');
    }
    
    // Highlight in list
    const listItem = document.querySelector(`#nodesList .listbox-item[data-node-id="${nodeId}"]`);
    if (listItem) {
      listItem.classList.add('highlighted');
    }
  });
  
  // Highlight edges from context
  contextData.edges.forEach(edgeInfo => {
    const { source, edgeType, target } = edgeInfo;
    
    // Find edges that match the triple
    cy.edges().forEach(edge => {
      const edgeData = edge.data();
      if (edgeData.source === source && 
          edgeData.target === target && 
          edgeData.edgeType === edgeType) {
        edge.removeClass('dimmed').addClass('highlighted');
      }
    });
  });
  
  // Fit to highlighted elements
  const highlightedElements = cy.elements('.highlighted');
  if (highlightedElements.length > 0) {
    cy.animate({
      fit: { eles: highlightedElements, padding: 100 }
    }, {
      duration: 500
    });
  }
}

// Show error message
function showError(message) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error';
  errorDiv.textContent = message;
  document.querySelector('.container').prepend(errorDiv);
  
  setTimeout(() => errorDiv.remove(), 5000);
}
