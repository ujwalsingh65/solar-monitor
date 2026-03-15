import { useState, useEffect } from "react";
import { calculatePanelEfficiency } from "@/utils/solarCalculations";

interface WeatherData {
  temperature: number;
  cloudCover: number;
  windSpeed: number;
}

interface SolarProduction {
  currentOutput: number;
  todayTotal: number;
  monthlyTotal: number;
  efficiency: number;
  hourlyData: { time: string; energy: number }[];
  weeklyData: { day: string; energy: number }[];
  monthlyWeekData: { week: string; energy: number }[];
}

export const useSolarProduction = (
  systemCapacity: number = 5.0,
  azimuth: number = 180,
  tilt: number = 19
) => {
  const [production, setProduction] = useState<SolarProduction>({
    currentOutput: 0,
    todayTotal: 0,
    monthlyTotal: 0,
    efficiency: 0,
    hourlyData: [],
    weeklyData: [],
    monthlyWeekData: [],
  });
  const [loading, setLoading] = useState(true);

  const calculateSolarOutput = (
    weather: WeatherData,
    hour: number
  ): number => {
    // Use the provided system capacity
    const SYSTEM_CAPACITY = systemCapacity;

    // Calculate sun intensity based on time of day (peak at noon)
    const getSunIntensity = (h: number): number => {
      if (h < 6 || h > 20) return 0;
      if (h >= 11 && h <= 14) return 1.0; // Peak hours
      if (h >= 9 && h <= 16) return 0.85;
      if (h >= 7 && h <= 18) return 0.6;
      return 0.3;
    };

    const sunIntensity = getSunIntensity(hour);

    // Cloud cover impact (0-100% clouds reduces output)
    const cloudFactor = (100 - weather.cloudCover) / 100;

    // Temperature impact (optimal at 25°C, slight reduction above)
    const tempFactor =
      weather.temperature <= 25
        ? 1.0
        : 1.0 - (weather.temperature - 25) * 0.004;

    // Panel orientation efficiency
    const orientationEfficiency = calculatePanelEfficiency(azimuth, tilt);

    // Calculate output with orientation factor
    const output =
      SYSTEM_CAPACITY * sunIntensity * cloudFactor * tempFactor * orientationEfficiency;

    return Math.max(0, output);
  };

  const fetchWeatherAndCalculate = async () => {
    try {
      setLoading(true);

      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        }
      );

      const { latitude, longitude } = position.coords;

      // Get current weather
      const currentResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,cloud_cover,wind_speed_10m&timezone=auto`
      );
      const data = await currentResponse.json();

      // Get historical weather for the month
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startDate = firstDayOfMonth.toISOString().split('T')[0];
      const endDate = now.toISOString().split('T')[0];

      // Also get last 30 days for better weekly data
      const thirtyDaysAgo = new Date(now);
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const thirtyDaysStart = thirtyDaysAgo.toISOString().split('T')[0];

      const historicalResponse = await fetch(
        `https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&start_date=${thirtyDaysStart}&end_date=${endDate}&hourly=temperature_2m,cloud_cover&timezone=auto`
      );
      const historicalData = await historicalResponse.json();

      const weather: WeatherData = {
        temperature: data.current.temperature_2m,
        cloudCover: data.current.cloud_cover,
        windSpeed: data.current.wind_speed_10m,
      };

      const currentHour = new Date().getHours();
      const currentOutput = calculateSolarOutput(weather, currentHour);

      // Calculate today's total (sum from 6AM to current hour)
      let todayTotal = 0;
      const hourlyData: { time: string; energy: number }[] = [];

      for (let h = 6; h <= Math.min(currentHour, 20); h++) {
        const output = calculateSolarOutput(weather, h);
        todayTotal += output;
        hourlyData.push({
          time: `${h % 12 || 12}${h < 12 ? "AM" : "PM"}`,
          energy: parseFloat(output.toFixed(2)),
        });
      }

      // Add forecast for rest of the day
      for (let h = currentHour + 1; h <= 20; h++) {
        const output = calculateSolarOutput(weather, h);
        hourlyData.push({
          time: `${h % 12 || 12}${h < 12 ? "AM" : "PM"}`,
          energy: parseFloat(output.toFixed(2)),
        });
      }

      // Calculate daily, weekly, and monthly totals from historical data
      let monthlyTotal = 0;
      const dailyTotals: { [key: string]: number } = {};
      
      if (historicalData.hourly) {
        const temps = historicalData.hourly.temperature_2m;
        const clouds = historicalData.hourly.cloud_cover;
        const times = historicalData.hourly.time;

        for (let i = 0; i < times.length; i++) {
          const dateTime = new Date(times[i]);
          const hour = dateTime.getHours();
          const dateKey = dateTime.toISOString().split('T')[0];
          
          const historicalWeather: WeatherData = {
            temperature: temps[i] || 25,
            cloudCover: clouds[i] || 30,
            windSpeed: weather.windSpeed,
          };

          const output = calculateSolarOutput(historicalWeather, hour);
          
          // Add to daily totals
          if (!dailyTotals[dateKey]) {
            dailyTotals[dateKey] = 0;
          }
          dailyTotals[dateKey] += output;

          // Add to monthly total only if in current month
          if (dateTime >= firstDayOfMonth) {
            monthlyTotal += output;
          }
        }
      }

      // Generate weekly data (last 7 days)
      const weeklyData: { day: string; energy: number }[] = [];
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateKey = date.toISOString().split('T')[0];
        const dayName = dayNames[date.getDay()];
        
        weeklyData.push({
          day: dayName,
          energy: parseFloat((dailyTotals[dateKey] || 0).toFixed(1)),
        });
      }

      // Generate monthly week data (last 4 weeks)
      const monthlyWeekData: { week: string; energy: number }[] = [];
      
      for (let weekNum = 4; weekNum >= 1; weekNum--) {
        let weekTotal = 0;
        for (let day = 0; day < 7; day++) {
          const date = new Date(now);
          date.setDate(date.getDate() - ((weekNum - 1) * 7 + day));
          const dateKey = date.toISOString().split('T')[0];
          weekTotal += dailyTotals[dateKey] || 0;
        }
        
        monthlyWeekData.unshift({
          week: `Week ${5 - weekNum}`,
          energy: parseFloat(weekTotal.toFixed(1)),
        });
      }

      const efficiency = Math.round((100 - weather.cloudCover) * 0.85);

      setProduction({
        currentOutput: parseFloat(currentOutput.toFixed(2)),
        todayTotal: parseFloat(todayTotal.toFixed(1)),
        monthlyTotal: parseFloat(monthlyTotal.toFixed(1)),
        efficiency,
        hourlyData,
        weeklyData,
        monthlyWeekData,
      });
    } catch (error) {
      console.error("Error calculating solar production:", error);
      // Fallback to estimated values scaled by system capacity
      const scaleFactor = systemCapacity / 5; // base values assume 5kW
      const orientationEff = calculatePanelEfficiency(azimuth, tilt);
      const adjustedScale = scaleFactor * orientationEff;

      const fallbackHourly: { time: string; energy: number }[] = [];
      let fallbackDayTotal = 0;
      for (let h = 6; h <= 20; h++) {
        const basePeakOutput = systemCapacity * 0.7; // 70% average efficiency
        let intensity = 0;
        if (h >= 11 && h <= 14) intensity = 1.0;
        else if (h >= 9 && h <= 16) intensity = 0.75;
        else if (h >= 7 && h <= 18) intensity = 0.45;
        else intensity = 0.15;
        const energy = parseFloat((basePeakOutput * intensity * orientationEff).toFixed(2));
        fallbackDayTotal += energy;
        fallbackHourly.push({
          time: `${h % 12 || 12}${h < 12 ? "AM" : "PM"}`,
          energy,
        });
      }

      setProduction({
        currentOutput: parseFloat((systemCapacity * 0.65 * orientationEff).toFixed(2)),
        todayTotal: parseFloat(fallbackDayTotal.toFixed(1)),
        monthlyTotal: parseFloat((fallbackDayTotal * 30 * 0.85).toFixed(1)),
        efficiency: 75,
        hourlyData: fallbackHourly,
        weeklyData: [
          { day: "Mon", energy: parseFloat((fallbackDayTotal * 0.95).toFixed(1)) },
          { day: "Tue", energy: parseFloat((fallbackDayTotal * 1.05).toFixed(1)) },
          { day: "Wed", energy: parseFloat((fallbackDayTotal * 0.90).toFixed(1)) },
          { day: "Thu", energy: parseFloat((fallbackDayTotal * 1.10).toFixed(1)) },
          { day: "Fri", energy: parseFloat((fallbackDayTotal * 1.00).toFixed(1)) },
          { day: "Sat", energy: parseFloat((fallbackDayTotal * 1.08).toFixed(1)) },
          { day: "Sun", energy: parseFloat((fallbackDayTotal * 0.92).toFixed(1)) },
        ],
        monthlyWeekData: [
          { week: "Week 1", energy: parseFloat((fallbackDayTotal * 6.5).toFixed(1)) },
          { week: "Week 2", energy: parseFloat((fallbackDayTotal * 7.2).toFixed(1)) },
          { week: "Week 3", energy: parseFloat((fallbackDayTotal * 6.8).toFixed(1)) },
          { week: "Week 4", energy: parseFloat((fallbackDayTotal * 7.5).toFixed(1)) },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherAndCalculate();

    // Refresh every 15 minutes
    const interval = setInterval(fetchWeatherAndCalculate, 15 * 60 * 1000);

    return () => clearInterval(interval);
  }, [systemCapacity, azimuth, tilt]);

  return { production, loading, refresh: fetchWeatherAndCalculate };
};
