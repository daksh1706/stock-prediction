interface MarketStatus {
  isOpen: boolean
  marketStatus: "OPEN" | "CLOSED" | "PRE_MARKET" | "AFTER_HOURS"
  nextOpen?: Date
  nextClose?: Date
}

class MarketHoursService {
  // Indian market holidays for 2024-2025
  private holidays = [
    "2024-01-26", // Republic Day
    "2024-03-08", // Holi
    "2024-03-29", // Good Friday
    "2024-04-11", // Eid ul-Fitr
    "2024-04-17", // Ram Navami
    "2024-05-01", // Maharashtra Day
    "2024-08-15", // Independence Day
    "2024-08-19", // Raksha Bandhan
    "2024-10-02", // Gandhi Jayanti
    "2024-10-31", // Diwali Laxmi Puja
    "2024-11-01", // Diwali Balipratipada
    "2024-11-15", // Guru Nanak Jayanti
    "2024-12-25", // Christmas
    "2025-01-26", // Republic Day
    "2025-03-14", // Holi
    "2025-04-18", // Good Friday
    "2025-05-01", // Maharashtra Day
    "2025-08-15", // Independence Day
    "2025-10-02", // Gandhi Jayanti
    "2025-12-25", // Christmas
  ]

  private isHoliday(date: Date): boolean {
    const dateStr = date.toISOString().split("T")[0]
    return this.holidays.includes(dateStr)
  }

  private getISTTime(): Date {
    // Convert current time to IST (UTC+5:30)
    const now = new Date()
    const utc = now.getTime() + now.getTimezoneOffset() * 60000
    const ist = new Date(utc + 5.5 * 3600000)
    return ist
  }

  public getMarketStatus(exchange: "NSE" | "BSE" = "NSE"): MarketStatus {
    const now = this.getISTTime()
    const dayOfWeek = now.getDay() // 0 = Sunday, 6 = Saturday

    // Check if it's weekend
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return {
        isOpen: false,
        marketStatus: "CLOSED",
      }
    }

    // Check if it's a holiday
    if (this.isHoliday(now)) {
      return {
        isOpen: false,
        marketStatus: "CLOSED",
      }
    }

    const hours = now.getHours()
    const minutes = now.getMinutes()
    const currentTime = hours * 60 + minutes

    // Market timings: 9:15 AM to 3:30 PM IST
    const marketOpen = 9 * 60 + 15 // 9:15 AM
    const marketClose = 15 * 60 + 30 // 3:30 PM
    const preMarketStart = 9 * 60 // 9:00 AM
    const afterHoursEnd = 16 * 60 // 4:00 PM

    if (currentTime >= marketOpen && currentTime <= marketClose) {
      return {
        isOpen: true,
        marketStatus: "OPEN",
      }
    } else if (currentTime >= preMarketStart && currentTime < marketOpen) {
      return {
        isOpen: false,
        marketStatus: "PRE_MARKET",
      }
    } else if (currentTime > marketClose && currentTime <= afterHoursEnd) {
      return {
        isOpen: false,
        marketStatus: "AFTER_HOURS",
      }
    } else {
      return {
        isOpen: false,
        marketStatus: "CLOSED",
      }
    }
  }

  public getTimeUntilOpen(exchange: "NSE" | "BSE" = "NSE"): string {
    const now = this.getISTTime()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(9, 15, 0, 0)

    // If it's Friday evening, next open is Monday
    if (now.getDay() === 5 && now.getHours() >= 15) {
      tomorrow.setDate(tomorrow.getDate() + 2)
    }
    // If it's Saturday, next open is Monday
    else if (now.getDay() === 6) {
      tomorrow.setDate(tomorrow.getDate() + 1)
    }
    // If it's Sunday, next open is Monday
    else if (now.getDay() === 0) {
      tomorrow.setDate(tomorrow.getDate() + 0)
    }

    const diff = tomorrow.getTime() - now.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (hours > 24) {
      const days = Math.floor(hours / 24)
      const remainingHours = hours % 24
      return `${days}d ${remainingHours}h ${minutes}m`
    }

    return `${hours}h ${minutes}m`
  }

  public getTimeUntilClose(exchange: "NSE" | "BSE" = "NSE"): string {
    const now = this.getISTTime()
    const today = new Date(now)
    today.setHours(15, 30, 0, 0)

    const diff = today.getTime() - now.getTime()
    if (diff <= 0) return "Market Closed"

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    return `${hours}h ${minutes}m`
  }

  public isMarketOpen(exchange: "NSE" | "BSE" = "NSE"): boolean {
    return this.getMarketStatus(exchange).isOpen
  }
}

export const marketHoursService = new MarketHoursService()
