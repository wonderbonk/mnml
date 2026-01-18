/**
 * NEXUS Graph Engine
 * Core graph data structure with nodes and edges
 */

export class GraphEngine {
  constructor() {
    this.nodes = new Map();
    this.edges = new Map();
    this.listeners = new Set();
  }

  /**
   * Create a new node in the graph
   */
  createNode(type, domain, data = {}) {
    const node = {
      id: this.generateId(),
      type,
      domain,
      data,
      metadata: {
        created: Date.now(),
        updated: Date.now(),
        tags: [],
        energy: Math.random(), // Random energy 0-1
      },
      position: {
        x: (Math.random() - 0.5) * 800,
        y: (Math.random() - 0.5) * 600,
        z: (Math.random() - 0.5) * 400,
      },
      velocity: { x: 0, y: 0, z: 0 },
      force: { x: 0, y: 0, z: 0 },
    };

    this.nodes.set(node.id, node);
    this.notifyListeners('nodeCreated', node);
    return node;
  }

  /**
   * Create an edge between two nodes
   */
  createEdge(sourceId, targetId, type, weight = 0.5) {
    if (!this.nodes.has(sourceId) || !this.nodes.has(targetId)) {
      console.error('Cannot create edge: source or target node not found');
      return null;
    }

    const edge = {
      id: this.generateId(),
      source: sourceId,
      target: targetId,
      type,
      weight,
      metadata: {
        created: Date.now(),
        bidirectional: false,
      },
    };

    this.edges.set(edge.id, edge);
    this.notifyListeners('edgeCreated', edge);
    return edge;
  }

  /**
   * Get node by ID
   */
  getNode(id) {
    return this.nodes.get(id);
  }

  /**
   * Get all nodes
   */
  getAllNodes() {
    return Array.from(this.nodes.values());
  }

  /**
   * Get all edges
   */
  getAllEdges() {
    return Array.from(this.edges.values());
  }

  /**
   * Get nodes by domain
   */
  getNodesByDomain(domain) {
    return this.getAllNodes().filter(node => node.domain === domain);
  }

  /**
   * Get connected nodes
   */
  getConnectedNodes(nodeId) {
    const connected = new Set();

    for (const edge of this.edges.values()) {
      if (edge.source === nodeId) {
        connected.add(edge.target);
      }
      if (edge.target === nodeId || edge.metadata.bidirectional) {
        connected.add(edge.source);
      }
    }

    return Array.from(connected).map(id => this.nodes.get(id));
  }

  /**
   * Get edges for a node
   */
  getNodeEdges(nodeId) {
    return this.getAllEdges().filter(
      edge => edge.source === nodeId || edge.target === nodeId
    );
  }

  /**
   * Delete node and its edges
   */
  deleteNode(id) {
    const node = this.nodes.get(id);
    if (!node) return false;

    // Delete all edges connected to this node
    for (const [edgeId, edge] of this.edges.entries()) {
      if (edge.source === id || edge.target === id) {
        this.edges.delete(edgeId);
      }
    }

    this.nodes.delete(id);
    this.notifyListeners('nodeDeleted', { id });
    return true;
  }

  /**
   * Delete edge
   */
  deleteEdge(id) {
    const edge = this.edges.get(id);
    if (!edge) return false;

    this.edges.delete(id);
    this.notifyListeners('edgeDeleted', { id });
    return true;
  }

  /**
   * Update node data
   */
  updateNode(id, updates) {
    const node = this.nodes.get(id);
    if (!node) return false;

    Object.assign(node.data, updates);
    node.metadata.updated = Date.now();
    this.notifyListeners('nodeUpdated', node);
    return true;
  }

  /**
   * Find path between two nodes (BFS)
   */
  findPath(startId, endId) {
    if (!this.nodes.has(startId) || !this.nodes.has(endId)) {
      return null;
    }

    const queue = [[startId]];
    const visited = new Set([startId]);

    while (queue.length > 0) {
      const path = queue.shift();
      const current = path[path.length - 1];

      if (current === endId) {
        return path.map(id => this.nodes.get(id));
      }

      const connected = this.getConnectedNodes(current);
      for (const neighbor of connected) {
        if (!visited.has(neighbor.id)) {
          visited.add(neighbor.id);
          queue.push([...path, neighbor.id]);
        }
      }
    }

    return null; // No path found
  }

