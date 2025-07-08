import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_squared_error, mean_absolute_error, accuracy_score
from sklearn.ensemble import RandomForestRegressor
import xgboost as xgb
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, GRU, Dense, Dropout, Attention, MultiHeadAttention, LayerNormalization
from tensorflow.keras.optimizers import Adam
import json
import pickle
from datetime import datetime
import warnings
warnings.filterwarnings('ignore')

class StockPredictor:
    def __init__(self, model_type='lstm'):
        self.model_type = model_type
        self.model = None
        self.scaler = MinMaxScaler()
        self.feature_scaler = MinMaxScaler()
        self.sequence_length = 60
        
    def prepare_data(self, stock_data, target_column='Close'):
        """Prepare data for training"""
        print(f"Preparing data for {self.model_type} model...")
        
        # Convert to DataFrame
        df = pd.DataFrame(stock_data['historical_data'])
        df['Date'] = pd.to_datetime(df.index)
        
        # Feature engineering
        df['Price_Change'] = df['Close'].pct_change()
        df['Volume_Change'] = df['Volume'].pct_change()
        df['High_Low_Ratio'] = df['High'] / df['Low']
        df['Price_Volume_Trend'] = df['Close'] * df['Volume']
        
        # Technical indicators (already calculated in fetch script)
        features = ['Open', 'High', 'Low', 'Close', 'Volume', 'SMA_20', 'SMA_50', 
                   'RSI', 'MACD', 'MACD_Signal', 'Bollinger_Upper', 'Bollinger_Lower',
                   'Price_Change', 'Volume_Change', 'High_Low_Ratio', 'Price_Volume_Trend']
        
        # Remove NaN values
        df = df.dropna()
        
        # Prepare features and target
        X = df[features].values
        y = df[target_column].values
        
        # Scale features
        X_scaled = self.feature_scaler.fit_transform(X)
        y_scaled = self.scaler.fit_transform(y.reshape(-1, 1)).flatten()
        
        if self.model_type in ['lstm', 'gru', 'transformer']:
            # Create sequences for neural networks
            X_seq, y_seq = self.create_sequences(X_scaled, y_scaled)
            return X_seq, y_seq
        else:
            # For traditional ML models
            return X_scaled, y_scaled
    
    def create_sequences(self, X, y):
        """Create sequences for time series models"""
        X_seq, y_seq = [], []
        for i in range(self.sequence_length, len(X)):
            X_seq.append(X[i-self.sequence_length:i])
            y_seq.append(y[i])
        return np.array(X_seq), np.array(y_seq)
    
    def build_lstm_model(self, input_shape):
        """Build LSTM model"""
        model = Sequential([
            LSTM(128, return_sequences=True, input_shape=input_shape),
            Dropout(0.2),
            LSTM(64, return_sequences=True),
            Dropout(0.2),
            LSTM(32, return_sequences=False),
            Dropout(0.2),
            Dense(25),
            Dense(1)
        ])
        model.compile(optimizer=Adam(learning_rate=0.001), loss='mse', metrics=['mae'])
        return model
    
    def build_gru_model(self, input_shape):
        """Build GRU model"""
        model = Sequential([
            GRU(128, return_sequences=True, input_shape=input_shape),
            Dropout(0.2),
            GRU(64, return_sequences=True),
            Dropout(0.2),
            GRU(32, return_sequences=False),
            Dropout(0.2),
            Dense(25),
            Dense(1)
        ])
        model.compile(optimizer=Adam(learning_rate=0.001), loss='mse', metrics=['mae'])
        return model
    
    def build_transformer_model(self, input_shape):
        """Build Transformer model"""
        inputs = tf.keras.Input(shape=input_shape)
        
        # Multi-head attention
        attention = MultiHeadAttention(num_heads=8, key_dim=64)(inputs, inputs)
        attention = Dropout(0.1)(attention)
        attention = LayerNormalization()(inputs + attention)
        
        # Feed forward network
        ffn = Dense(512, activation='relu')(attention)
        ffn = Dense(input_shape[-1])(ffn)
        ffn = Dropout(0.1)(ffn)
        ffn = LayerNormalization()(attention + ffn)
        
        # Global average pooling and output
        pooled = tf.keras.layers.GlobalAveragePooling1D()(ffn)
        outputs = Dense(1)(pooled)
        
        model = tf.keras.Model(inputs, outputs)
        model.compile(optimizer=Adam(learning_rate=0.0001), loss='mse', metrics=['mae'])
        return model
    
    def train(self, X, y):
        """Train the model"""
        print(f"Training {self.model_type} model...")
        
        # Split data
        split_idx = int(0.8 * len(X))
        X_train, X_test = X[:split_idx], X[split_idx:]
        y_train, y_test = y[:split_idx], y[split_idx:]
        
        start_time = datetime.now()
        
        if self.model_type == 'lstm':
            self.model = self.build_lstm_model((X.shape[1], X.shape[2]))
            history = self.model.fit(X_train, y_train, epochs=50, batch_size=32, 
                                   validation_split=0.2, verbose=1)
            
        elif self.model_type == 'gru':
            self.model = self.build_gru_model((X.shape[1], X.shape[2]))
            history = self.model.fit(X_train, y_train, epochs=50, batch_size=32, 
                                   validation_split=0.2, verbose=1)
            
        elif self.model_type == 'transformer':
            self.model = self.build_transformer_model((X.shape[1], X.shape[2]))
            history = self.model.fit(X_train, y_train, epochs=50, batch_size=32, 
                                   validation_split=0.2, verbose=1)
            
        elif self.model_type == 'random_forest':
            # Reshape for traditional ML
            X_train_2d = X_train.reshape(X_train.shape[0], -1)
            X_test_2d = X_test.reshape(X_test.shape[0], -1)
            
            self.model = RandomForestRegressor(n_estimators=100, random_state=42)
            self.model.fit(X_train_2d, y_train)
            
        elif self.model_type == 'xgboost':
            # Reshape for traditional ML
            X_train_2d = X_train.reshape(X_train.shape[0], -1)
            X_test_2d = X_test.reshape(X_test.shape[0], -1)
            
            self.model = xgb.XGBRegressor(n_estimators=100, random_state=42)
            self.model.fit(X_train_2d, y_train)
        
        training_time = datetime.now() - start_time
        
        # Evaluate model
        metrics = self.evaluate(X_test, y_test)
        metrics['training_time'] = str(training_time)
        
        return metrics
    
    def evaluate(self, X_test, y_test):
        """Evaluate model performance"""
        if self.model_type in ['random_forest', 'xgboost']:
            X_test = X_test.reshape(X_test.shape[0], -1)
        
        predictions = self.model.predict(X_test)
        
        # Calculate metrics
        mse = mean_squared_error(y_test, predictions)
        mae = mean_absolute_error(y_test, predictions)
        
        # Calculate accuracy (within 5% tolerance)
        tolerance = 0.05
        accurate_predictions = np.abs(predictions - y_test) <= tolerance * np.abs(y_test)
        accuracy = np.mean(accurate_predictions) * 100
        
        return {
            'mse': float(mse),
            'mae': float(mae),
            'accuracy': float(accuracy),
            'rmse': float(np.sqrt(mse))
        }
    
    def predict(self, X):
        """Make predictions"""
        if self.model_type in ['random_forest', 'xgboost']:
            X = X.reshape(X.shape[0], -1)
        
        predictions = self.model.predict(X)
        # Inverse transform to get actual prices
        return self.scaler.inverse_transform(predictions.reshape(-1, 1)).flatten()
    
    def generate_trading_signal(self, current_price, predicted_price, confidence):
        """Generate trading signal based on prediction"""
        price_change_percent = (predicted_price - current_price) / current_price * 100
        
        if price_change_percent > 2 and confidence > 75:
            return "BUY"
        elif price_change_percent < -2 and confidence > 75:
            return "SELL"
        else:
            return "HOLD"
    
    def save_model(self, filename):
        """Save trained model"""
        if self.model_type in ['lstm', 'gru', 'transformer']:
            self.model.save(f"{filename}_{self.model_type}.h5")
        else:
            with open(f"{filename}_{self.model_type}.pkl", 'wb') as f:
                pickle.dump(self.model, f)
        
        # Save scalers
        with open(f"{filename}_{self.model_type}_scalers.pkl", 'wb') as f:
            pickle.dump({'scaler': self.scaler, 'feature_scaler': self.feature_scaler}, f)

