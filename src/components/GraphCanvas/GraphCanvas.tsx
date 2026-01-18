import { useEffect, useRef } from 'react'
import { useGraphStore } from '@/store/useGraphStore'
import { graphEngine } from '@core/GraphEngine'
import './GraphCanvas.scss'

export const GraphCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { nodes, edges, selectedNodeId, selectNode } = useGraphStore()
  const animationFrameRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resize = () => {
      canvas.width = canvas.clientWidth
      canvas.height = canvas.clientHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Animation loop
    let lastTime = performance.now()
    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime
      lastTime = currentTime

      // Apply physics
      graphEngine.applyPhysics(deltaTime)

      // Clear canvas
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Center view
      ctx.save()
      ctx.translate(canvas.width / 2, canvas.height / 2)

      // Draw edges
      ctx.strokeStyle = 'rgba(0, 255, 65, 0.3)'
      ctx.lineWidth = 1
      edges.forEach((edge) => {
        const source = nodes.find((n) => n.id === edge.source)
        const target = nodes.find((n) => n.id === edge.target)
        if (!source || !target) return

        ctx.beginPath()
        ctx.moveTo(source.position.x, source.position.y)
        ctx.lineTo(target.position.x, target.position.y)
        ctx.stroke()
      })

      // Draw nodes
      nodes.forEach((node) => {
        const isSelected = node.id === selectedNodeId
        const radius = isSelected ? 8 : 6

        // Glow effect
        if (isSelected) {
          const gradient = ctx.createRadialGradient(
            node.position.x,
            node.position.y,
            0,
            node.position.x,
            node.position.y,
            radius * 3
          )
          gradient.addColorStop(0, 'rgba(0, 255, 65, 0.5)')
          gradient.addColorStop(1, 'rgba(0, 255, 65, 0)')
          ctx.fillStyle = gradient
          ctx.beginPath()
          ctx.arc(node.position.x, node.position.y, radius * 3, 0, Math.PI * 2)
          ctx.fill()
        }

        // Node circle
        ctx.fillStyle = isSelected ? '#00ff41' : '#00cc33'
        ctx.beginPath()
        ctx.arc(node.position.x, node.position.y, radius, 0, Math.PI * 2)
        ctx.fill()

        // Node label (for selected nodes)
        if (isSelected) {
          ctx.fillStyle = '#00ff41'
          ctx.font = '12px "JetBrains Mono"'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'top'
          ctx.shadowColor = '#00ff41'
          ctx.shadowBlur = 10
          ctx.fillText(node.data.label, node.position.x, node.position.y + radius + 5)
          ctx.shadowBlur = 0
        }
      })

      ctx.restore()

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    // Handle clicks
    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left - canvas.width / 2
      const y = e.clientY - rect.top - canvas.height / 2

      // Find clicked node
      const clickedNode = nodes.find((node) => {
        const dx = node.position.x - x
        const dy = node.position.y - y
        const distance = Math.sqrt(dx * dx + dy * dy)
        return distance < 10
      })

      selectNode(clickedNode ? clickedNode.id : null)
    }

    canvas.addEventListener('click', handleClick)

    return () => {
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('click', handleClick)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [nodes, edges, selectedNodeId])

  return (
    <div className="graph-canvas-container">
      <canvas ref={canvasRef} className="graph-canvas" />
      {selectedNodeId && (
        <div className="node-info-panel">
          {(() => {
            const node = nodes.find((n) => n.id === selectedNodeId)
            if (!node) return null
            return (
              <div>
                <h3>{node.data.label}</h3>
                <p>{node.type} / {node.domain}</p>
                <p className="node-id">{node.id}</p>
              </div>
            )
          })()}
        </div>
      )}
    </div>
  )
}
