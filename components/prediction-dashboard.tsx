"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, Target, TrendingUp, AlertTriangle, Zap, Activity, BarChart3 } from "lucide-react"
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar,
  PieChart,
  Pie,
  Cell,
} from "recharts"

interface PredictionDashboardProps {
  selectedStock: any
  prediction: any
  stockData: any
}

// Add validation helpers
const validateStockData = (data: any) => {
  return data && typeof data.currentPrice === "number" && !isNaN(data.currentPrice)
}

const validatePrediction = (pred: any) => {
  return pred && pred.signal && typeof pred.confidence === "number" && !isNaN(pred.confidence)
}

const validateForecastData = (data: any[]) => {
  return (
    Array.isArray(data) &&
    data.length > 0 &&
    data.every((item) => item && typeof item.price === "number" && !isNaN(item.price))
  )
}

export default function PredictionDashboard({ selectedStock, prediction, stockData }: PredictionDashboardProps) {
  // Safe data with validation
  const safeStockData = validateStockData(stockData) ? stockData : null
  const safePrediction = validatePrediction(prediction) ? prediction : null
  const safeSelectedStock = selectedStock || { symbol: "UNKNOWN", name: "Unknown Stock" }

  const [modelMetrics, setModelMetrics] = useState({
    accuracy: 87.5,
    precision: 84.2,
    recall: 89.1,
    f1Score: 86.6,
    mse: 0.023,
    mae: 0.018,
  })

  const [technicalIndicators, setTechnicalIndicators] = useState({
    rsi: 65.4,
    macd: 0.23,
    bollinger: { upper: 2850, middle: 2800, lower: 2750 },
    sma20: 2795,
    sma50: 2780,
    volume: 1250000,
  })

  const [riskMetrics, setRiskMetrics] = useState({
    volatility: 18.5,
    beta: 1.2,
    sharpeRatio: 1.45,
    maxDrawdown: -12.3,
    var95: -5.2,
  })

  const [forecastData, setForecastData] = useState([])

  useEffect(() => {
    // Generate forecast data with validation
    const currentPrice = safeStockData?.currentPrice || 2800
    if (isNaN(currentPrice) || currentPrice <= 0) return

    const forecast = []
    for (let i = 1; i <= 30; i++) {
      const date = new Date()
      date.setDate(date.getDate() + i)
      const trend = Math.sin(i * 0.1) * 20
      const volatility = (Math.random() - 0.5) * 50
      const price = Math.max(currentPrice + trend + volatility, currentPrice * 0.5)

      // Validate price before adding
      if (isNaN(price) || price <= 0) continue

      const forecastPoint = {
        date: date.toISOString().split("T")[0],
        price: Number.parseFloat(price.toFixed(2)),
        confidence: Math.max(60, 95 - i * 1.5),
        upper: Number.parseFloat((price * 1.05).toFixed(2)),
        lower: Number.parseFloat((price * 0.95).toFixed(2)),
      }

      // Only add if all values are valid
      if (Object.values(forecastPoint).every((val) => (typeof val === "number" ? !isNaN(val) : true))) {
        forecast.push(forecastPoint)
      }
    }

    if (validateForecastData(forecast)) {
      setForecastData(forecast)
    }
  }, [safeStockData])

  const riskDistribution = [
    { name: "Low Risk", value: 35, color: "#10b981" },
    { name: "Medium Risk", value: 45, color: "#f59e0b" },
    { name: "High Risk", value: 20, color: "#ef4444" },
  ]

  return (
    <div className="space-y-6">
      {/* Enhanced Prediction Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/20 to-purple-600/20 border-blue-500/30 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">AI Prediction</CardTitle>
            <Target className="h-4 w-4 text-blue-400 animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{safePrediction?.signal || "ANALYZING"}</div>
            <div className="flex items-center gap-2 mt-2">
              <Progress value={safePrediction?.confidence || 0} className="flex-1" />
              <span className="text-xs text-gray-300">{safePrediction?.confidence || 0}%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/20 to-blue-600/20 border-green-500/30 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Target Price</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-400">
              ₹{safePrediction?.targetPrice?.toFixed(2) || "0.00"}
            </div>
            <p className="text-xs text-gray-300">
              {safePrediction?.targetPrice && safeStockData?.currentPrice
                ? `${(((safePrediction.targetPrice - safeStockData.currentPrice) / safeStockData.currentPrice) * 100).toFixed(1)}% potential`
                : "Calculating..."}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/20 to-pink-600/20 border-purple-500/30 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Model Accuracy</CardTitle>
            <Brain className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-400">{modelMetrics.accuracy}%</div>
            <Progress value={modelMetrics.accuracy} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/20 to-red-600/20 border-orange-500/30 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Risk Level</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-400">
              {riskMetrics.volatility > 20 ? "HIGH" : riskMetrics.volatility > 15 ? "MEDIUM" : "LOW"}
            </div>
            <p className="text-xs text-gray-300">{riskMetrics.volatility}% volatility</p>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Analysis Tabs */}
      <Tabs defaultValue="forecast" className="space-y-4">
        <TabsList className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
          <TabsTrigger
            value="forecast"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 text-white"
          >
            Price Forecast
          </TabsTrigger>
          <TabsTrigger
            value="technical"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-blue-600 text-white"
          >
            Technical Analysis
          </TabsTrigger>
          <TabsTrigger
            value="model"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 text-white"
          >
            Model Performance
          </TabsTrigger>
          <TabsTrigger
            value="risk"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-600 text-white"
          >
            Risk Analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="forecast" className="space-y-4">
          <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-400" />
                30-Day Price Forecast
                <Zap className="h-4 w-4 text-yellow-400 animate-bounce" />
              </CardTitle>
              <CardDescription className="text-gray-300">
                AI-powered price predictions with confidence intervals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {validateForecastData(forecastData) ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={forecastData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <defs>
                        <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                      <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(value) => `₹${value}`} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1f2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                          color: "#ffffff",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="upper"
                        stackId="1"
                        stroke="#10b981"
                        fill="#10b981"
                        fillOpacity={0.1}
                      />
                      <Area
                        type="monotone"
                        dataKey="lower"
                        stackId="1"
                        stroke="#ef4444"
                        fill="#ef4444"
                        fillOpacity={0.1}
                      />
                      <Line type="monotone" dataKey="price" stroke="url(#forecastGradient)" strokeWidth={3} />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-gray-400">
                      <BarChart3 className="h-8 w-8 mx-auto mb-2" />
                      <p>Generating forecast data...</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="text-center p-4 rounded-lg bg-gradient-to-br from-green-500/20 to-blue-500/20 border border-green-500/30">
                  <h4 className="font-semibold text-white">1 Week Target</h4>
                  <p className="text-2xl font-bold text-green-400">
                    ₹{((safeStockData?.currentPrice || 0) * 1.02).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-300">+2.1% expected</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30">
                  <h4 className="font-semibold text-white">1 Month Target</h4>
                  <p className="text-2xl font-bold text-blue-400">
                    ₹{((safeStockData?.currentPrice || 0) * 1.05).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-300">+5.3% expected</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                  <h4 className="font-semibold text-white">3 Month Target</h4>
                  <p className="text-2xl font-bold text-purple-400">
                    ₹{((safeStockData?.currentPrice || 0) * 1.08).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-300">+8.7% expected</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="technical" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-400" />
                  Technical Indicators
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-300">RSI (14)</span>
                      <span className="font-medium text-white">{technicalIndicators.rsi}</span>
                    </div>
                    <Progress value={technicalIndicators.rsi} className="h-2" />
                    <p className="text-xs text-gray-400 mt-1">
                      {technicalIndicators.rsi > 70
                        ? "Overbought - Consider Selling"
                        : technicalIndicators.rsi < 30
                          ? "Oversold - Consider Buying"
                          : "Neutral Territory"}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">MACD Signal</span>
                      <Badge
                        variant={technicalIndicators.macd > 0 ? "default" : "secondary"}
                        className={technicalIndicators.macd > 0 ? "bg-green-500" : "bg-red-500"}
                      >
                        {technicalIndicators.macd > 0 ? "Bullish" : "Bearish"}
                      </Badge>
                    </div>
                    <p className="text-lg font-bold text-white mt-1">{technicalIndicators.macd}</p>
                  </div>

                  <div className="space-y-2">
                    <span className="text-sm text-gray-300 font-medium">Moving Averages</span>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-2 rounded bg-gray-700/50">
                        <div className="text-xs text-gray-400">SMA 20</div>
                        <div className="text-sm font-bold text-green-400">₹{technicalIndicators.sma20}</div>
                      </div>
                      <div className="p-2 rounded bg-gray-700/50">
                        <div className="text-xs text-gray-400">SMA 50</div>
                        <div className="text-sm font-bold text-yellow-400">₹{technicalIndicators.sma50}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Bollinger Bands Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 rounded bg-green-500/20">
                    <span className="text-sm text-gray-300">Upper Band</span>
                    <span className="font-medium text-green-400">₹{technicalIndicators.bollinger.upper}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded bg-blue-500/20">
                    <span className="text-sm text-gray-300">Middle Band (SMA 20)</span>
                    <span className="font-medium text-blue-400">₹{technicalIndicators.bollinger.middle}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded bg-red-500/20">
                    <span className="text-sm text-gray-300">Lower Band</span>
                    <span className="font-medium text-red-400">₹{technicalIndicators.bollinger.lower}</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                  <p className="text-sm text-gray-300">
                    <strong className="text-white">Current Position:</strong>
                    {safeStockData?.currentPrice > technicalIndicators.bollinger.upper
                      ? " Above upper band (Potential reversal)"
                      : safeStockData?.currentPrice < technicalIndicators.bollinger.lower
                        ? " Below lower band (Potential bounce)"
                        : " Within normal range"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="model" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-400" />
                  Model Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {Object.entries(modelMetrics).map(([key, value]) => (
                    <div key={key}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-300 capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                        <span className="text-sm font-medium text-white">
                          {typeof value === "number" ? (value < 1 ? value.toFixed(3) : `${value}%`) : value}
                        </span>
                      </div>
                      <Progress value={typeof value === "number" ? (value < 1 ? value * 100 : value) : 0} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Model Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart
                          cx="50%"
                          cy="50%"
                          innerRadius="60%"
                          outerRadius="90%"
                          data={[{ value: modelMetrics.accuracy }]}
                        >
                          <RadialBar dataKey="value" cornerRadius={10} fill="#8b5cf6" />
                        </RadialBarChart>
                      </ResponsiveContainer>
                    </div>
                    <p className="text-2xl font-bold text-purple-400">{modelMetrics.accuracy}%</p>
                    <p className="text-sm text-gray-300">Overall Accuracy</p>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg border border-green-500/30">
                    <p className="text-sm text-green-300">
                      <strong>Status:</strong> Model performing excellently with high accuracy and low error rates.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-400" />
                  Risk Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {Object.entries(riskMetrics).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center p-2 rounded bg-gray-700/30">
                      <span className="text-sm text-gray-300 capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                      <span
                        className={`font-medium ${
                          key.includes("drawdown") || key.includes("var") ? "text-red-400" : "text-white"
                        }`}
                      >
                        {typeof value === "number" ? `${value}${key.includes("Ratio") ? "" : "%"}` : value}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Risk Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={riskDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {riskDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1f2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                          color: "#ffffff",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-2 mt-4">
                  {riskDistribution.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span className="text-sm text-gray-300">{item.name}</span>
                      </div>
                      <span className="text-sm font-medium text-white">{item.value}%</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg border border-yellow-500/30">
                  <p className="text-sm text-yellow-300">
                    <strong>Recommendation:</strong> Current risk level is moderate. Consider position sizing and
                    stop-loss strategies.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
