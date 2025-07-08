import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import json

def fetch_nse_bse_stocks():
    """
    Fetch stock data for popular NSE and BSE stocks
    """
    # Popular NSE stocks
    nse_stocks = [
        "RELIANCE.NS", "TCS.NS", "HDFCBANK.NS", "INFY.NS", "HINDUNILVR.NS",
        "ITC.NS", "SBIN.NS", "BHARTIARTL.NS", "ASIANPAINT.NS", "MARUTI.NS",
        "KOTAKBANK.NS", "LT.NS", "AXISBANK.NS", "ICICIBANK.NS", "BAJFINANCE.NS",
        "HCLTECH.NS", "WIPRO.NS", "ULTRACEMCO.NS", "TITAN.NS", "SUNPHARMA.NS"
    ]
    
    # Popular BSE stocks (using .BO suffix)
    bse_stocks = [
        "500325.BO", "532540.BO", "500180.BO", "500209.BO", "500696.BO",
        "500875.BO", "500112.BO", "532454.BO", "500820.BO", "532500.BO"
    ]
    
    all_stocks = nse_stocks + bse_stocks
    stock_data = {}
    
    print(f"Fetching data for {len(all_stocks)} stocks...")
    
    for symbol in all_stocks:
        try:
            print(f"Fetching data for {symbol}...")
            
            # Fetch 5 years of data
            stock = yf.Ticker(symbol)
            hist = stock.history(period="5y")
            
            if not hist.empty:
                # Calculate technical indicators
                hist['SMA_20'] = hist['Close'].rolling(window=20).mean()
                hist['SMA_50'] = hist['Close'].rolling(window=50).mean()
                hist['RSI'] = calculate_rsi(hist['Close'])
                hist['MACD'], hist['MACD_Signal'] = calculate_macd(hist['Close'])
                hist['Bollinger_Upper'], hist['Bollinger_Lower'] = calculate_bollinger_bands(hist['Close'])
                
                # Get stock info
                info = stock.info
                
                stock_data[symbol] = {
                    'symbol': symbol,
                    'name': info.get('longName', symbol),
                    'sector': info.get('sector', 'Unknown'),
                    'industry': info.get('industry', 'Unknown'),
                    'market_cap': info.get('marketCap', 0),
                    'current_price': hist['Close'].iloc[-1],
                    'historical_data': hist.to_dict('records'),
                    'last_updated': datetime.now().isoformat()
                }
                
                print(f"✓ Successfully fetched data for {symbol}")
            else:
                print(f"✗ No data available for {symbol}")
                
        except Exception as e: 
                print(f"✗ No data available for {symbol}")
                
        except Exception as e:
            print(f"✗ Error fetching data for {symbol}: {str(e)}")
            continue
    
    return stock_data

def calculate_rsi(prices, window=14):
    """Calculate Relative Strength Index"""
    delta = prices.diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=window).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=window).mean()
    rs = gain / loss
    rsi = 100 - (100 / (1 + rs))
    return rsi

def calculate_macd(prices, fast=12, slow=26, signal=9):
    """Calculate MACD indicator"""
    ema_fast = prices.ewm(span=fast).mean()
    ema_slow = prices.ewm(span=slow).mean()
    macd = ema_fast - ema_slow
    macd_signal = macd.ewm(span=signal).mean()
    return macd, macd_signal

def calculate_bollinger_bands(prices, window=20, num_std=2):
    """Calculate Bollinger Bands"""
    sma = prices.rolling(window=window).mean()
    std = prices.rolling(window=window).std()
    upper_band = sma + (std * num_std)
    lower_band = sma - (std * num_std)
    return upper_band, lower_band

def save_stock_data(stock_data, filename='stock_data.json'):
    """Save stock data to JSON file"""
    with open(filename, 'w') as f:
        json.dump(stock_data, f, indent=2, default=str)
    print(f"Stock data saved to {filename}")

if __name__ == "__main__":
    print("Starting stock data collection for NSE and BSE...")
    stock_data = fetch_nse_bse_stocks()
    save_stock_data(stock_data)
    print(f"Data collection completed. Fetched data for {len(stock_data)} stocks.")
