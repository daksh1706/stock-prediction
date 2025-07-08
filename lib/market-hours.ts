interface MarketHours {
  isOpen: boolean
  nextOpen: Date | null
  nextClose: Date | null
  timezone: string
  marketStatus: "OPEN" | "CLOSED" | "PRE_MARKET" | "AFTER_HOURS"
}

interface ExchangeHours {
  open: string
  close: string
  timezone: string
  holidays: string[]
}

class MarketHoursService {
  private exchangeHours: Record<string, ExchangeHours> = {
    NSE: {
      open: "09:15",
      close: "15:30",
      timezone: "Asia/Kolkata",
      holidays: [
        "2024-01-26", // Republic Day
        "2024-03-08", // Holi
        "2024-03-29", // Good Friday
        "2024-04-11", // Ram Navami
        "2024-04-17", // Mahavir Jayanti
        "2024-05-01", // Labour Day
        "2024-08-15", // Independence Day
        "2024-10-02", // Gandhi Jayanti
        "2024-10-31", // Diwali Laxmi Puja
        "2024-11-01", // Diwali Balipratipada
        "2024-11-15", // Guru Nanak Jayanti
        "2024-12-25", // Christmas
      ],
    },
    BSE: {
      open: "09:15",
      close: "15:30",
      timezone: "Asia/Kolkata",
      holidays: [
        "2024-01-26", // Republic Day
        "2024-03-08", // Holi
        "2024-03-29", // Good Friday
        "2024-04-11", // Ram Navami
        "2024-04-17", // Mahavir Jayanti
        "2024-05-01", // Labour Day
        "2024-08-15", // Independence Day
        "2024-10-02", // Gandhi Jayanti
        "2024-10-31", // Diwali Laxmi Puja
        "2024-11-01", // Diwali Balipratipada
        "2024-11-15", // Guru Nanak Jayanti
        "2024-12-25", // Christmas
      ],
    },
  }

  private getIndianTime(): Date {
    return new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }))
  }

  private isWeekend(date: Date): boolean {
    const day = date.getDay()
    return day === 0 || day === 6 // Sunday or Saturday
  }

  private isHoliday(date: Date, exchange: string): boolean {
    const dateStr = date.toISOString().split("T")[0]
    const exchangeInfo = this.exchangeHours[exchange]
    return exchangeInfo?.holidays.includes(dateStr) || false
  }

  private parseTime(timeStr: string, date: Date): Date {
    const [hours, minutes] = timeStr.split(":").map(Number)
    const result = new Date(date)
    result.setHours(hours, minutes, 0, 0)
    return result
  }

  public getMarketStatus(exchange: string): MarketHours {
    const now = this.getIndianTime()
    const exchangeInfo = this.exchangeHours[exchange]

    if (!exchangeInfo) {
      return {
        isOpen: false,
        nextOpen: null,
        nextClose: null,
        timezone: "Asia/Kolkata",
        marketStatus: "CLOSED",
      }
    }

    // Check if it's weekend or holiday
    if (this.isWeekend(now) || this.isHoliday(now, exchange)) {
      const nextOpen = this.getNextTradingDay(now, exchange)
      return {
        isOpen: false,
        nextOpen,
        nextClose: null,
        timezone: exchangeInfo.timezone,
        marketStatus: "CLOSED",
      }
    }

    const openTime = this.parseTime(exchangeInfo.open, now)
    const closeTime = this.parseTime(exchangeInfo.close, now)

    // Pre-market (before 9:15 AM)
    if (now < openTime) {
      return {
        isOpen: false,
        nextOpen: openTime,
        nextClose: closeTime,
        timezone: exchangeInfo.timezone,
        marketStatus: "PRE_MARKET",
      }
    }

    // Market hours (9:15 AM - 3:30 PM)
    if (now >= openTime && now <= closeTime) {
      return {
        isOpen: true,
        nextOpen: null,
        nextClose: closeTime,
        timezone: exchangeInfo.timezone,
        marketStatus: "OPEN",
      }
    }

    // After hours (after 3:30 PM)
    const nextOpen = this.getNextTradingDay(now, exchange)
    return {
      isOpen: false,
      nextOpen,
      nextClose: null,
      timezone: exchangeInfo.timezone,
      marketStatus: "AFTER_HOURS",
    }
  }

  private getNextTradingDay(currentDate: Date, exchange: string): Date {
    const nextDay = new Date(currentDate)
    nextDay.setDate(nextDay.getDate() + 1)

    // Keep incrementing until we find a trading day
    while (this.isWeekend(nextDay) || this.isHoliday(nextDay, exchange)) {
      nextDay.setDate(nextDay.getDate() + 1)
    }

    const exchangeInfo = this.exchangeHours[exchange]
    return this.parseTime(exchangeInfo.open, nextDay)
  }

  public getTimeUntilOpen(exchange: string): string {
    const marketStatus = this.getMarketStatus(exchange)
    if (!marketStatus.nextOpen) return "Market closed"

    const now = this.getIndianTime()
    const diff = marketStatus.nextOpen.getTime() - now.getTime()

    if (diff <= 0) return "Market should be open"

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (hours > 24) {
      const days = Math.floor(hours / 24)
      const remainingHours = hours % 24
      return `${days}d ${remainingHours}h ${minutes}m`
    }

    return `${hours}h ${minutes}m`
  }

  public getTimeUntilClose(exchange: string): string {
    const marketStatus = this.getMarketStatus(exchange)
    if (!marketStatus.nextClose || !marketStatus.isOpen) return "Market closed"

    const now = this.getIndianTime()
    const diff = marketStatus.nextClose.getTime() - now.getTime()

    if (diff <= 0) return "Market closed"

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    return `${hours}h ${minutes}m`
  }
}

export const marketHoursService = new MarketHoursService()
