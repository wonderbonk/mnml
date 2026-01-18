import { motion } from 'framer-motion'
import { PhysicalModule } from '@/modules/PhysicalModule'
import { WorkModule } from '@/modules/WorkModule'
import { DesignModule } from '@/modules/DesignModule'
import { MusicModule } from '@/modules/MusicModule'
import { AIModule } from '@/modules/AIModule'
import { GraphModule } from '@/modules/GraphModule'
import type { Domain } from '@/types'
import './ModulePanel.scss'

interface ModulePanelProps {
  domain: Domain
}

export const ModulePanel = ({ domain }: ModulePanelProps) => {
  const renderModule = () => {
    switch (domain) {
      case 'graph':
        return <GraphModule />
      case 'physical':
        return <PhysicalModule />
      case 'work':
        return <WorkModule />
      case 'design':
        return <DesignModule />
      case 'music':
        return <MusicModule />
      case 'ai':
        return <AIModule />
      default:
        return null
    }
  }

  return (
    <motion.aside
      className="module-panel"
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
    >
      {renderModule()}
    </motion.aside>
  )
}
