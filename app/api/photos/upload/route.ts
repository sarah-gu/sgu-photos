import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const location = formData.get("location") as string;
    const description = formData.get("description") as string;
    const camera = formData.get("camera") as string;
    const lens = formData.get("lens") as string;
    const aperture = formData.get("aperture") as string;
    const shutterSpeed = formData.get("shutterSpeed") as string;
    const iso = formData.get("iso") as string;
    const aspectRatio = formData.get("aspectRatio") as
      | "landscape"
      | "portrait"
      | "square"
      | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    // Upload to Vercel Blob
    const blob = await put(file.name, file, {
      access: "public",
      addRandomSuffix: true,
    });

    // Prepare technical details
    const technicalDetails: Record<string, any> = {};
    if (camera) technicalDetails.camera = camera;
    if (lens) technicalDetails.lens = lens;
    if (aperture) technicalDetails.aperture = aperture;
    if (shutterSpeed) technicalDetails.shutterSpeed = shutterSpeed;
    if (iso) technicalDetails.iso = iso;
    if (aspectRatio) technicalDetails.aspectRatio = aspectRatio;

    // Save to database
    const photo = await prisma.photo.create({
      data: {
        imageUrl: blob.url,
        title: title || "Untitled",
        location: location || "Unknown",
        description: description || "",
        technicalDetails: technicalDetails as any,
      },
    });

    // Revalidate the home page
    revalidatePath("/");

    return NextResponse.json({
      success: true,
      photo: {
        id: photo.id,
        url: photo.imageUrl,
        title: photo.title,
        location: photo.location,
        description: photo.description,
        technicalDetails: photo.technicalDetails,
      },
    });
  } catch (error) {
    console.error("Error uploading photo:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to upload photo",
      },
      { status: 500 }
    );
  }
}
