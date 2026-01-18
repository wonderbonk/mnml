import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTerminalStore } from '@/store/useTerminalStore'
import { terminalCommands } from '@core/TerminalCommands'
import { TerminalOutput } from './TerminalOutput'
import { TerminalInput } from './TerminalInput'
import './Terminal.scss'

export const Terminal = () => {
  const { isExpanded, height, toggleExpanded, setHeight, addOutputs, clearHistory } =
    useTerminalStore()
  const [isDragging, setIsDragging] = useState(false)
  const dragStartY = useRef(0)
  const dragStartHeight = useRef(0)

  // Handle command execution
  const handleCommand = async (command: string) => {
    if (command.toLowerCase() === 'clear') {
      clearHistory()
      return
    }

    const output = await terminalCommands.execute(command)
    addOutputs(output)
  }

  // Handle drag resize
  const handleDragStart = (e: React.MouseEvent) => {
    setIsDragging(true)
    dragStartY.current = e.clientY
    dragStartHeight.current = height
  }

  const handleDragMove = (e: MouseEvent) => {
    if (!isDragging) return

    const deltaY = dragStartY.current - e.clientY
    const newHeight = dragStartHeight.current + deltaY
    setHeight(newHeight)
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDragMove)
      window.addEventListener('mouseup', handleDragEnd)

      return () => {
        window.removeEventListener('mousemove', handleDragMove)
        window.removeEventListener('mouseup', handleDragEnd)
      }
    }
  }, [isDragging])

  return (
    <motion.div
      className="terminal-container"
      initial={false}
      animate={{
        height: isExpanded ? height : 60,
      }}
      transition={{
        type: 'spring',
        damping: 30,
        stiffness: 300,
      }}
    >
      {/* Resize Handle */}
      <div
        className={`terminal-resize-handle ${isDragging ? 'dragging' : ''}`}
        onMouseDown={handleDragStart}
      >
        <div className="resize-indicator">
          <span />
          <span />
          <span />
        </div>
      </div>

      {/* Terminal Header */}
      <div className="terminal-header" onClick={toggleExpanded}>
        <div className="terminal-title">
          <span className="terminal-icon">▸</span>
          <span className="terminal-label">NEXUS TERMINAL</span>
        </div>
        <div className="terminal-status">
          <span className="status-indicator pulse-glow" />
          <span className="status-text">ACTIVE</span>
        </div>
        <button className="terminal-expand-btn" onClick={toggleExpanded}>
          <motion.span
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            ▼
          </motion.span>
        </button>
      </div>

      {/* Terminal Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="terminal-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <TerminalOutput />
            <TerminalInput onCommand={handleCommand} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
