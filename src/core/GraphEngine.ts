import { v4 as uuidv4 } from 'uuid'
import type {
  Node,
  Edge,
  Domain,
  NodeType,
  EdgeType,
  Vector3D,
  GraphStats,
  GraphEvent,
  GraphListener,
} from '@/types'

/**
 * NEXUS GraphEngine - Core graph database with full CRUD operations
 * Manages nodes, edges, and physics simulation
 */
export class GraphEngine {
  private nodes: Map<string, Node> = new Map()
  private edges: Map<string, Edge> = new Map()
  private listeners: Set<GraphListener> = new Set()

  // Physics constants
  private readonly REPULSION_STRENGTH = 5000
  private readonly SPRING_STRENGTH = 0.01
  private readonly DAMPING = 0.85
  private readonly MAX_VELOCITY = 10

  constructor() {
    this.loadFromStorage()
  }

  // ==========================================================================
  // CREATE OPERATIONS
  // ==========================================================================

  /**
   * Create a new node in the graph
   */
  createNode(
    type: NodeType,
    domain: Domain,
    data: { label: string; description?: string; [key: string]: any }
  ): Node {
    if (!data.label || data.label.trim() === '') {
      throw new Error('Node label is required')
    }

    const now = Date.now()
    const node: Node = {
      id: uuidv4(),
      type,
      domain,
      data: { ...data },
      metadata: {
        created: now,
        updated: now,
        tags: [],
        energy: Math.random(),
      },
      position: this.getRandomPosition(),
      velocity: { x: 0, y: 0, z: 0 },
      force: { x: 0, y: 0, z: 0 },
    }

    this.nodes.set(node.id, node)
    this.notifyListeners({
      type: 'nodeCreated',
      data: node,
      timestamp: now,
    })
    this.saveToStorage()

    return node
  }

  /**
   * Create a new edge between two nodes
   */
  createEdge(
    sourceId: string,
    targetId: string,
    type: EdgeType = 'relates',
    weight: number = 0.5
  ): Edge {
    // Validate nodes exist
    if (!this.nodes.has(sourceId)) {
      throw new Error(`Source node ${sourceId} does not exist`)
    }
    if (!this.nodes.has(targetId)) {
      throw new Error(`Target node ${targetId} does not exist`)
    }

    // Validate weight
    if (weight < 0 || weight > 1) {
      throw new Error('Edge weight must be between 0 and 1')
    }

    // Check for duplicate edges
    const existingEdge = Array.from(this.edges.values()).find(
      (e) =>
        (e.source === sourceId && e.target === targetId) ||
        (e.source === targetId && e.target === sourceId && e.metadata.bidirectional)
    )

    if (existingEdge) {
      throw new Error('Edge already exists between these nodes')
    }

    const now = Date.now()
    const edge: Edge = {
      id: uuidv4(),
      source: sourceId,
      target: targetId,
      type,
      weight,
      metadata: {
        created: now,
        bidirectional: false,
      },
    }

    this.edges.set(edge.id, edge)
    this.notifyListeners({
      type: 'edgeCreated',
      data: edge,
      timestamp: now,
    })
    this.saveToStorage()

    return edge
  }

  // ==========================================================================
  // READ OPERATIONS
  // ==========================================================================

  /**
   * Get a single node by ID
   */
  getNode(id: string): Node | undefined {
    return this.nodes.get(id)
  }

  /**
   * Get all nodes
   */
  getAllNodes(): Node[] {
    return Array.from(this.nodes.values())
  }

  /**
   * Get all edges
   */
  getAllEdges(): Edge[] {
    return Array.from(this.edges.values())
  }

  /**
   * Get nodes by domain
   */
  getNodesByDomain(domain: Domain): Node[] {
    return this.getAllNodes().filter((node) => node.domain === domain)
  }

  /**
   * Get nodes by type
   */
  getNodesByType(type: NodeType): Node[] {
    return this.getAllNodes().filter((node) => node.type === type)
  }

  /**
   * Get nodes connected to a specific node
   */
  getConnectedNodes(nodeId: string): Node[] {
    const connectedIds = new Set<string>()

    this.edges.forEach((edge) => {
      if (edge.source === nodeId) {
        connectedIds.add(edge.target)
      }
      if (edge.target === nodeId || edge.metadata.bidirectional) {
        connectedIds.add(edge.source)
      }
    })

    return Array.from(connectedIds)
      .map((id) => this.nodes.get(id))
      .filter((node): node is Node => node !== undefined)
  }

  /**
   * Get all edges for a specific node
   */
  getNodeEdges(nodeId: string): Edge[] {
    return this.getAllEdges().filter(
      (edge) => edge.source === nodeId || edge.target === nodeId
    )
  }

  /**
   * Search nodes by label
   */
  searchNodes(query: string): Node[] {
    const lowerQuery = query.toLowerCase()
    return this.getAllNodes().filter((node) =>
      node.data.label.toLowerCase().includes(lowerQuery)
    )
  }

