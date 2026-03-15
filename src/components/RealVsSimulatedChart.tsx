import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth, useUser } from "@clerk/clerk-react";
import { supabase, getSupabaseClient } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Activity, AlertTriangle, CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ComparisonData {
  id: string;
  comparison_date: string;
  actual_total: number;
  simulated_total: number;
  difference_percent: number;
  status: string;
  details: any;
}

export const RealVsSimulatedChart = () => {
  const [comparisons, setComparisons] = useState<ComparisonData[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();
  const { getToken } = useAuth();
  const { user } = useUser();

  const fetchComparisons = useCallback(async () => {
    if (!user) return;
    const client = await getSupabaseClient(getToken);
    const { data, error } = await client
      .from('production_comparisons')
      .select('*')
      .eq('user_id', user.id)
      .order('comparison_date', { ascending: false })
      .limit(7);

    if (!error && data) {
      setComparisons(data.reverse());
    }
    setLoading(false);
  }, [user, getToken]);

  useEffect(() => {
    fetchComparisons();

    const channel = supabase
      .channel('comparisons')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'production_comparisons',
      }, () => {
        fetchComparisons();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchComparisons]);

  const chartData = comparisons.map(c => ({
    date: new Date(c.comparison_date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
    actual: c.actual_total,
    simulated: c.simulated_total,
    difference: c.difference_percent,
  }));

  const latestComparison = comparisons[comparisons.length - 1];
  const hasIssue = latestComparison && Math.abs(latestComparison.difference_percent) > 10;

  if (loading) {
    return (
      <Card className="border-border/50 shadow-card">
        <CardContent className="p-6 flex items-center justify-center h-48">
          <Activity className="h-6 w-6 animate-pulse text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 shadow-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Real vs Simulated Production
        </CardTitle>
        {latestComparison && (
          <Badge variant={hasIssue ? "destructive" : "secondary"} className="flex items-center gap-1">
            {hasIssue ? <AlertTriangle className="h-3 w-3" /> : <CheckCircle className="h-3 w-3" />}
            {hasIssue ? `${latestComparison.difference_percent.toFixed(1)}% deviation` : 'Normal'}
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        {comparisons.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Activity className="h-10 w-10 mx-auto mb-3 opacity-50" />
            <p className="font-medium">No comparison data yet</p>
            <p className="text-sm mt-1">Connect your IoT device to start receiving real production data</p>
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} unit=" kWh" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))',
                  }}
                />
                <Legend />
                <Bar dataKey="actual" name="Actual" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="simulated" name="Simulated" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>

            {latestComparison?.details?.recommendation && (
              <div className={`mt-4 p-3 rounded-lg border text-sm ${
                hasIssue
                  ? 'bg-destructive/10 border-destructive/20 text-destructive'
                  : 'bg-accent/10 border-accent/20 text-accent-foreground'
              }`}>
                <p className="font-medium mb-1">{hasIssue ? '⚠️ Recommendation' : '✅ Status'}</p>
                <p>{latestComparison.details.recommendation}</p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
