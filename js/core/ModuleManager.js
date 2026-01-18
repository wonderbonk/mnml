/**
 * NEXUS Module Manager
 * Handles module loading, switching, and lifecycle
 */

export class ModuleManager {
  constructor(graphEngine) {
    this.graph = graphEngine;
    this.modules = new Map();
    this.activeModule = null;
    this.moduleButtons = document.querySelectorAll('.module-btn');
    this.moduleOverlay = document.getElementById('moduleOverlay');

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.moduleButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const moduleName = btn.dataset.module;
        this.switchModule(moduleName);
      });
    });
  }

  registerModule(name, moduleInstance) {
    this.modules.set(name, moduleInstance);
  }

  async switchModule(moduleName) {
    // Deactivate current module
    if (this.activeModule) {
      const currentModule = this.modules.get(this.activeModule);
      if (currentModule && currentModule.deactivate) {
        currentModule.deactivate();
      }
    }

    // Update button states
    this.moduleButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.module === moduleName);
    });

    // Activate new module
    let module = this.modules.get(moduleName);

    if (!module) {
      // Lazy load module if not loaded
      module = await this.loadModule(moduleName);
      if (module) {
        this.modules.set(moduleName, module);
      }
    }

    if (module) {
      this.activeModule = moduleName;

      if (module.activate) {
        module.activate();
      }

      // Render module UI
      this.renderModuleUI(module);
    }
  }

  async loadModule(moduleName) {
    try {
      const moduleClass = await import(`../modules/${moduleName}Module.js`);
      const ModuleClass = moduleClass.default;
      return new ModuleClass(this.graph);
    } catch (error) {
      console.error(`Failed to load module: ${moduleName}`, error);
      return null;
    }
  }

  renderModuleUI(module) {
    if (!module.renderUI) {
      this.moduleOverlay.classList.remove('active');
      return;
    }

    const content = module.renderUI();
    this.moduleOverlay.innerHTML = content;
    this.moduleOverlay.classList.add('active');

    // Call post-render hook if available
    if (module.onUIRendered) {
      module.onUIRendered();
    }
  }

  getActiveModule() {
    return this.modules.get(this.activeModule);
  }
}

/**
 * Base Module Class
 * All domain modules should extend this
 */
export class BaseModule {
  constructor(graphEngine) {
    this.graph = graphEngine;
    this.isActive = false;
  }

  activate() {
    this.isActive = true;
  }

  deactivate() {
    this.isActive = false;
  }

  renderUI() {
    return '<div>Base module - override renderUI()</div>';
  }

  onUIRendered() {
    // Hook for post-render setup (event listeners, etc.)
  }

  update(deltaTime) {
    // Called each frame when active
  }
}
