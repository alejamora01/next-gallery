import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">

      <h1 className="text-4xl font-bold text-[#3a2b3f]">
        Welcome to Next Gallery
      </h1>

      <p className="mt-3 text-lg text-[#6d5e72]">
        Manage your Supabase storage buckets & images.
      </p>

      <Link
        href="/gallery"
        className="
          mt-6 
          inline-block
          px-6 py-3
          text-lg font-semibold 
          rounded-lg
          bg-[#b45edb]
          text-white
          hover:bg-[#d288f0]
          transition-all
          shadow
        "
      >
        Open Gallery 🚀
      </Link>

    </div>
  );
}
