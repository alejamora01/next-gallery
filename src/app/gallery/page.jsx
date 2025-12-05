import { supabaseServer } from "@/lib/supabaseServerClient";
import GalleryClient from "@/components/GalleryClient";

export default async function GalleryPage() {
  const supabase = supabaseServer();
  const { data: buckets } = await supabase.storage.listBuckets();

  return <GalleryClient buckets={buckets || []} />;
}
