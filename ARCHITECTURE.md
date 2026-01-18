# NEXUS: Personal Operating System Architecture

## Vision
A graph-based personal operating system that manifests the totality of existence across physical, professional, creative, and AI-symbiotic domains through a holographic cyberpunk interface.

## Core Principles

### 1. Graph-First Architecture
```
Node {
  id: UUID
  type: EntityType (Task, Project, Location, Track, Thought, Agent)
  domain: Domain (physical, work, design, music, ai)
  data: {}
  metadata: { created, updated, tags, energy }
  position: { x, y, z } // 3D graph space
}

Edge {
  id: UUID
  source: NodeID
  target: NodeID
  type: RelationType (influences, blocks, inspires, contains, requires)
  weight: 0-1 (strength)
  metadata: { created, bidirectional }
}
```

### 2. Domain Modules
- **Physical**: Body metrics, location, activities, energy levels
- **Work**: Projects, tasks, meetings, deliverables, time
- **Design**: Creative projects, inspiration, iterations, portfolio
- **Music**: Tracks, samples, ideas, production stages, releases
- **AI Agent**: Conversations, insights, collaborations, emergent patterns

### 3. Visual Language

#### Terminal Layer
- Monospace fonts (JetBrains Mono, Fira Code)
- Command-line inspired interactions
- ASCII art and unicode box drawing

#### Cyberpunk Layer
- Neon accents: cyan (#00ffff), magenta (#ff00ff), lime (#00ff00)
- Glitch effects and scan lines
- Data stream animations
- CRT phosphor glow

#### Lumon Layer
- Stark black/white contrast
- Corporate minimalism
- Precise grid alignment
- Institutional typography

#### Cosmic Layer
- Particle systems
- Nebula gradients
- Depth of field blur
- Holographic chromatic aberration

### 4. Technical Stack

#### Core
- Vanilla JavaScript (ES modules)
- Canvas/WebGL for graph rendering
- Web Components for modularity
- CSS custom properties for theming

#### Data
- IndexedDB for persistence
- Graph algorithms (D3-force, pathfinding)
- Real-time data synchronization

#### Visualization
- Force-directed graph layout
- 3D perspective transforms
- Shader-based effects
- Particle systems for data flow

## Module System

### Module Interface
```javascript
class Module {
  constructor(graphEngine) {
    this.graph = graphEngine
    this.nodes = []
    this.edges = []
  }

  initialize() {}      // Setup
  render(container) {} // UI rendering
  update(delta) {}     // Animation loop
  serialize() {}       // Data export
  deserialize(data) {} // Data import
}
```

### Module Registry
Hot-pluggable modules with dependency injection

## UI Zones

```
┌────────────────────────────────────────────┐
│ HEADER: System Status | Time | AI Presence│
├────────────────────────────────────────────┤
│ ┌──────────┐                               │
│ │ MODULE   │  GRAPH VISUALIZATION          │
│ │ SELECTOR │  [Holographic 3D Node Cloud]  │
│ │          │                               │
│ │ Physical │  • Nodes as glowing spheres   │
│ │ Work     │  • Edges as energy beams      │
│ │ Design   │  • Clusters by domain         │
│ │ Music    │  • Interactive zoom/pan       │
│ │ AI       │                               │
│ └──────────┘                               │
├────────────────────────────────────────────┤
│ TERMINAL: Command Input | AI Chat          │
└────────────────────────────────────────────┘
```

## Data Flow

1. User creates entity (task, project, beat)
2. System generates node in graph
3. AI suggests relationships to existing nodes
4. Graph visualization updates in real-time
5. Modules reflect changes in their domain views
6. Persistence layer commits to IndexedDB

## Interaction Paradigms

### Command Mode
- `/create task "Build the future"`
- `/connect task-123 project-456 blocks`
- `/query path work music` - find connections between domains
- `/ai analyze recent work`

### Visual Mode
- Click node to focus
- Drag to reposition
- Right-click for context menu
- Scroll to zoom
- Shift-click to multi-select

### AI Symbiosis
- Agent observes graph patterns
- Suggests connections
- Identifies bottlenecks
- Generates insights
- Co-creates with user

## Performance Targets

- 60fps graph rendering (1000+ nodes)
- <100ms interaction latency
- <50MB memory footprint
- Instant module switching
- Smooth holographic effects

## Aesthetic Details

### Colors
```css
--void: #000000           /* Deep space */
--near-black: #0a0a0a     /* Lumon corporate */
--terminal-green: #00ff41 /* Matrix vibes */
--cyber-cyan: #00ffff     /* Neon accent */
--cyber-magenta: #ff00ff  /* Neon accent */
--lumon-blue: #0066cc     /* Corporate blue */
--cosmic-purple: #9d4edd  /* Nebula */
--warning-amber: #ffaa00  /* Alert state */
--white: #ffffff          /* Pure light */
--ghost: rgba(255,255,255,0.1) /* Subtle UI */
```

### Typography
- Headers: "Space Grotesk" (geometric, sci-fi)
- Body: "JetBrains Mono" (terminal)
- Data: "IBM Plex Mono" (technical)
- UI: "Inter" (clean, modern)

### Effects
- Bloom glow on active nodes
- Chromatic aberration on hover
- Scan line overlay (2px, 10% opacity)
- CRT curvature (subtle)
- Particle trails on data flow
- Holographic shimmer on UI panels

## Future Expansion

- Multi-user collaboration graphs
- External data sources (calendar, GitHub, Spotify)
- AR/VR visualization
- Voice command interface
- Generative audio based on graph state
- Export to various formats (JSON, GraphML, PDF)

---

**"The graph is the map. The map is the territory. You are the explorer."**
