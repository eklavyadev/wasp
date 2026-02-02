import { NextResponse } from 'next/server';

export async function GET() {
  const API_KEY = process.env.WEATHER_API;
  const LAT = 26.1445; // Guwahati
  const LON = 91.7362;

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&appid=${API_KEY}&units=metric`
    );
    const data = await res.json();

    // Logic to sum rain for the next 24h (8 intervals of 3h)
    let rain24h = 0;
    if (data.list) {
      data.list.slice(0, 8).forEach((slot: any) => {
        if (slot.rain && slot.rain['3h']) rain24h += slot.rain['3h'];
      });
    }

    return NextResponse.json({
      rain24h: rain24h.toFixed(1),
      temp: data.list[0].main.temp,
      humidity: data.list[0].main.humidity,
      current: data.list[0].weather[0].main
    });
  } catch (error) {
    return NextResponse.json({ error: 'Weather fetch failed' }, { status: 500 });
  }
}