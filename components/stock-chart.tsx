"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ComposedChart,
  Bar,
} from "recharts"
import { TrendingUp, TrendingDown, BarChart3, Activity, Zap } from "lucide-react"

interface StockChartProps {
  stockData: any
  prediction: any
  loading: boolean
}

// Add data validation helpers
const validateChartData = (data: any[]) => {
  if (!Array.isArray(data) || data.length === 0) return false
  return data.every((item) => item && typeof item.price === "number" && !isNaN(item.price) && item.date)
}

const validateStockData = (data: any) => {
  return data && typeof data.currentPrice === "number" && !isNaN(data.currentPrice)
}

export default function StockChart({ stockData, prediction, loading }: StockChartProps) {
  const [timeframe, setTimeframe] = useState("1M")
  const [chartType, setChartType] = useState("line")
  const [chartData, setChartData] = useState([])
  const [technicalData, setTechnicalData] = useState([])

  useEffect(() => {
    if (stockData) {
      generateChartData()
    }
  }, [stockData, timeframe])

  const generateChartData = () => {
    if (!stockData || !validateStockData(stockData)) {
      console.warn("Invalid stock data for chart generation")
      setChartData([])
      setTechnicalData([])
      return
    }

    const currentPrice = stockData.currentPrice || 2800
    const dataPoints =
      timeframe === "1D" ? 24 : timeframe === "1W" ? 7 : timeframe === "1M" ? 30 : timeframe === "3M" ? 90 : 365
    const data = []
    const technical = []

    for (let i = 0; i < dataPoints; i++) {
      const date = new Date()
      date.setDate(date.getDate() - (dataPoints - i))

      // Generate realistic price movement with validation
      const trend = Math.sin(i * 0.1) * 50
      const volatility = (Math.random() - 0.5) * 100
      const price = Math.max(currentPrice + trend + volatility, currentPrice * 0.7)

      // Ensure all values are valid numbers
      if (isNaN(price) || price <= 0) continue

      const volume = Math.random() * 2000000 + 500000
      const high = price * (1 + Math.random() * 0.03)
      const low = price * (1 - Math.random() * 0.03)
      const open = low + Math.random() * (high - low)
      const close = price

      // Technical indicators with validation
      const sma20 = price * (0.98 + Math.random() * 0.04)
      const sma50 = price * (0.96 + Math.random() * 0.08)
      const rsi = Math.max(0, Math.min(100, 30 + Math.random() * 40))
      const macd = (Math.random() - 0.5) * 10

      // Ensure signal is always defined (null or string)
      const signal = i % 15 === 0 ? (Math.random() > 0.5 ? "BUY" : "SELL") : null

      // Validate all values before adding
      const dataPoint = {
        date: date.toISOString().split("T")[0],
        time: date.getTime(),
        price: Number.parseFloat(price.toFixed(2)),
        open: Number.parseFloat(open.toFixed(2)),
        high: Number.parseFloat(high.toFixed(2)),
        low: Number.parseFloat(low.toFixed(2)),
        close: Number.parseFloat(close.toFixed(2)),
        volume: Math.floor(volume),
        change: Number.parseFloat((((price - currentPrice) / currentPrice) * 100).toFixed(2)),
        signal: signal,
      }

      const technicalPoint = {
        date: date.toISOString().split("T")[0],
        time: date.getTime(),
        price: Number.parseFloat(price.toFixed(2)),
        sma20: Number.parseFloat(sma20.toFixed(2)),
        sma50: Number.parseFloat(sma50.toFixed(2)),
        rsi: Number.parseFloat(rsi.toFixed(1)),
        macd: Number.parseFloat(macd.toFixed(3)),
        volume: Math.floor(volume),
        signal: signal,
      }

      // Only add if all values are valid
      if (Object.values(dataPoint).every((val) => (val !== null && !isNaN(Number(val))) || typeof val === "string")) {
        data.push(dataPoint)
        technical.push(technicalPoint)
      }
    }

    // Validate final data before setting
    if (validateChartData(data)) {
      setChartData(data)
      setTechnicalData(technical)
    } else {
      console.warn("Generated chart data is invalid")
      setChartData([])
      setTechnicalData([])
    }
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length || !payload[0]?.payload) {
      return null
    }

    const data = payload[0].payload
    if (!data) return null

    return (
      <div className="bg-gray-800/95 backdrop-blur-sm p-4 rounded-lg border border-gray-600 shadow-xl">
        <p className="text-white font-semibold">{`Date: ${label || "N/A"}`}</p>
        <p className="text-blue-400">{`Price: ₹${data.price || 0}`}</p>
        {data.volume && <p className="text-purple-400">{`Volume: ${data.volume.toLocaleString()}`}</p>}
        {data.change !== undefined && (
          <p className={`${(data.change || 0) >= 0 ? "text-green-400" : "text-red-400"}`}>
            {`Change: ${(data.change || 0) >= 0 ? "+" : ""}${data.change || 0}%`}
          </p>
        )}
        {data.signal && <Badge className={data.signal === "BUY" ? "bg-green-500" : "bg-red-500"}>{data.signal}</Badge>}
      </div>
    )
  }

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-gray-700 shadow-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-400 animate-pulse" />
            Loading Chart Data...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 flex items-center justify-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-400"></div>
              <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-b-4 border-purple-400 opacity-30"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-gray-700 shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-400" />
              Advanced Price Chart
              <Zap className="h-4 w-4 text-yellow-400 animate-bounce" />
            </CardTitle>
            <CardDescription className="text-gray-300">
              Real-time price movement with AI-generated trading signals
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {["1D", "1W", "1M", "3M", "1Y"].map((tf) => (
              <Button
                key={tf}
                variant={timeframe === tf ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeframe(tf)}
                className={
                  timeframe === tf
                    ? "bg-gradient-to-r from-blue-500 to-purple-600"
                    : "border-gray-600 text-gray-300 hover:bg-gray-700"
                }
              >
                {tf}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={chartType} onValueChange={setChartType} className="space-y-4">
          <TabsList className="bg-gray-700/50 border-gray-600">
            <TabsTrigger value="line" className="data-[state=active]:bg-blue-500">
              Line Chart
            </TabsTrigger>
            <TabsTrigger value="area" className="data-[state=active]:bg-purple-500">
              Area Chart
            </TabsTrigger>
            <TabsTrigger value="candlestick" className="data-[state=active]:bg-green-500">
              Candlestick
            </TabsTrigger>
            <TabsTrigger value="technical" className="data-[state=active]:bg-orange-500">
              Technical
            </TabsTrigger>
          </TabsList>

          <TabsContent value="line" className="space-y-4">
            <div className="h-96">
              {validateChartData(chartData) ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <defs>
                      <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(value) => `₹${value}`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={false}
                      activeDot={{ r: 8, fill: "#3b82f6", stroke: "#ffffff", strokeWidth: 2 }}
                    />
                    {stockData && validateStockData(stockData) && (
                      <ReferenceLine
                        y={stockData.currentPrice}
                        stroke="#ef4444"
                        strokeDasharray="5 5"
                        label={{ value: "Current Price", position: "right" }}
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-gray-400">
                    <Activity className="h-8 w-8 mx-auto mb-2" />
                    <p>No valid chart data available</p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="area" className="space-y-4">
            <div className="h-96">
              {chartData.length > 0 && (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <defs>
                      <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(value) => `₹${value}`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="price" stroke="#8b5cf6" strokeWidth={2} fill="url(#areaGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </TabsContent>

          <TabsContent value="candlestick" className="space-y-4">
            <div className="h-96">
              {chartData.length > 0 && (
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(value) => `₹${value}`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="volume" yAxisId="volume" opacity={0.3} fill="#6b7280" />
                    <Line type="monotone" dataKey="high" stroke="#10b981" strokeWidth={1} dot={false} />
                    <Line type="monotone" dataKey="low" stroke="#ef4444" strokeWidth={1} dot={false} />
                    <Line type="monotone" dataKey="close" stroke="#3b82f6" strokeWidth={2} dot={false} />
                  </ComposedChart>
                </ResponsiveContainer>
              )}
            </div>
          </TabsContent>

          <TabsContent value="technical" className="space-y-4">
            <div className="h-96">
              {technicalData.length > 0 && (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={technicalData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(value) => `₹${value}`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={2} name="Price" dot={false} />
                    <Line
                      type="monotone"
                      dataKey="sma20"
                      stroke="#10b981"
                      strokeWidth={1}
                      strokeDasharray="5 5"
                      name="SMA 20"
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="sma50"
                      stroke="#f59e0b"
                      strokeWidth={1}
                      strokeDasharray="5 5"
                      name="SMA 50"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Enhanced Legend */}
        <div className="flex flex-wrap items-center gap-6 mt-6 p-4 bg-gray-700/30 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded"></div>
            <span className="text-sm text-gray-300">Price Movement</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-300">Buy Signal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-300">Sell Signal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-red-500 border-dashed"></div>
            <span className="text-sm text-gray-300">Current Price</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-400" />
            <span className="text-sm text-gray-300">Bullish Trend</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-red-400" />
            <span className="text-sm text-gray-300">Bearish Trend</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
