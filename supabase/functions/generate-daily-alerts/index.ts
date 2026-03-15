import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface WeatherData {
  temperature: number;
  cloudCover: number;
  windSpeed: number;
  weatherCode: number;
  humidity?: number;
}

interface Alert {
  alert_type: string;
  severity: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
}

interface PanelConfig {
  panel_size: number;
  azimuth: number;
  tilt: number;
}

// Realistic solar production calculation in kWh for one hour
// Uses panel size in kW, time-of-day efficiency, weather, and panel orientation
const calculateHourlyProductionKwh = (
  panelSizeKw: number,
  hour: number,
  cloudCover: number,
  temperature: number,
  tilt: number,
  azimuth: number,
  latitude: number = 19.12
): number => {
  if (hour < 6 || hour > 18) return 0;

  // Solar elevation factor (peak at solar noon ~12:30 for Mumbai)
  const solarNoon = 12.5;
  const hourAngle = Math.abs(hour - solarNoon);
  const timeEfficiency = Math.max(0, Math.cos((hourAngle / 6.5) * (Math.PI / 2)));

  // Cloud cover reduces output
  const cloudFactor = Math.max(0.1, (100 - cloudCover) / 100);

  // Temperature derating: panels lose ~0.4% efficiency per °C above 25°C
  const tempCoefficient = -0.004;
  const tempDerate = temperature > 25 ? 1 + tempCoefficient * (temperature - 25) : 1;

  // Simplified tilt/azimuth efficiency (optimal for Mumbai: tilt ~19°, azimuth 180° south)
  const optimalTilt = latitude;
  const tiltDiff = Math.abs(tilt - optimalTilt);
  const tiltFactor = Math.max(0.7, 1 - tiltDiff * 0.005);

  const azimuthDiff = Math.min(Math.abs(azimuth - 180), 360 - Math.abs(azimuth - 180));
  const azimuthFactor = Math.max(0.6, 1 - azimuthDiff * 0.003);

  // System losses (inverter, wiring, soiling) ~15%
  const systemEfficiency = 0.85;

  return panelSizeKw * timeEfficiency * cloudFactor * tempDerate * tiltFactor * azimuthFactor * systemEfficiency;
};

