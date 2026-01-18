export type Domain = 'graph' | 'physical' | 'work' | 'design' | 'music' | 'ai'

export type NodeType =
  | 'task'
  | 'project'
  | 'activity'
  | 'location'
  | 'metric'
  | 'meeting'
  | 'inspiration'
  | 'track'
  | 'sample'
  | 'insight'
  | 'conversation'
  | 'custom'

export type EdgeType =
  | 'relates'
  | 'influences'
  | 'contains'
  | 'requires'
  | 'blocks'
  | 'custom'

export interface Vector3D {
  x: number
  y: number
  z: number
}

export interface NodeMetadata {
  created: number
  updated: number
  tags: string[]
  energy: number
  color?: string
  [key: string]: any
}

export interface Node {
  id: string
  type: NodeType
  domain: Domain
  data: {
    label: string
    description?: string
    [key: string]: any
  }
  metadata: NodeMetadata
  position: Vector3D
  velocity: Vector3D
  force: Vector3D
}

export interface EdgeMetadata {
  created: number
  bidirectional: boolean
  [key: string]: any
}

export interface Edge {
  id: string
  source: string
  target: string
  type: EdgeType
  weight: number
  metadata: EdgeMetadata
}

export interface GraphStats {
  nodeCount: number
  edgeCount: number
  domains: Record<Domain, number>
  avgDegree: number
  density: number
}

export interface GraphEvent {
  type: 'nodeCreated' | 'nodeUpdated' | 'nodeDeleted' | 'edgeCreated' | 'edgeDeleted' | 'graphCleared'
  data: Node | Edge | GraphStats | null
  timestamp: number
}

export type GraphListener = (event: GraphEvent) => void

export interface GraphEngineState {
  nodes: Map<string, Node>
  edges: Map<string, Edge>
  selectedNodeId: string | null
  hoveredNodeId: string | null
}
