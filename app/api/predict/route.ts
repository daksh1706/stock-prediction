import { type NextRequest, NextResponse } from "next/server"
import { predictionService } from "@/lib/prediction-service"
import { marketHoursService } from "@/lib/market-hours"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const symbol = searchParams.get("symbol")
  const currentPrice = searchParams.get("currentPrice")
  const dayChange = searchParams.get("dayChange")
  const dayChangePercent = searchParams.get("dayChangePercent")
  const volume = searchParams.get("volume")
  const high52w = searchParams.get("high52w")
  const low52w = searchParams.get("low52w")

  if (!symbol || typeof symbol !== "string" || symbol.trim().length === 0) {
    return NextResponse.json({ error: "Valid symbol is required" }, { status: 400 })
  }

  try {
    // Determine exchange from symbol
    const exchange = symbol.includes(".NS") ? "NSE" : symbol.includes(".BO") ? "BSE" : "NSE"

    // Check market status
    const marketStatus = marketHoursService.getMarketStatus(exchange)

    // For development/demo purposes, allow predictions even when market is closed
    // In production, you might want to uncomment the following block:
    /*
    if (!marketStatus.isOpen) {
      const timeUntilOpen = marketHoursService.getTimeUntilOpen(exchange)
      return NextResponse.json(
        {
          error: "Predictions are only available during trading hours",
          marketStatus: {
            isOpen: false,
            status: marketStatus.marketStatus,
            exchange,
            timeUntilOpen,
            message: `${exchange} market is currently ${marketStatus.marketStatus.toLowerCase()}. Next trading session opens in ${timeUntilOpen}.`,
          },
        },
        { status: 423 },
      )
    }
    */

    // Use provided stock data or generate realistic defaults
    const stockData = {
      symbol: symbol.trim(),
      currentPrice: currentPrice ? Number.parseFloat(currentPrice) : 2800 + (Math.random() - 0.5) * 400,
      dayChange: dayChange ? Number.parseFloat(dayChange) : (Math.random() - 0.5) * 100,
      dayChangePercent: dayChangePercent ? Number.parseFloat(dayChangePercent) : (Math.random() - 0.5) * 5,
      volume: volume ? Number.parseInt(volume) : Math.floor(Math.random() * 2000000) + 500000,
      high52w: high52w ? Number.parseFloat(high52w) : 3500,
      low52w: low52w ? Number.parseFloat(low52w) : 2200,
    }

    // Validate stock data
    if (isNaN(stockData.currentPrice) || stockData.currentPrice <= 0) {
      throw new Error("Invalid current price")
    }

    const prediction = predictionService.getPrediction(stockData)

    // Add market timing information to prediction
    const timeUntilClose = marketStatus.isOpen ? marketHoursService.getTimeUntilClose(exchange) : null
    const timeUntilOpen = !marketStatus.isOpen ? marketHoursService.getTimeUntilOpen(exchange) : null

    return NextResponse.json({
      ...prediction,
      marketStatus: {
        isOpen: marketStatus.isOpen,
        status: marketStatus.marketStatus,
        exchange,
        timeUntilClose,
        timeUntilOpen,
        message: marketStatus.isOpen
          ? `Prediction generated during active trading hours. Market closes in ${timeUntilClose}.`
          : `Prediction generated for demo purposes. Market is ${marketStatus.marketStatus.toLowerCase()}. Opens in ${timeUntilOpen}.`,
      },
    })
  } catch (error) {
    console.error("Error in predict API:", error)
    return NextResponse.json(
      { error: "Failed to generate prediction", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
