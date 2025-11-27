"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Photo } from "../types";
import AddPhotoModal from "./AddPhotoModal";
import PhotoModal from "./PhotoModal";

interface PhotoGalleryProps {
  initialPhotos: Photo[];
}

export default function PhotoGallery({ initialPhotos }: PhotoGalleryProps) {
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
  const router = useRouter();

  // Sync photos when initialPhotos prop changes (e.g., after router.refresh())
  useEffect(() => {
    setPhotos(initialPhotos);
  }, [initialPhotos]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [activeModal, setActiveModal] = useState<"none" | "view" | "add">(
    "none"
  );

  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo);
    setActiveModal("view");
  };

  const closeModal = () => {
    setActiveModal("none");
    // Add small delay to clear photo to allow animation to finish if needed,
    // but here we just clear it.
    setTimeout(() => setSelectedPhoto(null), 300);
  };

  const handleAddPhoto = (newPhoto: Photo) => {
    // The upload already saved to DB, so we add it to local state immediately
    // and refresh to ensure we have the latest data from the server
    setPhotos([newPhoto, ...photos]);

    // Refresh to sync with server (this will update initialPhotos prop)
    router.refresh();
  };

  const handleDeletePhoto = async (photoId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation(); // Prevent triggering the photo click
    }

    try {
      // Optimistically remove from UI
      setPhotos((prev) => prev.filter((p) => p.id !== photoId));

      const response = await fetch(`/api/photos/${photoId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!result.success) {
        // If deletion failed, refresh to restore the photo
        router.refresh();
        alert(result.error || "Failed to delete photo");
      } else {
        // Refresh to sync with server
        router.refresh();
      }
    } catch (error) {
      console.error("Delete error:", error);
      // Restore photo on error
      router.refresh();
      alert("An error occurred while deleting the photo");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 font-sans selection:bg-indigo-500/30">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="font-serif text-2xl text-white tracking-wider">
              SGU
            </h1>
            <span className="text-[10px] text-neutral-500 uppercase tracking-[0.2em]">
              Travel Portfolio
            </span>
          </div>

          <button
            onClick={() => setActiveModal("add")}
            className="group flex items-center gap-2 text-sm font-medium text-neutral-400 hover:text-white transition-colors"
          >
            <span>Add Photo</span>
            <div className="bg-neutral-800 p-1.5 rounded-full group-hover:bg-neutral-700 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </div>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Intro */}
        <div className="mb-16 max-w-2xl">
          <h2 className="text-4xl sm:text-5xl font-serif text-white mb-6 leading-tight">
            📸
            <br /> <span className="text-neutral-600">my life in photos</span>
          </h2>
          <p className="text-neutral-400 leading-relaxed">
            I&apos;m learning how to take photos so I can capture the best
            moments in my life. Below are some of my favorite shots, taken on my
            Fujifilm XT50.
          </p>
        </div>

        {/* Gallery Grid - Using CSS Columns for Masonry effect */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
          {photos.map((photo) => {
            console.log("Rendering photo:", photo.id, photo.url);
            return (
              <div
                key={photo.id}
                className="break-inside-avoid group cursor-pointer mb-8"
                onClick={() => handlePhotoClick(photo)}
              >
                <div className="relative overflow-hidden bg-neutral-900 rounded-sm w-full">
                  <Image
                    src={photo.url}
                    alt={photo.title}
                    width={800}
                    height={600}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                    onError={(e) => {
                      console.error("Image load error:", photo.url, e);
                    }}
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 pointer-events-none">
                    <h3 className="font-serif text-lg text-white translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      {photo.title}
                    </h3>
                    <p className="text-xs text-neutral-400 uppercase tracking-wider mt-1 translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                      {photo.location}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-20 border-t border-neutral-900 pt-8 flex justify-between items-center text-neutral-600 text-sm">
          <p>© {new Date().getFullYear()} SGU Portfolio.</p>
        </div>
      </main>

      {/* Modals */}
      <AddPhotoModal
        isOpen={activeModal === "add"}
        onClose={closeModal}
        onAdd={handleAddPhoto}
      />
      <PhotoModal
        photo={selectedPhoto}
        isOpen={activeModal === "view"}
        onClose={closeModal}
        onDelete={handleDeletePhoto}
      />
    </div>
  );
}