  /**
   * Apply force-directed layout physics
   */
  applyPhysics(deltaTime = 0.016) {
    const nodes = this.getAllNodes();
    const edges = this.getAllEdges();

    const springStrength = 0.01;
    const repulsionStrength = 1000;
    const damping = 0.9;
    const centeringForce = 0.001;

    // Reset forces
    nodes.forEach(node => {
      node.force = { x: 0, y: 0, z: 0 };
    });

    // Repulsion between nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const node1 = nodes[i];
        const node2 = nodes[j];

        const dx = node2.position.x - node1.position.x;
        const dy = node2.position.y - node1.position.y;
        const dz = node2.position.z - node1.position.z;

        const distSq = dx * dx + dy * dy + dz * dz + 0.1; // Avoid division by zero
        const dist = Math.sqrt(distSq);

        const force = repulsionStrength / distSq;
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        const fz = (dz / dist) * force;

        node1.force.x -= fx;
        node1.force.y -= fy;
        node1.force.z -= fz;

        node2.force.x += fx;
        node2.force.y += fy;
        node2.force.z += fz;
      }
    }

    // Spring force along edges
    edges.forEach(edge => {
      const source = this.nodes.get(edge.source);
      const target = this.nodes.get(edge.target);

      if (!source || !target) return;

      const dx = target.position.x - source.position.x;
      const dy = target.position.y - source.position.y;
      const dz = target.position.z - source.position.z;

      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      const idealDist = 150;
      const displacement = dist - idealDist;

      const force = displacement * springStrength * edge.weight;
      const fx = (dx / dist) * force;
      const fy = (dy / dist) * force;
      const fz = (dz / dist) * force;

      source.force.x += fx;
      source.force.y += fy;
      source.force.z += fz;

      target.force.x -= fx;
      target.force.y -= fy;
      target.force.z -= fz;
    });

    // Centering force
    nodes.forEach(node => {
      node.force.x -= node.position.x * centeringForce;
      node.force.y -= node.position.y * centeringForce;
      node.force.z -= node.position.z * centeringForce;
    });

    // Update velocities and positions
    nodes.forEach(node => {
      node.velocity.x = (node.velocity.x + node.force.x * deltaTime) * damping;
      node.velocity.y = (node.velocity.y + node.force.y * deltaTime) * damping;
      node.velocity.z = (node.velocity.z + node.force.z * deltaTime) * damping;

      node.position.x += node.velocity.x * deltaTime;
      node.position.y += node.velocity.y * deltaTime;
      node.position.z += node.velocity.z * deltaTime;
    });
  }

  /**
   * Add event listener
   */
  addListener(callback) {
    this.listeners.add(callback);
  }

  /**
   * Remove event listener
   */
  removeListener(callback) {
    this.listeners.delete(callback);
  }

  /**
   * Notify all listeners
   */
  notifyListeners(event, data) {
    this.listeners.forEach(callback => callback(event, data));
  }

  /**
   * Generate unique ID
   */
  generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Serialize graph to JSON
   */
  toJSON() {
    return {
      nodes: Array.from(this.nodes.entries()),
      edges: Array.from(this.edges.entries()),
    };
  }

  /**
   * Load graph from JSON
   */
  fromJSON(data) {
    this.nodes = new Map(data.nodes);
    this.edges = new Map(data.edges);
    this.notifyListeners('graphLoaded', { nodeCount: this.nodes.size, edgeCount: this.edges.size });
  }

  /**
   * Get graph statistics
   */
  getStats() {
    return {
      nodeCount: this.nodes.size,
      edgeCount: this.edges.size,
      domains: [...new Set(this.getAllNodes().map(n => n.domain))],
      avgEnergy: this.getAllNodes().reduce((sum, n) => sum + n.metadata.energy, 0) / this.nodes.size || 0,
    };
  }
}
