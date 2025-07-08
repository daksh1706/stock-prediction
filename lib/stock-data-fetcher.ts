interface RealStockData {
  symbol: string
  name: string
  currentPrice: number
  dayChange: number
  dayChangePercent: number
  volume: number
  high52w: number
  low52w: number
  marketCap: number
  pe: number
  dividend: number
  beta: number
  previousClose: number
  dayHigh: number
  dayLow: number
  timestamp: string
  isRealData: boolean
}

class StockDataFetcher {
  private cache: Map<string, { data: RealStockData; timestamp: number }> = new Map()
  private readonly CACHE_DURATION = 60 * 1000 // 1 minute cache for real data

  // Yahoo Finance API endpoints (free tier)
  private async fetchFromYahooFinance(symbol: string): Promise<RealStockData | null> {
    try {
      // Using a CORS proxy for Yahoo Finance
      const proxyUrl = "https://api.allorigins.win/raw?url="
      const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`

      const response = await fetch(`${proxyUrl}${encodeURIComponent(yahooUrl)}`, {
        headers: {
          Accept: "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (!data.chart?.result?.[0]) {
        throw new Error("Invalid response format")
      }

      const result = data.chart.result[0]
      const meta = result.meta
      const quote = result.indicators?.quote?.[0]

      if (!meta || !quote) {
        throw new Error("Missing quote data")
      }

      const currentPrice = meta.regularMarketPrice || meta.previousClose || 0
      const previousClose = meta.previousClose || currentPrice
      const dayChange = currentPrice - previousClose
      const dayChangePercent = previousClose > 0 ? (dayChange / previousClose) * 100 : 0

      return {
        symbol,
        name: meta.longName || symbol,
        currentPrice: Number.parseFloat(currentPrice.toFixed(2)),
        dayChange: Number.parseFloat(dayChange.toFixed(2)),
        dayChangePercent: Number.parseFloat(dayChangePercent.toFixed(2)),
        volume: meta.regularMarketVolume || 0,
        high52w: meta.fiftyTwoWeekHigh || currentPrice * 1.3,
        low52w: meta.fiftyTwoWeekLow || currentPrice * 0.7,
        marketCap: meta.marketCap || 0,
        pe: meta.trailingPE || 0,
        dividend: meta.dividendYield || 0,
        beta: meta.beta || 1.0,
        previousClose: Number.parseFloat(previousClose.toFixed(2)),
        dayHigh: meta.regularMarketDayHigh || currentPrice,
        dayLow: meta.regularMarketDayLow || currentPrice,
        timestamp: new Date().toISOString(),
        isRealData: true,
      }
    } catch (error) {
      console.error(`Error fetching real data for ${symbol}:`, error)
      return null
    }
  }

  // Alternative API using Alpha Vantage (requires API key)
  private async fetchFromAlphaVantage(symbol: string): Promise<RealStockData | null> {
    try {
      // You would need to get a free API key from https://www.alphavantage.co/
      const API_KEY = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_KEY
      if (!API_KEY) {
        console.warn("Alpha Vantage API key not found")
        return null
      }

      const cleanSymbol = symbol.replace(".NS", "").replace(".BO", "")
      const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${cleanSymbol}&apikey=${API_KEY}`

      const response = await fetch(url)
      const data = await response.json()

      if (data["Error Message"] || data["Note"]) {
        throw new Error(data["Error Message"] || "API limit reached")
      }

      const quote = data["Global Quote"]
      if (!quote) {
        throw new Error("No quote data available")
      }

      const currentPrice = Number.parseFloat(quote["05. price"])
      const previousClose = Number.parseFloat(quote["08. previous close"])
      const dayChange = Number.parseFloat(quote["09. change"])
      const dayChangePercent = Number.parseFloat(quote["10. change percent"].replace("%", ""))

      return {
        symbol,
        name: symbol,
        currentPrice: Number.parseFloat(currentPrice.toFixed(2)),
        dayChange: Number.parseFloat(dayChange.toFixed(2)),
        dayChangePercent: Number.parseFloat(dayChangePercent.toFixed(2)),
        volume: Number.parseInt(quote["06. volume"]),
        high52w: Number.parseFloat(quote["03. high"]),
        low52w: Number.parseFloat(quote["04. low"]),
        marketCap: 0, // Not available in this API
        pe: 0,
        dividend: 0,
        beta: 1.0,
        previousClose: Number.parseFloat(previousClose.toFixed(2)),
        dayHigh: Number.parseFloat(quote["03. high"]),
        dayLow: Number.parseFloat(quote["04. low"]),
        timestamp: new Date().toISOString(),
        isRealData: true,
      }
    } catch (error) {
      console.error(`Error fetching from Alpha Vantage for ${symbol}:`, error)
      return null
    }
  }

