'use client'

import { useState } from 'react'
import { Strategy } from '@/app/page'
import { Play, Square, Settings, DollarSign, TrendingUp, AlertTriangle, Eye, Target } from 'lucide-react'

interface LiveTradingPanelProps {
  strategy: Strategy | null
}

interface TradingStatus {
  isActive: boolean
  currentPnL: number
  dailyPnL: number
  openPositions: number
  totalTrades: number
  winRate: number
  accountBalance: number
}

export function LiveTradingPanel({ strategy }: LiveTradingPanelProps) {
  const [tradingConfig, setTradingConfig] = useState({
    riskPerTrade: '2',
    maxPositions: '3',
    dailyLossLimit: '5',
    accountSize: '10000'
  })
  
  const [isConfiguring, setIsConfiguring] = useState(false)
  const [tradingStatus, setTradingStatus] = useState<TradingStatus>({
    isActive: false,
    currentPnL: 0,
    dailyPnL: 0,
    openPositions: 0,
    totalTrades: 0,
    winRate: 0,
    accountBalance: 10000
  })

  const startTrading = () => {
    setTradingStatus(prev => ({ ...prev, isActive: true }))
    // In real implementation, this would connect to broker API
  }

  const stopTrading = () => {
    setTradingStatus(prev => ({ ...prev, isActive: false }))
    // In real implementation, this would disconnect from broker API
  }

  if (!strategy) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Play className="h-16 w-16 text-dark-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-dark-400 mb-2">No Strategy Selected</h3>
          <p className="text-dark-500">
            Select a strategy from the sidebar to start live trading.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-dark-50 mb-2">Live Trading</h2>
        <p className="text-dark-400">
          Deploy your strategy to live markets with real-time execution and monitoring.
        </p>
      </div>

      {/* Strategy Info */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Target className="h-5 w-5 text-primary-500" />
              <span className="text-lg font-semibold text-dark-50">{strategy.name}</span>
            </div>
            <p className="text-dark-400 text-sm">{strategy.description}</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            tradingStatus.isActive 
              ? 'bg-success-900/30 text-success-400 border border-success-600' 
              : 'bg-dark-700 text-dark-300 border border-dark-600'
          }`}>
            {tradingStatus.isActive ? 'LIVE' : 'STOPPED'}
          </div>
        </div>
      </div>

      {/* Live Status Dashboard */}
      {tradingStatus.isActive && (
        <div className="card mb-6">
          <h3 className="text-lg font-semibold text-dark-50 mb-4 flex items-center">
            <Eye className="h-5 w-5 mr-2 text-success-500" />
            Live Trading Status
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center p-3 bg-dark-800 rounded-lg border border-dark-700">
              <DollarSign className="h-6 w-6 text-primary-500 mx-auto mb-2" />
              <div className={`text-xl font-bold ${
                tradingStatus.currentPnL >= 0 ? 'text-success-400' : 'text-danger-400'
              }`}>
                ${tradingStatus.currentPnL.toFixed(2)}
              </div>
              <div className="text-xs text-dark-400">Current P&L</div>
            </div>
            
            <div className="text-center p-3 bg-dark-800 rounded-lg border border-dark-700">
              <TrendingUp className="h-6 w-6 text-blue-500 mx-auto mb-2" />
              <div className={`text-xl font-bold ${
                tradingStatus.dailyPnL >= 0 ? 'text-success-400' : 'text-danger-400'
              }`}>
                ${tradingStatus.dailyPnL.toFixed(2)}
              </div>
              <div className="text-xs text-dark-400">Daily P&L</div>
            </div>
            
            <div className="text-center p-3 bg-dark-800 rounded-lg border border-dark-700">
              <Target className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
              <div className="text-xl font-bold text-dark-100">{tradingStatus.openPositions}</div>
              <div className="text-xs text-dark-400">Open Positions</div>
            </div>
            
            <div className="text-center p-3 bg-dark-800 rounded-lg border border-dark-700">
              <div className="text-xl font-bold text-dark-100">{tradingStatus.totalTrades}</div>
              <div className="text-xs text-dark-400">Total Trades</div>
            </div>
          </div>

          <div className="bg-dark-800 p-4 rounded-lg border border-dark-700">
            <div className="flex justify-between items-center">
              <span className="text-dark-300">Account Balance:</span>
              <span className="text-xl font-bold text-dark-100">
                ${tradingStatus.accountBalance.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Risk Management & Configuration */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-dark-50 flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Trading Configuration
          </h3>
          <button
            onClick={() => setIsConfiguring(!isConfiguring)}
            className="btn-secondary text-sm"
          >
            {isConfiguring ? 'Hide Settings' : 'Show Settings'}
          </button>
        </div>

        {isConfiguring && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-dark-200 mb-2">
                Risk per Trade (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={tradingConfig.riskPerTrade}
                onChange={(e) => setTradingConfig(prev => ({ ...prev, riskPerTrade: e.target.value }))}
                className="input w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-200 mb-2">
                Max Concurrent Positions
              </label>
              <input
                type="number"
                value={tradingConfig.maxPositions}
                onChange={(e) => setTradingConfig(prev => ({ ...prev, maxPositions: e.target.value }))}
                className="input w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-200 mb-2">
                Daily Loss Limit (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={tradingConfig.dailyLossLimit}
                onChange={(e) => setTradingConfig(prev => ({ ...prev, dailyLossLimit: e.target.value }))}
                className="input w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-200 mb-2">
                Account Size ($)
              </label>
              <input
                type="number"
                value={tradingConfig.accountSize}
                onChange={(e) => setTradingConfig(prev => ({ ...prev, accountSize: e.target.value }))}
                className="input w-full"
              />
            </div>
          </div>
        )}

        {/* Risk Warnings */}
        <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4 mb-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-yellow-200 mb-2">Live Trading Risks</h4>
              <ul className="text-sm text-yellow-300 space-y-1">
                <li>• Live trading involves real financial risk and potential losses</li>
                <li>• Always test strategies thoroughly with backtesting before going live</li>
                <li>• Set appropriate risk limits and never risk more than you can afford to lose</li>
                <li>• Monitor your positions actively and be prepared to intervene if necessary</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex space-x-4">
          {!tradingStatus.isActive ? (
            <button
              onClick={startTrading}
              className="btn-success flex items-center space-x-2"
            >
              <Play className="h-5 w-5" />
              <span>Start Live Trading</span>
            </button>
          ) : (
            <button
              onClick={stopTrading}
              className="btn-danger flex items-center space-x-2"
            >
              <Square className="h-5 w-5" />
              <span>Stop Trading</span>
            </button>
          )}

          <button className="btn-secondary">
            View Trading Log
          </button>

          <button className="btn-secondary">
            Export Results
          </button>
        </div>
      </div>

      {/* Paper Trading Suggestion */}
      {!tradingStatus.isActive && (
        <div className="card">
          <h3 className="text-lg font-semibold text-dark-50 mb-3">💡 Recommendation</h3>
          <p className="text-dark-300 mb-4">
            Before starting live trading, consider running your strategy in paper trading mode 
            to validate its performance in real market conditions without financial risk.
          </p>
          <button className="btn-primary">
            Enable Paper Trading Mode
          </button>
        </div>
      )}
    </div>
  )
}