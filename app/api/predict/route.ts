import { type NextRequest, NextResponse } from "next/server"
import { predictionService } from "@/lib/prediction-service"
import { isMarketOpen } from "@/lib/market-hours"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get("symbol")

    if (!symbol) {
      return NextResponse.json({ error: "Symbol is required" }, { status: 400 })
    }

    // Check if market is open
    const marketStatus = isMarketOpen()
    if (!marketStatus.isOpen) {
      return NextResponse.json(
        {
          error: "Market is closed",
          marketStatus,
        },
        { status: 423 },
      )
    }

    // Get stock data from query params or use defaults
    const stockData = {
      symbol,
      currentPrice: Number.parseFloat(searchParams.get("currentPrice") || "0") || 2800,
      dayChange: Number.parseFloat(searchParams.get("dayChange") || "0") || 0,
      dayChangePercent: Number.parseFloat(searchParams.get("dayChangePercent") || "0") || 0,
      volume: Number.parseInt(searchParams.get("volume") || "0") || 1000000,
      high52w: Number.parseFloat(searchParams.get("high52w") || "0") || 3640,
      low52w: Number.parseFloat(searchParams.get("low52w") || "0") || 1960,
    }

    // Validate stock data
    if (stockData.currentPrice <= 0) {
      return NextResponse.json({ error: "Invalid stock price data" }, { status: 400 })
    }

    // Generate prediction
    const prediction = predictionService.getPrediction(stockData)

    // Validate prediction before sending
    if (
      !prediction ||
      !prediction.signal ||
      typeof prediction.confidence !== "number" ||
      typeof prediction.targetPrice !== "number"
    ) {
      return NextResponse.json({ error: "Failed to generate valid prediction" }, { status: 500 })
    }

    return NextResponse.json(prediction)
  } catch (error) {
    console.error("Prediction API error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