// Weather code descriptions (WMO codes)
const getWeatherDescription = (code: number): string => {
  if (code <= 1) return 'clear skies';
  if (code <= 3) return 'partly cloudy';
  if (code <= 48) return 'foggy conditions';
  if (code <= 57) return 'drizzle';
  if (code <= 67) return 'rain';
  if (code <= 77) return 'snow';
  if (code <= 82) return 'rain showers';
  if (code <= 86) return 'snow showers';
  if (code <= 99) return 'thunderstorms';
  return 'mixed conditions';
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

    // Get user_id from request body if provided
    let userId: string | null = null;
    try {
      const body = await req.json();
      userId = body?.user_id ?? null;
    } catch {
      // No body provided
    }

    // Get user's panel config filtered by user_id, or fall back to defaults
    let config: PanelConfig = { panel_size: 5, azimuth: 180, tilt: 19 };
    if (userId) {
      const { data: configs } = await supabase
        .from('solar_panel_configs')
        .select('panel_size, azimuth, tilt')
        .eq('user_id', userId)
        .limit(1);

      if (configs && configs.length > 0) {
        config = configs[0];
      }
    } else {
      const { data: configs } = await supabase
        .from('solar_panel_configs')
        .select('panel_size, azimuth, tilt')
        .limit(1);

      if (configs && configs.length > 0) {
        config = configs[0];
      }
    }

    console.log(`Using panel config: ${config.panel_size}kW, azimuth ${config.azimuth}°, tilt ${config.tilt}°`);

    // Fetch current weather for Mumbai
    const weatherResponse = await fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=19.12&longitude=72.89&current=temperature_2m,cloud_cover,wind_speed_10m,weather_code,relative_humidity_2m&daily=sunshine_duration,uv_index_max&timezone=auto&forecast_days=1'
    );

    if (!weatherResponse.ok) {
      console.error('Weather API failed:', weatherResponse.status);
      throw new Error('Weather API request failed');
    }

    const weatherData = await weatherResponse.json();

    if (!weatherData.current) {
      console.error('Invalid weather data format');
      throw new Error('Invalid weather data format');
    }

    const weather: WeatherData = {
      temperature: weatherData.current.temperature_2m,
      cloudCover: weatherData.current.cloud_cover,
      windSpeed: weatherData.current.wind_speed_10m,
      weatherCode: weatherData.current.weather_code,
      humidity: weatherData.current.relative_humidity_2m,
    };

    const sunshineDuration = weatherData.daily?.sunshine_duration?.[0] ?? 0; // seconds
    const sunshineHours = Math.round(sunshineDuration / 3600 * 10) / 10;
    const uvIndex = weatherData.daily?.uv_index_max?.[0] ?? 0;

    console.log(`Weather: ${weather.temperature}°C, clouds ${weather.cloudCover}%, wind ${weather.windSpeed}km/h, code ${weather.weatherCode}`);

    // Estimate today's production based on current conditions
    let estimatedDailyKwh = 0;
    for (let h = 6; h <= 18; h++) {
      estimatedDailyKwh += calculateHourlyProductionKwh(
        config.panel_size, h, weather.cloudCover, weather.temperature, config.tilt, config.azimuth
      );
    }
    estimatedDailyKwh = Math.round(estimatedDailyKwh * 10) / 10;

    // Theoretical maximum (clear sky, 25°C, optimal orientation)
    let maxDailyKwh = 0;
    for (let h = 6; h <= 18; h++) {
      maxDailyKwh += calculateHourlyProductionKwh(config.panel_size, h, 0, 25, 19, 180);
    }
    maxDailyKwh = Math.round(maxDailyKwh * 10) / 10;

    const efficiencyPercent = Math.round((estimatedDailyKwh / maxDailyKwh) * 100);

    // Electricity rate for savings calculation
    const { data: rates } = await supabase
      .from('electricity_rates')
      .select('rate_per_kwh, currency')
      .eq('location', 'Mumbai')
      .limit(1);

    const rate = rates && rates.length > 0 ? rates[0].rate_per_kwh : 8.5;
    const currency = rates && rates.length > 0 ? rates[0].currency : 'INR';
    const estimatedSavings = Math.round(estimatedDailyKwh * rate * 10) / 10;

    // Generate contextual alerts
    const alerts: Alert[] = [];
    const weatherDesc = getWeatherDescription(weather.weatherCode);
    const currentHour = new Date().getHours();

    // 1. Daily production forecast (always include one)
    if (weather.cloudCover < 30 && weather.weatherCode <= 2) {
      alerts.push({
        alert_type: 'production',
        severity: 'info',
        title: '☀️ Excellent Solar Day',
        message: `${weatherDesc.charAt(0).toUpperCase() + weatherDesc.slice(1)} with ${weather.cloudCover}% cloud cover. Your ${config.panel_size}kW system should produce ~${estimatedDailyKwh} kWh today (${efficiencyPercent}% efficiency), saving ₹${estimatedSavings}.`,
      });
    } else if (weather.cloudCover < 60) {
      alerts.push({
        alert_type: 'production',
        severity: 'info',
        title: '⛅ Moderate Solar Conditions',
        message: `${weather.cloudCover}% cloud cover expected. Estimated production: ${estimatedDailyKwh} kWh from your ${config.panel_size}kW system (${efficiencyPercent}% of peak capacity). Expected savings: ₹${estimatedSavings}.`,
      });
    } else {
      alerts.push({
        alert_type: 'production',
        severity: 'warning',
        title: '🌥️ Reduced Solar Output Expected',
        message: `Heavy cloud cover (${weather.cloudCover}%) will limit production to ~${estimatedDailyKwh} kWh today (${efficiencyPercent}% efficiency). Normal output for your system: ${maxDailyKwh} kWh.`,
      });
    }

    // 2. Severe weather alerts
    if (weather.weatherCode >= 80) {
      alerts.push({
        alert_type: 'weather',
        severity: 'critical',
        title: '⛈️ Severe Weather Warning',
        message: `${getWeatherDescription(weather.weatherCode).charAt(0).toUpperCase() + getWeatherDescription(weather.weatherCode).slice(1)} detected in Mumbai. Production will be minimal. Check panel mounting after weather clears.`,
      });
    } else if (weather.weatherCode >= 51 && weather.weatherCode < 80) {
      alerts.push({
        alert_type: 'weather',
        severity: 'warning',
        title: '🌧️ Precipitation Expected',
        message: `${getWeatherDescription(weather.weatherCode).charAt(0).toUpperCase() + getWeatherDescription(weather.weatherCode).slice(1)} forecast. Panels will self-clean but production drops to ~${estimatedDailyKwh} kWh.`,
      });
    }

    // 3. Temperature alert (panels lose efficiency above 25°C)
    if (weather.temperature > 38) {
      const effLoss = Math.round((weather.temperature - 25) * 0.4);
      alerts.push({
        alert_type: 'performance',
        severity: 'warning',
        title: '🌡️ Extreme Heat Impact',
        message: `${weather.temperature}°C ambient temperature reduces panel efficiency by ~${effLoss}%. Actual output will be lower than rated capacity. Consider shade structures for inverter.`,
      });
    } else if (weather.temperature > 35) {
      const effLoss = Math.round((weather.temperature - 25) * 0.4);
      alerts.push({
        alert_type: 'performance',
        severity: 'info',
        title: '🌡️ Heat Efficiency Note',
        message: `At ${weather.temperature}°C, panels operate ~${effLoss}% below rated efficiency. This is normal — already factored into today's ${estimatedDailyKwh} kWh estimate.`,
      });
    }

    // 4. Wind alert
    if (weather.windSpeed > 50) {
      alerts.push({
        alert_type: 'maintenance',
        severity: 'critical',
        title: '💨 High Wind Warning',
        message: `Wind speed: ${weather.windSpeed} km/h. Inspect panel mounting, brackets, and wiring after wind subsides. Check for debris on panels.`,
      });
    } else if (weather.windSpeed > 30) {
      alerts.push({
        alert_type: 'maintenance',
        severity: 'info',
        title: '💨 Moderate Wind',
        message: `Wind at ${weather.windSpeed} km/h helps cool panels, slightly improving efficiency. No action needed unless sustained above 50 km/h.`,
      });
    }

    // 5. Panel orientation tip (if not optimal)
    const optimalTilt = 19; // Mumbai latitude
    const tiltDiff = Math.abs(config.tilt - optimalTilt);
    const azimuthDiff = Math.min(Math.abs(config.azimuth - 180), 360 - Math.abs(config.azimuth - 180));

    if (tiltDiff > 10 || azimuthDiff > 30) {
      const potentialGain = Math.round(tiltDiff * 0.5 + azimuthDiff * 0.3);
      alerts.push({
        alert_type: 'optimization',
        severity: 'info',
        title: '🔧 Panel Orientation Tip',
        message: `Your panels are at ${config.tilt}° tilt, ${config.azimuth}° azimuth. Optimal for Mumbai: 19° tilt, 180° (south). Adjusting could improve output by ~${potentialGain}%.`,
      });
    }

    // 6. UV index alert
    if (uvIndex >= 11) {
      alerts.push({
        alert_type: 'performance',
        severity: 'info',
        title: '☀️ Extreme UV Index',
        message: `UV index: ${uvIndex} (extreme). High irradiance boosts production but accelerates panel degradation over time. Panels are rated for this — no action needed.`,
      });
    }

    console.log(`Generated ${alerts.length} alerts. Estimated production: ${estimatedDailyKwh} kWh for ${config.panel_size}kW system`);

    // Delete today's alerts to avoid duplicates
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    await supabase
      .from('alerts')
      .delete()
      .gte('created_at', startOfDay.toISOString());

    console.log('Cleared today\'s alerts');

    // Clear old alerts (older than 7 days)
    await supabase
      .from('alerts')
      .delete()
      .lt('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

    console.log('Cleared old alerts');

    // Insert new alerts
    if (alerts.length > 0) {
      const { error } = await supabase
        .from('alerts')
        .insert(alerts);

      if (error) throw error;
      console.log(`Successfully inserted ${alerts.length} new alerts`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        alertsGenerated: alerts.length,
        estimatedDailyKwh,
        maxDailyKwh,
        efficiencyPercent,
        panelSize: config.panel_size,
        alerts,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Alert generation failed:', error);

    return new Response(
      JSON.stringify({ error: 'Failed to generate alerts. Please try again later.' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
