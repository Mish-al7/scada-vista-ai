import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StatusCard } from "@/components/StatusCard";
import { Leaf, Zap, TrendingDown, Target } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface EnergyData {
  time: string;
  consumption: number;
  forecast: number;
}

interface SustainabilityMetrics {
  currentUsage: number;
  avgNext24h: number;
  savingsVsLastWeek: number;
  carbonReductionProgress: number;
  renewablePercentage: number;
}

export default function Sustainability() {
  const [energyData, setEnergyData] = useState<EnergyData[]>([]);
  const [metrics, setMetrics] = useState<SustainabilityMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSustainabilityData = () => {
    // Generate 24 hours of forecast data
    const now = new Date();
    const forecastData: EnergyData[] = Array.from({ length: 24 }, (_, i) => {
      const time = new Date(now.getTime() + i * 60 * 60 * 1000);
      const baseConsumption = 450 + Math.sin(i * Math.PI / 12) * 100; // Daily pattern
      return {
        time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        consumption: Math.round(baseConsumption + (Math.random() - 0.5) * 50),
        forecast: Math.round(baseConsumption * 0.95 + (Math.random() - 0.5) * 30) // 5% efficiency improvement
      };
    });

    const mockMetrics: SustainabilityMetrics = {
      currentUsage: 425,
      avgNext24h: 410,
      savingsVsLastWeek: 12.5,
      carbonReductionProgress: 68,
      renewablePercentage: 34
    };

    setEnergyData(forecastData);
    setMetrics(mockMetrics);
    setLoading(false);
  };

  useEffect(() => {
    fetchSustainabilityData();
    const interval = setInterval(fetchSustainabilityData, 15000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse-glow text-primary">Loading sustainability data...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Sustainability Dashboard</h1>
        <p className="text-muted-foreground">Energy forecasting and environmental impact monitoring</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusCard
          title="Current Usage"
          value={`${metrics?.currentUsage} kWh`}
          description="Real-time consumption"
          icon={<Zap className="w-4 h-4" />}
          variant="default"
        />
        <StatusCard
          title="24h Average Forecast"
          value={`${metrics?.avgNext24h} kWh`}
          description="Predicted consumption"
          icon={<TrendingDown className="w-4 h-4" />}
          variant="success"
          trend="down"
        />
        <StatusCard
          title="Weekly Savings"
          value={`${metrics?.savingsVsLastWeek}%`}
          description="vs. last week"
          icon={<Leaf className="w-4 h-4" />}
          variant="success"
          trend="up"
        />
        <StatusCard
          title="Renewable Energy"
          value={`${metrics?.renewablePercentage}%`}
          description="of total consumption"
          icon={<Target className="w-4 h-4" />}
          variant="warning"
        />
      </div>

      {/* Energy Forecast Chart */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            24-Hour Energy Forecast
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={energyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="time" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  label={{ value: 'kWh', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="consumption" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  name="Current Pattern"
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 0, r: 3 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="forecast" 
                  stroke="hsl(var(--success))" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Optimized Forecast"
                  dot={{ fill: 'hsl(var(--success))', strokeWidth: 0, r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Carbon Reduction Target
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress to 2030 Target</span>
                <span className="font-medium">{metrics?.carbonReductionProgress}% / 65%</span>
              </div>
              <Progress 
                value={metrics?.carbonReductionProgress} 
                className="h-3"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="text-center">
                <div className="text-2xl font-bold text-success">-2.1M</div>
                <div className="text-sm text-muted-foreground">tons CO₂ saved</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-warning">-1.2M</div>
                <div className="text-sm text-muted-foreground">tons CO₂ remaining</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-primary" />
              Efficiency Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Energy Efficiency</span>
                <span className="text-sm font-medium text-success">+15.2%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Waste Reduction</span>
                <span className="text-sm font-medium text-success">+22.8%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Water Conservation</span>
                <span className="text-sm font-medium text-success">+8.1%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Renewable Integration</span>
                <span className="text-sm font-medium text-warning">+5.3%</span>
              </div>
            </div>
            <div className="pt-2 border-t border-border/50">
              <div className="text-sm text-muted-foreground">
                Last updated: {new Date().toLocaleString()}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>AI Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-status-success">
              <Zap className="w-5 h-5 text-success mt-0.5" />
              <div>
                <div className="font-medium text-success">Optimize Peak Hours</div>
                <div className="text-sm text-muted-foreground">
                  Shift non-critical operations to off-peak hours (2-6 AM) to reduce costs by 18%
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-status-warning">
              <Leaf className="w-5 h-5 text-warning mt-0.5" />
              <div>
                <div className="font-medium text-warning">Increase Renewable Mix</div>
                <div className="text-sm text-muted-foreground">
                  Installing 50kW solar capacity could increase renewable percentage to 45%
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-card">
              <Target className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <div className="font-medium text-primary">Equipment Efficiency</div>
                <div className="text-sm text-muted-foreground">
                  HVAC system optimization could reduce consumption by 12% during peak hours
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}