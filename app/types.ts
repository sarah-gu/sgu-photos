export interface Photo {
  id: string;
  url: string;
  title: string;
  location: string;
  description: string;
  technicalDetails?: TechnicalDetails;
}

export interface TechnicalDetails {
  camera?: string;
  lens?: string;
  aperture?: string;
  shutterSpeed?: string;
  iso?: string;
  aspectRatio?: "square" | "portrait" | "landscape";
}
