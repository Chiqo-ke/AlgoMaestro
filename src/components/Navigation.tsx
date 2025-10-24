'use client'

import { View } from '@/app/page'
import { Bot, BarChart3, TrendingUp, Plus } from 'lucide-react'

interface NavigationProps {
  currentView: View
  onViewChange: (view: View) => void
}

export function Navigation({ currentView, onViewChange }: NavigationProps) {
  const navItems = [
    {
      id: 'create' as View,
      label: 'Create Strategy',
      icon: Plus,
    },
    {
      id: 'backtest' as View,
      label: 'Backtest',
      icon: BarChart3,
    },
    {
      id: 'live-trade' as View,
      label: 'Live Trade',
      icon: TrendingUp,
    },
  ]

  return (
    <nav className="bg-dark-900 border-b border-dark-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Bot className="h-8 w-8 text-primary-500" />
          <h1 className="text-xl font-bold text-dark-50">AlgoMaestro</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = currentView === item.id
            
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                  isActive
                    ? 'bg-primary-600 text-white'
                    : 'text-dark-300 hover:text-dark-100 hover:bg-dark-800'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}