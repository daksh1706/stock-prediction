"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Brain, Play, Square, TrendingUp, Zap, Activity, BarChart3, Target } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Cell,
} from "recharts"

export default function ModelTraining() {
  const [isTraining, setIsTraining] = useState(false)
  const [trainingProgress, setTrainingProgress] = useState(0)
  const [selectedModel, setSelectedModel] = useState("lstm")
  const [trainingData, setTrainingData] = useState("5years")
  const [currentEpoch, setCurrentEpoch] = useState(0)
  const [totalEpochs] = useState(50)
  const [trainingLoss, setTrainingLoss] = useState([])

  const models = [
    { id: "lstm", name: "LSTM Neural Network", description: "Best for time series prediction", color: "#3b82f6" },
    { id: "gru", name: "GRU Neural Network", description: "Faster training, good accuracy", color: "#10b981" },
    { id: "transformer", name: "Transformer", description: "State-of-the-art for sequences", color: "#8b5cf6" },
    { id: "random_forest", name: "Random Forest", description: "Ensemble method, interpretable", color: "#f59e0b" },
    { id: "xgboost", name: "XGBoost", description: "Gradient boosting, high performance", color: "#ef4444" },
  ]

  const trainingResults = [
    { model: "LSTM", accuracy: 87.5, mse: 0.023, training_time: "45 min", status: "Completed", color: "#3b82f6" },
    { model: "GRU", accuracy: 85.2, mse: 0.028, training_time: "32 min", status: "Completed", color: "#10b981" },
    {
      model: "Transformer",
      accuracy: 89.1,
      mse: 0.019,
      training_time: "78 min",
      status: "Completed",
      color: "#8b5cf6",
    },
    {
      model: "Random Forest",
      accuracy: 82.3,
      mse: 0.035,
      training_time: "12 min",
      status: "Completed",
      color: "#f59e0b",
    },
    { model: "XGBoost", accuracy: 84.7, mse: 0.031, training_time: "18 min", status: "Completed", color: "#ef4444" },
  ]

  const radarData = [
    { subject: "Accuracy", LSTM: 87.5, GRU: 85.2, Transformer: 89.1, fullMark: 100 },
    { subject: "Speed", LSTM: 65, GRU: 75, Transformer: 45, fullMark: 100 },
    { subject: "Memory", LSTM: 70, GRU: 80, Transformer: 50, fullMark: 100 },
    { subject: "Stability", LSTM: 85, GRU: 82, Transformer: 88, fullMark: 100 },
    { subject: "Interpretability", LSTM: 60, GRU: 65, Transformer: 40, fullMark: 100 },
  ]

  const startTraining = async () => {
    setIsTraining(true)
    setTrainingProgress(0)
    setCurrentEpoch(0)
    setTrainingLoss([])

    // Simulate training progress with realistic loss curve
    const interval = setInterval(() => {
      setCurrentEpoch((prev) => {
        const newEpoch = prev + 1
        const loss = Math.max(0.01, 0.5 * Math.exp(-newEpoch * 0.1) + Math.random() * 0.05)

        setTrainingLoss((prevLoss) => [...prevLoss, { epoch: newEpoch, loss: Number.parseFloat(loss.toFixed(4)) }])
        setTrainingProgress((newEpoch / totalEpochs) * 100)

        if (newEpoch >= totalEpochs) {
          clearInterval(interval)
          setIsTraining(false)
          return totalEpochs
        }
        return newEpoch
      })
    }, 200)
  }

  const stopTraining = () => {
    setIsTraining(false)
    setTrainingProgress(0)
    setCurrentEpoch(0)
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Training Controls */}
      <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-gray-700 shadow-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-400 animate-pulse" />
            AI Model Training Center
            <Zap className="h-5 w-5 text-yellow-400 animate-bounce" />
          </CardTitle>
          <CardDescription className="text-gray-300">
            Train and optimize advanced machine learning models for stock prediction
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Model Architecture</label>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  {models.map((model) => (
                    <SelectItem key={model.id} value={model.id} className="text-white hover:bg-gray-700">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: model.color }}></div>
                        {model.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-400">{models.find((m) => m.id === selectedModel)?.description}</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Training Dataset</label>
              <Select value={trainingData} onValueChange={setTrainingData}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="1year" className="text-white">
                    1 Year (365 days)
                  </SelectItem>
                  <SelectItem value="2years" className="text-white">
                    2 Years (730 days)
                  </SelectItem>
                  <SelectItem value="5years" className="text-white">
                    5 Years (1,825 days)
                  </SelectItem>
                  <SelectItem value="10years" className="text-white">
                    10 Years (3,650 days)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Training Control</label>
              <div className="flex gap-2">
                <Button
                  onClick={startTraining}
                  disabled={isTraining}
                  className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
                >
                  <Play className="h-4 w-4 mr-2" />
                  {isTraining ? "Training..." : "Start Training"}
                </Button>
                {isTraining && (
                  <Button
                    variant="outline"
                    onClick={stopTraining}
                    className="border-red-500 text-red-400 hover:bg-red-500/20 bg-transparent"
                  >
                    <Square className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Training Status</label>
              <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                <div className="text-sm text-white font-medium">
                  {isTraining ? `Epoch ${currentEpoch}/${totalEpochs}` : "Ready to Train"}
                </div>
                <div className="text-xs text-gray-300">
                  {isTraining ? `${Math.round(trainingProgress)}% Complete` : "Select model and start"}
                </div>
              </div>
            </div>
          </div>

          {/* Training Progress */}
          {isTraining && (
            <div className="space-y-4 p-4 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30">
              <div className="flex justify-between items-center">
                <span className="text-white font-medium">Training Progress</span>
                <span className="text-blue-400 font-bold">{Math.round(trainingProgress)}%</span>
              </div>
              <Progress value={trainingProgress} className="h-3" />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-gray-400">Current Epoch</div>
                  <div className="text-white font-bold">{currentEpoch}</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-400">Total Epochs</div>
                  <div className="text-white font-bold">{totalEpochs}</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-400">Current Loss</div>
                  <div className="text-white font-bold">
                    {trainingLoss.length > 0 ? trainingLoss[trainingLoss.length - 1].loss : "0.000"}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-gray-400">Model Type</div>
                  <div className="text-white font-bold">{selectedModel.toUpperCase()}</div>
                </div>
              </div>

              {/* Real-time Loss Chart */}
              {trainingLoss.length > 0 && (
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trainingLoss}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="epoch" stroke="#9ca3af" fontSize={10} />
                      <YAxis stroke="#9ca3af" fontSize={10} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1f2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                          color: "#ffffff",
                        }}
                      />
                      <Line type="monotone" dataKey="loss" stroke="#3b82f6" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enhanced Training Results */}
      <Tabs defaultValue="results" className="space-y-4">
        <TabsList className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
          <TabsTrigger
            value="results"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 text-white"
          >
            Training Results
          </TabsTrigger>
          <TabsTrigger
            value="comparison"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-blue-600 text-white"
          >
            Model Comparison
          </TabsTrigger>
          <TabsTrigger
            value="hyperparameters"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 text-white"
          >
            Hyperparameters
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-600 text-white"
          >
            Performance Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="results" className="space-y-4">
          <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="h-5 w-5 text-green-400" />
                Latest Training Results
              </CardTitle>
              <CardDescription className="text-gray-300">Performance metrics for all trained models</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trainingResults.map((result, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg bg-gradient-to-r from-gray-700/30 to-gray-800/30 border border-gray-600/50 hover:border-gray-500/50 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className="w-4 h-4 rounded-full animate-pulse"
                          style={{ backgroundColor: result.color }}
                        ></div>
                        <div>
                          <h4 className="font-semibold text-white text-lg">{result.model}</h4>
                          <p className="text-sm text-gray-400">Training Time: {result.training_time}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-white">{result.accuracy}%</div>
                          <div className="text-xs text-gray-400">Accuracy</div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-gray-300">{result.mse}</div>
                          <div className="text-xs text-gray-400">MSE</div>
                        </div>
                        <Badge
                          variant={result.status === "Completed" ? "default" : "secondary"}
                          className={result.status === "Completed" ? "bg-green-500 animate-pulse" : ""}
                        >
                          {result.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="mt-3">
                      <Progress value={result.accuracy} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-400" />
                  Accuracy Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={trainingResults}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="model" stroke="#9ca3af" fontSize={12} />
                      <YAxis stroke="#9ca3af" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1f2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                          color: "#ffffff",
                        }}
                      />
                      <Bar dataKey="accuracy" radius={[4, 4, 0, 0]}>
                        {trainingResults.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="h-5 w-5 text-purple-400" />
                  Model Performance Radar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#374151" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: "#9ca3af", fontSize: 12 }} />
                      <PolarRadiusAxis tick={{ fill: "#9ca3af", fontSize: 10 }} />
                      <Radar name="LSTM" dataKey="LSTM" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} />
                      <Radar name="GRU" dataKey="GRU" stroke="#10b981" fill="#10b981" fillOpacity={0.1} />
                      <Radar
                        name="Transformer"
                        dataKey="Transformer"
                        stroke="#8b5cf6"
                        fill="#8b5cf6"
                        fillOpacity={0.1}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1f2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                          color: "#ffffff",
                        }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-br from-green-500/10 to-blue-500/10 border-green-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-400" />
                Best Model Recommendation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-xl text-white">Transformer Model</h4>
                  <p className="text-green-300 text-sm">
                    Highest accuracy (89.1%) with superior pattern recognition capabilities. Recommended for production
                    deployment despite longer training time.
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-400">89.1%</div>
                  <div className="text-xs text-gray-300">Accuracy</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hyperparameters" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {models.slice(0, 4).map((model, index) => (
              <Card
                key={model.id}
                className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-gray-700"
              >
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: model.color }}></div>
                    {model.name} Parameters
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    {model.id === "lstm" && (
                      <>
                        <div className="flex justify-between p-2 rounded bg-gray-700/30">
                          <span className="text-gray-300">Hidden Units:</span>
                          <span className="font-medium text-white">128</span>
                        </div>
                        <div className="flex justify-between p-2 rounded bg-gray-700/30">
                          <span className="text-gray-300">Layers:</span>
                          <span className="font-medium text-white">3</span>
                        </div>
                        <div className="flex justify-between p-2 rounded bg-gray-700/30">
                          <span className="text-gray-300">Dropout:</span>
                          <span className="font-medium text-white">0.2</span>
                        </div>
                        <div className="flex justify-between p-2 rounded bg-gray-700/30">
                          <span className="text-gray-300">Learning Rate:</span>
                          <span className="font-medium text-white">0.001</span>
                        </div>
                        <div className="flex justify-between p-2 rounded bg-gray-700/30">
                          <span className="text-gray-300">Batch Size:</span>
                          <span className="font-medium text-white">32</span>
                        </div>
                      </>
                    )}
                    {model.id === "transformer" && (
                      <>
                        <div className="flex justify-between p-2 rounded bg-gray-700/30">
                          <span className="text-gray-300">Attention Heads:</span>
                          <span className="font-medium text-white">8</span>
                        </div>
                        <div className="flex justify-between p-2 rounded bg-gray-700/30">
                          <span className="text-gray-300">Model Dimension:</span>
                          <span className="font-medium text-white">256</span>
                        </div>
                        <div className="flex justify-between p-2 rounded bg-gray-700/30">
                          <span className="text-gray-300">Feed Forward Dim:</span>
                          <span className="font-medium text-white">512</span>
                        </div>
                        <div className="flex justify-between p-2 rounded bg-gray-700/30">
                          <span className="text-gray-300">Layers:</span>
                          <span className="font-medium text-white">6</span>
                        </div>
                        <div className="flex justify-between p-2 rounded bg-gray-700/30">
                          <span className="text-gray-300">Learning Rate:</span>
                          <span className="font-medium text-white">0.0001</span>
                        </div>
                      </>
                    )}
                    {model.id === "gru" && (
                      <>
                        <div className="flex justify-between p-2 rounded bg-gray-700/30">
                          <span className="text-gray-300">Hidden Units:</span>
                          <span className="font-medium text-white">96</span>
                        </div>
                        <div className="flex justify-between p-2 rounded bg-gray-700/30">
                          <span className="text-gray-300">Layers:</span>
                          <span className="font-medium text-white">2</span>
                        </div>
                        <div className="flex justify-between p-2 rounded bg-gray-700/30">
                          <span className="text-gray-300">Dropout:</span>
                          <span className="font-medium text-white">0.15</span>
                        </div>
                        <div className="flex justify-between p-2 rounded bg-gray-700/30">
                          <span className="text-gray-300">Learning Rate:</span>
                          <span className="font-medium text-white">0.002</span>
                        </div>
                        <div className="flex justify-between p-2 rounded bg-gray-700/30">
                          <span className="text-gray-300">Batch Size:</span>
                          <span className="font-medium text-white">64</span>
                        </div>
                      </>
                    )}
                    {model.id === "random_forest" && (
                      <>
                        <div className="flex justify-between p-2 rounded bg-gray-700/30">
                          <span className="text-gray-300">N Estimators:</span>
                          <span className="font-medium text-white">100</span>
                        </div>
                        <div className="flex justify-between p-2 rounded bg-gray-700/30">
                          <span className="text-gray-300">Max Depth:</span>
                          <span className="font-medium text-white">10</span>
                        </div>
                        <div className="flex justify-between p-2 rounded bg-gray-700/30">
                          <span className="text-gray-300">Min Samples Split:</span>
                          <span className="font-medium text-white">5</span>
                        </div>
                        <div className="flex justify-between p-2 rounded bg-gray-700/30">
                          <span className="text-gray-300">Min Samples Leaf:</span>
                          <span className="font-medium text-white">2</span>
                        </div>
                        <div className="flex justify-between p-2 rounded bg-gray-700/30">
                          <span className="text-gray-300">Random State:</span>
                          <span className="font-medium text-white">42</span>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Training Data Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                    <div className="text-2xl font-bold text-white">1.25M</div>
                    <div className="text-xs text-gray-300">Total Samples</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-gradient-to-br from-green-500/20 to-blue-500/20">
                    <div className="text-2xl font-bold text-white">25</div>
                    <div className="text-xs text-gray-300">Features</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between p-2 rounded bg-gray-700/30">
                    <span className="text-sm text-gray-300">Training Set (70%):</span>
                    <span className="font-medium text-white">875,000</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-gray-700/30">
                    <span className="text-sm text-gray-300">Validation Set (15%):</span>
                    <span className="font-medium text-white">187,500</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-gray-700/30">
                    <span className="text-sm text-gray-300">Test Set (15%):</span>
                    <span className="font-medium text-white">187,500</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-gray-700/30">
                    <span className="text-sm text-gray-300">Time Window:</span>
                    <span className="font-medium text-white">60 days</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Feature Importance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: "Price History", value: 23.5, color: "#3b82f6" },
                  { name: "Volume", value: 18.2, color: "#10b981" },
                  { name: "Technical Indicators", value: 15.8, color: "#8b5cf6" },
                  { name: "Market Sentiment", value: 12.3, color: "#f59e0b" },
                  { name: "Economic Indicators", value: 10.1, color: "#ef4444" },
                  { name: "Other Factors", value: 20.1, color: "#6b7280" },
                ].map((feature, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: feature.color }}></div>
                        <span className="text-gray-300">{feature.name}</span>
                      </div>
                      <span className="font-medium text-white">{feature.value}%</span>
                    </div>
                    <Progress value={feature.value} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
