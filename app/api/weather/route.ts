// app/api/weather/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const API_KEY = process.env.WEATHER_API;
  const LAT = '26.1445'; // Guwahati Lat
  const LON = '91.7362'; // Guwahati Lng

  if (!API_KEY) {
    return NextResponse.json({ error: 'Missing API Key' }, { status: 500 });
  }

  try {
    // We run two requests in parallel:
    // 1. "weather" endpoint for ACCURATE current conditions (Fixes the 100% humidity bug)
    // 2. "forecast" endpoint for determining the next 24h of rain
    const [currentRes, forecastRes] = await Promise.all([
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&appid=${API_KEY}&units=metric`, { cache: 'no-store' }),
      fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&appid=${API_KEY}&units=metric`, { cache: 'no-store' })
    ]);

    if (!currentRes.ok || !forecastRes.ok) {
      throw new Error(`Weather API Error: ${currentRes.status} / ${forecastRes.status}`);
    }

    const currentData = await currentRes.json();
    const forecastData = await forecastRes.json();

    // --- LOGIC 1: Get Real-Time Humidity & Temp ---
    // This comes from a physical station, not a prediction model
    const realHumidity = currentData.main.humidity;
    const realTemp = Math.round(currentData.main.temp);

    // --- LOGIC 2: Calculate Rain Volume & Probability for next 24h ---
    // We look at the next 8 blocks (8 blocks * 3 hours = 24 hours)
    const next24h = forecastData.list.slice(0, 8);
    
    let rainVolume = 0;
    let maxPop = 0; // "Probability of Precipitation" (0 to 1)

    next24h.forEach((block: any) => {
      // Sum up rain volume (mm)
      if (block.rain && block.rain['3h']) {
        rainVolume += block.rain['3h'];
      }
      // Track maximum probability (e.g., if any block has 80% chance, we want to know)
      if (block.pop > maxPop) {
        maxPop = block.pop;
      }
    });

    // --- LOGIC 3: Determine if it's "raining" or "cloudy" ---
    // If current weather explicitly says "Rain" OR volume > 0.5mm
    const isRainingNow = currentData.weather[0].main === 'Rain' || rainVolume > 0.5;

    return NextResponse.json({
      // The exact volume (mm) for flood calculations
      rain24h: rainVolume.toFixed(1),
      
      // The probability % (0-100) for the UI label
      rainChance: Math.round(maxPop * 100),

      temp: realTemp,
      humidity: realHumidity,
      
      // A clean status text for your dashboard
      current: isRainingNow ? 'Precipitation' : 'Dry Conditions',
      
      lastUpdated: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Weather Fetch Failed:', error);
    return NextResponse.json({ 
      rain24h: 0, 
      rainChance: 0,
      temp: 0, 
      humidity: 0, 
      current: 'Unavailable',
      error: 'Failed to connect to weather network'
    }, { status: 500 });
  }
}