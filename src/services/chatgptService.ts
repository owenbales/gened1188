import { ApartmentListing, SearchParams } from './api';

// Set your Render API base URL here
const API_BASE_URL = 'https://gened1188.onrender.com';

export async function getChatGPTRecommendations(
  apartments: ApartmentListing[],
  searchParams: SearchParams
): Promise<string[]> {
  try {
    console.log('Sending request to ChatGPT service with:', {
      apartments: apartments.length,
      searchParams
    });

    const response = await fetch(`${API_BASE_URL}/api/chatgpt/recommendations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        apartments,
        searchParams,
      }),
    });

    if (!response.ok) {
      console.error('ChatGPT service responded with error:', response.status);
      throw new Error('Failed to get ChatGPT recommendations');
    }

    const data = await response.json();
    console.log('Received recommendations from ChatGPT:', data.recommendedIds);
    return data.recommendedIds;
  } catch (error) {
    console.error('Error getting ChatGPT recommendations:', error);
    return [];
  }
} 