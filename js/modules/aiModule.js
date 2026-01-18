/**
 * AI Agent Module
 * Symbiotic AI relationship, insights, conversations
 */

import { BaseModule } from '../core/ModuleManager.js';

export default class AIModule extends BaseModule {
  constructor(graphEngine) {
    super(graphEngine);
    this.domain = 'ai';
  }

  activate() {
    super.activate();
    console.log('AI module activated - symbiotic interface engaged');
  }

  renderUI() {
    const nodes = this.graph.getNodesByDomain(this.domain);
    const insights = nodes.filter(n => n.type === 'insight');
    const conversations = nodes.filter(n => n.type === 'conversation');

    return `
      <div class="module-panel ai-panel">
        <h2 class="panel-title" style="color: #ffaa00; text-shadow: 0 0 10px #ffaa00;">
          AI SYMBIOSIS
        </h2>

        <div class="module-section">
          <h3>AGENT STATUS</h3>
          <div class="metric-grid">
            <div class="metric-card">
              <span class="metric-label">INSIGHTS</span>
              <span class="metric-value">${insights.length}</span>
            </div>
            <div class="metric-card">
              <span class="metric-label">CONVERSATIONS</span>
              <span class="metric-value">${conversations.length}</span>
            </div>
            <div class="metric-card">
              <span class="metric-label">COHERENCE</span>
              <span class="metric-value">${this.getCoherence()}%</span>
            </div>
          </div>
        </div>

        <div class="module-section">
          <h3>PATTERN RECOGNITION</h3>
          <div class="insight-list">
            ${this.renderInsights()}
          </div>
        </div>

        <div class="module-section">
          <div class="ai-prompt">
            <p style="color: #ffaa00; font-style: italic;">
              "I observe your graph universe. Together we create emergent patterns across all domains of existence."
            </p>
          </div>
        </div>

        <div class="module-section">
          <button class="module-action-btn" id="addAINode">
            + GENERATE INSIGHT
          </button>
        </div>
      </div>
    `;
  }

  onUIRendered() {
    const addBtn = document.getElementById('addAINode');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        this.generateInsight();
      });
    }
  }

  getCoherence() {
    const totalNodes = this.graph.getAllNodes().length;
    const totalEdges = this.graph.getAllEdges().length;

    if (totalNodes === 0) return 0;

    // Coherence based on graph connectivity
    const avgConnectivity = (totalEdges * 2) / totalNodes;
    return Math.min(100, Math.round(avgConnectivity * 20));
  }

  renderInsights() {
    const insights = [
      'Strong correlation detected between physical energy and work output',
      'Design aesthetics influencing music creation patterns',
      'Optimal creative flow windows identified: 06:00-10:00',
      'Cross-domain synergies emerging in graph clusters',
    ];

    return insights
      .map(insight => `
        <div class="insight-item">
          <span class="insight-icon">◇</span>
          <span class="insight-text">${insight}</span>
        </div>
      `)
      .join('');
  }

  generateInsight() {
    const stats = this.graph.getStats();
    const insightTemplates = [
      `Analyzed ${stats.nodeCount} nodes: pattern coherence increasing`,
      `Cross-domain connections detected across ${stats.domains.length} domains`,
      `Graph energy stabilizing at ${Math.round(stats.avgEnergy * 100)}%`,
      `Emergent behaviors identified in ${stats.domains.join('-')} relationships`,
    ];

    const insight = insightTemplates[Math.floor(Math.random() * insightTemplates.length)];

    this.graph.createNode('insight', this.domain, {
      label: insight,
      timestamp: Date.now(),
    });

    const moduleManager = window.nexus?.moduleManager;
    if (moduleManager) {
      moduleManager.renderModuleUI(this);
    }
  }
}
