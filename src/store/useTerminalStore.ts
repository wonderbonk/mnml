import { create } from 'zustand'
import type { TerminalLine, TerminalOutputType } from '@/types'
import { v4 as uuidv4 } from 'uuid'

interface TerminalStore {
  // State
  history: TerminalLine[]
  commandHistory: string[]
  historyIndex: number
  isExpanded: boolean
  height: number

  // Actions
  addOutput: (content: string, type?: TerminalOutputType) => void
  addOutputs: (lines: TerminalLine[]) => void
  addToCommandHistory: (command: string) => void
  navigateHistory: (direction: 'up' | 'down') => string | null
  toggleExpanded: () => void
  setHeight: (height: number) => void
  clearHistory: () => void
}

const MIN_HEIGHT = 60
const MAX_HEIGHT = 600
const DEFAULT_HEIGHT = 300

export const useTerminalStore = create<TerminalStore>((set, get) => ({
  // Initial state
  history: [
    {
      id: uuidv4(),
      type: 'system',
      content: '='.repeat(80),
      timestamp: Date.now(),
    },
    {
      id: uuidv4(),
      type: 'system',
      content: '███╗   ██╗███████╗██╗  ██╗██╗   ██╗███████╗',
      timestamp: Date.now(),
    },
    {
      id: uuidv4(),
      type: 'system',
      content: '████╗  ██║██╔════╝╚██╗██╔╝██║   ██║██╔════╝',
      timestamp: Date.now(),
    },
    {
      id: uuidv4(),
      type: 'system',
      content: '██╔██╗ ██║█████╗   ╚███╔╝ ██║   ██║███████╗',
      timestamp: Date.now(),
    },
    {
      id: uuidv4(),
      type: 'system',
      content: '██║╚██╗██║██╔══╝   ██╔██╗ ██║   ██║╚════██║',
      timestamp: Date.now(),
    },
    {
      id: uuidv4(),
      type: 'system',
      content: '██║ ╚████║███████╗██╔╝ ██╗╚██████╔╝███████║',
      timestamp: Date.now(),
    },
    {
      id: uuidv4(),
      type: 'system',
      content: '╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝',
      timestamp: Date.now(),
    },
    {
      id: uuidv4(),
      type: 'system',
      content: '='.repeat(80),
      timestamp: Date.now(),
    },
    {
      id: uuidv4(),
      type: 'info',
      content: 'NEXUS Terminal v2.0.0 - Graph-Based Personal Operating System',
      timestamp: Date.now(),
    },
    {
      id: uuidv4(),
      type: 'info',
      content: 'Type "help" for available commands',
      timestamp: Date.now(),
    },
    {
      id: uuidv4(),
      type: 'system',
      content: '',
      timestamp: Date.now(),
    },
  ],
  commandHistory: [],
  historyIndex: -1,
  isExpanded: false,
  height: DEFAULT_HEIGHT,

  // Actions
  addOutput: (content, type = 'info') => {
    const line: TerminalLine = {
      id: uuidv4(),
      type,
      content,
      timestamp: Date.now(),
    }
    set((state) => ({
      history: [...state.history, line],
    }))
  },

  addOutputs: (lines) => {
    set((state) => ({
      history: [...state.history, ...lines],
    }))
  },

  addToCommandHistory: (command) => {
    set((state) => ({
      commandHistory: [...state.commandHistory, command],
      historyIndex: -1,
    }))
  },

  navigateHistory: (direction) => {
    const { commandHistory, historyIndex } = get()
    if (commandHistory.length === 0) return null

    let newIndex = historyIndex

    if (direction === 'up') {
      newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex
    } else {
      newIndex = historyIndex > -1 ? historyIndex - 1 : -1
    }

    set({ historyIndex: newIndex })

    if (newIndex === -1) return ''
    return commandHistory[commandHistory.length - 1 - newIndex]
  },

  toggleExpanded: () => {
    set((state) => ({
      isExpanded: !state.isExpanded,
      height: !state.isExpanded ? MAX_HEIGHT : DEFAULT_HEIGHT,
    }))
  },

  setHeight: (height) => {
    const clampedHeight = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, height))
    set({ height: clampedHeight })
  },

  clearHistory: () => {
    set({
      history: [
        {
          id: uuidv4(),
          type: 'system',
          content: 'Terminal cleared',
          timestamp: Date.now(),
        },
      ],
    })
  },
}))
