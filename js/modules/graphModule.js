/**
 * Graph Module
 * Main graph visualization view (default)
 */

import { BaseModule } from '../core/ModuleManager.js';

export default class GraphModule extends BaseModule {
  constructor(graphEngine) {
    super(graphEngine);
    this.domain = 'graph';
  }

  activate() {
    super.activate();
    console.log('Graph module activated - full visualization mode');
  }

  deactivate() {
    super.deactivate();
  }

  renderUI() {
    // Graph module has no overlay UI - just shows the full visualization
    return '';
  }
}