def train_all_models(stock_data):
    """Train all model types and compare performance"""
    models = ['lstm', 'gru', 'transformer', 'random_forest', 'xgboost']
    results = {}
    
    for model_type in models:
        print(f"\n{'='*50}")
        print(f"Training {model_type.upper()} model")
        print(f"{'='*50}")
        
        try:
            predictor = StockPredictor(model_type=model_type)
            
            # Prepare data
            X, y = predictor.prepare_data(stock_data)
            
            # Train model
            metrics = predictor.train(X, y)
            
            # Save model
            predictor.save_model(f"models/stock_predictor")
            
            results[model_type] = {
                'metrics': metrics,
                'model_type': model_type,
                'trained_at': datetime.now().isoformat()
            }
            
            print(f"✓ {model_type.upper()} training completed")
            print(f"  Accuracy: {metrics['accuracy']:.2f}%")
            print(f"  MSE: {metrics['mse']:.6f}")
            print(f"  MAE: {metrics['mae']:.6f}")
            print(f"  Training time: {metrics['training_time']}")
            
        except Exception as e:
            print(f"✗ Error training {model_type}: {str(e)}")
            results[model_type] = {'error': str(e)}
    
    return results

if __name__ == "__main__":
    # Load stock data
    try:
        with open('stock_data.json', 'r') as f:
            all_stock_data = json.load(f)
        
        # Train models on first stock as example
        first_stock = list(all_stock_data.keys())[0]
        stock_data = all_stock_data[first_stock]
        
        print(f"Training models on {stock_data['name']} ({first_stock})")
        
        # Create models directory
        import os
        os.makedirs('models', exist_ok=True)
        
        # Train all models
        results = train_all_models(stock_data)
        
        # Save results
        with open('training_results.json', 'w') as f:
            json.dump(results, f, indent=2)
        
        print(f"\n{'='*50}")
        print("TRAINING SUMMARY")
        print(f"{'='*50}")
        
        for model_type, result in results.items():
            if 'metrics' in result:
                print(f"{model_type.upper()}: {result['metrics']['accuracy']:.2f}% accuracy")
            else:
                print(f"{model_type.upper()}: Training failed")
        
        # Find best model
        best_model = max(
            [(k, v) for k, v in results.items() if 'metrics' in v],
            key=lambda x: x[1]['metrics']['accuracy']
        )
        
        print(f"\nBest performing model: {best_model[0].upper()}")
        print(f"Accuracy: {best_model[1]['metrics']['accuracy']:.2f}%")
        
    except FileNotFoundError:
        print("Error: stock_data.json not found. Please run fetch_stock_data.py first.")
    except Exception as e:
        print(f"Error: {str(e)}")
