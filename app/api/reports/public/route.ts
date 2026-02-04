import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Standard Anon client is fine here as we are reading public data
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('reports')
      .select('id, type, impact_level, lat, lng, location, landmark, status, created_at, image_url')
      // Only show reports that have been vetted or fixed
      .in('status', ['approved', 'resolved']) 
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch public feed' }, { status: 500 });
  }
}