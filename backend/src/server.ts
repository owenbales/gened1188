import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { searchApartments } from './services/apartmentService';
import { getChatGPTRecommendations } from './services/chatgptService';

dotenv.config();

// Check required environment variables
const requiredEnvVars = ['RENTCAST_API_KEY', 'OPENAI_API_KEY', 'OPENCAGE_API_KEY'];
requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    console.warn(`Warning: ${varName} is not set in environment variables`);
  }
});

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Search endpoint
app.post('/api/search', async (req, res) => {
  try {
    const {
      company,
      location,
      startDate,
      endDate,
      maxPrice,
      maxDistance,
      roomType,
      amenities,
      preferences,
      safetyPreference,
      cleanlinessPreference,
      recommendedIds
    } = req.body;

    const results = await searchApartments({
      company,
      location,
      startDate,
      endDate,
      maxPrice,
      maxDistance,
      roomType,
      amenities,
      preferences,
      safetyPreference,
      cleanlinessPreference
    }, recommendedIds || []);

    res.json(results);
  } catch (error) {
    console.error('Error searching apartments:', error);
    res.status(500).json({ error: 'Failed to search apartments' });
  }
});

// ChatGPT recommendations endpoint
app.post('/api/chatgpt/recommendations', async (req, res) => {
  try {
    const { apartments, searchParams } = req.body;
    const recommendedIds = await getChatGPTRecommendations(apartments, searchParams);
    res.json({ recommendedIds });
  } catch (error) {
    console.error('Error getting ChatGPT recommendations:', error);
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 