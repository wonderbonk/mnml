/**
 * Physical Life Module
 * Tracks body metrics, activities, locations, energy
 */

import { BaseModule } from '../core/ModuleManager.js';

export default class PhysicalModule extends BaseModule {
  constructor(graphEngine) {
    super(graphEngine);
    this.domain = 'physical';
  }

  activate() {
    super.activate();
    console.log('Physical module activated');
  }

  renderUI() {
    const nodes = this.graph.getNodesByDomain(this.domain);

    return `
      <div class="module-panel physical-panel">
        <h2 class="panel-title glow-cyan">PHYSICAL LIFE</h2>

        <div class="module-section">
          <h3>METRICS</h3>
          <div class="metric-grid">
            <div class="metric-card">
              <span class="metric-label">ENERGY</span>
              <span class="metric-value">${this.getAverageEnergy()}%</span>
            </div>
            <div class="metric-card">
              <span class="metric-label">NODES</span>
              <span class="metric-value">${nodes.length}</span>
            </div>
            <div class="metric-card">
              <span class="metric-label">STATUS</span>
              <span class="metric-value">OPTIMAL</span>
            </div>
          </div>
        </div>

        <div class="module-section">
          <h3>RECENT ACTIVITIES</h3>
          <div class="activity-list">
            ${this.renderActivities(nodes)}
          </div>
        </div>

        <div class="module-section">
          <button class="module-action-btn" id="addPhysicalNode">
            + ADD ACTIVITY
          </button>
        </div>
      </div>
    `;
  }

  onUIRendered() {
    const addBtn = document.getElementById('addPhysicalNode');
    if (addBtn) {
      addBtn.addEventListener('click', () => this.addActivity());
    }
  }

  getAverageEnergy() {
    const nodes = this.graph.getNodesByDomain(this.domain);
    if (nodes.length === 0) return 0;

    const avg = nodes.reduce((sum, n) => sum + n.metadata.energy, 0) / nodes.length;
    return Math.round(avg * 100);
  }

  renderActivities(nodes) {
    if (nodes.length === 0) {
      return '<div class="empty-state">No activities yet. Add one to get started.</div>';
    }

    return nodes
      .slice(0, 5)
      .map(node => `
        <div class="activity-item" data-node-id="${node.id}">
          <span class="activity-icon">◆</span>
          <span class="activity-label">${node.data.label || node.type}</span>
          <span class="activity-energy" style="width: ${node.metadata.energy * 100}%"></span>
        </div>
      `)
      .join('');
  }

  addActivity() {
    const activities = ['Morning Run', 'Workout', 'Meditation', 'Walk', 'Yoga', 'Stretch'];
    const activity = activities[Math.floor(Math.random() * activities.length)];

    this.graph.createNode('activity', this.domain, {
      label: activity,
      timestamp: Date.now(),
    });

    // Re-render UI
    const moduleManager = window.nexus?.moduleManager;
    if (moduleManager) {
      moduleManager.renderModuleUI(this);
    }
  }
}
