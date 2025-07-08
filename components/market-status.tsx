"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, TrendingUp, AlertCircle, CheckCircle } from "lucide-react"

interface MarketStatusProps {
  stockData: any
}

export default function MarketStatus({ stockData }: MarketStatusProps) {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  if (!stockData?.marketStatus) {
    return null
  }

  const { marketStatus } = stockData
  const isOpen = marketStatus.isOpen

  const getStatusColor = () => {
    switch (marketStatus.status) {
      case "OPEN":
        return "bg-green-500"
      case "CLOSED":
        return "bg-red-500"
      case "PRE_MARKET":
        return "bg-yellow-500"
      case "AFTER_HOURS":
        return "bg-orange-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = () => {
    switch (marketStatus.status) {
      case "OPEN":
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case "CLOSED":
        return <AlertCircle className="h-4 w-4 text-red-400" />
      case "PRE_MARKET":
        return <Clock className="h-4 w-4 text-yellow-400" />
      case "AFTER_HOURS":
        return <TrendingUp className="h-4 w-4 text-orange-400" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour12: true,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  return (
    <Card className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-gray-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-400" />
          Market Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getStatusIcon()}
            <div>
              <div className="font-semibold text-white">{marketStatus.exchange} Exchange</div>
              <div className="text-sm text-gray-300">{formatTime(currentTime)} IST</div>
            </div>
          </div>
          <Badge className={`${getStatusColor()} text-white font-semibold px-3 py-1`}>
            {marketStatus.status.replace("_", " ")}
          </Badge>
        </div>

        {isOpen && marketStatus.timeUntilClose && (
          <div className="p-3 rounded-lg bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span className="text-sm text-green-300 font-medium">
                Market Open - Closes in {marketStatus.timeUntilClose}
              </span>
            </div>
            <div className="text-xs text-gray-300 mt-1">Live predictions and real-time data available</div>
          </div>
        )}

        {!isOpen && marketStatus.timeUntilOpen && (
          <div className="p-3 rounded-lg bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <span className="text-sm text-red-300 font-medium">
                Market Closed - Opens in {marketStatus.timeUntilOpen}
              </span>
            </div>
            <div className="text-xs text-gray-300 mt-1">Predictions unavailable during non-trading hours</div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="p-2 rounded bg-gray-700/50">
            <div className="text-gray-400">Trading Hours</div>
            <div className="text-white font-medium">9:15 AM - 3:30 PM</div>
          </div>
          <div className="p-2 rounded bg-gray-700/50">
            <div className="text-gray-400">Data Source</div>
            <div className="text-white font-medium">{stockData.isRealData ? "Live Data" : "Simulated"}</div>
          </div>
        </div>

        {stockData.isRealData === false && (
          <div className="p-2 rounded-lg bg-yellow-500/20 border border-yellow-500/30">
            <div className="text-xs text-yellow-300">
              ⚠️ Using simulated data - Real market data APIs may be unavailable
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
