import "@/styles/globals.css";

export const metadata = {
  title: "Next Gallery",
  description: "Cloud Storage Manager with Supabase",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#f9f6fb] text-[#3a2b3f]">
        {children}
      </body>
    </html>
  );
}
