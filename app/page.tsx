import { prisma } from "./lib/prisma";
import PhotoGallery from "./components/PhotoGallery";
import { Photo } from "./types";

// Force dynamic rendering to prevent caching
export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getPhotos(): Promise<Photo[]> {
  try {
    const photos = await prisma.photo.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    // Map database photos to Photo type
    return photos.map((photo) => ({
      id: photo.id,
      url: photo.imageUrl, // Map imageUrl to url
      title: photo.title,
      location: photo.location,
      description: photo.description,
      technicalDetails: photo.technicalDetails as Photo["technicalDetails"],
    }));
  } catch (error) {
    console.error("Error fetching photos:", error);
    // Return empty array if there's an error (e.g., database not set up yet)
    return [];
  }
}

export default async function Home() {
  const photos = await getPhotos();

  return <PhotoGallery initialPhotos={photos} />;
}
