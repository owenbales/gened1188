import { ApartmentListing, SearchParams } from './api';

export async function getChatGPTRecommendations(
  apartments: ApartmentListing[],
  searchParams: SearchParams
): Promise<string[]> {
  try {
    console.log('Sending request to ChatGPT service with:', {
      apartments: apartments.length,
      searchParams
    });

    const response = await fetch('http://localhost:5001/api/chatgpt/recommendations', {
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