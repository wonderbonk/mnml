import { useGraphStore } from '@/store/useGraphStore'
import { Card, CardHeader, CardBody } from '@components/UI'
import './ModuleStyles.scss'

export const GraphModule = () => {
  const { stats } = useGraphStore()

  return (
    <div className="module-container">
      <div className="module-header">
        <h2 className="module-title glow-text">◈ GRAPH</h2>
        <p className="module-description">View graph statistics and overview</p>
      </div>

      <Card glow className="stats-card">
        <CardHeader>STATISTICS</CardHeader>
        <CardBody>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">Total Nodes</span>
              <span className="stat-value glow-text">{stats.nodeCount}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Total Edges</span>
              <span className="stat-value glow-text">{stats.edgeCount}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Avg Degree</span>
              <span className="stat-value glow-text">{stats.avgDegree.toFixed(2)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Density</span>
              <span className="stat-value glow-text">{(stats.density * 100).toFixed(1)}%</span>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card glow className="stats-card">
        <CardHeader>DOMAINS</CardHeader>
        <CardBody>
          <div className="domain-stats">
            {Object.entries(stats.domains).map(([domain, count]) => (
              <div key={domain} className="domain-stat-item">
                <span className="domain-name">{domain.toUpperCase()}</span>
                <span className="domain-count glow-text">{count}</span>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      <Card className="info-card">
        <CardHeader>ABOUT</CardHeader>
        <CardBody>
          <p className="info-text">
            The graph view shows all nodes and their connections across domains.
            Click nodes to view details. Use the terminal for advanced operations.
          </p>
        </CardBody>
      </Card>
    </div>
  )
}
