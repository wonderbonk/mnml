import { useState } from 'react'
import { Terminal } from '@components/Terminal/Terminal'
import { GraphCanvas } from '@components/GraphCanvas/GraphCanvas'
import { ModulePanel } from '@components/ModulePanel/ModulePanel'
import { Header } from '@components/Header/Header'
import { Domain } from '@/types'
import './App.scss'

function App() {
  const [activeDomain, setActiveDomain] = useState<Domain | null>(null)

  return (
    <div className="app">
      {/* CRT Effects */}
      <div className="scanlines" />
      <div className="noise-overlay" />

      {/* Main Layout */}
      <div className="app-container crt-screen">
        <Header activeDomain={activeDomain} onDomainChange={setActiveDomain} />

        <main className="app-main">
          <GraphCanvas />
          {activeDomain && <ModulePanel domain={activeDomain} />}
        </main>

        <Terminal />
      </div>
    </div>
  )
}

export default App
