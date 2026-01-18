/**
 * NEXUS - Personal Operating System
 * Main entry point and initialization
 */

import { GraphEngine } from './core/GraphEngine.js';
import { GraphRenderer } from './core/GraphRenderer.js';
import { Terminal } from './core/Terminal.js';
import { ModuleManager } from './core/ModuleManager.js';

// Import modules
import GraphModule from './modules/graphModule.js';
import PhysicalModule from './modules/physicalModule.js';
import WorkModule from './modules/workModule.js';
import DesignModule from './modules/designModule.js';
import MusicModule from './modules/musicModule.js';
import AIModule from './modules/aiModule.js';

class NEXUS {
  constructor() {
    this.graphEngine = null;
    this.renderer = null;
    this.terminal = null;
    this.moduleManager = null;

    this.lastFrameTime = 0;
    this.isRunning = false;
  }

  async initialize() {
    console.log('%c NEXUS INITIALIZING ', 'background: #00ffff; color: #000; font-size: 16px; font-weight: bold;');

    // Initialize graph engine
    this.graphEngine = new GraphEngine();
    console.log('✓ Graph engine online');

    // Initialize renderer
    const canvas = document.getElementById('graphCanvas');
    this.renderer = new GraphRenderer(canvas, this.graphEngine);
    console.log('✓ Holographic renderer initialized');

    // Initialize terminal
    this.terminal = new Terminal(this.graphEngine);
    console.log('✓ Terminal interface ready');

    // Initialize module manager
    this.moduleManager = new ModuleManager(this.graphEngine);
    console.log('✓ Module system loaded');

    // Register modules
    this.moduleManager.registerModule('graph', new GraphModule(this.graphEngine));
    this.moduleManager.registerModule('physical', new PhysicalModule(this.graphEngine));
    this.moduleManager.registerModule('work', new WorkModule(this.graphEngine));
    this.moduleManager.registerModule('design', new DesignModule(this.graphEngine));
    this.moduleManager.registerModule('music', new MusicModule(this.graphEngine));
    this.moduleManager.registerModule('ai', new AIModule(this.graphEngine));

    console.log('✓ All modules registered');

    // Load persisted data
    this.loadPersistedData();

    // Setup UI
    this.setupUI();

    // Setup graph event listeners
    this.setupGraphListeners();

    // Activate default module
    this.moduleManager.switchModule('graph');

    // Start render loop
    this.start();

    // Seed initial data if empty
    if (this.graphEngine.getAllNodes().length === 0) {
      console.log('Seeding initial graph data...');
      this.terminal.seedGraph();
    }

    console.log('%c NEXUS ONLINE ', 'background: #00ff41; color: #000; font-size: 16px; font-weight: bold;');

    // Welcome message
    setTimeout(() => {
      this.terminal.addLine('Personal Operating System initialized', false);
      this.terminal.addLine('Type /help for commands or chat naturally with AI', false);
    }, 500);
  }

  setupUI() {
    // Update system time
    this.updateSystemTime();
    setInterval(() => this.updateSystemTime(), 1000);

    // Setup node detail panel
    this.setupDetailPanel();
  }

  updateSystemTime() {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0]; // HH:MM:SS
    const timeEl = document.getElementById('systemTime');
    if (timeEl) {
      timeEl.textContent = timeStr;
    }
  }

  setupDetailPanel() {
    const detailPanel = document.getElementById('detailPanel');
    const closeBtn = document.getElementById('closeDetail');
    const detailTitle = document.getElementById('detailTitle');
    const detailContent = document.getElementById('detailContent');

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        detailPanel.classList.add('hidden');
      });
    }

    // Listen for node selection
    window.addEventListener('nodeSelected', (e) => {
      const node = e.detail;

      detailTitle.textContent = node.data.label || node.type;

      const connections = this.graphEngine.getNodeEdges(node.id).length;
      const connectedNodes = this.graphEngine.getConnectedNodes(node.id);

      detailContent.innerHTML = `
        <div class="node-detail">
          <div class="detail-row">
            <span class="detail-label">ID:</span>
            <span class="detail-value">${node.id.substr(0, 12)}...</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Type:</span>
            <span class="detail-value">${node.type}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Domain:</span>
            <span class="detail-value">${node.domain}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Connections:</span>
            <span class="detail-value">${connections}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Energy:</span>
            <span class="detail-value">${Math.round(node.metadata.energy * 100)}%</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Created:</span>
            <span class="detail-value">${new Date(node.metadata.created).toLocaleString()}</span>
          </div>

          ${connectedNodes.length > 0 ? `
            <div class="detail-section">
              <div class="detail-label">Connected Nodes:</div>
              <div class="connected-list">
                ${connectedNodes.map(n => `
                  <div class="connected-item">${n.domain}:${n.data.label || n.type}</div>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      `;

      detailPanel.classList.remove('hidden');
    });
  }

  setupGraphListeners() {
    this.graphEngine.addListener((event, data) => {
      // Update stats UI
      this.updateStats();

      // Log events to console
      if (event === 'nodeCreated') {
        console.log(`Node created: ${data.domain}:${data.type}`);
      } else if (event === 'edgeCreated') {
        console.log(`Edge created: ${data.type}`);
      }
    });
  }

  updateStats() {
    const stats = this.graphEngine.getStats();

    const nodeCountEl = document.getElementById('nodeCount');
    const edgeCountEl = document.getElementById('edgeCount');
    const graphEnergyEl = document.getElementById('graphEnergy');

    if (nodeCountEl) nodeCountEl.textContent = stats.nodeCount;
    if (edgeCountEl) edgeCountEl.textContent = stats.edgeCount;
    if (graphEnergyEl) graphEnergyEl.textContent = Math.round(stats.avgEnergy * 100) + '%';
  }

  loadPersistedData() {
    try {
      const savedData = localStorage.getItem('nexus_graph');
      if (savedData) {
        const data = JSON.parse(savedData);
        this.graphEngine.fromJSON(data);
        console.log('✓ Loaded persisted graph data');
      }
    } catch (error) {
      console.warn('Failed to load persisted data:', error);
    }
  }

  persistData() {
    try {
      const data = this.graphEngine.toJSON();
      localStorage.setItem('nexus_graph', JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to persist data:', error);
    }
  }

  start() {
    this.isRunning = true;
    this.lastFrameTime = performance.now();

    // Start render loop
    this.renderer.animate();

    // Start physics loop
    this.physicsLoop();

    // Auto-save every 30 seconds
    setInterval(() => this.persistData(), 30000);
  }

  physicsLoop() {
    if (!this.isRunning) return;

    const currentTime = performance.now();
    const deltaTime = Math.min((currentTime - this.lastFrameTime) / 1000, 0.1); // Cap at 100ms
    this.lastFrameTime = currentTime;

    // Apply physics
    this.graphEngine.applyPhysics(deltaTime);

    // Update active module
    const activeModule = this.moduleManager.getActiveModule();
    if (activeModule && activeModule.update) {
      activeModule.update(deltaTime);
    }

    // Continue loop
    requestAnimationFrame(() => this.physicsLoop());
  }

  stop() {
    this.isRunning = false;
    this.persistData();
  }
}

// Initialize NEXUS on page load
window.addEventListener('DOMContentLoaded', async () => {
  window.nexus = new NEXUS();
  await window.nexus.initialize();
});

// Save data before page unload
window.addEventListener('beforeunload', () => {
  if (window.nexus) {
    window.nexus.persistData();
  }
});
