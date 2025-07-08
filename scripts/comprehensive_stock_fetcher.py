import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import json
import requests
from bs4 import BeautifulSoup
import time
import warnings
warnings.filterwarnings('ignore')

class ComprehensiveStockFetcher:
    def __init__(self):
        # Comprehensive list of NSE and BSE stocks
        self.nse_stocks = [
            # Large Cap Stocks
            {"symbol": "RELIANCE.NS", "name": "Reliance Industries Ltd", "sector": "Oil & Gas", "market_cap": "Large"},
            {"symbol": "TCS.NS", "name": "Tata Consultancy Services Ltd", "sector": "IT", "market_cap": "Large"},
            {"symbol": "HDFCBANK.NS", "name": "HDFC Bank Ltd", "sector": "Banking", "market_cap": "Large"},
            {"symbol": "INFY.NS", "name": "Infosys Ltd", "sector": "IT", "market_cap": "Large"},
            {"symbol": "HINDUNILVR.NS", "name": "Hindustan Unilever Ltd", "sector": "FMCG", "market_cap": "Large"},
            {"symbol": "ITC.NS", "name": "ITC Ltd", "sector": "FMCG", "market_cap": "Large"},
            {"symbol": "SBIN.NS", "name": "State Bank of India", "sector": "Banking", "market_cap": "Large"},
            {"symbol": "BHARTIARTL.NS", "name": "Bharti Airtel Ltd", "sector": "Telecom", "market_cap": "Large"},
            {"symbol": "ASIANPAINT.NS", "name": "Asian Paints Ltd", "sector": "Paints", "market_cap": "Large"},
            {"symbol": "MARUTI.NS", "name": "Maruti Suzuki India Ltd", "sector": "Auto", "market_cap": "Large"},
            {"symbol": "KOTAKBANK.NS", "name": "Kotak Mahindra Bank Ltd", "sector": "Banking", "market_cap": "Large"},
            {"symbol": "LT.NS", "name": "Larsen & Toubro Ltd", "sector": "Construction", "market_cap": "Large"},
            {"symbol": "AXISBANK.NS", "name": "Axis Bank Ltd", "sector": "Banking", "market_cap": "Large"},
            {"symbol": "ICICIBANK.NS", "name": "ICICI Bank Ltd", "sector": "Banking", "market_cap": "Large"},
            {"symbol": "BAJFINANCE.NS", "name": "Bajaj Finance Ltd", "sector": "NBFC", "market_cap": "Large"},
            {"symbol": "HCLTECH.NS", "name": "HCL Technologies Ltd", "sector": "IT", "market_cap": "Large"},
            {"symbol": "WIPRO.NS", "name": "Wipro Ltd", "sector": "IT", "market_cap": "Large"},
            {"symbol": "ULTRACEMCO.NS", "name": "UltraTech Cement Ltd", "sector": "Cement", "market_cap": "Large"},
            {"symbol": "TITAN.NS", "name": "Titan Company Ltd", "sector": "Jewellery", "market_cap": "Large"},
            {"symbol": "SUNPHARMA.NS", "name": "Sun Pharmaceutical Industries Ltd", "sector": "Pharma", "market_cap": "Large"},
            {"symbol": "NESTLEIND.NS", "name": "Nestle India Ltd", "sector": "FMCG", "market_cap": "Large"},
            {"symbol": "POWERGRID.NS", "name": "Power Grid Corporation of India Ltd", "sector": "Power", "market_cap": "Large"},
            {"symbol": "NTPC.NS", "name": "NTPC Ltd", "sector": "Power", "market_cap": "Large"},
            {"symbol": "COALINDIA.NS", "name": "Coal India Ltd", "sector": "Mining", "market_cap": "Large"},
            {"symbol": "ONGC.NS", "name": "Oil & Natural Gas Corporation Ltd", "sector": "Oil & Gas", "market_cap": "Large"},
            {"symbol": "TECHM.NS", "name": "Tech Mahindra Ltd", "sector": "IT", "market_cap": "Large"},
            {"symbol": "TATAMOTORS.NS", "name": "Tata Motors Ltd", "sector": "Auto", "market_cap": "Large"},
            {"symbol": "TATASTEEL.NS", "name": "Tata Steel Ltd", "sector": "Steel", "market_cap": "Large"},
            {"symbol": "JSWSTEEL.NS", "name": "JSW Steel Ltd", "sector": "Steel", "market_cap": "Large"},
            {"symbol": "HINDALCO.NS", "name": "Hindalco Industries Ltd", "sector": "Metals", "market_cap": "Large"},
            
            # Mid Cap Stocks
            {"symbol": "BAJAJFINSV.NS", "name": "Bajaj Finserv Ltd", "sector": "Financial Services", "market_cap": "Mid"},
            {"symbol": "HDFCLIFE.NS", "name": "HDFC Life Insurance Company Ltd", "sector": "Insurance", "market_cap": "Mid"},
            {"symbol": "SBILIFE.NS", "name": "SBI Life Insurance Company Ltd", "sector": "Insurance", "market_cap": "Mid"},
            {"symbol": "ICICIPRULI.NS", "name": "ICICI Prudential Life Insurance Company Ltd", "sector": "Insurance", "market_cap": "Mid"},
            {"symbol": "DIVISLAB.NS", "name": "Divi's Laboratories Ltd", "sector": "Pharma", "market_cap": "Mid"},
            {"symbol": "DRREDDY.NS", "name": "Dr. Reddy's Laboratories Ltd", "sector": "Pharma", "market_cap": "Mid"},
            {"symbol": "CIPLA.NS", "name": "Cipla Ltd", "sector": "Pharma", "market_cap": "Mid"},
            {"symbol": "APOLLOHOSP.NS", "name": "Apollo Hospitals Enterprise Ltd", "sector": "Healthcare", "market_cap": "Mid"},
            {"symbol": "ADANIPORTS.NS", "name": "Adani Ports and Special Economic Zone Ltd", "sector": "Infrastructure", "market_cap": "Mid"},
            {"symbol": "ADANIENT.NS", "name": "Adani Enterprises Ltd", "sector": "Diversified", "market_cap": "Mid"},
            {"symbol": "GODREJCP.NS", "name": "Godrej Consumer Products Ltd", "sector": "FMCG", "market_cap": "Mid"},
            {"symbol": "BRITANNIA.NS", "name": "Britannia Industries Ltd", "sector": "FMCG", "market_cap": "Mid"},
            {"symbol": "DABUR.NS", "name": "Dabur India Ltd", "sector": "FMCG", "market_cap": "Mid"},
            {"symbol": "MARICO.NS", "name": "Marico Ltd", "sector": "FMCG", "market_cap": "Mid"},
            {"symbol": "PIDILITIND.NS", "name": "Pidilite Industries Ltd", "sector": "Chemicals", "market_cap": "Mid"},
            {"symbol": "BERGEPAINT.NS", "name": "Berger Paints India Ltd", "sector": "Paints", "market_cap": "Mid"},
            {"symbol": "GRASIM.NS", "name": "Grasim Industries Ltd", "sector": "Textiles", "market_cap": "Mid"},
            {"symbol": "SHREECEM.NS", "name": "Shree Cement Ltd", "sector": "Cement", "market_cap": "Mid"},
            {"symbol": "AMBUJACEM.NS", "name": "Ambuja Cements Ltd", "sector": "Cement", "market_cap": "Mid"},
            {"symbol": "ACC.NS", "name": "ACC Ltd", "sector": "Cement", "market_cap": "Mid"},
            
            # Small Cap Stocks
            {"symbol": "TATAPOWER.NS", "name": "Tata Power Company Ltd", "sector": "Power", "market_cap": "Small"},
            {"symbol": "SAIL.NS", "name": "Steel Authority of India Ltd", "sector": "Steel", "market_cap": "Small"},
            {"symbol": "NMDC.NS", "name": "NMDC Ltd", "sector": "Mining", "market_cap": "Small"},
            {"symbol": "VEDL.NS", "name": "Vedanta Ltd", "sector": "Metals", "market_cap": "Small"},
            {"symbol": "JINDALSTEL.NS", "name": "Jindal Steel & Power Ltd", "sector": "Steel", "market_cap": "Small"},
            {"symbol": "NATIONALUM.NS", "name": "National Aluminium Company Ltd", "sector": "Metals", "market_cap": "Small"},
            {"symbol": "HINDZINC.NS", "name": "Hindustan Zinc Ltd", "sector": "Metals", "market_cap": "Small"},
            {"symbol": "BANKBARODA.NS", "name": "Bank of Baroda", "sector": "Banking", "market_cap": "Small"},
            {"symbol": "PNB.NS", "name": "Punjab National Bank", "sector": "Banking", "market_cap": "Small"},
            {"symbol": "CANBK.NS", "name": "Canara Bank", "sector": "Banking", "market_cap": "Small"},
            {"symbol": "UNIONBANK.NS", "name": "Union Bank of India", "sector": "Banking", "market_cap": "Small"},
            {"symbol": "INDUSINDBK.NS", "name": "IndusInd Bank Ltd", "sector": "Banking", "market_cap": "Small"},
            {"symbol": "FEDERALBNK.NS", "name": "Federal Bank Ltd", "sector": "Banking", "market_cap": "Small"},
            {"symbol": "IDFCFIRSTB.NS", "name": "IDFC First Bank Ltd", "sector": "Banking", "market_cap": "Small"},
            {"symbol": "BANDHANBNK.NS", "name": "Bandhan Bank Ltd", "sector": "Banking", "market_cap": "Small"},
            {"symbol": "RBLBANK.NS", "name": "RBL Bank Ltd", "sector": "Banking", "market_cap": "Small"},
            
            # IT Sector
            {"symbol": "MINDTREE.NS", "name": "Mindtree Ltd", "sector": "IT", "market_cap": "Mid"},
            {"symbol": "MPHASIS.NS", "name": "Mphasis Ltd", "sector": "IT", "market_cap": "Mid"},
            {"symbol": "LTI.NS", "name": "L&T Infotech Ltd", "sector": "IT", "market_cap": "Mid"},
            {"symbol": "COFORGE.NS", "name": "Coforge Ltd", "sector": "IT", "market_cap": "Small"},
            {"symbol": "PERSISTENT.NS", "name": "Persistent Systems Ltd", "sector": "IT", "market_cap": "Small"},
            {"symbol": "LTTS.NS", "name": "L&T Technology Services Ltd", "sector": "IT", "market_cap": "Small"},
            
            # Auto Sector
            {"symbol": "M&M.NS", "name": "Mahindra & Mahindra Ltd", "sector": "Auto", "market_cap": "Large"},
            {"symbol": "BAJAJ-AUTO.NS", "name": "Bajaj Auto Ltd", "sector": "Auto", "market_cap": "Large"},
            {"symbol": "HEROMOTOCO.NS", "name": "Hero MotoCorp Ltd", "sector": "Auto", "market_cap": "Large"},
            {"symbol": "EICHERMOT.NS", "name": "Eicher Motors Ltd", "sector": "Auto", "market_cap": "Mid"},
            {"symbol": "ASHOKLEY.NS", "name": "Ashok Leyland Ltd", "sector": "Auto", "market_cap": "Small"},
            {"symbol": "TVSMOTOR.NS", "name": "TVS Motor Company Ltd", "sector": "Auto", "market_cap": "Small"},
            {"symbol": "BAJAJHLDNG.NS", "name": "Bajaj Holdings & Investment Ltd", "sector": "Auto", "market_cap": "Small"},
            
            # Pharma Sector
            {"symbol": "LUPIN.NS", "name": "Lupin Ltd", "sector": "Pharma", "market_cap": "Mid"},
            {"symbol": "AUROPHARMA.NS", "name": "Aurobindo Pharma Ltd", "sector": "Pharma", "market_cap": "Mid"},
            {"symbol": "CADILAHC.NS", "name": "Cadila Healthcare Ltd", "sector": "Pharma", "market_cap": "Mid"},
            {"symbol": "BIOCON.NS", "name": "Biocon Ltd", "sector": "Pharma", "market_cap": "Mid"},
            {"symbol": "TORNTPHARM.NS", "name": "Torrent Pharmaceuticals Ltd", "sector": "Pharma", "market_cap": "Mid"},
            {"symbol": "ALKEM.NS", "name": "Alkem Laboratories Ltd", "sector": "Pharma", "market_cap": "Small"},
            {"symbol": "GLENMARK.NS", "name": "Glenmark Pharmaceuticals Ltd", "sector": "Pharma", "market_cap": "Small"},
        ]
        
        self.bse_stocks = [
            {"symbol": "500325.BO", "name": "Reliance Industries Ltd", "sector": "Oil & Gas", "market_cap": "Large"},
            {"symbol": "532540.BO", "name": "Tata Consultancy Services Ltd", "sector": "IT", "market_cap": "Large"},
            {"symbol": "500180.BO", "name": "HDFC Bank Ltd", "sector": "Banking", "market_cap": "Large"},
            {"symbol": "500209.BO", "name": "Infosys Ltd", "sector": "IT", "market_cap": "Large"},
            {"symbol": "500696.BO", "name": "Hindustan Unilever Ltd", "sector": "FMCG", "market_cap": "Large"},
            {"symbol": "500875.BO", "name": "ITC Ltd", "sector": "FMCG", "market_cap": "Large"},
            {"symbol": "500112.BO", "name": "State Bank of India", "sector": "Banking", "market_cap": "Large"},
            {"symbol": "532454.BO", "name": "Bharti Airtel Ltd", "sector": "Telecom", "market_cap": "Large"},
            {"symbol": "500820.BO", "name": "Asian Paints Ltd", "sector": "Paints", "market_cap": "Large"},
            {"symbol": "532500.BO", "name": "Maruti Suzuki India Ltd", "sector": "Auto", "market_cap": "Large"},
            {"symbol": "500247.BO", "name": "Kotak Mahindra Bank Ltd", "sector": "Banking", "market_cap": "Large"},
            {"symbol": "500510.BO", "name": "Larsen & Toubro Ltd", "sector": "Construction", "market_cap": "Large"},
            {"symbol": "532215.BO", "name": "Axis Bank Ltd", "sector": "Banking", "market_cap": "Large"},
            {"symbol": "532174.BO", "name": "ICICI Bank Ltd", "sector": "Banking", "market_cap": "Large"},
            {"symbol": "500034.BO", "name": "Bajaj Finance Ltd", "sector": "NBFC", "market_cap": "Large"},
        ]
        
    def fetch_stock_data(self, symbol_info, period="5y"):
        """Fetch comprehensive stock data for a single stock"""
        try:
            symbol = symbol_info["symbol"]
            print(f"Fetching data for {symbol}...")
            
            # Create ticker object
            ticker = yf.Ticker(symbol)
            
            # Get historical data
            hist = ticker.history(period=period)
            
            if hist.empty:
                print(f"No historical data found for {symbol}")
                return None
            
            # Get stock info
            try:
                info = ticker.info
            except:
                info = {}
            
            # Calculate technical indicators
            hist = self.calculate_technical_indicators(hist)
            
            # Prepare stock data
            stock_data = {
                'symbol': symbol,
                'name': symbol_info.get('name', info.get('longName', symbol)),
                'sector': symbol_info.get('sector', info.get('sector', 'Unknown')),
                'industry': info.get('industry', 'Unknown'),
                'market_cap_category': symbol_info.get('market_cap', 'Unknown'),
                'market_cap': info.get('marketCap', 0),
                'current_price': float(hist['Close'].iloc[-1]) if not hist.empty else 0,
                'day_change': float(hist['Close'].iloc[-1] - hist['Close'].iloc[-2]) if len(hist) > 1 else 0,
                'day_change_percent': float(((hist['Close'].iloc[-1] - hist['Close'].iloc[-2]) / hist['Close'].iloc[-2]) * 100) if len(hist) > 1 else 0,
                'volume': int(hist['Volume'].iloc[-1]) if not hist.empty else 0,
                'high_52w': float(hist['High'].max()),
                'low_52w': float(hist['Low'].min()),
                'pe_ratio': info.get('trailingPE', 0),
                'pb_ratio': info.get('priceToBook', 0),
                'dividend_yield': info.get('dividendYield', 0),
                'beta': info.get('beta', 1.0),
                'eps': info.get('trailingEps', 0),
                'book_value': info.get('bookValue', 0),
                'historical_data': self.prepare_historical_data(hist),
                'technical_indicators': self.get_latest_technical_indicators(hist),
                'last_updated': datetime.now().isoformat(),
                'exchange': 'NSE' if '.NS' in symbol else 'BSE'
            }
            
            return stock_data
            
        except Exception as e:
            print(f"Error fetching data for {symbol}: {str(e)}")
            return None
    
    def calculate_technical_indicators(self, df):
        """Calculate comprehensive technical indicators"""
        # Simple Moving Averages
        df['SMA_5'] = df['Close'].rolling(window=5).mean()
        df['SMA_10'] = df['Close'].rolling(window=10).mean()
        df['SMA_20'] = df['Close'].rolling(window=20).mean()
        df['SMA_50'] = df['Close'].rolling(window=50).mean()
        df['SMA_200'] = df['Close'].rolling(window=200).mean()
        
        # Exponential Moving Averages
        df['EMA_12'] = df['Close'].ewm(span=12).mean()
        df['EMA_26'] = df['Close'].ewm(span=26).mean()
        
        # RSI
        df['RSI'] = self.calculate_rsi(df['Close'])
        
        # MACD
        df['MACD'] = df['EMA_12'] - df['EMA_26']
        df['MACD_Signal'] = df['MACD'].ewm(span=9).mean()
        df['MACD_Histogram'] = df['MACD'] - df['MACD_Signal']
        
        # Bollinger Bands
        df['BB_Middle'] = df['Close'].rolling(window=20).mean()
        bb_std = df['Close'].rolling(window=20).std()
        df['BB_Upper'] = df['BB_Middle'] + (bb_std * 2)
        df['BB_Lower'] = df['BB_Middle'] - (bb_std * 2)
        
        # Stochastic Oscillator
        df['Stoch_K'], df['Stoch_D'] = self.calculate_stochastic(df)
        
        # Average True Range (ATR)
        df['ATR'] = self.calculate_atr(df)
        
        # Volume indicators
        df['Volume_SMA'] = df['Volume'].rolling(window=20).mean()
        df['Volume_Ratio'] = df['Volume'] / df['Volume_SMA']
        
        return df
    
    def calculate_rsi(self, prices, window=14):
        """Calculate Relative Strength Index"""
        delta = prices.diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=window).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=window).mean()
        rs = gain / loss
        rsi = 100 - (100 / (1 + rs))
        return rsi
    
    def calculate_stochastic(self, df, k_window=14, d_window=3):
        """Calculate Stochastic Oscillator"""
        low_min = df['Low'].rolling(window=k_window).min()
        high_max = df['High'].rolling(window=k_window).max()
        k_percent = 100 * ((df['Close'] - low_min) / (high_max - low_min))
        d_percent = k_percent.rolling(window=d_window).mean()
        return k_percent, d_percent
    
    def calculate_atr(self, df, window=14):
        """Calculate Average True Range"""
        high_low = df['High'] - df['Low']
        high_close = np.abs(df['High'] - df['Close'].shift())
        low_close = np.abs(df['Low'] - df['Close'].shift())
        ranges = pd.concat([high_low, high_close, low_close], axis=1)
        true_range = np.max(ranges, axis=1)
        return true_range.rolling(window).mean()
    
    def prepare_historical_data(self, df):
        """Prepare historical data for JSON serialization"""
        df_clean = df.dropna()
        records = []
        
        for index, row in df_clean.iterrows():
            record = {
                'Date': index.strftime('%Y-%m-%d'),
                'Open': float(row['Open']),
                'High': float(row['High']),
                'Low': float(row['Low']),
                'Close': float(row['Close']),
                'Volume': int(row['Volume']),
                'SMA_20': float(row['SMA_20']) if pd.notna(row['SMA_20']) else None,
                'SMA_50': float(row['SMA_50']) if pd.notna(row['SMA_50']) else None,
                'RSI': float(row['RSI']) if pd.notna(row['RSI']) else None,
                'MACD': float(row['MACD']) if pd.notna(row['MACD']) else None,
                'MACD_Signal': float(row['MACD_Signal']) if pd.notna(row['MACD_Signal']) else None,
                'BB_Upper': float(row['BB_Upper']) if pd.notna(row['BB_Upper']) else None,
                'BB_Lower': float(row['BB_Lower']) if pd.notna(row['BB_Lower']) else None,
            }
            records.append(record)
        
        return records[-252:]  # Return last 252 trading days (1 year)
    
    def get_latest_technical_indicators(self, df):
        """Get latest technical indicator values"""
        if df.empty:
            return {}
        
        latest = df.iloc[-1]
        return {
            'rsi': float(latest['RSI']) if pd.notna(latest['RSI']) else None,
            'macd': float(latest['MACD']) if pd.notna(latest['MACD']) else None,
            'macd_signal': float(latest['MACD_Signal']) if pd.notna(latest['MACD_Signal']) else None,
            'bb_upper': float(latest['BB_Upper']) if pd.notna(latest['BB_Upper']) else None,
            'bb_middle': float(latest['BB_Middle']) if pd.notna(latest['BB_Middle']) else None,
            'bb_lower': float(latest['BB_Lower']) if pd.notna(latest['BB_Lower']) else None,
            'sma_20': float(latest['SMA_20']) if pd.notna(latest['SMA_20']) else None,
            'sma_50': float(latest['SMA_50']) if pd.notna(latest['SMA_50']) else None,
            'volume_ratio': float(latest['Volume_Ratio']) if pd.notna(latest['Volume_Ratio']) else None,
            'atr': float(latest['ATR']) if pd.notna(latest['ATR']) else None,
        }
    
    def fetch_all_stocks(self):
        """Fetch data for all stocks"""
        all_stocks = self.nse_stocks + self.bse_stocks
        stock_data = {}
        
        print(f"Starting to fetch data for {len(all_stocks)} stocks...")
        
        for i, stock_info in enumerate(all_stocks):
            try:
                data = self.fetch_stock_data(stock_info)
                if data:
                    stock_data[data['symbol']] = data
                    print(f"✓ [{i+1}/{len(all_stocks)}] Successfully fetched {data['symbol']}")
                else:
                    print(f"✗ [{i+1}/{len(all_stocks)}] Failed to fetch {stock_info['symbol']}")
                
                # Add delay to avoid rate limiting
                time.sleep(0.5)
                
            except Exception as e:
                print(f"✗ [{i+1}/{len(all_stocks)}] Error with {stock_info['symbol']}: {str(e)}")
                continue
        
        return stock_data
    
    def save_stock_data(self, stock_data, filename='comprehensive_stock_data.json'):
        """Save stock data to JSON file"""
        try:
            with open(filename, 'w') as f:
                json.dump(stock_data, f, indent=2, default=str)
            print(f"✓ Stock data saved to {filename}")
            print(f"✓ Total stocks saved: {len(stock_data)}")
            
            # Save summary statistics
            self.save_summary_stats(stock_data)
            
        except Exception as e:
            print(f"✗ Error saving stock data: {str(e)}")
    
    def save_summary_stats(self, stock_data):
        """Save summary statistics"""
        stats = {
            'total_stocks': len(stock_data),
            'exchanges': {},
            'sectors': {},
            'market_caps': {},
            'last_updated': datetime.now().isoformat()
        }
        
        for symbol, data in stock_data.items():
            # Exchange distribution
            exchange = data.get('exchange', 'Unknown')
            stats['exchanges'][exchange] = stats['exchanges'].get(exchange, 0) + 1
            
            # Sector distribution
            sector = data.get('sector', 'Unknown')
            stats['sectors'][sector] = stats['sectors'].get(sector, 0) + 1
            
            # Market cap distribution
            market_cap = data.get('market_cap_category', 'Unknown')
            stats['market_caps'][market_cap] = stats['market_caps'].get(market_cap, 0) + 1
        
        with open('stock_summary_stats.json', 'w') as f:
            json.dump(stats, f, indent=2)
        
        print(f"✓ Summary statistics saved")
        print(f"  - Total Stocks: {stats['total_stocks']}")
        print(f"  - Exchanges: {dict(stats['exchanges'])}")
        print(f"  - Top Sectors: {dict(list(sorted(stats['sectors'].items(), key=lambda x: x[1], reverse=True))[:5])}")

if __name__ == "__main__":
    print("🚀 Starting Comprehensive Stock Data Fetching...")
    print("=" * 60)
    
    fetcher = ComprehensiveStockFetcher()
    
    # Fetch all stock data
    stock_data = fetcher.fetch_all_stocks()
    
    # Save the data
    fetcher.save_stock_data(stock_data)
    
    print("=" * 60)
    print("✅ Comprehensive stock data fetching completed!")
    print(f"📊 Successfully processed {len(stock_data)} stocks")
    print("📁 Data saved to 'comprehensive_stock_data.json'")
    print("📈 Summary statistics saved to 'stock_summary_stats.json'")
