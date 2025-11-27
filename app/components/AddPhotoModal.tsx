"use client";

import React, { useState, useRef } from "react";
import { Photo } from "../types";

interface AddPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (photo: Photo) => void;
}

export default function AddPhotoModal({
  isOpen,
  onClose,
  onAdd,
}: AddPhotoModalProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploading(true);

    const formData = new FormData(e.currentTarget);
    const file = fileInputRef.current?.files?.[0];

    if (!file) {
      alert("Please select an image file");
      setIsUploading(false);
      return;
    }

    formData.append("file", file);

    try {
      const response = await fetch("/api/photos/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      console.log("Successfully uploaded the photo,", result);
      if (result.success && result.photo) {
        // Call onAdd with the complete photo object including ID
        onAdd({
          id: result.photo.id,
          url: result.photo.url,
          title: result.photo.title,
          location: result.photo.location,
          description: result.photo.description,
          technicalDetails: result.photo.technicalDetails,
        });
        // Reset form
        formRef.current?.reset();
        setPreview(null);
        onClose();
      } else {
        alert(result.error || "Failed to upload photo");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("An error occurred while uploading the photo");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl mx-4 bg-neutral-900 rounded-lg border border-neutral-800 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors z-10"
          disabled={isUploading}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
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

        {/* Header */}
        <div className="p-6 border-b border-neutral-800">
          <h2 className="font-serif text-2xl text-white">Add New Photo</h2>
          <p className="text-sm text-neutral-400 mt-1">
            Upload an image and add details about your photo
          </p>
        </div>

        {/* Form */}
        <form ref={formRef} onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Image *
            </label>
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required
                disabled={isUploading}
                className="block w-full text-sm text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-neutral-800 file:text-neutral-300 hover:file:bg-neutral-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              />
              {preview && (
                <div className="relative w-full h-64 bg-neutral-800 rounded-md overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                required
                disabled={isUploading}
                className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
                placeholder="Photo title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Location *
              </label>
              <input
                type="text"
                name="location"
                required
                disabled={isUploading}
                className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
                placeholder="Location"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              required
              disabled={isUploading}
              rows={3}
              className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 resize-none"
              placeholder="Describe your photo..."
            />
          </div>

          {/* Technical Details */}
          <div className="border-t border-neutral-800 pt-6">
            <h3 className="text-sm font-medium text-neutral-300 mb-4">
              Technical Details (Optional)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-2">
                  Camera
                </label>
                <input
                  type="text"
                  name="camera"
                  disabled={isUploading}
                  className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-white text-sm placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
                  placeholder="e.g., Sony A7R IV"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-2">
                  Lens
                </label>
                <input
                  type="text"
                  name="lens"
                  disabled={isUploading}
                  className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-white text-sm placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
                  placeholder="e.g., FE 24-70mm GM"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-2">
                  Aperture
                </label>
                <input
                  type="text"
                  name="aperture"
                  disabled={isUploading}
                  className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-white text-sm placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
                  placeholder="e.g., f/8"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-2">
                  Shutter Speed
                </label>
                <input
                  type="text"
                  name="shutterSpeed"
                  disabled={isUploading}
                  className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-white text-sm placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
                  placeholder="e.g., 1/60"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-2">
                  ISO
                </label>
                <input
                  type="text"
                  name="iso"
                  disabled={isUploading}
                  className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-white text-sm placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
                  placeholder="e.g., 100"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-2">
                  Aspect Ratio
                </label>
                <select
                  name="aspectRatio"
                  disabled={isUploading}
                  className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
                >
                  <option value="">Select...</option>
                  <option value="landscape">Landscape</option>
                  <option value="portrait">Portrait</option>
                  <option value="square">Square</option>
                </select>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isUploading}
              className="px-4 py-2 text-sm font-medium text-neutral-400 hover:text-white transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="px-6 py-2 text-sm font-medium bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? "Uploading..." : "Upload Photo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
