/**
 * NEXUS Terminal
 * Command-line interface and AI chat
 */

export class Terminal {
  constructor(graphEngine) {
    this.graph = graphEngine;
    this.input = document.getElementById('terminalInput');
    this.output = document.getElementById('terminalOutput');
    this.commandHistory = [];
    this.historyIndex = -1;

    this.commands = this.setupCommands();
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.executeCommand(this.input.value);
        this.input.value = '';
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.navigateHistory(-1);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.navigateHistory(1);
      }
    });
  }

  setupCommands() {
    return {
      help: {
        description: 'Show available commands',
        execute: () => {
          const commandList = Object.entries(this.commands)
            .map(([name, cmd]) => `  /${name.padEnd(15)} - ${cmd.description}`)
            .join('\n');

          return `Available commands:\n${commandList}\n\nType any message to chat with AI.`;
        },
      },

      create: {
        description: 'Create a new node (/create [type] [domain] [label])',
        execute: (args) => {
          const [type = 'task', domain = 'work', ...labelParts] = args;
          const label = labelParts.join(' ') || 'New Node';

          const node = this.graph.createNode(type, domain, { label });
          return `Created ${domain} node: ${label} (ID: ${node.id.substr(0, 8)})`;
        },
      },

      connect: {
        description: 'Connect two nodes (/connect [source] [target] [type])',
        execute: (args) => {
          const [sourceId, targetId, type = 'relates'] = args;

          if (!sourceId || !targetId) {
            return 'Usage: /connect [sourceId] [targetId] [type]';
          }

          const edge = this.graph.createEdge(sourceId, targetId, type);
          if (edge) {
            return `Connected nodes with "${type}" relationship`;
          } else {
            return 'Failed to create connection. Check node IDs.';
          }
        },
      },

      list: {
        description: 'List all nodes (/list [domain])',
        execute: (args) => {
          const [domain] = args;
          const nodes = domain
            ? this.graph.getNodesByDomain(domain)
            : this.graph.getAllNodes();

          if (nodes.length === 0) {
            return `No nodes found${domain ? ` in domain "${domain}"` : ''}`;
          }

          const nodeList = nodes
            .map(n => `  ${n.id.substr(0, 8)} [${n.domain}] ${n.data.label || n.type}`)
            .join('\n');

          return `Nodes (${nodes.length}):\n${nodeList}`;
        },
      },

      stats: {
        description: 'Show graph statistics',
        execute: () => {
          const stats = this.graph.getStats();
          return `Graph Statistics:
  Nodes: ${stats.nodeCount}
  Edges: ${stats.edgeCount}
  Domains: ${stats.domains.join(', ')}
  Avg Energy: ${(stats.avgEnergy * 100).toFixed(1)}%`;
        },
      },

      query: {
        description: 'Find path between domains (/query [domain1] [domain2])',
        execute: (args) => {
          const [domain1, domain2] = args;

          if (!domain1 || !domain2) {
            return 'Usage: /query [domain1] [domain2]';
          }

          const nodes1 = this.graph.getNodesByDomain(domain1);
          const nodes2 = this.graph.getNodesByDomain(domain2);

          if (nodes1.length === 0 || nodes2.length === 0) {
            return `No nodes found in one or both domains`;
          }

          // Find shortest path between any nodes in the two domains
          let shortestPath = null;
          let shortestLength = Infinity;

          for (const n1 of nodes1) {
            for (const n2 of nodes2) {
              const path = this.graph.findPath(n1.id, n2.id);
              if (path && path.length < shortestLength) {
                shortestPath = path;
                shortestLength = path.length;
              }
            }
          }

          if (shortestPath) {
            const pathStr = shortestPath
              .map(n => `${n.domain}:${n.data.label || n.type}`)
              .join(' → ');
            return `Path found (${shortestLength} nodes):\n  ${pathStr}`;
          } else {
            return `No path found between ${domain1} and ${domain2}`;
          }
        },
      },

      delete: {
        description: 'Delete a node (/delete [nodeId])',
        execute: (args) => {
          const [nodeId] = args;

          if (!nodeId) {
            return 'Usage: /delete [nodeId]';
          }

          const success = this.graph.deleteNode(nodeId);
          return success
            ? `Deleted node ${nodeId}`
            : `Node ${nodeId} not found`;
        },
      },

      clear: {
        description: 'Clear terminal output',
        execute: () => {
          this.output.innerHTML = '';
          return null; // Don't show output
        },
      },

      ai: {
        description: 'Interact with AI agent',
        execute: (args) => {
          const message = args.join(' ');
          return this.aiResponse(message);
        },
      },

      seed: {
        description: 'Seed the graph with sample data',
        execute: () => {
          this.seedGraph();
          return 'Graph seeded with sample data';
        },
      },
    };
  }

  executeCommand(input) {
    if (!input.trim()) return;

    this.commandHistory.push(input);
    this.historyIndex = this.commandHistory.length;

    // Add input to output
    this.addLine(input, true);

    // Parse command
    if (input.startsWith('/')) {
      const parts = input.slice(1).split(' ');
      const commandName = parts[0];
      const args = parts.slice(1);

      const command = this.commands[commandName];
      if (command) {
        const result = command.execute(args);
        if (result) {
          this.addLine(result, false);
        }
      } else {
        this.addLine(`Unknown command: ${commandName}. Type /help for available commands.`, false);
      }
    } else {
      // AI chat
      const response = this.aiResponse(input);
      this.addLine(response, false);
    }

    // Scroll to bottom
    this.output.scrollTop = this.output.scrollHeight;
  }

  addLine(text, isInput = false) {
    const line = document.createElement('div');
    line.className = 'terminal-line';

    const prompt = document.createElement('span');
    prompt.className = 'prompt';
    prompt.textContent = isInput ? 'USER>' : 'NEXUS>';

    const content = document.createElement('span');
    content.className = 'output';
    content.textContent = text;

    line.appendChild(prompt);
    line.appendChild(content);
    this.output.appendChild(line);
  }

  navigateHistory(direction) {
    this.historyIndex = Math.max(0, Math.min(this.commandHistory.length, this.historyIndex + direction));

    if (this.historyIndex < this.commandHistory.length) {
      this.input.value = this.commandHistory[this.historyIndex];
    } else {
      this.input.value = '';
    }
  }

  aiResponse(message) {
    // Placeholder AI responses - in production, this would call an AI API
    const responses = [
      `I've analyzed your message: "${message}". Interesting correlation with your ${this.getRandomDomain()} domain.`,
      `Processing "${message}"... I've identified ${Math.floor(Math.random() * 5) + 1} potential connections in your graph.`,
      `"${message}" - I see patterns emerging between your work and ${this.getRandomDomain()} nodes.`,
      `Your message resonates with node clusters in ${this.getRandomDomain()}. Shall we explore deeper?`,
      `Analyzing semantic relationships for "${message}"... Consider connecting to your ${this.getRandomDomain()} domain.`,
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  }

  getRandomDomain() {
    const domains = ['physical', 'work', 'design', 'music', 'ai'];
    return domains[Math.floor(Math.random() * domains.length)];
  }

  seedGraph() {
    // Create sample nodes across domains
    const physical = [
      this.graph.createNode('activity', 'physical', { label: 'Morning Run' }),
      this.graph.createNode('location', 'physical', { label: 'Home Office' }),
      this.graph.createNode('metric', 'physical', { label: 'Energy Level' }),
    ];

    const work = [
      this.graph.createNode('project', 'work', { label: 'NEXUS Development' }),
      this.graph.createNode('task', 'work', { label: 'Graph Visualization' }),
      this.graph.createNode('meeting', 'work', { label: 'Team Sync' }),
    ];

    const design = [
      this.graph.createNode('project', 'design', { label: 'Cyberpunk UI Kit' }),
      this.graph.createNode('inspiration', 'design', { label: 'Severance Aesthetics' }),
    ];

    const music = [
      this.graph.createNode('track', 'music', { label: 'Cosmic Drift' }),
      this.graph.createNode('sample', 'music', { label: 'Synth Pad' }),
    ];

    const ai = [
      this.graph.createNode('insight', 'ai', { label: 'Pattern Recognition' }),
      this.graph.createNode('conversation', 'ai', { label: 'Creative Ideation' }),
    ];

    // Create some connections
    this.graph.createEdge(physical[0].id, physical[2].id, 'influences', 0.8);
    this.graph.createEdge(physical[2].id, work[0].id, 'affects', 0.6);
    this.graph.createEdge(work[0].id, work[1].id, 'contains', 1.0);
    this.graph.createEdge(work[0].id, design[0].id, 'requires', 0.7);
    this.graph.createEdge(design[1].id, design[0].id, 'inspires', 0.9);
    this.graph.createEdge(music[0].id, music[1].id, 'uses', 0.8);
    this.graph.createEdge(design[0].id, music[0].id, 'influences', 0.5);
    this.graph.createEdge(ai[0].id, work[0].id, 'supports', 0.7);
    this.graph.createEdge(ai[1].id, design[0].id, 'contributes', 0.6);
    this.graph.createEdge(ai[1].id, music[0].id, 'inspires', 0.5);
  }
}
