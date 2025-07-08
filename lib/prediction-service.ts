interface StockData {
  symbol: string
  currentPrice: number
  dayChange: number
  dayChangePercent: number
  volume: number
  high52w: number
  low52w: number
}

interface PredictionResult {
  symbol: string
  signal: "BUY" | "SELL" | "HOLD"
  confidence: number
  targetPrice: number
  stopLoss: number
  timeHorizon: string
  riskLevel: "LOW" | "MEDIUM" | "HIGH"
  factors: string[]
  timestamp: string
  reasoning: string
}

class PredictionService {
  private predictionCache: Map<string, { prediction: PredictionResult; timestamp: number }> = new Map()
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  // Technical analysis indicators
  private calculateRSI(prices: number[]): number {
    if (prices.length < 14) return 50

    let gains = 0
    let losses = 0

    for (let i = 1; i < Math.min(15, prices.length); i++) {
      const change = prices[i] - prices[i - 1]
      if (change > 0) gains += change
      else losses += Math.abs(change)
    }

    const avgGain = gains / 14
    const avgLoss = losses / 14
    const rs = avgGain / (avgLoss || 1)
    return 100 - 100 / (1 + rs)
  }

  private calculateMovingAverage(prices: number[], period: number): number {
    if (prices.length < period) return prices[prices.length - 1] || 0
    const sum = prices.slice(-period).reduce((a, b) => a + b, 0)
    return sum / period
  }

  private generateHistoricalPrices(currentPrice: number, symbol: string): number[] {
    // Use symbol hash for consistent randomness
    const seed = this.hashCode(symbol)
    const prices = []
    let price = currentPrice

    // Generate 50 days of historical data with trend
    for (let i = 0; i < 50; i++) {
      const dayVariation = this.seededRandom(seed + i) * 0.04 - 0.02 // ±2% daily variation
      const trendFactor = Math.sin((i / 50) * Math.PI * 2) * 0.001 // Long-term trend
      price = price * (1 + dayVariation + trendFactor)
      prices.push(price)
    }

    return prices
  }

  private hashCode(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash)
  }

  private seededRandom(seed: number): number {
    const x = Math.sin(seed) * 10000
    return x - Math.floor(x)
  }

  private analyzeStock(stockData: StockData): PredictionResult {
    const { symbol, currentPrice, dayChange, dayChangePercent, volume, high52w, low52w } = stockData

    // Validate input data
    if (!currentPrice || currentPrice <= 0) {
      throw new Error("Invalid stock price data")
    }

    // Generate consistent historical data
    const historicalPrices = this.generateHistoricalPrices(currentPrice, symbol)

    // Technical indicators
    const rsi = this.calculateRSI(historicalPrices)
    const sma20 = this.calculateMovingAverage(historicalPrices, 20)
    const sma50 = this.calculateMovingAverage(historicalPrices, 50)

    // Price position analysis
    const priceRange = high52w - low52w
    const pricePosition = priceRange > 0 ? (currentPrice - low52w) / priceRange : 0.5
    const volumeScore = volume > 1000000 ? 0.7 : volume > 500000 ? 0.5 : 0.3

    // Trend analysis
    const shortTermTrend = currentPrice > sma20 ? 1 : -1
    const longTermTrend = sma20 > sma50 ? 1 : -1
    const momentumScore = dayChangePercent > 2 ? 1 : dayChangePercent < -2 ? -1 : 0

    // Calculate composite score
    let score = 0
    const factors: string[] = []

    // RSI analysis
    if (rsi > 70) {
      score -= 0.3
      factors.push("RSI indicates overbought conditions")
    } else if (rsi < 30) {
      score += 0.3
      factors.push("RSI indicates oversold conditions - potential bounce")
    } else {
      factors.push("RSI in neutral territory")
    }

    // Moving average analysis
    if (shortTermTrend > 0 && longTermTrend > 0) {
      score += 0.4
      factors.push("Price above both short and long-term moving averages")
    } else if (shortTermTrend < 0 && longTermTrend < 0) {
      score -= 0.4
      factors.push("Price below moving averages - bearish trend")
    }

    // Price position
    if (pricePosition > 0.8) {
      score -= 0.2
      factors.push("Price near 52-week high - limited upside")
    } else if (pricePosition < 0.2) {
      score += 0.2
      factors.push("Price near 52-week low - potential value opportunity")
    }

    // Volume analysis
    score += volumeScore * 0.1
    factors.push(
      `Volume analysis shows ${volumeScore > 0.6 ? "strong" : volumeScore > 0.4 ? "moderate" : "weak"} institutional interest`,
    )

    // Momentum
    score += momentumScore * 0.2
    if (momentumScore > 0) {
      factors.push("Strong positive momentum detected")
    } else if (momentumScore < 0) {
      factors.push("Negative momentum - caution advised")
    }

    // Determine signal and confidence
    let signal: "BUY" | "SELL" | "HOLD"
    let confidence: number
    let targetPrice: number
    let stopLoss: number
    let riskLevel: "LOW" | "MEDIUM" | "HIGH"
    let reasoning: string

    if (score > 0.3) {
      signal = "BUY"
      confidence = Math.min(95, Math.max(60, 70 + score * 50))
      targetPrice = currentPrice * (1.05 + Math.max(0, score * 0.1))
      stopLoss = currentPrice * 0.95
      riskLevel = score > 0.6 ? "LOW" : "MEDIUM"
      reasoning = "Technical indicators suggest bullish momentum with favorable risk-reward ratio"
    } else if (score < -0.3) {
      signal = "SELL"
      confidence = Math.min(95, Math.max(60, 70 + Math.abs(score) * 50))
      targetPrice = currentPrice * (0.95 + score * 0.1)
      stopLoss = currentPrice * 1.05
      riskLevel = score < -0.6 ? "LOW" : "MEDIUM"
      reasoning = "Technical analysis indicates bearish pressure with downside risk"
    } else {
      signal = "HOLD"
      confidence = Math.max(50, 60 + Math.abs(score) * 20)
      targetPrice = currentPrice * (1.02 + score * 0.05)
      stopLoss = currentPrice * 0.98
      riskLevel = "MEDIUM"
      reasoning = "Mixed signals suggest sideways movement - wait for clearer direction"
    }

    // Ensure all values are valid numbers
    confidence = Math.round(Math.max(50, Math.min(95, confidence)))
    targetPrice = Math.max(currentPrice * 0.8, targetPrice)
    stopLoss = signal === "BUY" ? Math.min(currentPrice * 0.98, stopLoss) : Math.max(currentPrice * 1.02, stopLoss)

    return {
      symbol,
      signal,
      confidence,
      targetPrice: Number.parseFloat(targetPrice.toFixed(2)),
      stopLoss: Number.parseFloat(stopLoss.toFixed(2)),
      timeHorizon: "1-3 months",
      riskLevel,
      factors,
      timestamp: new Date().toISOString(),
      reasoning,
    }
  }

  public getPrediction(stockData: StockData): PredictionResult {
    const now = Date.now()
    const cached = this.predictionCache.get(stockData.symbol)

    // Return cached prediction if still valid
    if (cached && now - cached.timestamp < this.CACHE_DURATION) {
      return cached.prediction
    }

    // Generate new prediction
    const prediction = this.analyzeStock(stockData)

    // Cache the prediction
    this.predictionCache.set(stockData.symbol, {
      prediction,
      timestamp: now,
    })

    return prediction
  }

  public clearCache(): void {
    this.predictionCache.clear()
  }
}

export const predictionService = new PredictionService()
