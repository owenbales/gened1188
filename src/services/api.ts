import axios from 'axios';

const API_URL = 'https://gened1188.onrender.com/api';

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
  recommendedIds?: string[];
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

export async function searchApartments(params: SearchParams): Promise<ApartmentListing[]> {
  try {
    const response = await axios.post(`${API_URL}/search`, params);
    return response.data;
  } catch (error) {
    console.error('Error searching apartments:', error);
    throw error;
  }
} 