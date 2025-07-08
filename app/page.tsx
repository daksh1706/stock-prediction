"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import StockChart from "@/components/stock-chart"
import PredictionDashboard from "@/components/prediction-dashboard"
import ModelTraining from "@/components/model-training"
import MarketStatus from "@/components/market-status"
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Activity,
  RefreshCw,
  Zap,
  Target,
  Brain,
  Filter,
  Search,
  AlertTriangle,
  Clock,
} from "lucide-react"

// Comprehensive stock list with more Indian stocks
const COMPREHENSIVE_STOCKS = [
  // Large Cap NSE Stocks
  { symbol: "RELIANCE.NS", name: "Reliance Industries Ltd", exchange: "NSE", sector: "Oil & Gas", marketCap: "Large" },
  { symbol: "TCS.NS", name: "Tata Consultancy Services Ltd", exchange: "NSE", sector: "IT", marketCap: "Large" },
  { symbol: "HDFCBANK.NS", name: "HDFC Bank Ltd", exchange: "NSE", sector: "Banking", marketCap: "Large" },
  { symbol: "INFY.NS", name: "Infosys Ltd", exchange: "NSE", sector: "IT", marketCap: "Large" },
  { symbol: "HINDUNILVR.NS", name: "Hindustan Unilever Ltd", exchange: "NSE", sector: "FMCG", marketCap: "Large" },
  { symbol: "ITC.NS", name: "ITC Ltd", exchange: "NSE", sector: "FMCG", marketCap: "Large" },
  { symbol: "SBIN.NS", name: "State Bank of India", exchange: "NSE", sector: "Banking", marketCap: "Large" },
  { symbol: "BHARTIARTL.NS", name: "Bharti Airtel Ltd", exchange: "NSE", sector: "Telecom", marketCap: "Large" },
  { symbol: "ASIANPAINT.NS", name: "Asian Paints Ltd", exchange: "NSE", sector: "Paints", marketCap: "Large" },
  { symbol: "MARUTI.NS", name: "Maruti Suzuki India Ltd", exchange: "NSE", sector: "Auto", marketCap: "Large" },
  { symbol: "KOTAKBANK.NS", name: "Kotak Mahindra Bank Ltd", exchange: "NSE", sector: "Banking", marketCap: "Large" },
  { symbol: "LT.NS", name: "Larsen & Toubro Ltd", exchange: "NSE", sector: "Construction", marketCap: "Large" },
  { symbol: "AXISBANK.NS", name: "Axis Bank Ltd", exchange: "NSE", sector: "Banking", marketCap: "Large" },
  { symbol: "ICICIBANK.NS", name: "ICICI Bank Ltd", exchange: "NSE", sector: "Banking", marketCap: "Large" },
  { symbol: "BAJFINANCE.NS", name: "Bajaj Finance Ltd", exchange: "NSE", sector: "NBFC", marketCap: "Large" },
  { symbol: "HCLTECH.NS", name: "HCL Technologies Ltd", exchange: "NSE", sector: "IT", marketCap: "Large" },
  { symbol: "WIPRO.NS", name: "Wipro Ltd", exchange: "NSE", sector: "IT", marketCap: "Large" },
  { symbol: "ULTRACEMCO.NS", name: "UltraTech Cement Ltd", exchange: "NSE", sector: "Cement", marketCap: "Large" },
  { symbol: "TITAN.NS", name: "Titan Company Ltd", exchange: "NSE", sector: "Jewellery", marketCap: "Large" },
  {
    symbol: "SUNPHARMA.NS",
    name: "Sun Pharmaceutical Industries Ltd",
    exchange: "NSE",
    sector: "Pharma",
    marketCap: "Large",
  },
  { symbol: "NESTLEIND.NS", name: "Nestle India Ltd", exchange: "NSE", sector: "FMCG", marketCap: "Large" },
  {
    symbol: "POWERGRID.NS",
    name: "Power Grid Corporation of India Ltd",
    exchange: "NSE",
    sector: "Power",
    marketCap: "Large",
  },
  { symbol: "NTPC.NS", name: "NTPC Ltd", exchange: "NSE", sector: "Power", marketCap: "Large" },
  { symbol: "COALINDIA.NS", name: "Coal India Ltd", exchange: "NSE", sector: "Mining", marketCap: "Large" },
  {
    symbol: "ONGC.NS",
    name: "Oil & Natural Gas Corporation Ltd",
    exchange: "NSE",
    sector: "Oil & Gas",
    marketCap: "Large",
  },
  { symbol: "TECHM.NS", name: "Tech Mahindra Ltd", exchange: "NSE", sector: "IT", marketCap: "Large" },
  { symbol: "TATAMOTORS.NS", name: "Tata Motors Ltd", exchange: "NSE", sector: "Auto", marketCap: "Large" },
  { symbol: "TATASTEEL.NS", name: "Tata Steel Ltd", exchange: "NSE", sector: "Steel", marketCap: "Large" },
  { symbol: "JSWSTEEL.NS", name: "JSW Steel Ltd", exchange: "NSE", sector: "Steel", marketCap: "Large" },
  { symbol: "HINDALCO.NS", name: "Hindalco Industries Ltd", exchange: "NSE", sector: "Metals", marketCap: "Large" },

  // Mid Cap Stocks
  {
    symbol: "BAJAJFINSV.NS",
    name: "Bajaj Finserv Ltd",
    exchange: "NSE",
    sector: "Financial Services",
    marketCap: "Mid",
  },
  {
    symbol: "HDFCLIFE.NS",
    name: "HDFC Life Insurance Company Ltd",
    exchange: "NSE",
    sector: "Insurance",
    marketCap: "Mid",
  },
  {
    symbol: "SBILIFE.NS",
    name: "SBI Life Insurance Company Ltd",
    exchange: "NSE",
    sector: "Insurance",
    marketCap: "Mid",
  },
  {
    symbol: "ICICIPRULI.NS",
    name: "ICICI Prudential Life Insurance Company Ltd",
    exchange: "NSE",
    sector: "Insurance",
    marketCap: "Mid",
  },
  { symbol: "DIVISLAB.NS", name: "Divi's Laboratories Ltd", exchange: "NSE", sector: "Pharma", marketCap: "Mid" },
  { symbol: "DRREDDY.NS", name: "Dr. Reddy's Laboratories Ltd", exchange: "NSE", sector: "Pharma", marketCap: "Mid" },
  { symbol: "CIPLA.NS", name: "Cipla Ltd", exchange: "NSE", sector: "Pharma", marketCap: "Mid" },
  {
    symbol: "APOLLOHOSP.NS",
    name: "Apollo Hospitals Enterprise Ltd",
    exchange: "NSE",
    sector: "Healthcare",
    marketCap: "Mid",
  },
  {
    symbol: "ADANIPORTS.NS",
    name: "Adani Ports and Special Economic Zone Ltd",
    exchange: "NSE",
    sector: "Infrastructure",
    marketCap: "Mid",
  },
  { symbol: "ADANIENT.NS", name: "Adani Enterprises Ltd", exchange: "NSE", sector: "Diversified", marketCap: "Mid" },
  { symbol: "GODREJCP.NS", name: "Godrej Consumer Products Ltd", exchange: "NSE", sector: "FMCG", marketCap: "Mid" },
  { symbol: "BRITANNIA.NS", name: "Britannia Industries Ltd", exchange: "NSE", sector: "FMCG", marketCap: "Mid" },
  { symbol: "DABUR.NS", name: "Dabur India Ltd", exchange: "NSE", sector: "FMCG", marketCap: "Mid" },
  { symbol: "MARICO.NS", name: "Marico Ltd", exchange: "NSE", sector: "FMCG", marketCap: "Mid" },
  { symbol: "PIDILITIND.NS", name: "Pidilite Industries Ltd", exchange: "NSE", sector: "Chemicals", marketCap: "Mid" },
  { symbol: "BERGEPAINT.NS", name: "Berger Paints India Ltd", exchange: "NSE", sector: "Paints", marketCap: "Mid" },
  { symbol: "GRASIM.NS", name: "Grasim Industries Ltd", exchange: "NSE", sector: "Textiles", marketCap: "Mid" },
  { symbol: "SHREECEM.NS", name: "Shree Cement Ltd", exchange: "NSE", sector: "Cement", marketCap: "Mid" },
  { symbol: "AMBUJACEM.NS", name: "Ambuja Cements Ltd", exchange: "NSE", sector: "Cement", marketCap: "Mid" },
  { symbol: "ACC.NS", name: "ACC Ltd", exchange: "NSE", sector: "Cement", marketCap: "Mid" },

  // Auto Sector
  { symbol: "M&M.NS", name: "Mahindra & Mahindra Ltd", exchange: "NSE", sector: "Auto", marketCap: "Large" },
  { symbol: "BAJAJ-AUTO.NS", name: "Bajaj Auto Ltd", exchange: "NSE", sector: "Auto", marketCap: "Large" },
  { symbol: "HEROMOTOCO.NS", name: "Hero MotoCorp Ltd", exchange: "NSE", sector: "Auto", marketCap: "Large" },
  { symbol: "EICHERMOT.NS", name: "Eicher Motors Ltd", exchange: "NSE", sector: "Auto", marketCap: "Mid" },
  { symbol: "ASHOKLEY.NS", name: "Ashok Leyland Ltd", exchange: "NSE", sector: "Auto", marketCap: "Small" },
  { symbol: "TVSMOTOR.NS", name: "TVS Motor Company Ltd", exchange: "NSE", sector: "Auto", marketCap: "Small" },

  // IT Sector
  { symbol: "MINDTREE.NS", name: "Mindtree Ltd", exchange: "NSE", sector: "IT", marketCap: "Mid" },
  { symbol: "MPHASIS.NS", name: "Mphasis Ltd", exchange: "NSE", sector: "IT", marketCap: "Mid" },
  { symbol: "LTI.NS", name: "L&T Infotech Ltd", exchange: "NSE", sector: "IT", marketCap: "Mid" },
  { symbol: "COFORGE.NS", name: "Coforge Ltd", exchange: "NSE", sector: "IT", marketCap: "Small" },
  { symbol: "PERSISTENT.NS", name: "Persistent Systems Ltd", exchange: "NSE", sector: "IT", marketCap: "Small" },
  { symbol: "LTTS.NS", name: "L&T Technology Services Ltd", exchange: "NSE", sector: "IT", marketCap: "Small" },

  // Pharma Sector
  { symbol: "LUPIN.NS", name: "Lupin Ltd", exchange: "NSE", sector: "Pharma", marketCap: "Mid" },
  { symbol: "AUROPHARMA.NS", name: "Aurobindo Pharma Ltd", exchange: "NSE", sector: "Pharma", marketCap: "Mid" },
  { symbol: "CADILAHC.NS", name: "Cadila Healthcare Ltd", exchange: "NSE", sector: "Pharma", marketCap: "Mid" },
  { symbol: "BIOCON.NS", name: "Biocon Ltd", exchange: "NSE", sector: "Pharma", marketCap: "Mid" },
  { symbol: "TORNTPHARM.NS", name: "Torrent Pharmaceuticals Ltd", exchange: "NSE", sector: "Pharma", marketCap: "Mid" },
  { symbol: "ALKEM.NS", name: "Alkem Laboratories Ltd", exchange: "NSE", sector: "Pharma", marketCap: "Small" },
  {
    symbol: "GLENMARK.NS",
    name: "Glenmark Pharmaceuticals Ltd",
    exchange: "NSE",
    sector: "Pharma",
    marketCap: "Small",
  },

  // Banking Sector
  { symbol: "BANKBARODA.NS", name: "Bank of Baroda", exchange: "NSE", sector: "Banking", marketCap: "Small" },
  { symbol: "PNB.NS", name: "Punjab National Bank", exchange: "NSE", sector: "Banking", marketCap: "Small" },
  { symbol: "CANBK.NS", name: "Canara Bank", exchange: "NSE", sector: "Banking", marketCap: "Small" },
  { symbol: "UNIONBANK.NS", name: "Union Bank of India", exchange: "NSE", sector: "Banking", marketCap: "Small" },
  { symbol: "INDUSINDBK.NS", name: "IndusInd Bank Ltd", exchange: "NSE", sector: "Banking", marketCap: "Small" },
  { symbol: "FEDERALBNK.NS", name: "Federal Bank Ltd", exchange: "NSE", sector: "Banking", marketCap: "Small" },
  { symbol: "IDFCFIRSTB.NS", name: "IDFC First Bank Ltd", exchange: "NSE", sector: "Banking", marketCap: "Small" },
  { symbol: "BANDHANBNK.NS", name: "Bandhan Bank Ltd", exchange: "NSE", sector: "Banking", marketCap: "Small" },
  { symbol: "RBLBANK.NS", name: "RBL Bank Ltd", exchange: "NSE", sector: "Banking", marketCap: "Small" },

  // BSE Stocks
  { symbol: "500325.BO", name: "Reliance Industries Ltd", exchange: "BSE", sector: "Oil & Gas", marketCap: "Large" },
  { symbol: "532540.BO", name: "Tata Consultancy Services Ltd", exchange: "BSE", sector: "IT", marketCap: "Large" },
  { symbol: "500180.BO", name: "HDFC Bank Ltd", exchange: "BSE", sector: "Banking", marketCap: "Large" },
  { symbol: "500209.BO", name: "Infosys Ltd", exchange: "BSE", sector: "IT", marketCap: "Large" },
  { symbol: "500696.BO", name: "Hindustan Unilever Ltd", exchange: "BSE", sector: "FMCG", marketCap: "Large" },
  { symbol: "500875.BO", name: "ITC Ltd", exchange: "BSE", sector: "FMCG", marketCap: "Large" },
  { symbol: "500112.BO", name: "State Bank of India", exchange: "BSE", sector: "Banking", marketCap: "Large" },
  { symbol: "532454.BO", name: "Bharti Airtel Ltd", exchange: "BSE", sector: "Telecom", marketCap: "Large" },
  { symbol: "500820.BO", name: "Asian Paints Ltd", exchange: "BSE", sector: "Paints", marketCap: "Large" },
  { symbol: "532500.BO", name: "Maruti Suzuki India Ltd", exchange: "BSE", sector: "Auto", marketCap: "Large" },
]

