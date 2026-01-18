import { useState, useRef, useEffect } from 'react'
import { useTerminalStore } from '@/store/useTerminalStore'

interface TerminalInputProps {
  onCommand: (command: string) => void
}

export const TerminalInput = ({ onCommand }: TerminalInputProps) => {
  const [input, setInput] = useState('')
  const { addToCommandHistory, navigateHistory } = useTerminalStore()
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-focus input
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (input.trim()) {
      addToCommandHistory(input)
      onCommand(input)
      setInput('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Command history navigation
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      const historicCommand = navigateHistory('up')
      if (historicCommand !== null) {
        setInput(historicCommand)
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const historicCommand = navigateHistory('down')
      if (historicCommand !== null) {
        setInput(historicCommand)
      }
    }
  }

  return (
    <form className="terminal-input-container" onSubmit={handleSubmit}>
      <span className="terminal-prompt glow-text">{'>'}</span>
      <input
        ref={inputRef}
        type="text"
        className="terminal-input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a command..."
        autoComplete="off"
        spellCheck={false}
      />
      <div className="terminal-cursor" />
    </form>
  )
}
