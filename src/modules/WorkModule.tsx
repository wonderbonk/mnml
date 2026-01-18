import { useState } from 'react'
import { useGraphStore } from '@/store/useGraphStore'
import { Card, CardHeader, CardBody, Button, Input } from '@components/UI'
import './ModuleStyles.scss'

export const WorkModule = () => {
  const { getNodesByDomain, createNode, deleteNode } = useGraphStore()
  const nodes = getNodesByDomain('work')

  const [newLabel, setNewLabel] = useState('')
  const [newType, setNewType] = useState<'project' | 'task' | 'meeting'>('task')

  const handleCreate = () => {
    if (!newLabel.trim()) return
    createNode(newType, 'work', { label: newLabel })
    setNewLabel('')
  }

  const handleDelete = (id: string) => {
    if (confirm('Delete this node?')) deleteNode(id)
  }

  return (
    <div className="module-container">
      <div className="module-header">
        <h2 className="module-title glow-text">▣ WORK</h2>
        <p className="module-description">Manage projects, tasks, and meetings</p>
      </div>

      <Card glow className="create-card">
        <CardHeader>CREATE NEW</CardHeader>
        <CardBody>
          <div className="form-group">
            <div className="button-group">
              <Button size="sm" variant={newType === 'project' ? 'primary' : 'ghost'} onClick={() => setNewType('project')}>Project</Button>
              <Button size="sm" variant={newType === 'task' ? 'primary' : 'ghost'} onClick={() => setNewType('task')}>Task</Button>
              <Button size="sm" variant={newType === 'meeting' ? 'primary' : 'ghost'} onClick={() => setNewType('meeting')}>Meeting</Button>
            </div>
          </div>
          <Input label="Label" value={newLabel} onChange={setNewLabel} placeholder="Enter label..." />
          <Button onClick={handleCreate} disabled={!newLabel.trim()}>Create {newType}</Button>
        </CardBody>
      </Card>

      <div className="node-list">
        <h3 className="list-title">{nodes.length} {nodes.length === 1 ? 'Node' : 'Nodes'}</h3>
        {nodes.map((node) => (
          <Card key={node.id} className="node-card" interactive>
            <CardBody>
              <div className="node-card-content">
                <div className="node-info">
                  <h4 className="node-label">{node.data.label}</h4>
                  <p className="node-type">{node.type}</p>
                </div>
                <Button variant="danger" size="sm" onClick={() => handleDelete(node.id)}>Delete</Button>
              </div>
            </CardBody>
          </Card>
        ))}
        {nodes.length === 0 && <p className="empty-state">No work nodes yet. Create one above!</p>}
      </div>
    </div>
  )
}
