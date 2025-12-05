"use client";

import { useState } from "react";

const STUDIO_BASE_URL =
  "https://studio-arepa.morapena001.space/project/default/storage/buckets/";

export default function GalleryClient({ buckets }) {
  const [bucketList, setBucketList] = useState(buckets);
  const [selectedBucket, setSelectedBucket] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);

  const [status, setStatus] = useState("");          // mensajes generales (upload, loading...)
  const [createStatus, setCreateStatus] = useState(""); // mensajes de crear bucket

  const [galleryStatus, setGalleryStatus] = useState(""); // "Gallery loaded!"
  const [studioBucket, setStudioBucket] = useState("");   // bucket actual para el link

  const [lightbox, setLightbox] = useState(null);

  // --- helpers ---

  async function refreshBuckets() {
    const res = await fetch("/api/buckets");
    const json = await res.json();
    if (json.buckets) setBucketList(json.buckets);
  }

  async function loadGallery() {
    if (!selectedBucket) return;
    setStatus("Loading images...");
    setGalleryStatus("");
    setStudioBucket("");

    const res = await fetch("/api/files", {
      method: "POST",
      body: JSON.stringify({ bucket: selectedBucket }),
    });

    const json = await res.json();

    setGalleryImages(json.images || []);
    setStatus("");
    setGalleryStatus("Gallery loaded!");
    setStudioBucket(selectedBucket);
  }

  async function uploadImages() {
    if (!selectedBucket || selectedFiles.length === 0) {
      setStatus("Select a bucket and some images first.");
      return;
    }

    setStatus("Uploading...");

    for (const file of selectedFiles) {
      const form = new FormData();
      form.append("bucket", selectedBucket);
      form.append("file", file);
      await fetch("/api/upload", { method: "POST", body: form });
    }

    setStatus("Upload complete!");
    await loadGallery();
  }

  async function createBucket(nameRaw) {
    const name = nameRaw.trim().toLowerCase();
    if (!name) {
      setCreateStatus("Please enter a bucket name.");
      return;
    }

    const res = await fetch("/api/buckets", {
      method: "POST",
      body: JSON.stringify({ name }),
    });

    const json = await res.json();
    if (json.error) {
      setCreateStatus(`Error: ${json.error}`);
    } else {
      setCreateStatus("Bucket created!");
      refreshBuckets();
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    const files = [...e.dataTransfer.files].filter((f) =>
      f.type.startsWith("image/")
    );
    setSelectedFiles(files);
    setStatus(`${files.length} image(s) ready to upload`);
  }

  // --- UI ---

  return (
    <div className="min-h-screen w-full flex flex-wrap bg-[#f9f6fb] text-[#3a2b3f]">
      {/* LEFT PANEL */}
      <div className="w-full md:w-[400px] max-w-[400px] bg-white border-r border-[#e6d7ed] shadow-lg flex flex-col gap-6 p-6">
        {/* Header */}
        <header>
          <h1 className="text-2xl font-semibold text-[#b45edb]">
            Cloud Storage Manager 🌩️
          </h1>
          <p className="text-[#8c7a93]">
            Create buckets & upload files (secure via server-only keys).
          </p>
        </header>

        {/* Create Bucket */}
        <section>
          <h2 className="text-[#b45edb] font-semibold mb-2">
            1. Create New Bucket
          </h2>

          <div className="flex gap-2">
            <input
              id="bucketNameInput"
              type="text"
              placeholder="e.g., travel-photos"
              className="flex-1 p-2 border rounded bg-[#f7f1fa] border-[#e6d7ed] focus:outline-none focus:ring-2 focus:ring-[#d288f0]"
              onKeyDown={(e) => {
                if (e.key === "Enter") createBucket(e.target.value);
              }}
            />
            <button
              className="px-3 py-2 bg-[#d288f0] text-white rounded hover:bg-[#e4a6f7]"
              onClick={() => {
                const input = document.getElementById("bucketNameInput");
                if (input) createBucket(input.value);
              }}
            >
              Create
            </button>
          </div>

          <p className="mt-1 text-sm">{createStatus}</p>
        </section>

        {/* Select Bucket & Upload */}
        <section>
          <h2 className="text-[#b45edb] font-semibold mb-2">
            2. Select Bucket & Upload
          </h2>

          <select
            className="w-full p-2 border rounded bg-[#f7f1fa] border-[#e6d7ed] focus:outline-none focus:ring-2 focus:ring-[#d288f0]"
            value={selectedBucket}
            onChange={(e) => {
              setSelectedBucket(e.target.value);
              setGalleryImages([]);
              setGalleryStatus("");
              setStudioBucket("");
            }}
          >
            <option value="">-- Select a Bucket --</option>
            {bucketList.map((b) => (
              <option key={b.name} value={b.name}>
                {b.name}
              </option>
            ))}
          </select>

          {/* Drop zone */}
          <div
            className="mt-3 border-2 border-dashed border-[#e6d7ed] rounded-lg p-6 bg-[#fdf8ff] text-center cursor-pointer"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <p>Drag & Drop Images Here</p>
            <span className="block text-sm text-[#8c7a93] my-1">or</span>

            <input
              type="file"
              id="filePicker"
              className="hidden"
              multiple
              accept="image/*"
              onChange={(e) => setSelectedFiles([...e.target.files])}
            />

            <button
              className="mt-2 px-4 py-1 bg-[#f6b6d8] text-white rounded hover:bg-[#f9c9e1]"
              onClick={() => document.getElementById("filePicker")?.click()}
            >
              Choose Files
            </button>
          </div>

          <button
            className="w-full mt-3 bg-[#d288f0] text-white p-2 rounded hover:bg-[#e4a6f7]"
            onClick={uploadImages}
          >
            Upload Selected Images
          </button>

          <button
            className="w-full mt-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            onClick={loadGallery}
          >
            Load Gallery
          </button>

          <p className="mt-2 text-sm">{status}</p>
        </section>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 p-6 overflow-y-auto">
        <h2 className="text-xl font-semibold text-[#b45edb]">Gallery</h2>

        {/* Mensaje Gallery loaded + link a Supabase Studio */}
        {galleryStatus && (
          <p className="mt-3 text-sm font-medium text-green-700">
            {galleryStatus}
          </p>
        )}

        {studioBucket && (
          <a
            href={`${STUDIO_BASE_URL}${studioBucket}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-block text-sm font-semibold text-[#f4c542] underline hover:no-underline"
          >
            View this bucket in Supabase Studio
          </a>
        )}

        {/* Grid de imágenes */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {galleryImages.length === 0 && (
            <div className="col-span-full text-center text-sm text-[#8c7a93] py-8">
              No images loaded yet.
            </div>
          )}

          {galleryImages.map((img) => (
            <img
              key={img.name}
              src={img.url}
              alt={img.name}
              className="w-full aspect-[4/3] object-cover rounded-lg shadow cursor-pointer hover:scale-[1.03] transition-transform"
              onClick={() => setLightbox(img)}
            />
          ))}
        </div>
      </div>

      {/* LIGHTBOX */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/70 flex flex-col items-center justify-center z-50"
          onClick={() => setLightbox(null)}
        >
          <button className="absolute top-4 right-4 text-white text-3xl">
            ×
          </button>
          <img
            src={lightbox.url}
            alt={lightbox.name}
            className="max-w-[90vw] max-h-[80vh] rounded-lg shadow-2xl"
          />
          <p className="text-white mt-3">{lightbox.name}</p>
        </div>
      )}
    </div>
  );
}

