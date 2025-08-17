import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { StatusCard } from "@/components/StatusCard";
import { AlertTriangle, CheckCircle, AlertCircle } from "lucide-react";

interface Alarm {
  id: string;
  pressure: number;
  temperature: number;
  severity: number;
  falseProbability: number;
  timestamp: string;
  type: string;
}

export default function AlarmManager() {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [showCriticalOnly, setShowCriticalOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  // Simulate API call
  const fetchAlarms = () => {
    // Mock data simulation
    const mockAlarms: Alarm[] = Array.from({ length: 12 }, (_, i) => ({
      id: `ALM-${String(i + 1).padStart(3, '0')}`,
      pressure: Math.random() * 100 + 50,
      temperature: Math.random() * 50 + 70,
      severity: Math.floor(Math.random() * 5) + 1,
      falseProbability: Math.random(),
      timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      type: ['Pressure', 'Temperature', 'Flow', 'Vibration'][Math.floor(Math.random() * 4)]
    }));
    
    setAlarms(mockAlarms);
    setLoading(false);
  };

  useEffect(() => {
    fetchAlarms();
    const interval = setInterval(fetchAlarms, 8000); // Refresh every 8 seconds
    return () => clearInterval(interval);
  }, []);

  const filteredAlarms = showCriticalOnly 
    ? alarms.filter(alarm => alarm.severity >= 3)
    : alarms;

  const criticalCount = alarms.filter(alarm => alarm.severity >= 4).length;
  const warningCount = alarms.filter(alarm => alarm.severity === 3).length;
  const normalCount = alarms.filter(alarm => alarm.severity < 3).length;

  const getProbabilityColor = (probability: number) => {
    if (probability < 0.3) return "success";
    if (probability < 0.6) return "warning";
    return "danger";
  };

  const getSeverityBadge = (severity: number) => {
    if (severity >= 4) return <Badge variant="destructive">Critical</Badge>;
    if (severity === 3) return <Badge variant="secondary" className="bg-warning/20 text-warning">Warning</Badge>;
    return <Badge variant="outline">Normal</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse-glow text-primary">Loading alarm data...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Alarm Manager</h1>
          <p className="text-muted-foreground">Real-time system alarm monitoring and analysis</p>
        </div>
        <div className="flex items-center space-x-2">
          <Switch 
            id="critical-filter" 
            checked={showCriticalOnly}
            onCheckedChange={setShowCriticalOnly}
          />
          <Label htmlFor="critical-filter">Show only critical alarms</Label>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatusCard
          title="Critical Alarms"
          value={criticalCount}
          description="Requires immediate attention"
          icon={<AlertTriangle className="w-4 h-4" />}
          variant="danger"
        />
        <StatusCard
          title="Warning Alarms"
          value={warningCount}
          description="Monitoring required"
          icon={<AlertCircle className="w-4 h-4" />}
          variant="warning"
        />
        <StatusCard
          title="Normal Status"
          value={normalCount}
          description="Systems operating normally"
          icon={<CheckCircle className="w-4 h-4" />}
          variant="success"
        />
      </div>

      {/* Alarms Table */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-primary" />
            Active Alarms ({filteredAlarms.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium">Alarm ID</th>
                  <th className="text-left py-3 px-4 font-medium">Type</th>
                  <th className="text-left py-3 px-4 font-medium">Pressure (PSI)</th>
                  <th className="text-left py-3 px-4 font-medium">Temperature (°F)</th>
                  <th className="text-left py-3 px-4 font-medium">Severity</th>
                  <th className="text-left py-3 px-4 font-medium">False Alarm Probability</th>
                  <th className="text-left py-3 px-4 font-medium">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {filteredAlarms.map((alarm) => (
                  <tr key={alarm.id} className="border-b border-border/50 hover:bg-card-hover transition-colors">
                    <td className="py-3 px-4 font-mono">{alarm.id}</td>
                    <td className="py-3 px-4">{alarm.type}</td>
                    <td className="py-3 px-4">{alarm.pressure.toFixed(1)}</td>
                    <td className="py-3 px-4">{alarm.temperature.toFixed(1)}</td>
                    <td className="py-3 px-4">
                      {getSeverityBadge(alarm.severity)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                          alarm.falseProbability < 0.3 ? 'bg-success' :
                          alarm.falseProbability < 0.6 ? 'bg-warning' : 'bg-destructive'
                        }`}></div>
                        <span className={`font-medium ${
                          alarm.falseProbability < 0.3 ? 'text-success' :
                          alarm.falseProbability < 0.6 ? 'text-warning' : 'text-destructive'
                        }`}>
                          {(alarm.falseProbability * 100).toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {new Date(alarm.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}