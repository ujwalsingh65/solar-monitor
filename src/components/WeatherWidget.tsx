import { Cloud, Sun, Wind, MapPin, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface WeatherData {
  temperature: number;
  windSpeed: number;
  cloudCover: number;
  weatherCode: number;
  city: string;
}

export const WeatherWidget = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [locationDenied, setLocationDenied] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const getWeatherDescription = (code: number) => {
    if (code === 0) return t("clearSky");
    if (code <= 3) return t("partlyCloudy");
    if (code <= 48) return t("foggy");
    if (code <= 67) return t("rainy");
    if (code <= 77) return t("snowy");
    return t("stormy");
  };

  const fetchWeather = async (lat: number, lon: number) => {
    try {
      setLoading(true);
      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,cloud_cover,wind_speed_10m,weather_code&timezone=auto`
      );
      const weatherData = await weatherResponse.json();

      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?latitude=${lat}&longitude=${lon}&count=1`
      );
      const geoData = await geoResponse.json();

      setWeather({
        temperature: Math.round(weatherData.current.temperature_2m),
        windSpeed: Math.round(weatherData.current.wind_speed_10m),
        cloudCover: weatherData.current.cloud_cover,
        weatherCode: weatherData.current.weather_code,
        city: geoData.results?.[0]?.name || "Unknown Location",
      });
    } catch (error) {
      toast({
        title: "Error fetching weather",
        description: "Unable to load weather data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const requestLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Location not supported",
        description: "Your browser doesn't support geolocation.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationDenied(false);
        fetchWeather(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        setLoading(false);
        setLocationDenied(true);
        toast({
          title: "Location access denied",
          description: "Please enable location permissions to see weather data.",
          variant: "destructive",
        });
      }
    );
  };

  useEffect(() => {
    requestLocation();
  }, []);

  const solarEfficiency = weather
    ? Math.round(100 - weather.cloudCover * 0.7)
    : 85;

  return (
    <Card className="border-border/50 bg-gradient-to-br from-card via-card to-card/80 backdrop-blur-sm shadow-card hover:shadow-card-hover transition-all duration-300 card-glow">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          {t("weatherConditions")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {locationDenied && !loading && (
          <div className="text-center py-4 space-y-3">
            <MapPin className="h-12 w-12 mx-auto text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {t("locationRequired")}
            </p>
            <Button onClick={requestLocation} size="sm">
              {t("enableLocation")}
            </Button>
          </div>
        )}

        {weather && !loading && (
          <>
            <div className="flex items-center justify-between p-5 bg-gradient-to-br from-secondary/20 via-secondary/10 to-transparent rounded-2xl border border-secondary/20 shadow-lg">
              <div className="flex items-center gap-4">
                <Sun className="h-12 w-12 text-secondary drop-shadow-lg" />
                <div>
                  <p className="text-3xl font-bold">{weather.temperature}°C</p>
                  <p className="text-sm text-muted-foreground">
                    {getWeatherDescription(weather.weatherCode)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{weather.city}</p>
                <p className="text-lg font-bold text-secondary">
                  {new Date().toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Cloud className="h-6 w-6 text-accent" />
                <div>
                  <p className="text-xs text-muted-foreground">{t("cloudCover")}</p>
                  <p className="text-lg font-semibold">{weather.cloudCover}%</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Wind className="h-6 w-6 text-accent" />
                <div>
                  <p className="text-xs text-muted-foreground">{t("windSpeed")}</p>
                  <p className="text-lg font-semibold">{weather.windSpeed} km/h</p>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-border/50">
              <p className="text-sm font-medium mb-1">{t("solarEfficiency")}</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-secondary to-accent rounded-full transition-all duration-500"
                    style={{ width: `${solarEfficiency}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-secondary">
                  {solarEfficiency}%
                </span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
