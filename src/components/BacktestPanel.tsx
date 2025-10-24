'use client'

import { useState } from 'react'
import { Strategy } from '@/app/page'
import { BarChart3, TrendingUp, TrendingDown, Activity, Target, ChartLine, Eye } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'

interface BacktestPanelProps {
  strategy: Strategy | null
}

interface TradeSignal {
  date: string
  type: 'buy' | 'sell'
  price: number
  reason: string
}

interface ChartData {
  date: string
  price: number
  volume: number
  rsi?: number
  macd?: number
}

interface BacktestResults {
  totalReturn: number
  winRate: number
  profitFactor: number
  maxDrawdown: number
  recoveryFactor: number
  totalTrades: number
  avgTradeDuration: string
  dailyResults: {
    monday: number
    tuesday: number
    wednesday: number
    thursday: number
    friday: number
  }
  monthlyPnL: Array<{ month: string; pnl: number }>
  chartData: ChartData[]
  tradeSignals: TradeSignal[]
  equityCurve: Array<{ date: string; equity: number; drawdown: number }>
}

export function BacktestPanel({ strategy }: BacktestPanelProps) {
  const [symbol, setSymbol] = useState('AAPL')
  const [timeframe, setTimeframe] = useState('1D')
  const [startDate, setStartDate] = useState('2022-01-01')
  const [endDate, setEndDate] = useState('2024-01-01')
  const [initialCapital, setInitialCapital] = useState('10000')
  const [isRunning, setIsRunning] = useState(false)
  const [results, setResults] = useState<BacktestResults | null>(null)
  const [chartView, setChartView] = useState<'price' | 'equity' | 'indicators'>('price')

  const timeframes = [
    { value: '1m', label: '1 Minute' },
    { value: '5m', label: '5 Minutes' },
    { value: '15m', label: '15 Minutes' },
    { value: '1h', label: '1 Hour' },
    { value: '4h', label: '4 Hours' },
    { value: '1D', label: '1 Day' },
    { value: '1W', label: '1 Week' },
  ]

  const popularSymbols = [
    'AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'NVDA', 'META', 'NFLX',
    'SPY', 'QQQ', 'IWM', 'GLD', 'BTCUSD', 'ETHUSD'
  ]

  const generateMockChartData = (): ChartData[] => {
    const data: ChartData[] = []
    const startPrice = 150 + Math.random() * 50
    let currentPrice = startPrice
    
    const startDateObj = new Date(startDate)
    const endDateObj = new Date(endDate)
    const daysDiff = Math.floor((endDateObj.getTime() - startDateObj.getTime()) / (1000 * 60 * 60 * 24))
    const dataPoints = Math.min(daysDiff, 250) // Limit to 250 data points for performance
    
    for (let i = 0; i < dataPoints; i++) {
      const date = new Date(startDateObj.getTime() + i * (1000 * 60 * 60 * 24))
      const volatility = 0.02
      const change = (Math.random() - 0.5) * volatility * currentPrice
      currentPrice += change
      
      // Ensure price doesn't go negative
      currentPrice = Math.max(currentPrice, 10)
      
      // Generate RSI and MACD indicators
      const rsi = 30 + Math.random() * 40 // RSI between 30-70
      const macd = (Math.random() - 0.5) * 2 // MACD between -1 and 1
      
      data.push({
        date: date.toISOString().split('T')[0],
        price: Math.round(currentPrice * 100) / 100,
        volume: Math.floor(1000000 + Math.random() * 5000000),
        rsi: Math.round(rsi * 100) / 100,
        macd: Math.round(macd * 100) / 100
      })
    }
    
    return data
  }

  const generateMockTradeSignals = (chartData: ChartData[]): TradeSignal[] => {
    const signals: TradeSignal[] = []
    
    for (let i = 20; i < chartData.length - 1; i++) {
      const current = chartData[i]
      const prev = chartData[i - 1]
      
      // Simulate RSI strategy signals
      if (current.rsi && prev.rsi) {
        if (prev.rsi <= 30 && current.rsi > 30) {
          signals.push({
            date: current.date,
            type: 'buy',
            price: current.price,
            reason: `RSI oversold bounce: ${current.rsi.toFixed(1)}`
          })
        } else if (prev.rsi <= 70 && current.rsi > 70) {
          signals.push({
            date: current.date,
            type: 'sell',
            price: current.price,
            reason: `RSI overbought: ${current.rsi.toFixed(1)}`
          })
        }
      }
      
      // Add some random MACD signals
      if (Math.random() < 0.05 && current.macd && prev.macd) { // 5% chance
        if (prev.macd < 0 && current.macd > 0) {
          signals.push({
            date: current.date,
            type: 'buy',
            price: current.price,
            reason: `MACD bullish cross: ${current.macd.toFixed(3)}`
          })
        } else if (prev.macd > 0 && current.macd < 0) {
          signals.push({
            date: current.date,
            type: 'sell',
            price: current.price,
            reason: `MACD bearish cross: ${current.macd.toFixed(3)}`
          })
        }
      }
    }
    
    return signals
  }

  const generateEquityCurve = (chartData: ChartData[], tradeSignals: TradeSignal[]): Array<{ date: string; equity: number; drawdown: number }> => {
    const equityCurve: Array<{ date: string; equity: number; drawdown: number }> = []
    let equity = parseFloat(initialCapital)
    let highWaterMark = equity
    let position = 0
    
    chartData.forEach((dataPoint) => {
      const signal = tradeSignals.find(s => s.date === dataPoint.date)
      
      if (signal) {
        if (signal.type === 'buy' && position === 0) {
          position = equity / signal.price
          equity = position * signal.price
        } else if (signal.type === 'sell' && position > 0) {
          equity = position * signal.price
          position = 0
        }
      } else if (position > 0) {
        equity = position * dataPoint.price
      }
      
      highWaterMark = Math.max(highWaterMark, equity)
      const drawdown = ((equity - highWaterMark) / highWaterMark) * 100
      
      equityCurve.push({
        date: dataPoint.date,
        equity: Math.round(equity * 100) / 100,
        drawdown: Math.round(drawdown * 100) / 100
      })
    })
    
    return equityCurve
  }

  const runBacktest = async () => {
    if (!strategy) return

    setIsRunning(true)

    // Simulate backtest execution
    setTimeout(() => {
      const chartData = generateMockChartData()
      const tradeSignals = generateMockTradeSignals(chartData)
      const equityCurve = generateEquityCurve(chartData, tradeSignals)
      
      const mockResults: BacktestResults = {
        totalReturn: 23.45,
        winRate: 64.2,
        profitFactor: 1.67,
        maxDrawdown: -12.3,
        recoveryFactor: 1.9,
        totalTrades: tradeSignals.length,
        avgTradeDuration: '3.2 days',
        dailyResults: {
          monday: 2.1,
          tuesday: -0.8,
          wednesday: 1.9,
          thursday: 0.7,
          friday: -1.2,
        },
        monthlyPnL: [
          { month: 'Jan', pnl: 8.2 },
          { month: 'Feb', pnl: -2.1 },
          { month: 'Mar', pnl: 5.7 },
          { month: 'Apr', pnl: -1.3 },
          { month: 'May', pnl: 4.8 },
          { month: 'Jun', pnl: 2.9 },
          { month: 'Jul', pnl: 1.1 },
          { month: 'Aug', pnl: -0.7 },
          { month: 'Sep', pnl: 3.2 },
          { month: 'Oct', pnl: 1.8 },
          { month: 'Nov', pnl: -0.4 },
          { month: 'Dec', pnl: 0.3 },
        ],
        chartData,
        tradeSignals,
        equityCurve
      }
      setResults(mockResults)
      setIsRunning(false)
    }, 4000)
  }

  if (!strategy) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <BarChart3 className="h-16 w-16 text-dark-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-dark-400 mb-2">No Strategy Selected</h3>
          <p className="text-dark-500">
            Select a strategy from the sidebar to run a backtest.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-dark-50 mb-2">Backtest Strategy</h2>
        <p className="text-dark-400">
          Test your strategy against historical data to evaluate performance and risk metrics.
        </p>
      </div>

      {/* Configuration Panel */}
      <div className="card mb-6">
        <h3 className="text-lg font-semibold text-dark-50 mb-4">Backtest Configuration</h3>
        
        <div className="mb-4 p-3 bg-dark-800 rounded-lg border border-dark-700">
          <div className="flex items-center space-x-2 mb-2">
            <Target className="h-4 w-4 text-primary-500" />
            <span className="text-sm font-medium text-dark-200">Selected Strategy:</span>
          </div>
          <span className="text-dark-100 font-medium">{strategy.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-dark-200 mb-2">Symbol</label>
            <div className="relative">
              <input
                type="text"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                className="input w-full"
                placeholder="AAPL"
              />
              <div className="mt-2">
                <div className="flex flex-wrap gap-1">
                  {popularSymbols.slice(0, 8).map((sym) => (
                    <button
                      key={sym}
                      onClick={() => setSymbol(sym)}
                      className={`text-xs px-2 py-1 rounded ${
                        symbol === sym 
                          ? 'bg-primary-600 text-white' 
                          : 'bg-dark-700 text-dark-300 hover:bg-dark-600'
                      }`}
                    >
                      {sym}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-200 mb-2">Timeframe</label>
            <select value={timeframe} onChange={(e) => setTimeframe(e.target.value)} className="select w-full">
              {timeframes.map((tf) => (
                <option key={tf.value} value={tf.value}>
                  {tf.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-200 mb-2">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-200 mb-2">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="input w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-dark-200 mb-2">Initial Capital ($)</label>
            <input
              type="number"
              value={initialCapital}
              onChange={(e) => setInitialCapital(e.target.value)}
              className="input w-full"
              placeholder="10000"
            />
          </div>
        </div>

        <button
          onClick={runBacktest}
          disabled={isRunning}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          <BarChart3 className="h-5 w-5" />
          <span>{isRunning ? 'Running Backtest...' : 'Run Backtest'}</span>
        </button>
      </div>

      {/* Loading State */}
      {isRunning && (
        <div className="card mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="text-foreground">Running backtest simulation...</span>
          </div>
          <div className="text-sm text-muted-foreground">
            • Loading historical data for {symbol}<br/>
            • Executing strategy logic<br/>
            • Calculating performance metrics<br/>
            • Generating chart visualization<br/>
            • Identifying trade signals<br/>
          </div>
        </div>
      )}

      {/* Results */}
      {results && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="card">
            <h3 className="text-lg font-semibold text-foreground mb-4">Performance Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-secondary rounded-lg">
                <TrendingUp className="h-8 w-8 text-success-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-success-400">{results.totalReturn}%</div>
                <div className="text-sm text-muted-foreground">Total Return</div>
              </div>
              <div className="text-center p-3 bg-secondary rounded-lg">
                <Target className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-primary">{results.winRate}%</div>
                <div className="text-sm text-muted-foreground">Win Rate</div>
              </div>
              <div className="text-center p-3 bg-secondary rounded-lg">
                <Activity className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-400">{results.profitFactor}</div>
                <div className="text-sm text-muted-foreground">Profit Factor</div>
              </div>
              <div className="text-center p-3 bg-secondary rounded-lg">
                <TrendingDown className="h-8 w-8 text-destructive mx-auto mb-2" />
                <div className="text-2xl font-bold text-destructive">{results.maxDrawdown}%</div>
                <div className="text-sm text-muted-foreground">Max Drawdown</div>
              </div>
            </div>
          </div>

          {/* Chart Visualization */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center">
                <ChartLine className="h-5 w-5 mr-2" />
                Strategy Visualization
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => setChartView('price')}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    chartView === 'price' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  Price & Signals
                </button>
                <button
                  onClick={() => setChartView('equity')}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    chartView === 'equity' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  Equity Curve
                </button>
                <button
                  onClick={() => setChartView('indicators')}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    chartView === 'indicators' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  Indicators
                </button>
              </div>
            </div>

            <div className="bg-background border border-border rounded-lg p-4 mb-4">
              {chartView === 'price' && (
                <div>
                  <div className="mb-4">
                    <h4 className="font-medium text-foreground mb-2">{symbol} Price Chart with Strategy Signals</h4>
                    <p className="text-sm text-muted-foreground">
                      Green markers: Buy signals | Red markers: Sell signals | 
                      Total signals: {results.tradeSignals.length}
                    </p>
                  </div>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={results.chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="date" 
                        stroke="hsl(var(--muted-foreground))"
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                        tickFormatter={(date) => new Date(date).toLocaleDateString()}
                      />
                      <YAxis 
                        stroke="hsl(var(--muted-foreground))"
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                        domain={['dataMin - 5', 'dataMax + 5']}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '6px',
                          color: 'hsl(var(--card-foreground))'
                        }}
                        formatter={(value: number, name: string) => [
                          `$${Number(value).toFixed(2)}`, 
                          name === 'price' ? 'Price' : name
                        ]}
                        labelFormatter={(date) => new Date(date).toLocaleDateString()}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="price" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        dot={false}
                      />
                      {/* Trade Signals */}
                      {results.tradeSignals.map((signal, index) => {
                        const dataPoint = results.chartData.find(d => d.date === signal.date)
                        if (!dataPoint) return null
                        return (
                          <ReferenceLine
                            key={index}
                            x={signal.date}
                            stroke={signal.type === 'buy' ? '#22c55e' : '#ef4444'}
                            strokeDasharray="2 2"
                          />
                        )
                      })}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              {chartView === 'equity' && (
                <div>
                  <div className="mb-4">
                    <h4 className="font-medium text-foreground mb-2">Portfolio Equity Curve</h4>
                    <p className="text-sm text-muted-foreground">
                      Blue line: Portfolio value | Red area: Drawdown periods
                    </p>
                  </div>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={results.equityCurve}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="date" 
                        stroke="hsl(var(--muted-foreground))"
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                        tickFormatter={(date) => new Date(date).toLocaleDateString()}
                      />
                      <YAxis 
                        stroke="hsl(var(--muted-foreground))"
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '6px',
                          color: 'hsl(var(--card-foreground))'
                        }}
                        formatter={(value: number, name: string) => {
                          if (name === 'equity') return [`$${Number(value).toFixed(2)}`, 'Portfolio Value']
                          if (name === 'drawdown') return [`${Number(value).toFixed(2)}%`, 'Drawdown']
                          return [value.toString(), name]
                        }}
                        labelFormatter={(date) => new Date(date).toLocaleDateString()}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="equity" 
                        stroke="hsl(var(--chart-1))" 
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="drawdown" 
                        stroke="hsl(var(--destructive))" 
                        strokeWidth={1}
                        dot={false}
                        strokeDasharray="2 2"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              {chartView === 'indicators' && (
                <div>
                  <div className="mb-4">
                    <h4 className="font-medium text-foreground mb-2">Technical Indicators</h4>
                    <p className="text-sm text-muted-foreground">
                      RSI and MACD indicators used by the strategy
                    </p>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <h5 className="text-sm font-medium text-foreground mb-2">RSI (14)</h5>
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={results.chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis 
                            dataKey="date" 
                            stroke="hsl(var(--muted-foreground))"
                            tick={{ fill: 'hsl(var(--muted-foreground))' }}
                            tickFormatter={(date) => new Date(date).toLocaleDateString()}
                          />
                          <YAxis 
                            stroke="hsl(var(--muted-foreground))"
                            tick={{ fill: 'hsl(var(--muted-foreground))' }}
                            domain={[0, 100]}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'hsl(var(--card))', 
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '6px',
                              color: 'hsl(var(--card-foreground))'
                            }}
                          />
                          <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="2 2" />
                          <ReferenceLine y={30} stroke="#22c55e" strokeDasharray="2 2" />
                          <Line 
                            type="monotone" 
                            dataKey="rsi" 
                            stroke="hsl(var(--chart-2))" 
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-foreground mb-2">MACD</h5>
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={results.chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis 
                            dataKey="date" 
                            stroke="hsl(var(--muted-foreground))"
                            tick={{ fill: 'hsl(var(--muted-foreground))' }}
                            tickFormatter={(date) => new Date(date).toLocaleDateString()}
                          />
                          <YAxis 
                            stroke="hsl(var(--muted-foreground))"
                            tick={{ fill: 'hsl(var(--muted-foreground))' }}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'hsl(var(--card))', 
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '6px',
                              color: 'hsl(var(--card-foreground))'
                            }}
                          />
                          <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="1 1" />
                          <Line 
                            type="monotone" 
                            dataKey="macd" 
                            stroke="hsl(var(--chart-3))" 
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Trade Signals Summary */}
            {results.tradeSignals.length > 0 && (
              <div className="bg-muted/20 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Eye className="h-4 w-4 text-primary" />
                  <h4 className="font-medium text-foreground">Strategy Signals Detected</h4>
                </div>
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {results.tradeSignals.slice(0, 10).map((signal, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          signal.type === 'buy' ? 'bg-success-500' : 'bg-destructive'
                        }`} />
                        <span className="text-foreground font-medium">
                          {signal.type.toUpperCase()}
                        </span>
                        <span className="text-muted-foreground">
                          ${signal.price.toFixed(2)}
                        </span>
                      </div>
                      <div className="text-muted-foreground text-xs">
                        {signal.reason}
                      </div>
                      <div className="text-muted-foreground text-xs">
                        {new Date(signal.date).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                  {results.tradeSignals.length > 10 && (
                    <div className="text-xs text-muted-foreground text-center pt-2">
                      Showing first 10 of {results.tradeSignals.length} signals
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Additional Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-dark-50 mb-4">Trading Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-dark-400">Total Trades:</span>
                  <span className="text-dark-100 font-medium">{results.totalTrades}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-400">Avg Trade Duration:</span>
                  <span className="text-dark-100 font-medium">{results.avgTradeDuration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-400">Recovery Factor:</span>
                  <span className="text-dark-100 font-medium">{results.recoveryFactor}</span>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-dark-50 mb-4">Day of Week Performance</h3>
              <div className="space-y-2">
                {Object.entries(results.dailyResults).map(([day, performance]) => (
                  <div key={day} className="flex justify-between items-center">
                    <span className="text-dark-400 capitalize">{day}:</span>
                    <span className={`font-medium ${performance >= 0 ? 'text-success-400' : 'text-danger-400'}`}>
                      {performance >= 0 ? '+' : ''}{performance}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Monthly Performance Chart */}
          <div className="card">
            <h3 className="text-lg font-semibold text-dark-50 mb-4">Monthly Performance</h3>
            <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
              {results.monthlyPnL.map((month, index) => (
                <div key={index} className="text-center">
                  <div className="text-xs text-dark-400 mb-1">{month.month}</div>
                  <div 
                    className={`text-xs font-medium p-2 rounded ${
                      month.pnl >= 0 
                        ? 'bg-success-900/30 text-success-400' 
                        : 'bg-danger-900/30 text-danger-400'
                    }`}
                  >
                    {month.pnl >= 0 ? '+' : ''}{month.pnl}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}