/**
 * Design Projects Module
 * Creative work, portfolio, inspiration, iterations
 */

import { BaseModule } from '../core/ModuleManager.js';

export default class DesignModule extends BaseModule {
  constructor(graphEngine) {
    super(graphEngine);
    this.domain = 'design';
  }

  activate() {
    super.activate();
    console.log('Design module activated');
  }

  renderUI() {
    const nodes = this.graph.getNodesByDomain(this.domain);

    return `
      <div class="module-panel design-panel">
        <h2 class="panel-title glow-magenta">DESIGN PROJECTS</h2>

        <div class="module-section">
          <h3>CREATIVE PORTFOLIO</h3>
          <div class="metric-grid">
            <div class="metric-card">
              <span class="metric-label">PROJECTS</span>
              <span class="metric-value">${nodes.filter(n => n.type === 'project').length}</span>
            </div>
            <div class="metric-card">
              <span class="metric-label">INSPIRATION</span>
              <span class="metric-value">${nodes.filter(n => n.type === 'inspiration').length}</span>
            </div>
          </div>
        </div>

        <div class="module-section">
          <div class="empty-state">
            Design module initialized. Expand with your creative projects.
          </div>
        </div>

        <div class="module-section">
          <button class="module-action-btn" id="addDesignNode">
            + NEW PROJECT
          </button>
        </div>
      </div>
    `;
  }

  onUIRendered() {
    const addBtn = document.getElementById('addDesignNode');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        this.graph.createNode('project', this.domain, {
          label: 'New Design Project',
        });

        const moduleManager = window.nexus?.moduleManager;
        if (moduleManager) {
          moduleManager.renderModuleUI(this);
        }
      });
    }
  }
}
