import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusCard } from "@/components/StatusCard";
import { Wrench, TrendingUp, Clock, Settings } from "lucide-react";

interface Machine {
  id: string;
  name: string;
  rul: number; // Remaining Useful Life in days
  lastMaintenance: string;
  trend: number[]; // Historical RUL data for sparkline
  status: "good" | "warning" | "critical";
  location: string;
  type: string;
}

export default function PredictiveMaintenance() {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [sortBy, setSortBy] = useState<"rul" | "name" | "status">("rul");
  const [loading, setLoading] = useState(true);

  const fetchMachines = () => {
    const mockMachines: Machine[] = Array.from({ length: 8 }, (_, i) => {
      const rul = Math.random() * 100;
      return {
        id: `MCH-${String(i + 1).padStart(3, '0')}`,
        name: ['Pump A-1', 'Compressor B-2', 'Motor C-3', 'Valve D-4', 'Generator E-5', 'Turbine F-6', 'Boiler G-7', 'Heater H-8'][i],
        rul: Math.round(rul),
        lastMaintenance: new Date(Date.now() - Math.random() * 30 * 86400000).toISOString(),
        trend: Array.from({ length: 10 }, (_, j) => rul + (Math.random() - 0.5) * 20),
        status: rul > 50 ? "good" : rul > 20 ? "warning" : "critical",
        location: ['Building A', 'Building B', 'Building C'][Math.floor(Math.random() * 3)],
        type: ['Pump', 'Compressor', 'Motor', 'Valve'][Math.floor(Math.random() * 4)]
      };
    });
    
    setMachines(mockMachines);
    setLoading(false);
  };

  useEffect(() => {
    fetchMachines();
    const interval = setInterval(fetchMachines, 10000);
    return () => clearInterval(interval);
  }, []);

  const sortedMachines = [...machines].sort((a, b) => {
    switch (sortBy) {
      case "rul":
        return a.rul - b.rul;
      case "name":
        return a.name.localeCompare(b.name);
      case "status":
        const statusOrder = { critical: 0, warning: 1, good: 2 };
        return statusOrder[a.status] - statusOrder[b.status];
      default:
        return 0;
    }
  });

  const criticalMachines = machines.filter(m => m.status === "critical").length;
  const warningMachines = machines.filter(m => m.status === "warning").length;
  const goodMachines = machines.filter(m => m.status === "good").length;
  const avgRul = Math.round(machines.reduce((sum, m) => sum + m.rul, 0) / machines.length);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "critical": return "danger";
      case "warning": return "warning";
      case "good": return "success";
      default: return "default";
    }
  };

  const Sparkline = ({ data }: { data: number[] }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    
    return (
      <div className="flex items-end h-8 gap-1">
        {data.map((value, index) => (
          <div
            key={index}
            className="bg-primary/60 w-1.5 rounded-t"
            style={{
              height: `${((value - min) / range) * 100}%`,
              minHeight: '2px'
            }}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse-glow text-primary">Loading maintenance data...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Predictive Maintenance</h1>
          <p className="text-muted-foreground">AI-powered equipment health monitoring and RUL prediction</p>
        </div>
        <Select value={sortBy} onValueChange={(value: "rul" | "name" | "status") => setSortBy(value)}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rul">Sort by RUL</SelectItem>
            <SelectItem value="name">Sort by Name</SelectItem>
            <SelectItem value="status">Sort by Status</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatusCard
          title="Critical Equipment"
          value={criticalMachines}
          description="Requires immediate maintenance"
          icon={<Wrench className="w-4 h-4" />}
          variant="danger"
        />
        <StatusCard
          title="Warning Status"
          value={warningMachines}
          description="Schedule maintenance soon"
          icon={<Clock className="w-4 h-4" />}
          variant="warning"
        />
        <StatusCard
          title="Good Condition"
          value={goodMachines}
          description="Operating optimally"
          icon={<TrendingUp className="w-4 h-4" />}
          variant="success"
        />
        <StatusCard
          title="Average RUL"
          value={`${avgRul} days`}
          description="Fleet-wide average"
          icon={<Settings className="w-4 h-4" />}
        />
      </div>

      {/* Machine Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sortedMachines.map((machine) => (
          <Card key={machine.id} className={`shadow-card hover:shadow-card-hover transition-all duration-300 ${
            machine.status === "critical" ? "border-destructive/20 bg-gradient-status-danger" :
            machine.status === "warning" ? "border-warning/20 bg-gradient-status-warning" :
            "border-success/20 bg-gradient-status-success"
          }`}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{machine.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{machine.id}</p>
                </div>
                <Badge variant={machine.status === "critical" ? "destructive" : 
                              machine.status === "warning" ? "secondary" : "outline"}
                       className={machine.status === "warning" ? "bg-warning/20 text-warning" : ""}>
                  {machine.status.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Remaining Useful Life</span>
                <span className={`text-2xl font-bold ${
                  machine.status === "critical" ? "text-destructive" :
                  machine.status === "warning" ? "text-warning" : "text-success"
                }`}>
                  {machine.rul} days
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Trend</span>
                  <span className="text-muted-foreground">Last 10 readings</span>
                </div>
                <Sparkline data={machine.trend} />
              </div>

              <div className="pt-2 border-t border-border/50 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Location:</span>
                  <span>{machine.location}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Type:</span>
                  <span>{machine.type}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Last Maintenance:</span>
                  <span>{new Date(machine.lastMaintenance).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}