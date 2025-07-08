import sqlite3
import json
from datetime import datetime

def create_database():
    """Create SQLite database for stock data"""
    conn = sqlite3.connect('stock_data.db')
    cursor = conn.cursor()
    
    # Create stocks table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS stocks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            symbol TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            sector TEXT,
            industry TEXT,
            market_cap REAL,
            exchange TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create stock_prices table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS stock_prices (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            stock_id INTEGER,
            date DATE NOT NULL,
            open_price REAL NOT NULL,
            high_price REAL NOT NULL,
            low_price REAL NOT NULL,
            close_price REAL NOT NULL,
            volume INTEGER NOT NULL,
            sma_20 REAL,
            sma_50 REAL,
            rsi REAL,
            macd REAL,
            macd_signal REAL,
            bollinger_upper REAL,
            bollinger_lower REAL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (stock_id) REFERENCES stocks (id)
        )
    ''')
    
    # Create predictions table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS predictions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            stock_id INTEGER,
            model_type TEXT NOT NULL,
            prediction_date DATE NOT NULL,
            predicted_price REAL NOT NULL,
            actual_price REAL,
            signal TEXT CHECK(signal IN ('BUY', 'SELL', 'HOLD')),
            confidence REAL,
            target_price REAL,
            stop_loss REAL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (stock_id) REFERENCES stocks (id)
        )
    ''')
    
    # Create model_performance table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS model_performance (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            model_type TEXT NOT NULL,
            accuracy REAL NOT NULL,
            mse REAL NOT NULL,
            mae REAL NOT NULL,
            training_time TEXT,
            trained_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    conn.commit()
    conn.close()
    print("Database created successfully!")

def populate_database():
    """Populate database with stock data"""
    try:
        with open('stock_data.json', 'r') as f:
            stock_data = json.load(f)
    except FileNotFoundError:
        print("Error: stock_data.json not found. Please run fetch_stock_data.py first.")
        return
    
    conn = sqlite3.connect('stock_data.db')
    cursor = conn.cursor()
    
    for symbol, data in stock_data.items():
        try:
            # Insert stock info
            exchange = 'NSE' if '.NS' in symbol else 'BSE'
            cursor.execute('''
                INSERT OR REPLACE INTO stocks (symbol, name, sector, industry, market_cap, exchange)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (symbol, data['name'], data.get('sector'), data.get('industry'), 
                  data.get('market_cap'), exchange))
            
            stock_id = cursor.lastrowid
            
            # Insert historical prices
            for price_data in data['historical_data']:
                cursor.execute('''
                    INSERT OR REPLACE INTO stock_prices 
                    (stock_id, date, open_price, high_price, low_price, close_price, volume,
                     sma_20, sma_50, rsi, macd, macd_signal, bollinger_upper, bollinger_lower)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', (stock_id, price_data.get('Date'), price_data.get('Open'),
                      price_data.get('High'), price_data.get('Low'), price_data.get('Close'),
                      price_data.get('Volume'), price_data.get('SMA_20'), price_data.get('SMA_50'),
                      price_data.get('RSI'), price_data.get('MACD'), price_data.get('MACD_Signal'),
                      price_data.get('Bollinger_Upper'), price_data.get('Bollinger_Lower')))
            
            print(f"✓ Inserted data for {symbol}")
            
        except Exception as e:
            print(f"✗ Error inserting data for {symbol}: {str(e)}")
    
    conn.commit()
    conn.close()
    print("Database populated successfully!")

if __name__ == "__main__":
    print("Creating database...")
    create_database()
    print("Populating database...")
    populate_database()
    print("Database setup completed!")
