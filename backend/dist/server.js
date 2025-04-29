"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const apartmentService_1 = require("./services/apartmentService");
const chatgptService_1 = require("./services/chatgptService");
dotenv_1.default.config();
// Check required environment variables
const requiredEnvVars = ['RENTCAST_API_KEY', 'OPENAI_API_KEY', 'OPENCAGE_API_KEY'];
requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
        console.warn(`Warning: ${varName} is not set in environment variables`);
    }
});
const app = (0, express_1.default)();
const port = process.env.PORT || 5001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Search endpoint
app.post('/api/search', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { company, location, startDate, endDate, maxPrice, maxDistance, roomType, amenities, preferences, safetyPreference, cleanlinessPreference, recommendedIds } = req.body;
        const results = yield (0, apartmentService_1.searchApartments)({
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
    }
    catch (error) {
        console.error('Error searching apartments:', error);
        res.status(500).json({ error: 'Failed to search apartments' });
    }
}));
// ChatGPT recommendations endpoint
app.post('/api/chatgpt/recommendations', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { apartments, searchParams } = req.body;
        const recommendedIds = yield (0, chatgptService_1.getChatGPTRecommendations)(apartments, searchParams);
        res.json({ recommendedIds });
    }
    catch (error) {
        console.error('Error getting ChatGPT recommendations:', error);
        res.status(500).json({ error: 'Failed to get recommendations' });
    }
}));
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
