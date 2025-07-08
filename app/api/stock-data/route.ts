import { type NextRequest, NextResponse } from "next/server"
import { stockDataFetcher } from "@/lib/stock-data-fetcher"
import { marketHoursService } from "@/lib/market-hours"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const symbol = searchParams.get("symbol")

  if (!symbol || typeof symbol !== "string" || symbol.trim().length === 0) {
    return NextResponse.json({ error: "Valid symbol is required" }, { status: 400 })
  }

  try {
    // Determine exchange from symbol
    const exchange = symbol.includes(".NS") ? "NSE" : symbol.includes(".BO") ? "BSE" : "NSE"

    // Get market status
    const marketStatus = marketHoursService.getMarketStatus(exchange)

    // Fetch stock data
    const stockData = await stockDataFetcher.fetchStockData(symbol.trim())

    if (!stockData) {
      throw new Error("Failed to fetch stock data")
    }

    // Add market status to response
    const response = {
      ...stockData,
      marketStatus: {
        isOpen: marketStatus.isOpen,
        status: marketStatus.marketStatus,
        exchange,
        timeUntilClose: marketStatus.isOpen ? marketHoursService.getTimeUntilClose(exchange) : null,
        timeUntilOpen: !marketStatus.isOpen ? marketHoursService.getTimeUntilOpen(exchange) : null,
        timezone: marketStatus.timezone,
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error in stock-data API:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch stock data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
