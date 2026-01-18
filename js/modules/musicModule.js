/**
 * Music Creation Module
 * Tracks, samples, production stages, releases
 */

import { BaseModule } from '../core/ModuleManager.js';

export default class MusicModule extends BaseModule {
  constructor(graphEngine) {
    super(graphEngine);
    this.domain = 'music';
  }

  activate() {
    super.activate();
    console.log('Music module activated');
  }

  renderUI() {
    const nodes = this.graph.getNodesByDomain(this.domain);
    const tracks = nodes.filter(n => n.type === 'track');
    const samples = nodes.filter(n => n.type === 'sample');

    return `
      <div class="module-panel music-panel">
        <h2 class="panel-title" style="color: #9d4edd; text-shadow: 0 0 10px #9d4edd;">
          MUSIC CREATION
        </h2>

        <div class="module-section">
          <h3>STUDIO</h3>
          <div class="metric-grid">
            <div class="metric-card">
              <span class="metric-label">TRACKS</span>
              <span class="metric-value">${tracks.length}</span>
            </div>
            <div class="metric-card">
              <span class="metric-label">SAMPLES</span>
              <span class="metric-value">${samples.length}</span>
            </div>
            <div class="metric-card">
              <span class="metric-label">COSMIC VIBE</span>
              <span class="metric-value">∞</span>
            </div>
          </div>
        </div>

        <div class="module-section">
          <div class="empty-state">
            Music module ready. Add tracks and samples to begin creation.
          </div>
        </div>

        <div class="module-section">
          <button class="module-action-btn" id="addMusicNode">
            + NEW TRACK
          </button>
        </div>
      </div>
    `;
  }

  onUIRendered() {
    const addBtn = document.getElementById('addMusicNode');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        const trackNames = ['Cosmic Drift', 'Neon Dreams', 'Digital Sunrise', 'Void Walker'];
        const trackName = trackNames[Math.floor(Math.random() * trackNames.length)];

        this.graph.createNode('track', this.domain, {
          label: trackName,
        });

        const moduleManager = window.nexus?.moduleManager;
        if (moduleManager) {
          moduleManager.renderModuleUI(this);
        }
      });
    }
  }
}
