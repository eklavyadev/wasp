import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const MAX_SIZE_MB = 10;
const DUPLICATE_RADIUS_METERS = 50; 

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    /* ---------- 1. DATA EXTRACTION ---------- */
    const image = formData.get('image') as File | null;
    const location = formData.get('location') as string | null;
    const landmark = formData.get('landmark') as string | null; // This pulls from the 'landmark' key in frontend
    const lat = Number(formData.get('lat'));
    const lng = Number(formData.get('lng'));
    const type = formData.get('type') as string | null; 
    const impactLevel = Number(formData.get('impact_level'));

    // Debug Log: Check your terminal to see if landmark is arriving
    console.log('--- NEW REPORT INCOMING ---');
    console.log('Type:', type);
    console.log('Landmark Received:', landmark); 

    /* ---------- 2. VALIDATION ---------- */
    if (!image || !location || !type || isNaN(lat) || isNaN(lng)) {
      return NextResponse.json({ error: 'Missing required report fields.' }, { status: 400 });
    }

    /* ---------- 3. DATABASE DUPLICATE CHECK ---------- */
    const { data: nearby, error: dupError } = await supabase.rpc('check_nearby_reports', {
      input_lat: lat,
      input_lng: lng,
      radius_meters: DUPLICATE_RADIUS_METERS,
    });

    if (nearby && nearby.length > 0) {
      return NextResponse.json({ 
        error: 'A report already exists for this exact location.' 
      }, { status: 409 });
    }

    /* ---------- 4. STORAGE UPLOAD ---------- */
    const fileExt = image.type.split('/')[1] || 'jpg';
    const fileName = `wasp-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('report-images') 
      .upload(fileName, image, { contentType: image.type });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('report-images')
      .getPublicUrl(fileName);

    /* ---------- 5. DB INSERTION ---------- */
    // Explicitly mapping the fields to ensure landmark isn't lost
    const { data: inserted, error: insertError } = await supabase
      .from('reports')
      .insert({
        image_url: publicUrl,
        location: location,
        landmark: landmark ? landmark.trim() : '', // Ensure we don't send null
        lat: lat,
        lng: lng,
        type: type,
        impact_level: impactLevel,
        status: 'pending',
        governing_body: 'Guwahati Municipal'
      })
      .select()
      .single();

    if (insertError) {
        console.error('DATABASE INSERT ERROR:', insertError);
        throw insertError;
    }

    return NextResponse.json({ 
      success: true, 
      reportId: inserted.id,
      message: 'Report successfully submitted.'
    });

  } catch (err: any) {
    console.error('API_ERROR:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}