  // Fallback to simulated data with realistic patterns
  private generateRealisticData(symbol: string): RealStockData {
    // Use symbol hash for consistent base price
    const hash = this.hashCode(symbol)
    const basePrice = 1000 + (hash % 3000) // Price between 1000-4000

    // Generate realistic intraday movement
    const now = new Date()
    const marketOpenMinutes = (now.getHours() - 9) * 60 + (now.getMinutes() - 15)
    const marketProgress = Math.max(0, Math.min(1, marketOpenMinutes / (6 * 60 + 15))) // 6h 15m market

    // Simulate intraday trend
    const trendFactor = Math.sin(marketProgress * Math.PI) * 0.02 // ±2% intraday movement
    const volatility = Math.sin(hash + now.getTime() / 60000) * 0.01 // ±1% volatility

    const currentPrice = basePrice * (1 + trendFactor + volatility)
    const previousClose = basePrice
    const dayChange = currentPrice - previousClose
    const dayChangePercent = (dayChange / previousClose) * 100

    return {
      symbol,
      name: this.getStockName(symbol),
      currentPrice: Number.parseFloat(currentPrice.toFixed(2)),
      dayChange: Number.parseFloat(dayChange.toFixed(2)),
      dayChangePercent: Number.parseFloat(dayChangePercent.toFixed(2)),
      volume: Math.floor(500000 + (hash % 2000000)),
      high52w: Number.parseFloat((currentPrice * 1.3).toFixed(2)),
      low52w: Number.parseFloat((currentPrice * 0.7).toFixed(2)),
      marketCap: Math.floor(currentPrice * 1000000000),
      pe: 15 + (hash % 20),
      dividend: Number.parseFloat((Math.random() * 3).toFixed(2)),
      beta: Number.parseFloat((0.8 + Math.random() * 0.8).toFixed(2)),
      previousClose: Number.parseFloat(previousClose.toFixed(2)),
      dayHigh: Number.parseFloat((currentPrice * 1.02).toFixed(2)),
      dayLow: Number.parseFloat((currentPrice * 0.98).toFixed(2)),
      timestamp: new Date().toISOString(),
      isRealData: false,
    }
  }

  private hashCode(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash
    }
    return Math.abs(hash)
  }

  private getStockName(symbol: string): string {
    const stockNames: Record<string, string> = {
      "RELIANCE.NS": "Reliance Industries Ltd",
      "TCS.NS": "Tata Consultancy Services Ltd",
      "HDFCBANK.NS": "HDFC Bank Ltd",
      "INFY.NS": "Infosys Ltd",
      "HINDUNILVR.NS": "Hindustan Unilever Ltd",
      "ITC.NS": "ITC Ltd",
      "SBIN.NS": "State Bank of India",
      "BHARTIARTL.NS": "Bharti Airtel Ltd",
      "ASIANPAINT.NS": "Asian Paints Ltd",
      "MARUTI.NS": "Maruti Suzuki India Ltd",
    }
    return stockNames[symbol] || symbol
  }

  public async fetchStockData(symbol: string): Promise<RealStockData> {
    // Check cache first
    const cached = this.cache.get(symbol)
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data
    }

    // Try to fetch real data
    let stockData = await this.fetchFromYahooFinance(symbol)

    // Fallback to Alpha Vantage if Yahoo fails
    if (!stockData) {
      stockData = await this.fetchFromAlphaVantage(symbol)
    }

    // Fallback to simulated data if all APIs fail
    if (!stockData) {
      console.warn(`Using simulated data for ${symbol} - real APIs unavailable`)
      stockData = this.generateRealisticData(symbol)
    }

    // Cache the result
    this.cache.set(symbol, {
      data: stockData,
      timestamp: Date.now(),
    })

    return stockData
  }

  public clearCache(): void {
    this.cache.clear()
  }
}

export const stockDataFetcher = new StockDataFetcher()
