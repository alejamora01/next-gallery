import { supabaseServer } from "@/lib/supabaseServerClient";

export async function GET() {
  const supabase = supabaseServer();
  const { data, error } = await supabase.storage.listBuckets();
  if (error) return Response.json({ error: error.message }, { status: 400 });
  return Response.json({ buckets: data });
}

export async function POST(request) {
  const supabase = supabaseServer();
  const { name } = await request.json();
  const { error } = await supabase.storage.createBucket(name, { public: true });
  if (error) return Response.json({ error: error.message }, { status: 400 });
  return Response.json({ success: true });
}
