'use client'

import { useState } from 'react'
import { Navigation } from '@/components/Navigation'
import { StrategyCreation } from '@/components/StrategyCreation'
import { StrategyList } from '@/components/StrategyList'
import { BacktestPanel } from '@/components/BacktestPanel'
import { LiveTradingPanel } from '@/components/LiveTradingPanel'

export type View = 'create' | 'list' | 'backtest' | 'live-trade'
export type Strategy = {
  id: string
  name: string
  description: string
  content: string
  createdAt: Date
  status: 'draft' | 'validated' | 'active'
}

export default function Home() {
  const [currentView, setCurrentView] = useState<View>('create')
  const [strategies, setStrategies] = useState<Strategy[]>([])
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null)

  const handleStrategyCreated = (strategy: Omit<Strategy, 'id' | 'createdAt'>) => {
    const newStrategy: Strategy = {
      ...strategy,
      id: Date.now().toString(),
      createdAt: new Date(),
    }
    setStrategies(prev => [...prev, newStrategy])
  }

  const handleStrategySelected = (strategy: Strategy) => {
    setSelectedStrategy(strategy)
  }

  return (
    <div className="min-h-screen bg-dark-950">
      <Navigation 
        currentView={currentView}
        onViewChange={setCurrentView}
      />
      
      <div className="flex">
        <aside className="w-80 bg-dark-900 border-r border-dark-700 min-h-screen">
          <StrategyList 
            strategies={strategies}
            selectedStrategy={selectedStrategy}
            onStrategySelect={handleStrategySelected}
            onViewChange={setCurrentView}
          />
        </aside>
        
        <main className="flex-1 p-6">
          {currentView === 'create' && (
            <StrategyCreation onStrategyCreated={handleStrategyCreated} />
          )}
          
          {currentView === 'backtest' && (
            <BacktestPanel strategy={selectedStrategy} />
          )}
          
          {currentView === 'live-trade' && (
            <LiveTradingPanel strategy={selectedStrategy} />
          )}
        </main>
      </div>
    </div>
  )
}