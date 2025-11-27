"use client";

import React from "react";
import Image from "next/image";
import { Photo } from "../types";

interface PhotoModalProps {
  photo: Photo | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (photoId: string) => void;
}

export default function PhotoModal({
  photo,
  isOpen,
  onClose,
  onDelete,
}: PhotoModalProps) {
  if (!isOpen || !photo) return null;

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this photo?")) {
      onDelete(photo.id);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-md"
      onClick={onClose}
    >
      {/* Modal Container */}
      <div
        className="relative w-full h-full flex flex-col max-w-7xl mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Right Controls */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-3">
          {/* Delete Button */}
          <button
            onClick={handleDelete}
            className="text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full p-2.5 border border-white/10"
            title="Delete photo"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6h18"></path>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full p-2.5 border border-white/10"
            title="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Image Section */}
        <div className="relative flex-1 min-h-0 bg-neutral-950/50 backdrop-blur-sm">
          <Image
            src={photo.url}
            alt={photo.title}
            fill
            className="object-contain"
            sizes="100vw"
            priority
          />
        </div>

        {/* Description Section Below Image */}
        <div className="bg-black border-t border-white/10">
          <div className="max-w-4xl mx-auto px-6 py-4 space-y-2">
            {/* Title and Location */}
            <div>
              <h2 className="font-serif text-xl text-white mb-0.5">
                {photo.title}
              </h2>
              <p className="text-xs text-white/60 uppercase tracking-wider">
                {photo.location}
              </p>
            </div>

            {/* Description */}
            <p className="text-sm text-white/80 leading-relaxed">
              {photo.description}
            </p>

            {/* Technical Details - Compact Horizontal Layout */}
            {photo.technicalDetails &&
              Object.keys(photo.technicalDetails).length > 0 && (
                <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-white/60">
                  {photo.technicalDetails.camera && (
                    <span>
                      <span className="uppercase tracking-wider">Camera:</span>{" "}
                      <span className="text-white/80">
                        {photo.technicalDetails.camera}
                      </span>
                    </span>
                  )}
                  {photo.technicalDetails.lens && (
                    <span>
                      <span className="uppercase tracking-wider">Lens:</span>{" "}
                      <span className="text-white/80">
                        {photo.technicalDetails.lens}
                      </span>
                    </span>
                  )}
                  {photo.technicalDetails.aperture && (
                    <span>
                      <span className="uppercase tracking-wider">f/</span>
                      <span className="text-white/80">
                        {photo.technicalDetails.aperture.replace("f/", "")}
                      </span>
                    </span>
                  )}
                  {photo.technicalDetails.shutterSpeed && (
                    <span>
                      <span className="text-white/80">
                        {photo.technicalDetails.shutterSpeed}
                      </span>
                    </span>
                  )}
                  {photo.technicalDetails.iso && (
                    <span>
                      <span className="uppercase tracking-wider">ISO</span>{" "}
                      <span className="text-white/80">
                        {photo.technicalDetails.iso}
                      </span>
                    </span>
                  )}
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
