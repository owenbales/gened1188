export interface SearchParams {
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  maxPrice: number;
  maxDistance: number;
  roomType: string;
  amenities: string[];
  preferences: string[];
  safetyPreference: string;
  cleanlinessPreference: string;
}

export interface ApartmentListing {
  id: string;
  title: string;
  price: number;
  location: string;
  distance: string;
  rating: number;
  image: string;
  amenities: string[];
  url: string;
} 