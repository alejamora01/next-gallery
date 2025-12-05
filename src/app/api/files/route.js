import { supabaseServer } from "@/lib/supabaseServerClient";

export async function POST(request) {
  const supabase = supabaseServer();
  const { bucket } = await request.json();

  const { data, error } = await supabase.storage.from(bucket).list();
  if (error) return Response.json({ error: error.message }, { status: 400 });

  const images = data
    .filter(f => /\.(png|jpe?g|gif|webp)$/i.test(f.name))
    .map(f => {
      const { data: url } = supabase.storage.from(bucket).getPublicUrl(f.name);
      return { name: f.name, url: url.publicUrl };
    });

  return Response.json({ images });
}
