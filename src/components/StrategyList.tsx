'use client'

import { Strategy, View } from '@/app/page'
import { FileText, Play, BarChart3, Circle, CheckCircle, Zap } from 'lucide-react'

interface StrategyListProps {
  strategies: Strategy[]
  selectedStrategy: Strategy | null
  onStrategySelect: (strategy: Strategy) => void
  onViewChange: (view: View) => void
}

export function StrategyList({ 
  strategies, 
  selectedStrategy, 
  onStrategySelect, 
  onViewChange 
}: StrategyListProps) {
  const getStatusIcon = (status: Strategy['status']) => {
    switch (status) {
      case 'draft':
        return <Circle className="h-4 w-4 text-dark-400" />
      case 'validated':
        return <CheckCircle className="h-4 w-4 text-success-500" />
      case 'active':
        return <Zap className="h-4 w-4 text-primary-500" />
      default:
        return <Circle className="h-4 w-4 text-dark-400" />
    }
  }

  const getStatusColor = (status: Strategy['status']) => {
    switch (status) {
      case 'draft':
        return 'text-dark-400'
      case 'validated':
        return 'text-success-400'
      case 'active':
        return 'text-primary-400'
      default:
        return 'text-dark-400'
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold text-dark-50 mb-4 flex items-center">
        <FileText className="h-5 w-5 mr-2" />
        My Strategies ({strategies.length})
      </h2>

      {strategies.length === 0 ? (
        <div className="text-center py-8">
          <FileText className="h-12 w-12 text-dark-600 mx-auto mb-3" />
          <p className="text-dark-400 text-sm">
            No strategies yet.<br />
            Create your first strategy to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {strategies.map((strategy) => (
            <div
              key={strategy.id}
              onClick={() => onStrategySelect(strategy)}
              className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                selectedStrategy?.id === strategy.id
                  ? 'border-primary-500 bg-primary-950/50'
                  : 'border-dark-700 bg-dark-800/50 hover:bg-dark-800 hover:border-dark-600'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-dark-50 text-sm truncate flex-1 mr-2">
                  {strategy.name}
                </h3>
                <div className="flex items-center space-x-1">
                  {getStatusIcon(strategy.status)}
                </div>
              </div>
              
              <p className="text-xs text-dark-400 line-clamp-2 mb-3">
                {strategy.description}
              </p>
              
              <div className="flex items-center justify-between">
                <span className={`text-xs font-medium capitalize ${getStatusColor(strategy.status)}`}>
                  {strategy.status}
                </span>
                <span className="text-xs text-dark-500">
                  {strategy.createdAt.toLocaleDateString()}
                </span>
              </div>

              {selectedStrategy?.id === strategy.id && (
                <div className="flex space-x-2 mt-3 pt-3 border-t border-dark-700">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onViewChange('backtest')
                    }}
                    className="flex-1 text-xs py-2 px-3 bg-dark-700 hover:bg-dark-600 text-dark-200 rounded flex items-center justify-center space-x-1"
                  >
                    <BarChart3 className="h-3 w-3" />
                    <span>Backtest</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onViewChange('live-trade')
                    }}
                    className="flex-1 text-xs py-2 px-3 bg-success-700 hover:bg-success-600 text-white rounded flex items-center justify-center space-x-1"
                  >
                    <Play className="h-3 w-3" />
                    <span>Live Trade</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}