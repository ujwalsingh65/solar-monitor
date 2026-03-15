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

    const body = await req.json();
    const { user_id, power_output, energy_produced, device_id, readings } = body;

    if (!user_id) {
      return new Response(
        JSON.stringify({ error: 'user_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Support batch readings from IoT device
    if (readings && Array.isArray(readings)) {
      const rows = readings.map((r: any) => ({
        user_id,
        power_output: r.power_output,
        energy_produced: r.energy_produced,
        device_id: r.device_id || device_id || null,
        timestamp: r.timestamp || new Date().toISOString(),
      }));

      const { error } = await supabase.from('actual_production').insert(rows);
      if (error) throw error;

      // Check for fault on latest reading
      await checkForFault(supabase, user_id, rows[rows.length - 1]);

      return new Response(
        JSON.stringify({ success: true, inserted: rows.length }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Single reading
    if (power_output === undefined || energy_produced === undefined) {
      return new Response(
        JSON.stringify({ error: 'power_output and energy_produced are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const row = {
      user_id,
      power_output,
      energy_produced,
      device_id: device_id || null,
      timestamp: new Date().toISOString(),
    };

    const { error } = await supabase.from('actual_production').insert([row]);
    if (error) throw error;

    // Check for fault
    await checkForFault(supabase, user_id, row);

    return new Response(
      JSON.stringify({ success: true, inserted: 1 }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('IoT data ingestion failed:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to ingest data' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function checkForFault(supabase: any, userId: string, reading: any) {
  try {
    // Get user's panel config
    const { data: configs } = await supabase
      .from('solar_panel_configs')
      .select('panel_size, azimuth, tilt')
      .eq('user_id', userId)
      .limit(1);

    if (!configs || configs.length === 0) return;
    const config = configs[0];

    // Calculate expected simulated output for current hour
    const hour = new Date().getHours();
    if (hour < 6 || hour > 18) return; // No sun, skip check

    // Fetch current weather
    const weatherResponse = await fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=19.12&longitude=72.89&current=temperature_2m,cloud_cover&timezone=auto'
    );
    const weatherData = await weatherResponse.json();
    const cloudCover = weatherData.current?.cloud_cover ?? 30;
    const temperature = weatherData.current?.temperature_2m ?? 25;

    // Calculate expected output
    const solarNoon = 12.5;
    const hourAngle = Math.abs(hour - solarNoon);
    const timeEfficiency = Math.max(0, Math.cos((hourAngle / 6.5) * (Math.PI / 2)));
    const cloudFactor = Math.max(0.1, (100 - cloudCover) / 100);
    const tempDerate = temperature > 25 ? 1 + (-0.004) * (temperature - 25) : 1;
    const tiltDiff = Math.abs(config.tilt - 19);
    const tiltFactor = Math.max(0.7, 1 - tiltDiff * 0.005);
    const azimuthDiff = Math.min(Math.abs(config.azimuth - 180), 360 - Math.abs(config.azimuth - 180));
    const azimuthFactor = Math.max(0.6, 1 - azimuthDiff * 0.003);
    const systemEfficiency = 0.85;

    const expectedOutput = config.panel_size * timeEfficiency * cloudFactor * tempDerate * tiltFactor * azimuthFactor * systemEfficiency;

    if (expectedOutput <= 0) return;

    const actualOutput = reading.power_output;
    const differencePercent = Math.abs((actualOutput - expectedOutput) / expectedOutput) * 100;

    if (differencePercent > 10) {
      const status = actualOutput < expectedOutput ? 'underperforming' : 'overperforming';
      const isUnder = actualOutput < expectedOutput;

      // Insert a fault alert
      await supabase.from('alerts').insert([{
        alert_type: 'fault',
        severity: 'critical',
        title: `⚠️ Panel ${isUnder ? 'Underperformance' : 'Anomaly'} Detected`,
        message: `Actual output (${actualOutput.toFixed(2)} kW) differs from expected (${expectedOutput.toFixed(2)} kW) by ${differencePercent.toFixed(1)}%. ${
          isUnder
            ? `Possible causes: panel obstruction, dirt buildup, wiring fault, or inverter issue. Consider checking panel orientation (current: ${config.azimuth}° azimuth, ${config.tilt}° tilt).`
            : `Output exceeds expectations. Verify sensor calibration.`
        }`,
      }]);

      // Store comparison record
      await supabase.from('production_comparisons').insert([{
        user_id: userId,
        actual_total: actualOutput,
        simulated_total: expectedOutput,
        difference_percent: differencePercent,
        status,
        details: {
          cloud_cover: cloudCover,
          temperature,
          hour,
          config,
          recommendation: isUnder
            ? `Check panels for obstruction or dirt. Optimal orientation for your location: 180° azimuth, 19° tilt.`
            : 'Sensor calibration may be needed.',
        },
      }]);

      console.log(`FAULT DETECTED: ${differencePercent.toFixed(1)}% difference for user ${userId}`);
    }
  } catch (err) {
    console.error('Fault check failed:', err);
  }
}