  /**
   * Get graph statistics
   */
  getStats(): GraphStats {
    const nodes = this.getAllNodes()
    const edges = this.getAllEdges()

    const domains: Record<Domain, number> = {
      graph: 0,
      physical: 0,
      work: 0,
      design: 0,
      music: 0,
      ai: 0,
    }

    nodes.forEach((node) => {
      domains[node.domain]++
    })

    const avgDegree = nodes.length > 0 ? (edges.length * 2) / nodes.length : 0
    const maxEdges = (nodes.length * (nodes.length - 1)) / 2
    const density = maxEdges > 0 ? edges.length / maxEdges : 0

    return {
      nodeCount: nodes.length,
      edgeCount: edges.length,
      domains,
      avgDegree,
      density,
    }
  }

  // ==========================================================================
  // UPDATE OPERATIONS
  // ==========================================================================

  /**
   * Update a node's data
   */
  updateNode(
    id: string,
    updates: {
      data?: Partial<Node['data']>
      metadata?: Partial<Node['metadata']>
      type?: NodeType
      domain?: Domain
    }
  ): Node {
    const node = this.nodes.get(id)
    if (!node) {
      throw new Error(`Node ${id} not found`)
    }

    // Validate label if updating
    if (updates.data?.label !== undefined && updates.data.label.trim() === '') {
      throw new Error('Node label cannot be empty')
    }

    // Apply updates
    if (updates.data) {
      node.data = { ...node.data, ...updates.data }
    }
    if (updates.metadata) {
      node.metadata = { ...node.metadata, ...updates.metadata }
    }
    if (updates.type) {
      node.type = updates.type
    }
    if (updates.domain) {
      node.domain = updates.domain
    }

    // Update timestamp
    node.metadata.updated = Date.now()

    this.notifyListeners({
      type: 'nodeUpdated',
      data: node,
      timestamp: node.metadata.updated,
    })
    this.saveToStorage()

    return node
  }

  /**
   * Update an edge
   */
  updateEdge(
    id: string,
    updates: {
      type?: EdgeType
      weight?: number
      metadata?: Partial<Edge['metadata']>
    }
  ): Edge {
    const edge = this.edges.get(id)
    if (!edge) {
      throw new Error(`Edge ${id} not found`)
    }

    // Validate weight if updating
    if (updates.weight !== undefined && (updates.weight < 0 || updates.weight > 1)) {
      throw new Error('Edge weight must be between 0 and 1')
    }

    // Apply updates
    if (updates.type) {
      edge.type = updates.type
    }
    if (updates.weight !== undefined) {
      edge.weight = updates.weight
    }
    if (updates.metadata) {
      edge.metadata = { ...edge.metadata, ...updates.metadata }
    }

    this.saveToStorage()
    return edge
  }

  /**
   * Update node position (used by physics and drag)
   */
  updateNodePosition(id: string, position: Partial<Vector3D>): void {
    const node = this.nodes.get(id)
    if (!node) return

    node.position = { ...node.position, ...position }
  }

  // ==========================================================================
  // DELETE OPERATIONS
  // ==========================================================================

  /**
   * Delete a node and all its connected edges
   */
  deleteNode(id: string): boolean {
    const node = this.nodes.get(id)
    if (!node) {
      return false
    }

    // Delete all connected edges
    const edgesToDelete = this.getNodeEdges(id)
    edgesToDelete.forEach((edge) => {
      this.edges.delete(edge.id)
    })

    // Delete the node
    this.nodes.delete(id)

    this.notifyListeners({
      type: 'nodeDeleted',
      data: node,
      timestamp: Date.now(),
    })
    this.saveToStorage()

    return true
  }

  /**
   * Delete an edge
   */
  deleteEdge(id: string): boolean {
    const edge = this.edges.get(id)
    if (!edge) {
      return false
    }

    this.edges.delete(id)

    this.notifyListeners({
      type: 'edgeDeleted',
      data: edge,
      timestamp: Date.now(),
    })
    this.saveToStorage()

    return true
  }

  /**
   * Clear all nodes and edges
   */
  clearGraph(): void {
    this.nodes.clear()
    this.edges.clear()

    this.notifyListeners({
      type: 'graphCleared',
      data: null,
      timestamp: Date.now(),
    })
    this.saveToStorage()
  }

  // ==========================================================================
  // PHYSICS SIMULATION
  // ==========================================================================

