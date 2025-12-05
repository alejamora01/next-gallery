import { supabaseServer } from "@/lib/supabaseServerClient";

export async function POST(request) {
  const supabase = supabaseServer();
  const form = await request.formData();
  const bucket = form.get("bucket");
  const file = form.get("file");

  if (!bucket || !file)
    return Response.json({ error: "Missing fields" }, { status: 400 });

  const { error } = await supabase.storage
    .from(bucket)
    .upload(file.name, file, { upsert: false });

  if (error) return Response.json({ error: error.message }, { status: 400 });

  return Response.json({ success: true });
}
