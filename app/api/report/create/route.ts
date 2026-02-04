import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import twilio from 'twilio';

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Initialize Twilio
const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
const TARGET_WHATSAPP = 'whatsapp:+918709436341';
const TWILIO_SENDER = 'whatsapp:+14155238886'; 

const DUPLICATE_RADIUS_METERS = 50; 

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    /* ---------- 1. DATA EXTRACTION ---------- */
    const image = formData.get('image') as File | null;
    const location = formData.get('location') as string | null;
    const landmark = formData.get('landmark') as string | null;
    const lat = Number(formData.get('lat'));
    const lng = Number(formData.get('lng'));
    const type = formData.get('type') as string | null; 
    const impactLevel = Number(formData.get('impact_level')); // Official scale (1, 2, or 3)

    /* ---------- 2. VALIDATION ---------- */
    if (!image || !location || !type || isNaN(lat) || isNaN(lng)) {
      return NextResponse.json({ error: 'Missing required report fields.' }, { status: 400 });
    }

    /* ---------- 3. DATABASE DUPLICATE CHECK ---------- */
    const { data: nearby } = await supabase.rpc('check_nearby_reports', {
      input_lat: lat,
      input_lng: lng,
      radius_meters: DUPLICATE_RADIUS_METERS,
    });

    if (nearby && nearby.length > 0) {
      return NextResponse.json({ error: 'A report already exists for this location.' }, { status: 409 });
    }

    /* ---------- 4. STORAGE UPLOAD ---------- */
    const fileExt = image.type.split('/')[1] || 'jpg';
    const fileName = `wasp-${Date.now()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from('report-images') 
      .upload(fileName, image, { contentType: image.type });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage.from('report-images').getPublicUrl(fileName);

    /* ---------- 5. STATUS LOGIC ---------- */
    // Defaulting to approved for official municipal signal stream
    const finalStatus = 'approved';

    /* ---------- 6. DB INSERTION ---------- */
    const { data: inserted, error: insertError } = await supabase
      .from('reports')
      .insert({
        image_url: publicUrl,
        location: location,
        landmark: landmark || 'None provided',
        lat: lat,
        lng: lng,
        type: type,
        impact_level: impactLevel,
        status: finalStatus,
        governing_body: 'Guwahati Municipal'
      })
      .select()
      .single();

    if (insertError) throw insertError;

    /* ---------- 7. OFFICIAL WHATSAPP ALERT ---------- */
    try {
      // Logic for Priority Labels and Icons
      let priorityText = "🟢 LOW";
      let alertIcon = "⚠️";
      
      if (impactLevel === 3) {
        priorityText = "🔴 HIGH";
        alertIcon = "‼️";
      } else if (impactLevel === 2) {
        priorityText = "🟡 MEDIUM";
        alertIcon = "🔸";
      }

      await twilioClient.messages.create({
        from: TWILIO_SENDER,
        to: TARGET_WHATSAPP,
        body: `${alertIcon} *MUNICIPAL INCIDENT ALERT* ${alertIcon}\n\n` +
              `*Impact Level:* ${priorityText} (${impactLevel}/3)\n` +
              `*Category:* ${type.toUpperCase()}\n` +
              `*Location:* ${location}\n` +
              `*Landmark:* ${landmark || 'N/A'}\n\n` +
              `📍 *GPS View:* https://www.google.com/maps?q=${lat},${lng}\n\n` +
              `_Sent via WASP Real-time Dispatch_`,
        mediaUrl: [publicUrl]
      });
      console.log('WhatsApp Dispatch Successful');
    } catch (twError) {
      console.error('Twilio Error:', twError);
    }

    return NextResponse.json({ 
      success: true, 
      reportId: inserted.id,
      status: finalStatus
    });

  } catch (err: any) {
    console.error('API_ERROR:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}