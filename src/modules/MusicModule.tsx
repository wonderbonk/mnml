import { useState } from 'react'
import { useGraphStore } from '@/store/useGraphStore'
import { Card, CardHeader, CardBody, Button, Input } from '@components/UI'
import './ModuleStyles.scss'

export const MusicModule = () => {
  const { getNodesByDomain, createNode, deleteNode } = useGraphStore()
  const nodes = getNodesByDomain('music')
  const [newLabel, setNewLabel] = useState('')
  const [newType, setNewType] = useState<'track' | 'sample'>('track')

  const handleCreate = () => {
    if (!newLabel.trim()) return
    createNode(newType, 'music', { label: newLabel })
    setNewLabel('')
  }

  return (
    <div className="module-container">
      <div className="module-header">
        <h2 className="module-title glow-text">♪ MUSIC</h2>
        <p className="module-description">Organize tracks and samples</p>
      </div>
      <Card glow className="create-card">
        <CardHeader>CREATE NEW</CardHeader>
        <CardBody>
          <div className="button-group">
            <Button size="sm" variant={newType === 'track' ? 'primary' : 'ghost'} onClick={() => setNewType('track')}>Track</Button>
            <Button size="sm" variant={newType === 'sample' ? 'primary' : 'ghost'} onClick={() => setNewType('sample')}>Sample</Button>
          </div>
          <Input label="Name" value={newLabel} onChange={setNewLabel} placeholder="Enter name..." />
          <Button onClick={handleCreate} disabled={!newLabel.trim()}>Create {newType}</Button>
        </CardBody>
      </Card>
      <div className="node-list">
        <h3 className="list-title">{nodes.length} Items</h3>
        {nodes.map((node) => (
          <Card key={node.id} className="node-card" interactive>
            <CardBody>
              <div className="node-card-content">
                <div className="node-info">
                  <h4 className="node-label">{node.data.label}</h4>
                  <p className="node-type">{node.type}</p>
                </div>
                <Button variant="danger" size="sm" onClick={() => deleteNode(node.id)}>Delete</Button>
              </div>
            </CardBody>
          </Card>
        ))}
        {nodes.length === 0 && <p className="empty-state">No music items yet!</p>}
      </div>
    </div>
  )
}
