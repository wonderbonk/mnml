import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useTerminalStore } from '@/store/useTerminalStore'
import clsx from 'clsx'

export const TerminalOutput = () => {
  const { history } = useTerminalStore()
  const outputRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new output is added
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [history])

  const getLineClass = (type: string) => {
    return clsx('terminal-line', `terminal-line-${type}`)
  }

  return (
    <div className="terminal-output" ref={outputRef}>
      {history.map((line, index) => (
        <motion.div
          key={line.id}
          className={getLineClass(line.type)}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.1,
            delay: index === history.length - 1 ? 0 : 0,
          }}
        >
          {line.content}
        </motion.div>
      ))}
    </div>
  )
}
