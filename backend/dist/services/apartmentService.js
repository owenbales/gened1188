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
exports.searchApartments = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const companyLocationService_1 = require("./companyLocationService");
// Load environment variables
dotenv_1.default.config();
// API Keys should be stored in environment variables
const RENTCAST_API_KEY = process.env.RENTCAST_API_KEY;
const RENT_API_KEY = process.env.RENT_API_KEY;
const HOTPADS_API_KEY = process.env.HOTPADS_API_KEY;
// Debug logging
console.log('Environment variables loaded:');
console.log('RENTCAST_API_KEY exists:', !!RENTCAST_API_KEY);
console.log('RENT_API_KEY exists:', !!RENT_API_KEY);
console.log('HOTPADS_API_KEY exists:', !!HOTPADS_API_KEY);
// Mock data for fallback
const mockApartments = [
    {
        id: '1',
        title: 'Modern Studio Apartment',
        price: 1200,
        location: '123 Tech Street, San Francisco',
        distance: '0.5 miles',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
        amenities: ['WiFi', 'Parking', 'Gym'],
        url: 'https://example.com/listing1'
    },
    {
        id: '2',
        title: 'Cozy 1-Bedroom',
        price: 1500,
        location: '456 Innovation Ave, San Francisco',
        distance: '1.2 miles',
        rating: 4.5,
        image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
        amenities: ['WiFi', 'Washer/Dryer', 'Pet Friendly'],
        url: 'https://example.com/listing2'
    }
];
// Helper to map RentCast features to user-friendly amenities
function mapFeaturesToAmenities(features) {
    if (!features)
        return [];
    const amenities = [];
    if (features.cooling)
        amenities.push('Air Conditioning');
    if (features.pool)
        amenities.push('Pool');
    if (features.garage)
        amenities.push('Garage');
    if (features.fireplace)
        amenities.push('Fireplace');
    if (features.heating)
        amenities.push('Heating');
    if (features.laundry)
        amenities.push('Washer/Dryer');
    if (features.furnished)
        amenities.push('Furnished');
    // Add more mappings as needed
    return amenities;
}
function fetchPropertyFeatures(address) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get('https://api.rentcast.io/v1/properties', {
                params: { address },
                headers: {
                    'X-Api-Key': RENTCAST_API_KEY,
                    'Accept': 'application/json'
                }
            });
            if (Array.isArray(response.data) && response.data.length > 0) {
                return response.data[0].features || {};
            }
            return {};
        }
        catch (error) {
            console.error('Error fetching property features for', address, error);
            return {};
        }
    });
}
function searchRentCast(params) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        if (!RENTCAST_API_KEY) {
            console.warn('RentCast API key not found');
            return [];
        }
        try {
            // First, try to find the company's office location
            console.log('Finding office location for:', params.company, params.location);
            const officeLocation = yield (0, companyLocationService_1.findCompanyOffice)(params.company, params.location);
            if (!officeLocation) {
                console.warn('Could not find office location');
            }
            else {
                console.log('Found office location:', officeLocation);
            }
            // Parse location into city and state
            const [city, state] = params.location.split(',').map((part) => part.trim());
            // Parse bedrooms from roomType
            let bedrooms = 0;
            if (params.roomType === 'studio') {
                bedrooms = 0;
            }
            else {
                const match = params.roomType.match(/\d+/);
                bedrooms = match ? parseInt(match[0]) : 1;
            }
            // Format the date for the API
            const startDate = new Date(params.startDate);
            const formattedStartDate = startDate.toISOString().split('T')[0];
            console.log('Sending request to RentCast with params:', {
                city,
                state,
                bedrooms,
                maxRent: params.maxPrice,
                availableBy: formattedStartDate
            });
            const response = yield axios_1.default.get('https://api.rentcast.io/v1/listings/rental/long-term', {
                params: {
                    city: city,
                    state: state,
                    maxRent: params.maxPrice,
                    bedrooms: bedrooms,
                    limit: 50,
                    propertyType: 'Apartment',
                    status: 'Active',
                    availableBy: formattedStartDate,
                    sortBy: 'available_date'
                },
                headers: {
                    'X-Api-Key': RENTCAST_API_KEY,
                    'Accept': 'application/json'
                }
            });
            console.log('RentCast response:', response.data);
            // Check if response.data is an array directly
            const listings = Array.isArray(response.data) ? response.data : [];
            if (listings.length === 0) {
                console.warn('No listings found in RentCast response');
                return [];
            }
            // Filter listings by price
            const filteredListings = listings.filter(listing => listing.price <= params.maxPrice);
            // Process listings without making additional API calls
            const processedListings = filteredListings.map((listing) => {
                var _a, _b;
                let distance = 'Unknown from office';
                if (officeLocation && listing.latitude && listing.longitude) {
                    const distanceMiles = calculateDistance(officeLocation.latitude, officeLocation.longitude, listing.latitude, listing.longitude);
                    if (distanceMiles <= params.maxDistance) {
                        distance = `${distanceMiles.toFixed(1)} miles from ${officeLocation.address}`;
                    }
                    else {
                        distance = `${distanceMiles.toFixed(1)} miles (exceeds max distance) from ${officeLocation.address}`;
                    }
                }
                // Map features directly from the listing data
                const amenities = mapFeaturesToAmenities(listing.features || {});
                return {
                    id: `rentcast-${listing.id || listing.propertyId || listing.formattedAddress}`,
                    title: `${listing.bedrooms} Bedroom ${listing.propertyType || 'Apartment'}`,
                    price: listing.price || listing.rent || listing.listPrice,
                    location: listing.formattedAddress || `${listing.addressLine1 || ''}, ${listing.city || ''}, ${listing.state || ''}`,
                    distance,
                    rating: 4.0,
                    image: ((_a = listing.photoUrls) === null || _a === void 0 ? void 0 : _a[0]) || ((_b = listing.photos) === null || _b === void 0 ? void 0 : _b[0]) || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
                    amenities,
                    url: `https://app.rentcast.io/app?address=${encodeURIComponent(listing.formattedAddress)}&type=single-family`
                };
            });
            // Filter by max distance if we have office location
            const distanceFilteredListings = officeLocation
                ? processedListings.filter(listing => {
                    if (listing.distance.includes('miles from')) {
                        const miles = parseFloat(listing.distance);
                        return !isNaN(miles) && miles <= params.maxDistance;
                    }
                    return true;
                })
                : processedListings;
            // Sort by distance if available, then by price
            return distanceFilteredListings.sort((a, b) => {
                const distanceA = parseFloat(a.distance);
                const distanceB = parseFloat(b.distance);
                if (!isNaN(distanceA) && !isNaN(distanceB)) {
                    return distanceA - distanceB;
                }
                return a.price - b.price;
            });
        }
        catch (error) {
            console.error('Error fetching from RentCast:', error);
            if (axios_1.default.isAxiosError(error)) {
                console.error('RentCast API error details:', {
                    status: (_a = error.response) === null || _a === void 0 ? void 0 : _a.status,
                    data: (_b = error.response) === null || _b === void 0 ? void 0 : _b.data
                });
            }
            return [];
        }
    });
}
// Helper function to calculate distance between two points using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 3959; // Earth's radius in miles
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
function toRad(degrees) {
    return degrees * (Math.PI / 180);
}
function searchRent(params) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get('https://api.rent.com/api/v1/listings', {
                params: {
                    location: params.location,
                    maxPrice: params.maxPrice,
                    bedrooms: params.roomType === 'studio' ? 0 : parseInt(params.roomType),
                    limit: 50,
                    apiKey: RENT_API_KEY
                }
            });
            return response.data.listings.map((listing) => ({
                id: `rent-${listing.id}`,
                title: listing.title,
                price: listing.price,
                location: listing.address,
                distance: 'Unknown',
                rating: listing.rating || 4.0,
                image: listing.images[0] || '',
                amenities: listing.amenities || [],
                url: listing.url
            }));
        }
        catch (error) {
            console.error('Error searching Rent.com:', error);
            return [];
        }
    });
}
function searchHotPads(params) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get('https://api.hotpads.com/v1/listings', {
                params: {
                    location: params.location,
                    maxPrice: params.maxPrice,
                    bedrooms: params.roomType === 'studio' ? 0 : parseInt(params.roomType),
                    limit: 50,
                    apiKey: HOTPADS_API_KEY
                }
            });
            return response.data.listings.map((listing) => ({
                id: `hotpads-${listing.id}`,
                title: listing.title,
                price: listing.price,
                location: listing.address,
                distance: 'Unknown',
                rating: listing.rating || 4.0,
                image: listing.images[0] || '',
                amenities: listing.amenities || [],
                url: listing.url
            }));
        }
        catch (error) {
            console.error('Error searching HotPads:', error);
            return [];
        }
    });
}
function searchApartments(params, recommendedIds = []) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Try to get real data from RentCast first
            const rentcastResults = yield searchRentCast(params);
            // Log the number of results for debugging
            console.log(`Found ${rentcastResults.length} results from RentCast`);
            // Always return what we got from RentCast, fall back to mock data only if there's an error
            // or if rentcastResults is explicitly empty
            if (rentcastResults && Array.isArray(rentcastResults)) {
                // Sort the results to put ChatGPT-recommended apartments first
                return rentcastResults.sort((a, b) => {
                    // If one is recommended and the other isn't, put the recommended one first
                    const aIsRecommended = recommendedIds.includes(a.id);
                    const bIsRecommended = recommendedIds.includes(b.id);
                    if (aIsRecommended && !bIsRecommended)
                        return -1;
                    if (!aIsRecommended && bIsRecommended)
                        return 1;
                    // If both are recommended or both are not, maintain the original sorting
                    const distanceA = parseFloat(a.distance);
                    const distanceB = parseFloat(b.distance);
                    if (!isNaN(distanceA) && !isNaN(distanceB)) {
                        return distanceA - distanceB;
                    }
                    return a.price - b.price;
                });
            }
            // If we reach here, something went wrong with the RentCast results
            console.log('Falling back to mock data');
            return mockApartments;
        }
        catch (error) {
            console.error('Error in searchApartments:', error);
            return mockApartments;
        }
    });
}
exports.searchApartments = searchApartments;
