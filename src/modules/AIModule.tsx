import { useState } from 'react'
import { useGraphStore } from '@/store/useGraphStore'
import { Card, CardHeader, CardBody, Button, Input, TextArea } from '@components/UI'
import './ModuleStyles.scss'

export const AIModule = () => {
  const { getNodesByDomain, createNode, deleteNode } = useGraphStore()
  const nodes = getNodesByDomain('ai')
  const [newLabel, setNewLabel] = useState('')
  const [newContent, setNewContent] = useState('')

  const handleCreate = () => {
    if (!newLabel.trim()) return
    createNode('insight', 'ai', {
      label: newLabel,
      content: newContent
    })
    setNewLabel('')
    setNewContent('')
  }

  return (
    <div className="module-container">
      <div className="module-header">
        <h2 className="module-title glow-text">◉ AI</h2>
        <p className="module-description">Capture insights and conversations</p>
      </div>
      <Card glow className="create-card">
        <CardHeader>CREATE INSIGHT</CardHeader>
        <CardBody>
          <Input label="Title" value={newLabel} onChange={setNewLabel} placeholder="Insight title..." />
          <TextArea label="Content" value={newContent} onChange={setNewContent} placeholder="Insight content..." rows={3} />
          <Button onClick={handleCreate} disabled={!newLabel.trim()}>Create Insight</Button>
        </CardBody>
      </Card>
      <div className="node-list">
        <h3 className="list-title">{nodes.length} Insights</h3>
        {nodes.map((node) => (
          <Card key={node.id} className="node-card" interactive>
            <CardBody>
              <div className="node-card-content">
                <div className="node-info">
                  <h4 className="node-label">{node.data.label}</h4>
                  {node.data.content && <p className="node-content">{node.data.content}</p>}
                </div>
                <Button variant="danger" size="sm" onClick={() => deleteNode(node.id)}>Delete</Button>
              </div>
            </CardBody>
          </Card>
        ))}
        {nodes.length === 0 && <p className="empty-state">No AI insights yet!</p>}
      </div>
    </div>
  )
}
