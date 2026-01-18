/**
 * Work Life Module
 * Projects, tasks, time tracking, deliverables
 */

import { BaseModule } from '../core/ModuleManager.js';

export default class WorkModule extends BaseModule {
  constructor(graphEngine) {
    super(graphEngine);
    this.domain = 'work';
  }

  activate() {
    super.activate();
    console.log('Work module activated');
  }

  renderUI() {
    const nodes = this.graph.getNodesByDomain(this.domain);
    const projects = nodes.filter(n => n.type === 'project');
    const tasks = nodes.filter(n => n.type === 'task');

    return `
      <div class="module-panel work-panel">
        <h2 class="panel-title glow-green">WORK DOMAIN</h2>

        <div class="module-section">
          <h3>OVERVIEW</h3>
          <div class="metric-grid">
            <div class="metric-card">
              <span class="metric-label">PROJECTS</span>
              <span class="metric-value">${projects.length}</span>
            </div>
            <div class="metric-card">
              <span class="metric-label">TASKS</span>
              <span class="metric-value">${tasks.length}</span>
            </div>
            <div class="metric-card">
              <span class="metric-label">COMPLETION</span>
              <span class="metric-value">${this.getCompletionRate()}%</span>
            </div>
          </div>
        </div>

        <div class="module-section">
          <h3>ACTIVE PROJECTS</h3>
          <div class="project-list">
            ${this.renderProjects(projects)}
          </div>
        </div>

        <div class="module-section">
          <h3>TASKS</h3>
          <div class="task-list">
            ${this.renderTasks(tasks)}
          </div>
        </div>

        <div class="module-section">
          <button class="module-action-btn" id="addWorkNode">
            + NEW TASK
          </button>
        </div>
      </div>
    `;
  }

  onUIRendered() {
    const addBtn = document.getElementById('addWorkNode');
    if (addBtn) {
      addBtn.addEventListener('click', () => this.addTask());
    }
  }

  getCompletionRate() {
    const nodes = this.graph.getNodesByDomain(this.domain);
    if (nodes.length === 0) return 0;

    // Energy level as proxy for completion
    const avg = nodes.reduce((sum, n) => sum + n.metadata.energy, 0) / nodes.length;
    return Math.round(avg * 100);
  }

  renderProjects(projects) {
    if (projects.length === 0) {
      return '<div class="empty-state">No active projects</div>';
    }

    return projects
      .map(project => {
        const connectedTasks = this.graph.getConnectedNodes(project.id)
          .filter(n => n.type === 'task').length;

        return `
          <div class="project-item" data-node-id="${project.id}">
            <div class="project-header">
              <span class="project-icon">◇</span>
              <span class="project-name">${project.data.label || 'Untitled Project'}</span>
            </div>
            <div class="project-meta">
              <span>${connectedTasks} tasks</span>
              <span class="project-status">IN PROGRESS</span>
            </div>
          </div>
        `;
      })
      .join('');
  }

  renderTasks(tasks) {
    if (tasks.length === 0) {
      return '<div class="empty-state">No tasks. Create one to begin.</div>';
    }

    return tasks
      .slice(0, 8)
      .map(task => `
        <div class="task-item" data-node-id="${task.id}">
          <span class="task-checkbox ${task.metadata.energy > 0.7 ? 'checked' : ''}">
            ${task.metadata.energy > 0.7 ? '✓' : '○'}
          </span>
          <span class="task-label">${task.data.label || 'Untitled Task'}</span>
        </div>
      `)
      .join('');
  }

  addTask() {
    const taskNames = [
      'Review code',
      'Update documentation',
      'Fix bug in module',
      'Implement feature',
      'Write tests',
      'Deploy to production',
    ];

    const taskName = taskNames[Math.floor(Math.random() * taskNames.length)];

    this.graph.createNode('task', this.domain, {
      label: taskName,
      created: Date.now(),
    });

    // Re-render UI
    const moduleManager = window.nexus?.moduleManager;
    if (moduleManager) {
      moduleManager.renderModuleUI(this);
    }
  }
}
