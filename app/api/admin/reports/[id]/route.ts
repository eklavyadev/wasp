// app/api/admin/reports/[id]/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Get the image URL before we delete the record
    const { data: report, error: fetchError } = await supabase
      .from('reports')
      .select('image_url')
      .eq('id', id)
      .single();

    if (report?.image_url) {
      // Extract filename from URL (e.g., "wasp-123.jpg")
      const urlParts = report.image_url.split('/');
      const fileName = urlParts[urlParts.length - 1];

      // 2. Delete from Storage
      const { error: storageError } = await supabase.storage
        .from('report-images')
        .remove([fileName]);

      if (storageError) console.error('Storage Delete Warning:', storageError);
    }

    // 3. Delete from Database
    const { error: dbError } = await supabase
      .from('reports')
      .delete()
      .eq('id', id);

    if (dbError) throw dbError;

    return NextResponse.json({ success: true, message: 'Cleaned up DB and Storage' });
  } catch (err: any) {
    console.error('DELETE_ERROR:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}