import { create } from 'zustand'
import { graphEngine } from '@core/GraphEngine'
import type { Node, Edge, Domain, NodeType, EdgeType, GraphStats } from '@/types'

interface GraphStore {
  // State
  nodes: Node[]
  edges: Edge[]
  selectedNodeId: string | null
  hoveredNodeId: string | null
  stats: GraphStats

  // Actions
  refresh: () => void
  selectNode: (id: string | null) => void
  hoverNode: (id: string | null) => void

  // CRUD Operations
  createNode: (type: NodeType, domain: Domain, data: { label: string; description?: string; [key: string]: any }) => Node
  updateNode: (id: string, updates: any) => Node
  deleteNode: (id: string) => void
  createEdge: (sourceId: string, targetId: string, type?: EdgeType, weight?: number) => Edge
  deleteEdge: (id: string) => void
  clearGraph: () => void

  // Queries
  getNodesByDomain: (domain: Domain) => Node[]
  getConnectedNodes: (nodeId: string) => Node[]
  searchNodes: (query: string) => Node[]
}

export const useGraphStore = create<GraphStore>((set, get) => {
  // Listen to graph engine events and update store
  graphEngine.addListener(() => {
    get().refresh()
  })

  return {
    // Initial state
    nodes: graphEngine.getAllNodes(),
    edges: graphEngine.getAllEdges(),
    selectedNodeId: null,
    hoveredNodeId: null,
    stats: graphEngine.getStats(),

    // Actions
    refresh: () => {
      set({
        nodes: graphEngine.getAllNodes(),
        edges: graphEngine.getAllEdges(),
        stats: graphEngine.getStats(),
      })
    },

    selectNode: (id) => {
      set({ selectedNodeId: id })
    },

    hoverNode: (id) => {
      set({ hoveredNodeId: id })
    },

    // CRUD Operations
    createNode: (type, domain, data) => {
      const node = graphEngine.createNode(type, domain, data)
      return node
    },

    updateNode: (id, updates) => {
      const node = graphEngine.updateNode(id, updates)
      return node
    },

    deleteNode: (id) => {
      graphEngine.deleteNode(id)
    },

    createEdge: (sourceId, targetId, type, weight) => {
      const edge = graphEngine.createEdge(sourceId, targetId, type, weight)
      return edge
    },

    deleteEdge: (id) => {
      graphEngine.deleteEdge(id)
    },

    clearGraph: () => {
      graphEngine.clearGraph()
    },

    // Queries
    getNodesByDomain: (domain) => {
      return graphEngine.getNodesByDomain(domain)
    },

    getConnectedNodes: (nodeId) => {
      return graphEngine.getConnectedNodes(nodeId)
    },

    searchNodes: (query) => {
      return graphEngine.searchNodes(query)
    },
  }
})
