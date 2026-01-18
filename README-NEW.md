# NEXUS Terminal v2.0 - Retro Cyberpunk Edition

A complete React + TypeScript + Vite rewrite of NEXUS with a gorgeous retro sci-fi terminal aesthetic.

## What's New

### Complete UI Overhaul
- **Retro Terminal Aesthetic**: Old-school 80s cyberpunk styling inspired by Matrix, Severance, and Star Wars
- **Soft Glow Dark Mode**: Neon green text with CRT scanlines and chromatic aberration effects
- **Expandable Terminal**: Sexy terminal interface pinned to bottom with smooth animations

### Fixed CRUD Operations
- **CREATE**: ✓ Working across all modules
- **READ**: ✓ Full query capabilities
- **UPDATE**: ✓ Now fully implemented with terminal commands
- **DELETE**: ✓ Working with cascade edge deletion

### Technical Stack
- **React 18** with modern hooks
- **TypeScript** for type safety
- **Vite** for blazing fast builds
- **Zustand** for lightweight state management
- **Framer Motion** for slick animations
- **SCSS** with CSS custom properties for theming

### Features

#### 4 Theme Presets
- **Matrix** (default): Green terminals and digital rain vibes
- **Lumon**: Severance-inspired cool blues
- **Star Wars**: Gold and blue Imperial/Rebel aesthetic
- **Cyberpunk**: Purple and cyan neon madness

#### Terminal Commands
All CRUD operations available via terminal:
```
create <type> <domain> <label>     - Create nodes
update <id> <field> <value>        - Update nodes
delete <id>                        - Delete nodes
connect <sourceId> <targetId>      - Create edges
disconnect <edgeId>                - Delete edges
list [domain]                      - List all nodes
search <query>                     - Search nodes
show <id>                          - Show node details
stats                              - Graph statistics
theme <name>                       - Change theme
help                               - Show all commands
```

#### 6 Domain Modules
- **Graph**: Visualization and statistics
- **Physical**: Activities, locations, metrics
- **Work**: Projects, tasks, meetings
- **Design**: Design projects and inspiration
- **Music**: Tracks and samples
- **AI**: Insights and conversations

## Getting Started

### Install Dependencies
```bash
npm install
```

### Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Architecture

```
src/
├── components/        # React components
│   ├── Terminal/     # Terminal UI (input, output, animations)
│   ├── GraphCanvas/  # Canvas-based graph renderer
│   ├── Header/       # Top nav with domain switcher
│   ├── ModulePanel/  # Side panel for modules
│   └── UI/           # Reusable UI components (Button, Card, Input)
├── core/             # Core engine
│   ├── GraphEngine.ts       # Graph database with physics
│   └── TerminalCommands.ts  # Command interpreter
├── modules/          # Domain-specific modules
├── store/            # Zustand stores
├── styles/           # Global styles and design tokens
└── types/            # TypeScript definitions
```

## Design System

### CSS Custom Properties
All styling uses CSS variables for easy theming:
- Colors: `--fg-primary`, `--bg-primary`, `--accent-primary`, etc.
- Effects: `--text-glow-md`, `--box-glow-lg`, etc.
- Spacing: `--space-4`, `--space-6`, etc.
- Typography: `--font-mono`, `--font-display`, etc.

### Animations
All animations use CSS transforms and Framer Motion for 60fps performance:
- Expandable/collapsible terminal with spring physics
- Smooth module panel transitions
- CRT scanline effects
- Holographic shimmer
- Pulsing glows

## Data Persistence
- LocalStorage for graph data (`nexus_graph`)
- Auto-save on all mutations
- Loads previous state on startup

## Performance
- Canvas-based rendering for 1000+ nodes
- Force-directed physics simulation
- Optimized with requestAnimationFrame
- Code splitting (React vendor, Motion chunks)
- SCSS compiled to optimized CSS

## Browser Support
Modern browsers with ES2020 support:
- Chrome/Edge 88+
- Firefox 78+
- Safari 14+

---

**Built with** ⚡ **by Claude** for the ultimate retro terminal experience.
