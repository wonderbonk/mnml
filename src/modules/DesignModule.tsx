import { useState } from 'react'
import { useGraphStore } from '@/store/useGraphStore'
import { Card, CardHeader, CardBody, Button, Input } from '@components/UI'
import './ModuleStyles.scss'

export const DesignModule = () => {
  const { getNodesByDomain, createNode, deleteNode } = useGraphStore()
  const nodes = getNodesByDomain('design')
  const [newLabel, setNewLabel] = useState('')

  const handleCreate = () => {
    if (!newLabel.trim()) return
    createNode('project', 'design', { label: newLabel })
    setNewLabel('')
  }

  return (
    <div className="module-container">
      <div className="module-header">
        <h2 className="module-title glow-text">◧ DESIGN</h2>
        <p className="module-description">Track design projects and inspiration</p>
      </div>
      <Card glow className="create-card">
        <CardHeader>CREATE PROJECT</CardHeader>
        <CardBody>
          <Input label="Project Name" value={newLabel} onChange={setNewLabel} placeholder="Enter name..." />
          <Button onClick={handleCreate} disabled={!newLabel.trim()}>Create Project</Button>
        </CardBody>
      </Card>
      <div className="node-list">
        <h3 className="list-title">{nodes.length} Projects</h3>
        {nodes.map((node) => (
          <Card key={node.id} className="node-card" interactive>
            <CardBody>
              <div className="node-card-content">
                <h4 className="node-label">{node.data.label}</h4>
                <Button variant="danger" size="sm" onClick={() => deleteNode(node.id)}>Delete</Button>
              </div>
            </CardBody>
          </Card>
        ))}
        {nodes.length === 0 && <p className="empty-state">No design projects yet!</p>}
      </div>
    </div>
  )
}
