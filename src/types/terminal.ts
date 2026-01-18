export type TerminalOutputType = 'success' | 'error' | 'info' | 'warning' | 'system' | 'input'

export interface TerminalLine {
  id: string
  type: TerminalOutputType
  content: string
  timestamp: number
}

export interface TerminalCommand {
  name: string
  description: string
  usage: string
  execute: (args: string[]) => Promise<TerminalLine | TerminalLine[]>
}

export interface TerminalState {
  history: TerminalLine[]
  commandHistory: string[]
  historyIndex: number
  isExpanded: boolean
  height: number
}
