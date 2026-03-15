import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wifi, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@clerk/clerk-react";

export const IoTConnectionGuide = () => {
  const { toast } = useToast();
  const { user } = useUser();
  const userId = user?.id || '';
  const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID || 'debnyhafwifqjtfzqxsy';

  const endpointUrl = `https://${projectId}.supabase.co/functions/v1/ingest-iot-data`;

  const samplePayload = JSON.stringify({
    user_id: userId || '<your-user-id>',
    power_output: 3.5,
    energy_produced: 3.5,
    device_id: 'inverter-01',
  }, null, 2);

  const batchPayload = JSON.stringify({
    user_id: userId || '<your-user-id>',
    device_id: 'inverter-01',
    readings: [
      { power_output: 3.2, energy_produced: 3.2, timestamp: '2025-01-15T10:00:00Z' },
      { power_output: 4.1, energy_produced: 4.1, timestamp: '2025-01-15T11:00:00Z' },
    ]
  }, null, 2);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied!', description: `${label} copied to clipboard` });
  };

  return (
    <Card className="border-border/50 shadow-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Wifi className="h-5 w-5 text-primary" />
          IoT Device Connection
        </CardTitle>
        <Badge variant="outline">MQTT → HTTP</Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Your IoT gateway (Raspberry Pi, ESP32, etc.) should send HTTP POST requests to the endpoint below.
          Most MQTT-to-HTTP bridges support this natively.
        </p>

        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Endpoint URL</p>
          <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-3 font-mono text-xs break-all">
            <span className="flex-1">{endpointUrl}</span>
            <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => copyToClipboard(endpointUrl, 'Endpoint URL')}>
              <Copy className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Single Reading</p>
            <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => copyToClipboard(samplePayload, 'Sample payload')}>
              <Copy className="h-3 w-3 mr-1" /> Copy
            </Button>
          </div>
          <pre className="bg-muted/50 rounded-lg p-3 text-xs overflow-x-auto">{samplePayload}</pre>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Batch Readings</p>
            <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => copyToClipboard(batchPayload, 'Batch payload')}>
              <Copy className="h-3 w-3 mr-1" /> Copy
            </Button>
          </div>
          <pre className="bg-muted/50 rounded-lg p-3 text-xs overflow-x-auto">{batchPayload}</pre>
        </div>

        <div className="text-xs text-muted-foreground space-y-1 border-t border-border/50 pt-3">
          <p>• <strong>power_output:</strong> Current power in kW</p>
          <p>• <strong>energy_produced:</strong> Energy in kWh for the period</p>
          <p>• <strong>Fault detection:</strong> Automatic alert if actual differs from simulated by &gt;10%</p>
          <p>• <strong>Daily report:</strong> Sent at 7 PM with full comparison breakdown</p>
        </div>
      </CardContent>
    </Card>
  );
};
