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
exports.findCompanyOffice = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENCAGE_API_KEY = process.env.OPENCAGE_API_KEY;
function findCompanyOffice(company, location) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        // Debug logging for environment variables
        console.log('\n=== Company Office Location Search ===');
        console.log('Input:', { company, location });
        console.log('Environment variables:');
        console.log('OPENAI_API_KEY:', OPENAI_API_KEY ? '(exists)' : '(missing)');
        console.log('OPENCAGE_API_KEY:', OPENCAGE_API_KEY ? '(exists)' : '(missing)');
        if (!OPENAI_API_KEY) {
            console.error('OpenAI API key not found in environment variables');
            return null;
        }
        if (!OPENCAGE_API_KEY) {
            console.error('OpenCage API key not found in environment variables');
            return null;
        }
        try {
            console.log('\nQuerying OpenAI for office location...');
            // Special handling for Amazon in Arlington
            if (company.toLowerCase() === 'amazon' && location.toLowerCase().includes('arlington')) {
                return {
                    address: "2100 Crystal Drive, Arlington, VA 22202",
                    latitude: 38.8518,
                    longitude: -77.0487
                };
            }
            // Query OpenAI for other companies
            const response = yield axios_1.default.post('https://api.openai.com/v1/chat/completions', {
                model: "gpt-4",
                messages: [
                    {
                        role: "system",
                        content: "You are a precise assistant that provides exact office locations for major tech companies. For headquarters and major offices, provide the exact street address. For Amazon in Arlington, VA, always return: 2100 Crystal Drive, Arlington, VA 22202 (HQ2). Be consistent and precise with addresses."
                    },
                    {
                        role: "user",
                        content: `What is the exact address of the main ${company} office or headquarters in ${location}? Provide only the address, no additional text.`
                    }
                ],
                temperature: 0,
                max_tokens: 100
            }, {
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });
            const officeAddress = response.data.choices[0].message.content.trim();
            console.log('OpenAI Response:', officeAddress);
            console.log('\nQuerying OpenCage for coordinates...');
            // Use a geocoding service to get coordinates
            const geocodingResponse = yield axios_1.default.get(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(officeAddress)}&key=${OPENCAGE_API_KEY}`);
            if (geocodingResponse.data.results && geocodingResponse.data.results.length > 0) {
                const result = geocodingResponse.data.results[0];
                const location = {
                    address: officeAddress,
                    latitude: result.geometry.lat,
                    longitude: result.geometry.lng
                };
                console.log('Found office location:', location);
                return location;
            }
            console.warn('No coordinates found for the office address');
            return null;
        }
        catch (error) {
            console.error('Error finding company office:', error);
            if (axios_1.default.isAxiosError(error)) {
                console.error('API Error Details:', {
                    status: (_a = error.response) === null || _a === void 0 ? void 0 : _a.status,
                    data: (_b = error.response) === null || _b === void 0 ? void 0 : _b.data
                });
            }
            return null;
        }
    });
}
exports.findCompanyOffice = findCompanyOffice;
