'use client'

import { useState, useRef, useEffect } from 'react'
import { Strategy } from '@/app/page'
import { Link, Sparkles, Send, MessageCircle, Bot, User, Save, Loader2 } from 'lucide-react'

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
}

interface StrategyCreationProps {
  onStrategyCreated: (strategy: Omit<Strategy, 'id' | 'createdAt'>) => void
}

export function StrategyCreation({ onStrategyCreated }: StrategyCreationProps) {
  const [strategyInput, setStrategyInput] = useState('')
  const [linkInput, setLinkInput] = useState('')
  const [inputMethod, setInputMethod] = useState<'text' | 'link'>('text')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [chatInput, setChatInput] = useState('')
  const [isChatMode, setIsChatMode] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [strategyName, setStrategyName] = useState('')
  const [isAutomating, setIsAutomating] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async () => {
    if (!strategyInput.trim() && !linkInput.trim()) return

    setIsAnalyzing(true)
    
    // Add initial user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMethod === 'text' ? strategyInput : `Strategy from link: ${linkInput}`,
      timestamp: new Date()
    }
    
    // Simulate AI analysis
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `## AI Analysis and Recommendations

### Strategy Overview
${inputMethod === 'text' ? strategyInput : `Strategy from: ${linkInput}`}

### Key Observations:
• **Risk Level**: Moderate - Strategy appears to have balanced risk/reward profile
• **Time Horizon**: Suitable for medium-term trading (1-30 days)
• **Market Conditions**: Works best in trending markets with moderate volatility

### Recommendations:
1. **Risk Management**: Consider adding a maximum drawdown limit of 15%
2. **Position Sizing**: Implement dynamic position sizing based on volatility
3. **Entry/Exit Rules**: Add confirmation signals to reduce false positives
4. **Backtesting Period**: Recommend testing on at least 2 years of historical data

### Potential Improvements:
• Add stop-loss mechanisms for better downside protection
• Consider market regime filters for better performance
• Implement portfolio correlation checks for diversification

### Overall Assessment: ⭐⭐⭐⭐ (Good strategy with minor optimizations needed)

---

*What would you like to discuss or modify about this strategy? I'm here to help refine it further.*`,
        timestamp: new Date()
      }
      
      setMessages([userMessage, aiResponse])
      setIsChatMode(true)
      setIsAnalyzing(false)
    }, 3000)
  }

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: chatInput,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setChatInput('')
    setIsSending(true)

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "That's a great point! Let me adjust the strategy accordingly. For the stop-loss mechanism, I recommend implementing a trailing stop at 3% below the recent high to protect profits while allowing for upward movement. Would you like me to elaborate on the implementation details?",
        
        "Excellent suggestion! Adding volume confirmation would indeed reduce false signals. We could require that the entry signal coincides with above-average volume (1.5x the 20-day average). This helps ensure genuine market interest. Should we also consider any other confirmation indicators?",
        
        "I understand your concern about market volatility. We could add a volatility filter using ATR (Average True Range). The strategy would only trigger when ATR is below the 50-day average, indicating calmer market conditions. What's your risk tolerance for this strategy?",
        
        "Good thinking on the time-based filters! We could avoid trading during the first and last 30 minutes of market sessions when spreads are wider and volatility is higher. We could also skip trading on major economic announcement days. Would you like me to specify which economic events to avoid?",
        
        "That modification makes sense. Adjusting the RSI threshold from 30 to 25 for oversold conditions would make the strategy more selective and potentially improve the win rate. However, this might reduce the number of trading opportunities. Are you comfortable with fewer but potentially higher-quality signals?"
      ]
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: randomResponse,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, aiMessage])
      setIsSending(false)
    }, 1500)
  }

  const handleSaveStrategy = async () => {
    if (!strategyName.trim()) return

    setIsAutomating(true)

    // Simulate automation process
    setTimeout(() => {
      const conversationSummary = messages
        .filter(msg => msg.type === 'ai')
        .map(msg => msg.content)
        .join('\n\n')

      onStrategyCreated({
        name: strategyName,
        description: conversationSummary.substring(0, 200) + '...' || '',
        content: strategyInput || linkInput,
        status: 'validated'
      })

      // Reset form
      setStrategyInput('')
      setLinkInput('')
      setStrategyName('')
      setMessages([])
      setIsChatMode(false)
      setIsAutomating(false)
    }, 2500)
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Create Trading Strategy</h2>
        <p className="text-muted-foreground">
          Enter your trading strategy in natural language or provide a link to documentation. 
          Our AI will analyze it and provide recommendations.
        </p>
      </div>

      {!isChatMode ? (
        <>
          {/* Initial Strategy Input */}
          <div className="card mb-6">
            <div className="mb-4">
              <div className="flex space-x-4 mb-4">
                <button
                  onClick={() => setInputMethod('text')}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    inputMethod === 'text' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  Natural Language
                </button>
                <button
                  onClick={() => setInputMethod('link')}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    inputMethod === 'link' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  Strategy Link
                </button>
              </div>

              {inputMethod === 'text' ? (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Describe Your Trading Strategy
                  </label>
                  <textarea
                    value={strategyInput}
                    onChange={(e) => setStrategyInput(e.target.value)}
                    placeholder="Example: Buy when RSI is below 30 and MACD crosses above signal line. Sell when RSI is above 70 or stop loss is hit at -5%..."
                    className="textarea w-full h-32"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Strategy Documentation Link
                  </label>
                  <div className="flex space-x-3">
                    <div className="flex-1 relative">
                      <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <input
                        type="url"
                        value={linkInput}
                        onChange={(e) => setLinkInput(e.target.value)}
                        placeholder="https://example.com/my-strategy"
                        className="input w-full pl-10"
                      />
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={isAnalyzing || (!strategyInput.trim() && !linkInput.trim())}
                className="btn-primary mt-4 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Sparkles className="h-5 w-5" />
                <span>{isAnalyzing ? 'Analyzing...' : 'Analyze Strategy'}</span>
              </button>
            </div>
          </div>

          {/* Analysis Loading */}
          {isAnalyzing && (
            <div className="card mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span className="text-foreground">AI is analyzing your strategy...</span>
              </div>
              <div className="text-sm text-muted-foreground">
                • Checking strategy logic and parameters<br/>
                • Identifying potential risks and opportunities<br/>
                • Generating optimization recommendations<br/>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Chat Interface */}
          <div className="space-y-6">
            <div className="card">
              <div className="flex items-center space-x-3 mb-4">
                <MessageCircle className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-semibold text-foreground">AI Strategy Consultation</h3>
              </div>
              
              {/* Messages Container */}
              <div className="bg-muted/20 rounded-lg p-4 max-h-96 overflow-y-auto mb-4 border border-border">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex space-x-3 ${
                        message.type === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[80%] ${
                          message.type === 'user'
                            ? 'order-2'
                            : 'order-1'
                        }`}
                      >
                        <div
                          className={`rounded-lg p-3 ${
                            message.type === 'user'
                              ? 'bg-primary text-primary-foreground ml-auto'
                              : 'bg-card border border-border text-card-foreground'
                          }`}
                        >
                          <div className="text-sm whitespace-pre-wrap">
                            {message.content}
                          </div>
                          <div className={`text-xs mt-1 opacity-70`}>
                            {message.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                      <div
                        className={`flex-shrink-0 ${
                          message.type === 'user' ? 'order-1' : 'order-2'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          message.type === 'user' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-secondary text-secondary-foreground'
                        }`}>
                          {message.type === 'user' ? (
                            <User className="h-4 w-4" />
                          ) : (
                            <Bot className="h-4 w-4" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isSending && (
                    <div className="flex space-x-3 justify-start">
                      <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="bg-card border border-border text-card-foreground rounded-lg p-3 max-w-[80%]">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Chat Input */}
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                  placeholder="Ask about modifications, clarifications, or improvements..."
                  className="input flex-1"
                  disabled={isSending}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!chatInput.trim() || isSending}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Save Strategy Section */}
            <div className="card">
              <h3 className="text-lg font-semibold text-foreground mb-4">Save Your Strategy</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Strategy Name
                </label>
                <input
                  type="text"
                  value={strategyName}
                  onChange={(e) => setStrategyName(e.target.value)}
                  placeholder="e.g., Enhanced RSI Mean Reversion v1"
                  className="input w-full"
                  disabled={isAutomating}
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleSaveStrategy}
                  disabled={!strategyName.trim() || isAutomating}
                  className="btn-success disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isAutomating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Automating...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Save Strategy</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setMessages([])
                    setIsChatMode(false)
                    setStrategyInput('')
                    setLinkInput('')
                    setStrategyName('')
                  }}
                  className="btn-secondary"
                  disabled={isAutomating}
                >
                  Start Over
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Automating Overlay */}
      {isAutomating && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="card max-w-sm w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="text-lg font-semibold text-foreground">Automating Strategy</span>
            </div>
            <div className="text-sm text-muted-foreground">
              • Processing conversation insights<br/>
              • Generating final strategy code<br/>
              • Validating parameters<br/>
              • Creating backtest template<br/>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}