export default function StockPredictionApp() {
  const [selectedStock, setSelectedStock] = useState(COMPREHENSIVE_STOCKS[0])
  const [stockData, setStockData] = useState(null)
  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState(30) // seconds
  const [lastUpdated, setLastUpdated] = useState(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [sectorFilter, setSectorFilter] = useState("All")
  const [exchangeFilter, setExchangeFilter] = useState("All")
  const [marketCapFilter, setMarketCapFilter] = useState("All")
  const [error, setError] = useState<string | null>(null)
  const [predictionError, setPredictionError] = useState<string | null>(null)

  // Add data validation helper
  const validateStockData = (data: any) => {
    if (!data) return false
    return (
      typeof data.currentPrice === "number" &&
      typeof data.dayChange === "number" &&
      typeof data.dayChangePercent === "number" &&
      typeof data.volume === "number"
    )
  }

  // Add prediction validation helper
  const validatePrediction = (pred: any) => {
    if (!pred) return false
    return pred.signal && typeof pred.confidence === "number" && typeof pred.targetPrice === "number"
  }

  const fetchStockData = useCallback(async (symbol: string) => {
    setLoading(true)
    setIsRefreshing(true)
    setError(null)
    try {
      const response = await fetch(`/api/stock-data?symbol=${symbol}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()

      if (validateStockData(data)) {
        setStockData(data)
        setLastUpdated(new Date())
        return data
      } else {
        throw new Error("Invalid stock data received")
      }
    } catch (error) {
      console.error("Error fetching stock data:", error)
      setError(error instanceof Error ? error.message : "Failed to fetch stock data")
      setStockData(null)
      return null
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }, [])

  const generatePrediction = useCallback(async (symbol: string, stockData: any = null) => {
    setPredictionError(null)
    try {
      // Build query parameters with stock data for more accurate predictions
      const params = new URLSearchParams({ symbol })

      if (stockData) {
        params.append("currentPrice", stockData.currentPrice.toString())
        params.append("dayChange", stockData.dayChange.toString())
        params.append("dayChangePercent", stockData.dayChangePercent.toString())
        params.append("volume", stockData.volume.toString())
        params.append("high52w", stockData.high52w.toString())
        params.append("low52w", stockData.low52w.toString())
      }

      const response = await fetch(`/api/predict?${params.toString()}`)

      if (response.status === 423) {
        // Market closed
        const errorData = await response.json()
        setPredictionError(errorData.marketStatus?.message || "Market is closed")
        setPrediction(null)
        return
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (validatePrediction(data)) {
        setPrediction(data)
      } else {
        console.warn("Invalid prediction data received")
        setPrediction(null)
      }
    } catch (error) {
      console.error("Error generating prediction:", error)
      setPredictionError(error instanceof Error ? error.message : "Failed to generate prediction")
      setPrediction(null)
    }
  }, [])

  const refreshData = useCallback(async () => {
    if (selectedStock) {
      const stockData = await fetchStockData(selectedStock.symbol)
      if (stockData) {
        await generatePrediction(selectedStock.symbol, stockData)
      }
    }
  }, [selectedStock, fetchStockData, generatePrediction])

  // Auto-refresh functionality - only during market hours
  useEffect(() => {
    if (autoRefresh && refreshInterval > 0 && stockData?.marketStatus?.isOpen) {
      const interval = setInterval(refreshData, refreshInterval * 1000)
      return () => clearInterval(interval)
    }
  }, [autoRefresh, refreshInterval, refreshData, stockData?.marketStatus?.isOpen])

  // Initial data fetch
  useEffect(() => {
    refreshData()
  }, [selectedStock, refreshData])

  const getSignalIcon = (signal: string) => {
    if (!signal) return <Activity className="h-4 w-4 text-gray-500" />

    switch (signal.toLowerCase()) {
      case "buy":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "sell":
        return <TrendingDown className="h-4 w-4 text-red-500" />
      case "hold":
        return <Minus className="h-4 w-4 text-yellow-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getSignalColor = (signal: string) => {
    if (!signal) return "bg-gradient-to-r from-gray-500 to-gray-600 text-white"

    switch (signal.toLowerCase()) {
      case "buy":
        return "bg-gradient-to-r from-green-500 to-green-600 text-white"
      case "sell":
        return "bg-gradient-to-r from-red-500 to-red-600 text-white"
      case "hold":
        return "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white"
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600 text-white"
    }
  }

  // Get unique values for filters
  const uniqueSectors = ["All", ...new Set(COMPREHENSIVE_STOCKS.map((stock) => stock.sector))]
  const uniqueExchanges = ["All", ...new Set(COMPREHENSIVE_STOCKS.map((stock) => stock.exchange))]
  const uniqueMarketCaps = ["All", ...new Set(COMPREHENSIVE_STOCKS.map((stock) => stock.marketCap))]

  // Filter stocks based on search and filters
  const filteredStocks = COMPREHENSIVE_STOCKS.filter((stock) => {
    const matchesSearch =
      stock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSector = sectorFilter === "All" || stock.sector === sectorFilter
    const matchesExchange = exchangeFilter === "All" || stock.exchange === exchangeFilter
    const matchesMarketCap = marketCapFilter === "All" || stock.marketCap === marketCapFilter

    return matchesSearch && matchesSector && matchesExchange && matchesMarketCap
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Enhanced Header */}
        {error && (
          <Card className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border-red-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-red-400">
                <AlertTriangle className="h-5 w-5" />
                <span>Error: {error}</span>
                <Button variant="outline" size="sm" onClick={() => setError(null)} className="ml-auto">
                  Dismiss
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {predictionError && (
          <Card className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-yellow-400">
                <Clock className="h-5 w-5" />
                <span>{predictionError}</span>
                <Button variant="outline" size="sm" onClick={() => setPredictionError(null)} className="ml-auto">
                  Dismiss
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="text-center space-y-4 py-8">
          <div className="relative">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
              AI Stock Predictor Pro
            </h1>
            <div className="absolute -top-2 -right-2">
              <Zap className="h-8 w-8 text-yellow-400 animate-bounce" />
            </div>
          </div>
          <p className="text-xl text-gray-300 font-medium">
            Real-time NSE & BSE Stock Analysis with AI Trading Signals
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full animate-pulse ${stockData?.marketStatus?.isOpen ? "bg-green-400" : "bg-red-400"}`}
              ></div>
              <span>{stockData?.marketStatus?.isOpen ? "Market Open" : "Market Closed"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-purple-400" />
              <span>AI Powered</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-400" />
              <span>{COMPREHENSIVE_STOCKS.length}+ Stocks</span>
            </div>
          </div>
        </div>

        {/* Market Status */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            {/* Enhanced Stock Selection with Filters */}
            <Card className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-gray-700 shadow-2xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Search className="h-5 w-5 text-blue-400" />
                      Stock Selection & Advanced Filters
                    </CardTitle>
                    <CardDescription className="text-gray-300">
                      Search and filter from {COMPREHENSIVE_STOCKS.length}+ NSE/BSE stocks with real-time data
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={autoRefresh}
                        onCheckedChange={setAutoRefresh}
                        className="data-[state=checked]:bg-green-500"
                        disabled={!stockData?.marketStatus?.isOpen}
                      />
                      <span className="text-sm text-gray-300">Auto Refresh</span>
                    </div>
                    <Select
                      value={refreshInterval.toString()}
                      onValueChange={(value) => setRefreshInterval(Number.parseInt(value))}
                    >
                      <SelectTrigger className="w-24 bg-gray-700 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10s</SelectItem>
                        <SelectItem value="30">30s</SelectItem>
                        <SelectItem value="60">1m</SelectItem>
                        <SelectItem value="300">5m</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={refreshData}
                      disabled={isRefreshing}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                      Refresh
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search and Filters */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <Input
                    placeholder="Search stocks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />

                  <Select value={sectorFilter} onValueChange={setSectorFilter}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Sector" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      {uniqueSectors.map((sector) => (
                        <SelectItem key={sector} value={sector} className="text-white hover:bg-gray-700">
                          {sector}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={exchangeFilter} onValueChange={setExchangeFilter}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Exchange" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      {uniqueExchanges.map((exchange) => (
                        <SelectItem key={exchange} value={exchange} className="text-white hover:bg-gray-700">
                          {exchange}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={marketCapFilter} onValueChange={setMarketCapFilter}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Market Cap" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      {uniqueMarketCaps.map((cap) => (
                        <SelectItem key={cap} value={cap} className="text-white hover:bg-gray-700">
                          {cap}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={selectedStock.symbol}
                    onValueChange={(value) => {
                      const stock = COMPREHENSIVE_STOCKS.find((s) => s.symbol === value)
                      if (stock) setSelectedStock(stock)
                    }}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600 max-h-60">
                      {filteredStocks.map((stock) => (
                        <SelectItem key={stock.symbol} value={stock.symbol} className="text-white hover:bg-gray-700">
                          <div className="flex items-center justify-between w-full">
                            <span className="truncate">{stock.name}</span>
                            <div className="flex gap-1 ml-2">
                              <Badge variant="outline" className="text-xs">
                                {stock.exchange}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {stock.sector}
                              </Badge>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Filter Summary */}
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <span>
                      Showing {filteredStocks.length} of {COMPREHENSIVE_STOCKS.length} stocks
                    </span>
                  </div>
                  {sectorFilter !== "All" && (
                    <Badge variant="outline" className="text-blue-400 border-blue-400">
                      Sector: {sectorFilter}
                    </Badge>
                  )}
                  {exchangeFilter !== "All" && (
                    <Badge variant="outline" className="text-green-400 border-green-400">
                      Exchange: {exchangeFilter}
                    </Badge>
                  )}
                  {marketCapFilter !== "All" && (
                    <Badge variant="outline" className="text-purple-400 border-purple-400">
                      Cap: {marketCapFilter}
                    </Badge>
                  )}
                </div>

                {/* Enhanced Current Selection */}
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-6 border border-blue-500/30">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 animate-pulse"></div>
                  <div className="relative flex items-center justify-between">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-white">{selectedStock.name}</h3>
                      <div className="flex items-center gap-4">
                        <p className="text-gray-300">
                          {selectedStock.symbol} • {selectedStock.exchange}
                        </p>
                        <Badge className="bg-gradient-to-r from-indigo-500 to-purple-600">{selectedStock.sector}</Badge>
                        <Badge variant="outline" className="border-yellow-400 text-yellow-400">
                          {selectedStock.marketCap} Cap
                        </Badge>
                        {lastUpdated && (
                          <span className="text-xs text-gray-400">Updated: {lastUpdated.toLocaleTimeString()}</span>
                        )}
                      </div>
                      {stockData && validateStockData(stockData) && (
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-3xl font-bold text-white">
                            ₹{stockData.currentPrice?.toFixed(2) || "0.00"}
                          </span>
                          <span
                            className={`text-lg font-semibold ${
                              (stockData.dayChange || 0) >= 0 ? "text-green-400" : "text-red-400"
                            }`}
                          >
                            {(stockData.dayChange || 0) >= 0 ? "+" : ""}₹{stockData.dayChange?.toFixed(2) || "0.00"} (
                            {stockData.dayChangePercent?.toFixed(2) || "0.00"}%)
                          </span>
                        </div>
                      )}
                    </div>
                    {prediction && validatePrediction(prediction) && (
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="flex items-center gap-2 mb-2">
                            {getSignalIcon(prediction.signal)}
                            <Badge className={getSignalColor(prediction.signal)}>
                              {prediction.signal?.toUpperCase() || "UNKNOWN"}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-300">
                            <div>Confidence: {prediction.confidence || 0}%</div>
                            <div>Target: ₹{prediction.targetPrice?.toFixed(2) || "0.00"}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <MarketStatus stockData={stockData} />
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="analysis" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800/50 backdrop-blur-sm border-gray-700">
            <TabsTrigger
              value="analysis"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 text-white"
            >
              Stock Analysis
            </TabsTrigger>
            <TabsTrigger
              value="prediction"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 text-white"
            >
              AI Predictions
            </TabsTrigger>
            <TabsTrigger
              value="training"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 text-white"
            >
              Model Training
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analysis" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Enhanced Stock Chart */}
              <div className="lg:col-span-2">
                <StockChart stockData={stockData} prediction={prediction} loading={loading} />
              </div>

              {/* Enhanced Quick Stats */}
              <div className="space-y-4">
                <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-gray-700 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-400" />
                      Market Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {stockData ? (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-3 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30">
                            <div className="text-2xl font-bold text-white">₹{stockData.currentPrice?.toFixed(2)}</div>
                            <div className="text-xs text-gray-300">Current Price</div>
                          </div>
                          <div className="text-center p-3 rounded-lg bg-gradient-to-br from-green-500/20 to-blue-500/20 border border-green-500/30">
                            <div
                              className={`text-2xl font-bold ${stockData.dayChange >= 0 ? "text-green-400" : "text-red-400"}`}
                            >
                              {stockData.dayChangePercent?.toFixed(2)}%
                            </div>
                            <div className="text-xs text-gray-300">Day Change</div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between items-center p-2 rounded bg-gray-700/50">
                            <span className="text-sm text-gray-300">Volume</span>
                            <span className="font-semibold text-white">{stockData.volume?.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center p-2 rounded bg-gray-700/50">
                            <span className="text-sm text-gray-300">52W High</span>
                            <span className="font-semibold text-green-400">₹{stockData.high52w?.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between items-center p-2 rounded bg-gray-700/50">
                            <span className="text-sm text-gray-300">52W Low</span>
                            <span className="font-semibold text-red-400">₹{stockData.low52w?.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between items-center p-2 rounded bg-gray-700/50">
                            <span className="text-sm text-gray-300">Market Cap</span>
                            <span className="font-semibold text-white">
                              ₹{(stockData.marketCap / 1e9)?.toFixed(1)}B
                            </span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Enhanced Trading Signal */}
                {prediction && (
                  <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-gray-700 shadow-xl">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Target className="h-5 w-5 text-purple-400" />
                        AI Trading Signal
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                        <div className="flex items-center justify-center gap-3 mb-3">
                          {getSignalIcon(prediction.signal)}
                          <span className="text-3xl font-bold text-white">{prediction.signal?.toUpperCase()}</span>
                        </div>
                        <div className="text-lg text-purple-300">Confidence: {prediction.confidence}%</div>
                        {prediction.reasoning && <p className="text-sm text-gray-300 mt-2">{prediction.reasoning}</p>}
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-green-500/20 to-blue-500/20">
                          <span className="text-sm text-gray-300">Target Price</span>
                          <span className="font-bold text-green-400">₹{prediction.targetPrice?.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-red-500/20 to-orange-500/20">
                          <span className="text-sm text-gray-300">Stop Loss</span>
                          <span className="font-bold text-red-400">₹{prediction.stopLoss?.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20">
                          <span className="text-sm text-gray-300">Risk Level</span>
                          <Badge
                            className={
                              prediction.riskLevel === "LOW"
                                ? "bg-green-500"
                                : prediction.riskLevel === "MEDIUM"
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                            }
                          >
                            {prediction.riskLevel}
                          </Badge>
                        </div>
                      </div>

                      {prediction.factors && prediction.factors.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-gray-300">Key Factors:</h4>
                          <ul className="space-y-1">
                            {prediction.factors.slice(0, 3).map((factor, index) => (
                              <li key={index} className="text-xs text-gray-400 flex items-start gap-2">
                                <span className="text-blue-400">•</span>
                                {factor}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="prediction">
            <PredictionDashboard selectedStock={selectedStock} prediction={prediction} stockData={stockData} />
          </TabsContent>

          <TabsContent value="training">
            <ModelTraining />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
