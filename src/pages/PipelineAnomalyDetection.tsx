import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { StatusCard } from "@/components/StatusCard";
import { Activity, Gauge, Thermometer, Droplets, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PipelineData {
  pressure: number;
  flow: number;
  temperature: number;
  anomaly: boolean;
  anomalyType?: string;
  timestamp: string;
}

interface PipelineNode {
  id: string;
  x: number;
  y: number;
  type: "pump" | "valve" | "sensor" | "tank";
  status: "normal" | "warning" | "anomaly";
  label: string;
}

export default function PipelineAnomalyDetection() {
  const [pipelineData, setPipelineData] = useState<PipelineData | null>(null);
  const [loading, setLoading] = useState(true);
  const [nodes] = useState<PipelineNode[]>([
    { id: "tank1", x: 50, y: 150, type: "tank", status: "normal", label: "Storage Tank A" },
    { id: "pump1", x: 150, y: 150, type: "pump", status: "normal", label: "Main Pump" },
    { id: "valve1", x: 250, y: 100, type: "valve", status: "normal", label: "Control Valve 1" },
    { id: "valve2", x: 250, y: 200, type: "valve", status: "normal", label: "Control Valve 2" },
    { id: "sensor1", x: 350, y: 100, type: "sensor", status: "normal", label: "Pressure Sensor" },
    { id: "sensor2", x: 350, y: 200, type: "sensor", status: "normal", label: "Flow Sensor" },
    { id: "tank2", x: 450, y: 150, type: "tank", status: "normal", label: "Storage Tank B" },
  ]);

  const fetchPipelineData = () => {
    // Simulate anomaly detection
    const hasAnomaly = Math.random() < 0.2; // 20% chance of anomaly
    const anomalyTypes = ["pressure_spike", "flow_reduction", "temperature_rise", "vibration"];
    
    const mockData: PipelineData = {
      pressure: Math.random() * 50 + 75, // 75-125 PSI
      flow: Math.random() * 30 + 20, // 20-50 GPM
      temperature: Math.random() * 20 + 180, // 180-200°F
      anomaly: hasAnomaly,
      anomalyType: hasAnomaly ? anomalyTypes[Math.floor(Math.random() * anomalyTypes.length)] : undefined,
      timestamp: new Date().toISOString()
    };
    
    setPipelineData(mockData);
    setLoading(false);
  };

  useEffect(() => {
    fetchPipelineData();
    const interval = setInterval(fetchPipelineData, 6000);
    return () => clearInterval(interval);
  }, []);

  const getNodeIcon = (type: string) => {
    switch (type) {
      case "pump": return "⚙️";
      case "valve": return "🔧";
      case "sensor": return "📡";
      case "tank": return "🛢️";
      default: return "⚪";
    }
  };

  const getNodeColor = (status: string, hasAnomaly?: boolean) => {
    if (hasAnomaly) return "#ef4444"; // red
    switch (status) {
      case "anomaly": return "#ef4444"; // red
      case "warning": return "#f59e0b"; // yellow
      default: return "#10b981"; // green
    }
  };

  const PipelineSchematic = () => (
    <div className="relative w-full h-80 bg-card rounded-lg border border-border p-4">
      <svg width="100%" height="100%" viewBox="0 0 500 300">
        {/* Pipeline connections */}
        <g stroke="hsl(var(--primary))" strokeWidth="3" fill="none">
          <line x1="80" y1="150" x2="120" y2="150" />
          <line x1="180" y1="150" x2="220" y2="150" />
          <line x1="220" y1="150" x2="250" y2="100" />
          <line x1="220" y1="150" x2="250" y2="200" />
          <line x1="280" y1="100" x2="320" y2="100" />
          <line x1="280" y1="200" x2="320" y2="200" />
          <line x1="380" y1="100" x2="420" y2="150" />
          <line x1="380" y1="200" x2="420" y2="150" />
        </g>
        
        {/* Pipeline nodes */}
        {nodes.map((node) => (
          <g key={node.id}>
            <circle
              cx={node.x}
              cy={node.y}
              r="15"
              fill={getNodeColor(node.status, pipelineData?.anomaly && node.type === "sensor")}
              stroke="white"
              strokeWidth="2"
              className={pipelineData?.anomaly && node.type === "sensor" ? "animate-pulse-glow" : ""}
            />
            <text
              x={node.x}
              y={node.y + 5}
              textAnchor="middle"
              fontSize="12"
              fill="white"
            >
              {getNodeIcon(node.type)}
            </text>
            <text
              x={node.x}
              y={node.y + 35}
              textAnchor="middle"
              fontSize="10"
              fill="hsl(var(--muted-foreground))"
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse-glow text-primary">Loading pipeline data...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Pipeline Anomaly Detection</h1>
        <p className="text-muted-foreground">Real-time monitoring and AI-powered anomaly detection</p>
      </div>

      {/* Anomaly Alert */}
      {pipelineData?.anomaly && (
        <Alert className="border-destructive/20 bg-gradient-status-danger animate-pulse-glow">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          <AlertDescription className="text-destructive">
            <strong>Anomaly Detected:</strong> {pipelineData.anomalyType?.replace('_', ' ').toUpperCase()} 
            - Immediate attention required!
          </AlertDescription>
        </Alert>
      )}

      {/* Current Readings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatusCard
          title="Pressure"
          value={`${pipelineData?.pressure.toFixed(1)} PSI`}
          description="Operating pressure"
          icon={<Gauge className="w-4 h-4" />}
          variant={pipelineData?.pressure > 100 ? "warning" : "success"}
        />
        <StatusCard
          title="Flow Rate"
          value={`${pipelineData?.flow.toFixed(1)} GPM`}
          description="Current flow rate"
          icon={<Droplets className="w-4 h-4" />}
          variant={pipelineData?.flow < 25 ? "warning" : "success"}
        />
        <StatusCard
          title="Temperature"
          value={`${pipelineData?.temperature.toFixed(1)}°F`}
          description="Fluid temperature"
          icon={<Thermometer className="w-4 h-4" />}
          variant={pipelineData?.temperature > 195 ? "danger" : "success"}
        />
      </div>

      {/* Pipeline Schematic */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Pipeline System Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PipelineSchematic />
        </CardContent>
      </Card>

      {/* System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span>Overall Health</span>
              <Badge variant={pipelineData?.anomaly ? "destructive" : "outline"} 
                     className={!pipelineData?.anomaly ? "bg-success/20 text-success" : ""}>
                {pipelineData?.anomaly ? "ALERT" : "NORMAL"}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>AI Monitoring</span>
              <Badge variant="outline" className="bg-primary/20 text-primary">ACTIVE</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Last Updated</span>
              <span className="text-sm text-muted-foreground">
                {pipelineData?.timestamp && new Date(pipelineData.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Recent Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {pipelineData?.anomaly ? (
                <div className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm">Anomaly detected: {pipelineData.anomalyType}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-success">
                  <Activity className="w-4 h-4" />
                  <span className="text-sm">All systems operating normally</span>
                </div>
              )}
              <div className="text-sm text-muted-foreground">
                • Pressure within normal range
              </div>
              <div className="text-sm text-muted-foreground">
                • Flow rate stable
              </div>
              <div className="text-sm text-muted-foreground">
                • Temperature controlled
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}