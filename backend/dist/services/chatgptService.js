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
exports.getChatGPTRecommendations = void 0;
const openai_1 = __importDefault(require("openai"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
function getChatGPTRecommendations(apartments, searchParams) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('Starting ChatGPT recommendations with:', {
                apartmentsCount: apartments.length,
                searchParams
            });
            // Create a prompt for ChatGPT
            const prompt = `Given the following apartment listings and user preferences, recommend the top 3 apartments that best match the user's criteria. Consider the following factors:
    - User's desired amenities: ${searchParams.amenities.join(', ')}
    - User's additional preferences: ${searchParams.preferences.join(', ')}
    - Safety preference: ${searchParams.safetyPreference}
    - Cleanliness preference: ${searchParams.cleanlinessPreference}
    - Price range: Up to $${searchParams.maxPrice}
    - Distance preference: Up to ${searchParams.maxDistance} miles
    - Room type: ${searchParams.roomType}

    Here are the available apartments:
    ${apartments.map(apt => `
    ID: ${apt.id}
    Title: ${apt.title}
    Price: $${apt.price}/mo
    Location: ${apt.location}
    Distance: ${apt.distance}
    Rating: ${apt.rating}
    Amenities: ${apt.amenities.length > 0 ? apt.amenities.join(', ') : 'N/A'}
    `).join('\n')}

    If amenities are missing or N/A, use your general knowledge AND SEARCH THE WEB about these apartment buildings AND those in the area and the address/building type to infer likely amenities. If you cannot infer, recommend based on the other available criteria.
    
    IMPORTANT: Please analyze these apartments and return ONLY the IDs of the top 3 apartments that best match the user's preferences. Format your response exactly like this:
    ID: <id1>
    ID: <id2>
    ID: <id3>
    
    Do not include any other text or explanation. Just the IDs in the format shown above.`;
            console.log('Sending prompt to ChatGPT:', prompt);
            const response = yield openai.chat.completions.create({
                model: "gpt-4",
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful assistant that analyzes apartment listings and recommends the best matches based on user preferences. Return only the IDs of the recommended apartments in the exact format specified."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 150
            });
            const content = ((_b = (_a = response.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content) || '';
            console.log('Raw ChatGPT response:', content);
            // More flexible ID extraction
            const recommendedIds = content
                .split('\n')
                .map((line) => line.trim())
                .filter((line) => line.length > 0)
                .map((line) => {
                // Try to extract ID from different possible formats
                if (line.startsWith('ID: ')) {
                    return line.replace('ID: ', '');
                }
                if (line.match(/^[A-Za-z0-9-]+$/)) {
                    return line;
                }
                return null;
            })
                .filter((id) => id !== null);
            console.log('Extracted recommended IDs:', recommendedIds);
            if (recommendedIds.length === 0) {
                console.warn('No valid IDs found in ChatGPT response. Raw response:', content);
            }
            return recommendedIds;
        }
        catch (error) {
            console.error('Error getting ChatGPT recommendations:', error);
            if (error instanceof Error) {
                console.error('Error details:', {
                    message: error.message,
                    stack: error.stack
                });
            }
            return [];
        }
    });
}
exports.getChatGPTRecommendations = getChatGPTRecommendations;
