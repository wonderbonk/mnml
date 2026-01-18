/**
 * NEXUS Graph Renderer
 * Holographic 3D graph visualization on canvas
 */

export class GraphRenderer {
  constructor(canvas, graphEngine) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.graph = graphEngine;

    this.camera = {
      x: 0,
      y: 0,
      z: 1000,
      rotationX: 0,
      rotationY: 0,
    };

    this.mouse = {
      x: 0,
      y: 0,
      down: false,
      lastX: 0,
      lastY: 0,
    };

    this.selectedNode = null;
    this.hoveredNode = null;

    this.colors = {
      physical: '#00ffff',    // cyan
      work: '#00ff41',        // terminal green
      design: '#ff00ff',      // magenta
      music: '#9d4edd',       // cosmic purple
      ai: '#ffaa00',          // amber
      default: '#ffffff',     // white
    };

    this.particleEffects = [];

    this.setupCanvas();
    this.setupEventListeners();
  }

  setupCanvas() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width * window.devicePixelRatio;
    this.canvas.height = rect.height * window.devicePixelRatio;
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    this.width = rect.width;
    this.height = rect.height;
  }

  setupEventListeners() {
    this.canvas.addEventListener('mousedown', (e) => {
      this.mouse.down = true;
      this.mouse.lastX = e.clientX;
      this.mouse.lastY = e.clientY;

      // Check for node click
      const clickedNode = this.getNodeAtPosition(e.offsetX, e.offsetY);
      if (clickedNode) {
        this.selectNode(clickedNode);
      } else {
        this.selectNode(null);
      }
    });

    this.canvas.addEventListener('mousemove', (e) => {
      this.mouse.x = e.offsetX;
      this.mouse.y = e.offsetY;

      if (this.mouse.down) {
        const dx = e.clientX - this.mouse.lastX;
        const dy = e.clientY - this.mouse.lastY;

        this.camera.rotationY += dx * 0.005;
        this.camera.rotationX += dy * 0.005;

        this.mouse.lastX = e.clientX;
        this.mouse.lastY = e.clientY;
      }

      // Check for node hover
      const hoveredNode = this.getNodeAtPosition(e.offsetX, e.offsetY);
      this.hoveredNode = hoveredNode;
    });

    this.canvas.addEventListener('mouseup', () => {
      this.mouse.down = false;
    });

    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.camera.z += e.deltaY * 0.5;
      this.camera.z = Math.max(400, Math.min(2000, this.camera.z));
    });
  }

  /**
   * Project 3D point to 2D screen space
   */
  project3D(x, y, z) {
    // Apply camera rotation
    const cosX = Math.cos(this.camera.rotationX);
    const sinX = Math.sin(this.camera.rotationX);
    const cosY = Math.cos(this.camera.rotationY);
    const sinY = Math.sin(this.camera.rotationY);

    // Rotate around Y axis
    let x1 = x * cosY - z * sinY;
    let z1 = x * sinY + z * cosY;

    // Rotate around X axis
    let y1 = y * cosX - z1 * sinX;
    let z2 = y * sinX + z1 * cosX;

    // Perspective projection
    const scale = this.camera.z / (this.camera.z + z2);
    const screenX = this.width / 2 + x1 * scale;
    const screenY = this.height / 2 + y1 * scale;

    return { x: screenX, y: screenY, scale, depth: z2 };
  }

  /**
   * Get node at screen position
   */
  getNodeAtPosition(x, y) {
    const nodes = this.graph.getAllNodes();

    for (const node of nodes) {
      const projected = this.project3D(node.position.x, node.position.y, node.position.z);
      const nodeRadius = this.getNodeRadius(node) * projected.scale;

      const dx = x - projected.x;
      const dy = y - projected.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < nodeRadius) {
        return node;
      }
    }

    return null;
  }

  /**
   * Select a node
   */
  selectNode(node) {
    this.selectedNode = node;

    if (node) {
      // Emit event for detail panel
      const event = new CustomEvent('nodeSelected', { detail: node });
      window.dispatchEvent(event);

      // Create particle explosion effect
      this.createParticleExplosion(node);
    }
  }

  /**
   * Get node radius based on connections
   */
  getNodeRadius(node) {
    const connections = this.graph.getNodeEdges(node.id).length;
    return Math.max(8, Math.min(20, 8 + connections * 2));
  }

  /**
   * Get node color
   */
  getNodeColor(node) {
    return this.colors[node.domain] || this.colors.default;
  }

  /**
   * Render the graph
   */
  render() {
    // Clear canvas with fade effect for trails
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    this.ctx.fillRect(0, 0, this.width, this.height);

    const nodes = this.graph.getAllNodes();
    const edges = this.graph.getAllEdges();

    // Project all nodes
    const projectedNodes = nodes.map(node => ({
      node,
      projected: this.project3D(node.position.x, node.position.y, node.position.z),
    }));

    // Sort by depth (z-order)
    projectedNodes.sort((a, b) => a.projected.depth - b.projected.depth);

    // Render edges
    edges.forEach(edge => {
      const source = this.graph.getNode(edge.source);
      const target = this.graph.getNode(edge.target);

      if (!source || !target) return;

      const sourceProj = this.project3D(source.position.x, source.position.y, source.position.z);
      const targetProj = this.project3D(target.position.x, target.position.y, target.position.z);

      // Energy flow animation
      const flowOffset = (Date.now() / 1000) % 1;

      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.moveTo(sourceProj.x, sourceProj.y);
      this.ctx.lineTo(targetProj.x, targetProj.y);

      // Gradient for energy flow
      const gradient = this.ctx.createLinearGradient(
        sourceProj.x, sourceProj.y,
        targetProj.x, targetProj.y
      );

      const color1 = this.getNodeColor(source);
      const color2 = this.getNodeColor(target);

      gradient.addColorStop(0, this.hexToRgba(color1, 0.1));
      gradient.addColorStop(flowOffset, this.hexToRgba(color1, 0.6));
      gradient.addColorStop(1, this.hexToRgba(color2, 0.1));

      this.ctx.strokeStyle = gradient;
      this.ctx.lineWidth = edge.weight * 2;
      this.ctx.stroke();
      this.ctx.restore();
    });

    // Render nodes
    projectedNodes.forEach(({ node, projected }) => {
      const radius = this.getNodeRadius(node) * projected.scale;
      const color = this.getNodeColor(node);

      const isSelected = this.selectedNode?.id === node.id;
      const isHovered = this.hoveredNode?.id === node.id;

      this.ctx.save();

      // Outer glow
      if (isSelected || isHovered) {
        const gradient = this.ctx.createRadialGradient(
          projected.x, projected.y, radius,
          projected.x, projected.y, radius * 3
        );
        gradient.addColorStop(0, this.hexToRgba(color, 0.4));
        gradient.addColorStop(1, this.hexToRgba(color, 0));

        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(projected.x, projected.y, radius * 3, 0, Math.PI * 2);
        this.ctx.fill();
      }

      // Node body
      const nodeGradient = this.ctx.createRadialGradient(
        projected.x - radius * 0.3,
        projected.y - radius * 0.3,
        0,
        projected.x,
        projected.y,
        radius
      );

      nodeGradient.addColorStop(0, this.hexToRgba(color, 1));
      nodeGradient.addColorStop(0.5, this.hexToRgba(color, 0.8));
      nodeGradient.addColorStop(1, this.hexToRgba(color, 0.4));

      this.ctx.fillStyle = nodeGradient;
      this.ctx.beginPath();
      this.ctx.arc(projected.x, projected.y, radius, 0, Math.PI * 2);
      this.ctx.fill();

      // Holographic ring
      this.ctx.strokeStyle = color;
      this.ctx.lineWidth = 2;
      this.ctx.globalAlpha = 0.6 + Math.sin(Date.now() / 500 + node.metadata.energy * 10) * 0.4;
      this.ctx.beginPath();
      this.ctx.arc(projected.x, projected.y, radius + 4, 0, Math.PI * 2);
      this.ctx.stroke();

      // Energy pulse
      const pulseRadius = radius + (Math.sin(Date.now() / 300 + node.metadata.energy * 5) + 1) * 3;
      this.ctx.globalAlpha = 0.3;
      this.ctx.beginPath();
      this.ctx.arc(projected.x, projected.y, pulseRadius, 0, Math.PI * 2);
      this.ctx.stroke();

      this.ctx.restore();

      // Label for hovered/selected nodes
      if (isSelected || isHovered) {
        this.ctx.save();
        this.ctx.font = '11px JetBrains Mono';
        this.ctx.fillStyle = color;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'top';
        this.ctx.shadowColor = color;
        this.ctx.shadowBlur = 10;

        const label = node.data.label || node.type;
        this.ctx.fillText(label, projected.x, projected.y + radius + 8);
        this.ctx.restore();
      }
    });

    // Render particle effects
    this.renderParticles();
  }

  /**
   * Create particle explosion effect
   */
  createParticleExplosion(node) {
    const projected = this.project3D(node.position.x, node.position.y, node.position.z);
    const color = this.getNodeColor(node);

    for (let i = 0; i < 20; i++) {
      const angle = (Math.PI * 2 * i) / 20;
      const speed = 2 + Math.random() * 3;

      this.particleEffects.push({
        x: projected.x,
        y: projected.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        color,
      });
    }
  }

  /**
   * Render particle effects
   */
  renderParticles() {
    this.particleEffects = this.particleEffects.filter(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life -= 0.02;

      if (particle.life <= 0) return false;

      this.ctx.save();
      this.ctx.globalAlpha = particle.life;
      this.ctx.fillStyle = particle.color;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();

      return true;
    });
  }

  /**
   * Convert hex to rgba
   */
  hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  /**
   * Animation loop
   */
  animate() {
    this.render();
    requestAnimationFrame(() => this.animate());
  }
}
