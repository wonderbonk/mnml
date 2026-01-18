import { graphEngine } from './GraphEngine'
import type { TerminalLine, Domain, NodeType, EdgeType } from '@/types'
import { v4 as uuidv4 } from 'uuid'

export class TerminalCommands {
  private commands: Map<string, (args: string[]) => Promise<TerminalLine | TerminalLine[]>>

  constructor() {
    this.commands = new Map()
    this.registerCommands()
  }

  private registerCommands() {
    // Help command
    this.commands.set('help', async () => {
      return [
        this.createLine('Available Commands:', 'info'),
        this.createLine('', 'info'),
        this.createLine('CRUD OPERATIONS:', 'success'),
        this.createLine('  create <type> <domain> <label>     - Create a new node', 'info'),
        this.createLine('  update <id> <field> <value>        - Update a node', 'info'),
        this.createLine('  delete <id>                        - Delete a node', 'info'),
        this.createLine('  connect <sourceId> <targetId>      - Create an edge', 'info'),
        this.createLine('  disconnect <edgeId>                - Delete an edge', 'info'),
        this.createLine('', 'info'),
        this.createLine('QUERIES:', 'success'),
        this.createLine('  list [domain]                      - List all nodes or by domain', 'info'),
        this.createLine('  search <query>                     - Search nodes by label', 'info'),
        this.createLine('  show <id>                          - Show node details', 'info'),
        this.createLine('  stats                              - Show graph statistics', 'info'),
        this.createLine('', 'info'),
        this.createLine('SYSTEM:', 'success'),
        this.createLine('  clear                              - Clear terminal', 'info'),
        this.createLine('  theme <name>                       - Change theme (matrix/lumon/starwars/cyberpunk)', 'info'),
        this.createLine('  export                             - Export graph as JSON', 'info'),
        this.createLine('  help                               - Show this help', 'info'),
      ]
    })

    // Create command
    this.commands.set('create', async (args) => {
      if (args.length < 3) {
        return this.createLine('Usage: create <type> <domain> <label>', 'error')
      }

      const [type, domain, ...labelParts] = args
      const label = labelParts.join(' ')

      try {
        const node = graphEngine.createNode(type as NodeType, domain as Domain, { label })
        return this.createLine(`✓ Created node: ${node.data.label} (${node.id})`, 'success')
      } catch (error) {
        return this.createLine(`✗ Error: ${(error as Error).message}`, 'error')
      }
    })

    // Update command
    this.commands.set('update', async (args) => {
      if (args.length < 3) {
        return this.createLine('Usage: update <id> <field> <value>', 'error')
      }

      const [id, field, ...valueParts] = args
      const value = valueParts.join(' ')

      try {
        const updates: any = {}

        // Handle nested fields
        if (field.startsWith('data.')) {
          const dataField = field.replace('data.', '')
          updates.data = { [dataField]: value }
        } else if (field.startsWith('metadata.')) {
          const metaField = field.replace('metadata.', '')
          updates.metadata = { [metaField]: value }
        } else {
          updates[field] = value
        }

        const node = graphEngine.updateNode(id, updates)
        return this.createLine(`✓ Updated node: ${node.data.label}`, 'success')
      } catch (error) {
        return this.createLine(`✗ Error: ${(error as Error).message}`, 'error')
      }
    })

    // Delete command
    this.commands.set('delete', async (args) => {
      if (args.length < 1) {
        return this.createLine('Usage: delete <id>', 'error')
      }

      const [id] = args

      try {
        const success = graphEngine.deleteNode(id)
        if (success) {
          return this.createLine(`✓ Deleted node: ${id}`, 'success')
        } else {
          return this.createLine(`✗ Node not found: ${id}`, 'error')
        }
      } catch (error) {
        return this.createLine(`✗ Error: ${(error as Error).message}`, 'error')
      }
    })

    // Connect command
    this.commands.set('connect', async (args) => {
      if (args.length < 2) {
        return this.createLine('Usage: connect <sourceId> <targetId> [type] [weight]', 'error')
      }

      const [sourceId, targetId, type = 'relates', weight = '0.5'] = args

      try {
        const edge = graphEngine.createEdge(
          sourceId,
          targetId,
          type as EdgeType,
          parseFloat(weight)
        )
        return this.createLine(`✓ Created edge: ${edge.id}`, 'success')
      } catch (error) {
        return this.createLine(`✗ Error: ${(error as Error).message}`, 'error')
      }
    })

    // Disconnect command
    this.commands.set('disconnect', async (args) => {
      if (args.length < 1) {
        return this.createLine('Usage: disconnect <edgeId>', 'error')
      }

      const [id] = args

      try {
        const success = graphEngine.deleteEdge(id)
        if (success) {
          return this.createLine(`✓ Deleted edge: ${id}`, 'success')
        } else {
          return this.createLine(`✗ Edge not found: ${id}`, 'error')
        }
      } catch (error) {
        return this.createLine(`✗ Error: ${(error as Error).message}`, 'error')
      }
    })

    // List command
    this.commands.set('list', async (args) => {
      const domain = args[0] as Domain | undefined
      const nodes = domain ? graphEngine.getNodesByDomain(domain) : graphEngine.getAllNodes()

      if (nodes.length === 0) {
        return this.createLine('No nodes found', 'warning')
      }

      const lines: TerminalLine[] = [
        this.createLine(`Found ${nodes.length} node(s):`, 'info'),
        this.createLine('', 'info'),
      ]

      nodes.forEach((node) => {
        lines.push(
          this.createLine(
            `  [${node.domain}] ${node.data.label} - ${node.type} (${node.id.substring(0, 8)}...)`,
            'info'
          )
        )
      })

      return lines
    })

    // Search command
    this.commands.set('search', async (args) => {
      if (args.length < 1) {
        return this.createLine('Usage: search <query>', 'error')
      }

      const query = args.join(' ')
      const nodes = graphEngine.searchNodes(query)

      if (nodes.length === 0) {
        return this.createLine(`No nodes found matching "${query}"`, 'warning')
      }

      const lines: TerminalLine[] = [
        this.createLine(`Found ${nodes.length} node(s) matching "${query}":`, 'info'),
        this.createLine('', 'info'),
      ]

      nodes.forEach((node) => {
        lines.push(
          this.createLine(
            `  ${node.data.label} - ${node.domain}/${node.type} (${node.id.substring(0, 8)}...)`,
            'info'
          )
        )
      })

      return lines
    })

    // Show command
    this.commands.set('show', async (args) => {
      if (args.length < 1) {
        return this.createLine('Usage: show <id>', 'error')
      }

      const [id] = args
      const node = graphEngine.getNode(id)

      if (!node) {
        return this.createLine(`Node not found: ${id}`, 'error')
      }

      const connected = graphEngine.getConnectedNodes(id)
      const edges = graphEngine.getNodeEdges(id)

      return [
        this.createLine('─'.repeat(80), 'info'),
        this.createLine(`Node: ${node.data.label}`, 'success'),
        this.createLine(`ID: ${node.id}`, 'info'),
        this.createLine(`Type: ${node.type}`, 'info'),
        this.createLine(`Domain: ${node.domain}`, 'info'),
        this.createLine(`Created: ${new Date(node.metadata.created).toLocaleString()}`, 'info'),
        this.createLine(`Updated: ${new Date(node.metadata.updated).toLocaleString()}`, 'info'),
        this.createLine(`Connections: ${connected.length}`, 'info'),
        this.createLine(`Edges: ${edges.length}`, 'info'),
        this.createLine('─'.repeat(80), 'info'),
      ]
    })

    // Stats command
    this.commands.set('stats', async () => {
      const stats = graphEngine.getStats()

      return [
        this.createLine('─'.repeat(80), 'info'),
        this.createLine('NEXUS GRAPH STATISTICS', 'success'),
        this.createLine('─'.repeat(80), 'info'),
        this.createLine(`Total Nodes: ${stats.nodeCount}`, 'info'),
        this.createLine(`Total Edges: ${stats.edgeCount}`, 'info'),
        this.createLine(`Average Degree: ${stats.avgDegree.toFixed(2)}`, 'info'),
        this.createLine(`Graph Density: ${(stats.density * 100).toFixed(2)}%`, 'info'),
        this.createLine('', 'info'),
        this.createLine('Nodes by Domain:', 'success'),
        this.createLine(`  Graph: ${stats.domains.graph}`, 'info'),
        this.createLine(`  Physical: ${stats.domains.physical}`, 'info'),
        this.createLine(`  Work: ${stats.domains.work}`, 'info'),
        this.createLine(`  Design: ${stats.domains.design}`, 'info'),
        this.createLine(`  Music: ${stats.domains.music}`, 'info'),
        this.createLine(`  AI: ${stats.domains.ai}`, 'info'),
        this.createLine('─'.repeat(80), 'info'),
      ]
    })

    // Export command
    this.commands.set('export', async () => {
      const data = graphEngine.toJSON()
      const json = JSON.stringify(data, null, 2)

      // Copy to clipboard
      try {
        await navigator.clipboard.writeText(json)
        return this.createLine('✓ Graph exported to clipboard as JSON', 'success')
      } catch {
        console.log(json)
        return this.createLine('✓ Graph exported to console (clipboard not available)', 'success')
      }
    })

    // Clear command (handled by terminal component)
    this.commands.set('clear', async () => {
      return this.createLine('', 'system')
    })
  }

  async execute(input: string): Promise<TerminalLine[]> {
    const trimmed = input.trim()
    if (!trimmed) return []

    // Parse command and arguments
    const parts = trimmed.split(/\s+/)
    const commandName = parts[0].toLowerCase()
    const args = parts.slice(1)

    // Add input to history
    const inputLine = this.createLine(`> ${input}`, 'input')

    // Execute command
    const command = this.commands.get(commandName)
    if (!command) {
      return [
        inputLine,
        this.createLine(`Unknown command: ${commandName}. Type "help" for available commands.`, 'error'),
      ]
    }

    try {
      const result = await command(args)
      const resultLines = Array.isArray(result) ? result : [result]
      return [inputLine, ...resultLines]
    } catch (error) {
      return [
        inputLine,
        this.createLine(`Error executing command: ${(error as Error).message}`, 'error'),
      ]
    }
  }

  private createLine(content: string, type: TerminalLine['type']): TerminalLine {
    return {
      id: uuidv4(),
      type,
      content,
      timestamp: Date.now(),
    }
  }
}

export const terminalCommands = new TerminalCommands()
