"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, TrendingUp, Activity, Wifi, WifiOff } from "lucide-react"

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

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour12: true,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-IN", {
      timeZone: "Asia/Kolkata",
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
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

  const getStatusIcon = (isOpen: boolean) => {
    return isOpen ? <TrendingUp className="h-4 w-4 text-green-400" /> : <Activity className="h-4 w-4 text-red-400" />
  }

  const marketStatus = stockData?.marketStatus
  const isRealData = stockData?.isRealData

  return (
    <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-gray-700 shadow-xl">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-400" />
          Market Status
        </CardTitle>
        <CardDescription className="text-gray-300">Live market information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Time */}
        <div className="text-center p-4 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30">
          <div className="text-2xl font-bold text-white font-mono">{formatTime(currentTime)}</div>
          <div className="text-sm text-gray-300">IST</div>
          <div className="text-xs text-gray-400 mt-1">{formatDate(currentTime)}</div>
        </div>

        {/* Market Status */}
        {marketStatus && (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-700/50">
              <div className="flex items-center gap-2">
                {getStatusIcon(marketStatus.isOpen)}
                <span className="text-sm text-gray-300">Status</span>
              </div>
              <Badge className={getStatusColor(marketStatus.status)}>{marketStatus.status.replace("_", " ")}</Badge>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-700/50">
              <span className="text-sm text-gray-300">Exchange</span>
              <span className="font-semibold text-white">{marketStatus.exchange}</span>
            </div>

            {marketStatus.isOpen && marketStatus.timeUntilClose && (
              <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/20">
                <span className="text-sm text-gray-300">Closes in</span>
                <span className="font-semibold text-green-400">{marketStatus.timeUntilClose}</span>
              </div>
            )}

            {!marketStatus.isOpen && marketStatus.timeUntilOpen && (
              <div className="flex items-center justify-between p-3 rounded-lg bg-red-500/20">
                <span className="text-sm text-gray-300">Opens in</span>
                <span className="font-semibold text-red-400">{marketStatus.timeUntilOpen}</span>
              </div>
            )}
          </div>
        )}

        {/* Data Source */}
        <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30">
          <div className="flex items-center gap-2 mb-2">
            {isRealData ? <Wifi className="h-4 w-4 text-green-400" /> : <WifiOff className="h-4 w-4 text-yellow-400" />}
            <span className="text-sm font-medium text-white">Data Source</span>
          </div>
          <p className="text-xs text-gray-300">{isRealData ? "Live market data" : "Simulated data for demo"}</p>
        </div>

        {/* Trading Hours */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-300">Trading Hours (IST)</h4>
          <div className="text-xs text-gray-400 space-y-1">
            <div className="flex justify-between">
              <span>Pre-market:</span>
              <span>9:00 AM - 9:15 AM</span>
            </div>
            <div className="flex justify-between">
              <span>Regular:</span>
              <span>9:15 AM - 3:30 PM</span>
            </div>
            <div className="flex justify-between">
              <span>After hours:</span>
              <span>3:30 PM - 4:00 PM</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
