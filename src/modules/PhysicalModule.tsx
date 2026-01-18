import { useState } from 'react'
import { useGraphStore } from '@/store/useGraphStore'
import { Card, CardHeader, CardBody, Button, Input } from '@components/UI'
import './ModuleStyles.scss'

export const PhysicalModule = () => {
  const { getNodesByDomain, createNode, deleteNode } = useGraphStore()
  const nodes = getNodesByDomain('physical')

  const [newLabel, setNewLabel] = useState('')
  const [newType, setNewType] = useState<'activity' | 'location' | 'metric'>('activity')

  const handleCreate = () => {
    if (!newLabel.trim()) return

    createNode(newType, 'physical', {
      label: newLabel,
      description: '',
    })

    setNewLabel('')
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this node?')) {
      deleteNode(id)
    }
  }

  return (
    <div className="module-container">
      <div className="module-header">
        <h2 className="module-title glow-text">♢ PHYSICAL</h2>
        <p className="module-description">Track activities, locations, and metrics</p>
      </div>

      {/* Create Form */}
      <Card glow className="create-card">
        <CardHeader>CREATE NEW</CardHeader>
        <CardBody>
          <div className="form-group">
            <label className="form-label">Type:</label>
            <div className="button-group">
              <Button
                size="sm"
                variant={newType === 'activity' ? 'primary' : 'ghost'}
                onClick={() => setNewType('activity')}
              >
                Activity
              </Button>
              <Button
                size="sm"
                variant={newType === 'location' ? 'primary' : 'ghost'}
                onClick={() => setNewType('location')}
              >
                Location
              </Button>
              <Button
                size="sm"
                variant={newType === 'metric' ? 'primary' : 'ghost'}
                onClick={() => setNewType('metric')}
              >
                Metric
              </Button>
            </div>
          </div>

          <Input
            label="Label"
            value={newLabel}
            onChange={setNewLabel}
            placeholder="Enter label..."
          />

          <Button onClick={handleCreate} disabled={!newLabel.trim()}>
            Create {newType}
          </Button>
        </CardBody>
      </Card>

      {/* Node List */}
      <div className="node-list">
        <h3 className="list-title">
          {nodes.length} {nodes.length === 1 ? 'Node' : 'Nodes'}
        </h3>
        {nodes.map((node) => (
          <Card key={node.id} className="node-card" interactive>
            <CardBody>
              <div className="node-card-content">
                <div className="node-info">
                  <h4 className="node-label">{node.data.label}</h4>
                  <p className="node-type">{node.type}</p>
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(node.id)}
                >
                  Delete
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
        {nodes.length === 0 && (
          <p className="empty-state">No physical nodes yet. Create one above!</p>
        )}
      </div>
    </div>
  )
}