  /**
   * Apply physics forces to all nodes
   */
  applyPhysics(deltaTime: number): void {
    const nodes = this.getAllNodes()
    const dt = Math.min(deltaTime / 1000, 0.1) // Cap at 100ms

    // Reset forces
    nodes.forEach((node) => {
      node.force = { x: 0, y: 0, z: 0 }
    })

    // Repulsion forces (nodes push each other away)
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const nodeA = nodes[i]
        const nodeB = nodes[j]

        const dx = nodeB.position.x - nodeA.position.x
        const dy = nodeB.position.y - nodeA.position.y
        const dz = nodeB.position.z - nodeA.position.z

        const distSq = dx * dx + dy * dy + dz * dz
        const dist = Math.sqrt(distSq) || 1

        const force = this.REPULSION_STRENGTH / (distSq || 1)

        const fx = (dx / dist) * force
        const fy = (dy / dist) * force
        const fz = (dz / dist) * force

        nodeA.force.x -= fx
        nodeA.force.y -= fy
        nodeA.force.z -= fz

        nodeB.force.x += fx
        nodeB.force.y += fy
        nodeB.force.z += fz
      }
    }

    // Spring forces (edges pull connected nodes together)
    this.getAllEdges().forEach((edge) => {
      const source = this.nodes.get(edge.source)
      const target = this.nodes.get(edge.target)

      if (!source || !target) return

      const dx = target.position.x - source.position.x
      const dy = target.position.y - source.position.y
      const dz = target.position.z - source.position.z

      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1

      const force = this.SPRING_STRENGTH * dist * edge.weight

      const fx = (dx / dist) * force
      const fy = (dy / dist) * force
      const fz = (dz / dist) * force

      source.force.x += fx
      source.force.y += fy
      source.force.z += fz

      target.force.x -= fx
      target.force.y -= fy
      target.force.z -= fz
    })

    // Update velocities and positions
    nodes.forEach((node) => {
      // Update velocity
      node.velocity.x += node.force.x * dt
      node.velocity.y += node.force.y * dt
      node.velocity.z += node.force.z * dt

      // Apply damping
      node.velocity.x *= this.DAMPING
      node.velocity.y *= this.DAMPING
      node.velocity.z *= this.DAMPING

      // Limit max velocity
      const speed = Math.sqrt(
        node.velocity.x ** 2 + node.velocity.y ** 2 + node.velocity.z ** 2
      )
      if (speed > this.MAX_VELOCITY) {
        const scale = this.MAX_VELOCITY / speed
        node.velocity.x *= scale
        node.velocity.y *= scale
        node.velocity.z *= scale
      }

      // Update position
      node.position.x += node.velocity.x * dt
      node.position.y += node.velocity.y * dt
      node.position.z += node.velocity.z * dt
    })
  }

  // ==========================================================================
  // EVENT LISTENERS
  // ==========================================================================

  /**
   * Add a listener for graph events
   */
  addListener(listener: GraphListener): void {
    this.listeners.add(listener)
  }

  /**
   * Remove a listener
   */
  removeListener(listener: GraphListener): void {
    this.listeners.delete(listener)
  }

  /**
   * Notify all listeners of an event
   */
  private notifyListeners(event: GraphEvent): void {
    this.listeners.forEach((listener) => {
      try {
        listener(event)
      } catch (error) {
        console.error('Error in graph listener:', error)
      }
    })
  }

  // ==========================================================================
  // PERSISTENCE
  // ==========================================================================

  /**
   * Serialize graph to JSON
   */
  toJSON(): { nodes: Node[]; edges: Edge[] } {
    return {
      nodes: Array.from(this.nodes.values()),
      edges: Array.from(this.edges.values()),
    }
  }

  /**
   * Deserialize graph from JSON
   */
  fromJSON(data: { nodes: Node[]; edges: Edge[] }): void {
    this.nodes.clear()
    this.edges.clear()

    data.nodes.forEach((node) => {
      this.nodes.set(node.id, node)
    })

    data.edges.forEach((edge) => {
      this.edges.set(edge.id, edge)
    })

    this.notifyListeners({
      type: 'graphCleared',
      data: null,
      timestamp: Date.now(),
    })
  }

  /**
   * Save to localStorage
   */
  private saveToStorage(): void {
    try {
      const data = this.toJSON()
      localStorage.setItem('nexus_graph', JSON.stringify(data))
    } catch (error) {
      console.error('Failed to save graph to storage:', error)
    }
  }

  /**
   * Load from localStorage
   */
  private loadFromStorage(): void {
    try {
      const data = localStorage.getItem('nexus_graph')
      if (data) {
        const parsed = JSON.parse(data)
        this.fromJSON(parsed)
      }
    } catch (error) {
      console.error('Failed to load graph from storage:', error)
    }
  }

  // ==========================================================================
  // UTILITIES
  // ==========================================================================

  /**
   * Get a random position in 3D space
   */
  private getRandomPosition(): Vector3D {
    const range = 500
    return {
      x: (Math.random() - 0.5) * range,
      y: (Math.random() - 0.5) * range,
      z: (Math.random() - 0.5) * range,
    }
  }
}

// Export singleton instance
export const graphEngine = new GraphEngine()
