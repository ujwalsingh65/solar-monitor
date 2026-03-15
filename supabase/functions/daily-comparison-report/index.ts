import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get all users with panel configs
    const { data: configs, error: configError } = await supabase
      .from('solar_panel_configs')
      .select('user_id, panel_size, azimuth, tilt');

    if (configError) throw configError;
    if (!configs || configs.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: 'No users with configs found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get today's date range
    const today = new Date();
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    // Fetch weather for simulated calculation
    const weatherResponse = await fetch(
      'https://archive-api.open-meteo.com/v1/archive?latitude=19.12&longitude=72.89&start_date=' +
      today.toISOString().split('T')[0] + '&end_date=' + today.toISOString().split('T')[0] +
      '&hourly=temperature_2m,cloud_cover&timezone=auto'
    );

    let hourlyTemps: number[] = [];
    let hourlyClouds: number[] = [];

    try {
      const weatherData = await weatherResponse.json();
      hourlyTemps = weatherData.hourly?.temperature_2m || [];
      hourlyClouds = weatherData.hourly?.cloud_cover || [];
    } catch {
      // Use defaults if weather API fails
      hourlyTemps = Array(24).fill(30);
      hourlyClouds = Array(24).fill(30);
    }

    const reports: any[] = [];

    for (const config of configs) {
      // Get actual production for today
      const { data: actualData } = await supabase
        .from('actual_production')
        .select('power_output, energy_produced, timestamp')
        .eq('user_id', config.user_id)
        .gte('timestamp', startOfDay.toISOString())
        .lte('timestamp', endOfDay.toISOString())
        .order('timestamp', { ascending: true });

      const actualTotal = actualData?.reduce((sum, r) => sum + (r.energy_produced || 0), 0) || 0;

      // Calculate simulated total for today
      let simulatedTotal = 0;
      for (let h = 6; h <= 18; h++) {
        const temp = hourlyTemps[h] ?? 30;
        const cloud = hourlyClouds[h] ?? 30;

        const solarNoon = 12.5;
        const hourAngle = Math.abs(h - solarNoon);
        const timeEfficiency = Math.max(0, Math.cos((hourAngle / 6.5) * (Math.PI / 2)));
        const cloudFactor = Math.max(0.1, (100 - cloud) / 100);
        const tempDerate = temp > 25 ? 1 + (-0.004) * (temp - 25) : 1;
        const tiltDiff = Math.abs(config.tilt - 19);
        const tiltFactor = Math.max(0.7, 1 - tiltDiff * 0.005);
        const azimuthDiff = Math.min(Math.abs(config.azimuth - 180), 360 - Math.abs(config.azimuth - 180));
        const azimuthFactor = Math.max(0.6, 1 - azimuthDiff * 0.003);

        simulatedTotal += config.panel_size * timeEfficiency * cloudFactor * tempDerate * tiltFactor * azimuthFactor * 0.85;
      }

      simulatedTotal = Math.round(simulatedTotal * 10) / 10;

      const differencePercent = simulatedTotal > 0
        ? Math.round(((actualTotal - simulatedTotal) / simulatedTotal) * 1000) / 10
        : 0;

      const status = Math.abs(differencePercent) > 10
        ? (differencePercent < 0 ? 'underperforming' : 'overperforming')
        : 'normal';

      // Get hourly breakdown
      const hourlyBreakdown: any[] = [];
      for (let h = 6; h <= 18; h++) {
        const temp = hourlyTemps[h] ?? 30;
        const cloud = hourlyClouds[h] ?? 30;
        const solarNoon = 12.5;
        const hourAngle = Math.abs(h - solarNoon);
        const timeEff = Math.max(0, Math.cos((hourAngle / 6.5) * (Math.PI / 2)));
        const cloudF = Math.max(0.1, (100 - cloud) / 100);
        const tempD = temp > 25 ? 1 + (-0.004) * (temp - 25) : 1;
        const tiltD = Math.abs(config.tilt - 19);
        const tiltF = Math.max(0.7, 1 - tiltD * 0.005);
        const azD = Math.min(Math.abs(config.azimuth - 180), 360 - Math.abs(config.azimuth - 180));
        const azF = Math.max(0.6, 1 - azD * 0.003);
        const simHourly = config.panel_size * timeEff * cloudF * tempD * tiltF * azF * 0.85;

        // Find actual reading closest to this hour
        const actualHourly = actualData?.filter(r => {
          const rh = new Date(r.timestamp).getHours();
          return rh === h;
        }).reduce((sum, r) => sum + (r.energy_produced || 0), 0) || 0;

        hourlyBreakdown.push({
          hour: h,
          simulated: Math.round(simHourly * 100) / 100,
          actual: Math.round(actualHourly * 100) / 100,
        });
      }

      // Store comparison
      await supabase.from('production_comparisons').insert([{
        user_id: config.user_id,
        comparison_date: today.toISOString().split('T')[0],
        actual_total: actualTotal,
        simulated_total: simulatedTotal,
        difference_percent: differencePercent,
        status,
        details: {
          hourly_breakdown: hourlyBreakdown,
          config,
          recommendation: getRecommendation(differencePercent, config),
        },
      }]);

      // Get user email for report
      const { data: userData } = await supabase.auth.admin.getUserById(config.user_id);
      const userEmail = userData?.user?.email;

      if (userEmail) {
        // Send email report via alert (email sending will be set up separately)
        const emailSubject = `Daily Solar Report - ${today.toLocaleDateString()}`;
        const emailBody = generateReportHTML(
          actualTotal, simulatedTotal, differencePercent, status, hourlyBreakdown, config
        );

        reports.push({
          user_id: config.user_id,
          email: userEmail,
          subject: emailSubject,
          actual_total: actualTotal,
          simulated_total: simulatedTotal,
          difference_percent: differencePercent,
          status,
        });

        // Create an alert with the daily summary
        await supabase.from('alerts').insert([{
          alert_type: 'daily_report',
          severity: Math.abs(differencePercent) > 10 ? 'warning' : 'info',
          title: `📊 Daily Report: ${status === 'normal' ? 'System Normal' : status === 'underperforming' ? 'Underperformance Detected' : 'Above Expected'}`,
          message: `Actual: ${actualTotal.toFixed(1)} kWh | Simulated: ${simulatedTotal.toFixed(1)} kWh | Difference: ${differencePercent > 0 ? '+' : ''}${differencePercent.toFixed(1)}%. ${getRecommendation(differencePercent, config)}`,
        }]);
      }
    }

    return new Response(
      JSON.stringify({ success: true, reports_generated: reports.length, reports }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Daily comparison report failed:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate daily report' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function getRecommendation(diffPercent: number, config: any): string {
  if (Math.abs(diffPercent) <= 10) {
    return 'System performing within expected range. No action needed.';
  }
  if (diffPercent < -20) {
    return `Significant underperformance. Check for: panel obstructions, dirt/debris, inverter faults, wiring issues. Current orientation: ${config.azimuth}° azimuth, ${config.tilt}° tilt. Optimal: 180° azimuth, 19° tilt.`;
  }
  if (diffPercent < -10) {
    return `Moderate underperformance. Possible causes: partial shading, soiling, or suboptimal panel angle. Consider cleaning panels and verifying orientation (current: ${config.azimuth}°/${config.tilt}°, optimal: 180°/19°).`;
  }
  return 'Output exceeds expectations. Verify IoT sensor calibration for accuracy.';
}

function generateReportHTML(
  actual: number, simulated: number, diff: number, status: string,
  hourly: any[], config: any
): string {
  return `
    <h2>Daily Solar Production Report</h2>
    <p><strong>System:</strong> ${config.panel_size}kW | Azimuth: ${config.azimuth}° | Tilt: ${config.tilt}°</p>
    <table border="1" cellpadding="8" style="border-collapse:collapse;">
      <tr><th>Metric</th><th>Value</th></tr>
      <tr><td>Actual Production</td><td>${actual.toFixed(1)} kWh</td></tr>
      <tr><td>Simulated Production</td><td>${simulated.toFixed(1)} kWh</td></tr>
      <tr><td>Difference</td><td>${diff > 0 ? '+' : ''}${diff.toFixed(1)}%</td></tr>
      <tr><td>Status</td><td>${status.toUpperCase()}</td></tr>
    </table>
    <h3>Hourly Breakdown</h3>
    <table border="1" cellpadding="8" style="border-collapse:collapse;">
      <tr><th>Hour</th><th>Simulated (kWh)</th><th>Actual (kWh)</th></tr>
      ${hourly.map(h => `<tr><td>${h.hour}:00</td><td>${h.simulated}</td><td>${h.actual}</td></tr>`).join('')}
    </table>
    <p><strong>Recommendation:</strong> ${getRecommendation(diff, config)}</p>
  `;
}
