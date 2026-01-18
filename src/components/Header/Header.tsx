import { motion } from 'framer-motion'
import { useThemeStore } from '@/store/useThemeStore'
import { useGraphStore } from '@/store/useGraphStore'
import type { Domain, ThemePreset } from '@/types'
import './Header.scss'

interface HeaderProps {
  activeDomain: Domain | null
  onDomainChange: (domain: Domain | null) => void
}

const domains: { id: Domain; label: string; icon: string }[] = [
  { id: 'graph', label: 'GRAPH', icon: '◈' },
  { id: 'physical', label: 'PHYSICAL', icon: '♢' },
  { id: 'work', label: 'WORK', icon: '▣' },
  { id: 'design', label: 'DESIGN', icon: '◧' },
  { id: 'music', label: 'MUSIC', icon: '♪' },
  { id: 'ai', label: 'AI', icon: '◉' },
]

const themes: { id: ThemePreset; label: string }[] = [
  { id: 'matrix', label: 'MATRIX' },
  { id: 'lumon', label: 'LUMON' },
  { id: 'starwars', label: 'STAR WARS' },
  { id: 'cyberpunk', label: 'CYBERPUNK' },
]

export const Header = ({ activeDomain, onDomainChange }: HeaderProps) => {
  const { currentTheme, setTheme } = useThemeStore()
  const { stats } = useGraphStore()

  return (
    <header className="app-header">
      <div className="header-left">
        <div className="header-logo">
          <span className="logo-icon glow-text">◈</span>
          <span className="logo-text">NEXUS</span>
        </div>
        <div className="header-stats">
          <span className="stat">
            <span className="stat-label">NODES:</span>
            <span className="stat-value glow-text">{stats.nodeCount}</span>
          </span>
          <span className="stat-divider">|</span>
          <span className="stat">
            <span className="stat-label">EDGES:</span>
            <span className="stat-value glow-text">{stats.edgeCount}</span>
          </span>
        </div>
      </div>

      <div className="header-center">
        <nav className="domain-nav">
          {domains.map((domain) => (
            <motion.button
              key={domain.id}
              className={`domain-btn ${activeDomain === domain.id ? 'active' : ''}`}
              onClick={() => onDomainChange(activeDomain === domain.id ? null : domain.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="domain-icon">{domain.icon}</span>
              <span className="domain-label">{domain.label}</span>
            </motion.button>
          ))}
        </nav>
      </div>

      <div className="header-right">
        <div className="theme-selector">
          {themes.map((theme) => (
            <motion.button
              key={theme.id}
              className={`theme-btn ${currentTheme === theme.id ? 'active' : ''}`}
              onClick={() => setTheme(theme.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={`Switch to ${theme.label} theme`}
            >
              {theme.label.charAt(0)}
            </motion.button>
          ))}
        </div>
      </div>
    </header>
  )
}
