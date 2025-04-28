import React, { useState } from 'react';
import { createBrowserRouter, RouterProvider, Outlet, Link } from 'react-router-dom';
import { searchApartments, SearchParams, ApartmentListing } from './services/api';
import { getChatGPTRecommendations } from './services/chatgptService';
import About from './pages/About';
import Contact from './pages/Contact';
import ErrorBoundary from './components/ErrorBoundary';

const locations = [
  { value: 'Arlington, VA', label: 'Arlington, VA (HQ2)' },
  { value: 'Seattle, WA', label: 'Seattle, WA' },
  { value: 'New York City, New York', label: 'New York City, NY' }
];

// Header component
const Header = () => (
  <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
    <div className="container mx-auto px-6 py-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Link to="/" className="flex items-center space-x-3">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <h1 className="text-2xl font-bold">Intern Housing Finder</h1>
          </Link>
        </div>
        
        <nav>
          <ul className="flex space-x-6">
            <li><Link to="/about" className="hover:text-blue-200 transition-colors">About</Link></li>
            <li><Link to="/contact" className="hover:text-blue-200 transition-colors">Contact</Link></li>
          </ul>
        </nav>
      </div>
    </div>
  </header>
);

// Footer component
const Footer = () => (
  <footer className="bg-gray-900 text-white mt-16">
    <div className="container mx-auto px-6 py-8">
      <div className="text-center text-gray-400">
        <p>&copy; {new Date().getFullYear()} Intern Housing Finder. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

// Layout component
const Layout = () => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <div className="flex-grow">
      <Outlet />
    </div>
    <Footer />
  </div>
);

// Benefits Section Component
const BenefitsSection = () => (
  <section className="py-16 bg-gray-50">
    <div className="container mx-auto px-6">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-blue-600 mb-4">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Affordable Housing</h3>
          <p className="text-gray-600">
            Find housing options that fit your budget with our comprehensive search filters and price comparisons.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-blue-600 mb-4">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Prime Locations</h3>
          <p className="text-gray-600">
            Discover housing near Amazon offices, with easy access to transportation and local amenities.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-blue-600 mb-4">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Verified Listings</h3>
          <p className="text-gray-600">
            All listings are verified and vetted to ensure a safe and reliable housing experience.
          </p>
        </div>
      </div>
    </div>
  </section>
);

// Main content component
const MainContent = () => {
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState<ApartmentListing[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendedApartments, setRecommendedApartments] = useState<string[]>([]);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data: SearchParams = {
      company: 'Amazon',
      location: formData.get('location') as string,
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string,
      maxPrice: Number(formData.get('maxPrice')),
      maxDistance: Number(formData.get('maxDistance')),
      roomType: formData.get('roomType') as string || '',
      amenities: formData.getAll('amenities') as string[],
      preferences: formData.getAll('preferences') as string[],
      safetyPreference: formData.get('safetyPreference') as string,
      cleanlinessPreference: formData.get('cleanlinessPreference') as string
    };

    try {
      // 1. Search for apartments first
      const results = await searchApartments(data);
      if (!Array.isArray(results)) {
        throw new Error('Invalid response format from server');
      }

      // 2. Get ChatGPT recommendations using the results
      const recommendedIds = await getChatGPTRecommendations(results, data);
      setRecommendedApartments(recommendedIds);

      // 3. Sort results so recommended apartments appear first
      const sortedResults = [...results].sort((a, b) => {
        const aIsRecommended = recommendedIds.includes(a.id);
        const bIsRecommended = recommendedIds.includes(b.id);
        if (aIsRecommended && !bIsRecommended) return -1;
        if (!aIsRecommended && bIsRecommended) return 1;
        return 0;
      });

      setSearchResults(sortedResults);
      setShowResults(true);

      if (sortedResults.length === 0) {
        setError('No housing options found matching your criteria. Try adjusting your search parameters.');
      }
    } catch (error) {
      setError('Failed to fetch housing options. Please try again.');
      console.error('Error:', error);
      setShowResults(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-700 to-blue-800 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">Find Your Perfect Amazon Intern Housing</h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Enter your internship details and we'll find the best housing options near Amazon offices
          </p>
        </div>
      </section>
      
      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 -mt-8 relative z-10">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Submit Your Internship Details</h2>
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company</label>
                  <input
                    type="text"
                    name="company"
                    value="Amazon"
                    disabled
                    className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <select
                    name="location"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    {locations.map(loc => (
                      <option key={loc.value} value={loc.value}>{loc.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Max Price</label>
                  <input
                    type="number"
                    name="maxPrice"
                    required
                    min="0"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Max Distance (miles)</label>
                  <input
                    type="number"
                    name="maxDistance"
                    required
                    min="0"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* New form fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Safety Preference</label>
                  <select
                    name="safetyPreference"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="any">Any</option>
                    <option value="very_safe">Very Safe</option>
                    <option value="safe">Safe</option>
                    <option value="moderate">Moderate</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Cleanliness Preference</label>
                  <select
                    name="cleanlinessPreference"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="any">Any</option>
                    <option value="very_clean">Very Clean</option>
                    <option value="clean">Clean</option>
                    <option value="moderate">Moderate</option>
                  </select>
                </div>
              </div>

              {/* Amenities */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Desired Amenities</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {['WiFi', 'Parking', 'Gym', 'Pool', 'Washer/Dryer', 'Air Conditioning', 'Furnished', 'Pet Friendly'].map((amenity) => (
                    <label key={amenity} className="flex items-center space-x-2 p-2 bg-gray-50 rounded border border-gray-200 hover:bg-gray-100 transition-colors">
                      <input
                        type="checkbox"
                        name="amenities"
                        value={amenity}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
                      />
                      <span className="text-sm text-gray-700">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Preferences */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Preferences</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {['Quiet Area', 'Near Public Transport', 'Near Restaurants', 'Near Shopping', 'Near Parks'].map((preference) => (
                    <label key={preference} className="flex items-center space-x-2 p-2 bg-gray-50 rounded border border-gray-200 hover:bg-gray-100 transition-colors">
                      <input
                        type="checkbox"
                        name="preferences"
                        value={preference}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
                      />
                      <span className="text-sm text-gray-700">{preference}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="mt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {isLoading ? 'Searching...' : 'Search Apartments'}
                </button>
              </div>
            </form>
          </div>
          
          {/* Results Section */}
          {showResults && !isLoading && (
            <div className="mt-12">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6">
                {searchResults.length === 0 ? 'No Results Found' : 'Available Housing Options'}
              </h3>
              
              {searchResults.length === 0 ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                  <svg className="w-12 h-12 text-yellow-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">No Housing Options Found</h4>
                  <p className="text-gray-600 mb-4">
                    We couldn't find any housing options matching your criteria. Try adjusting your:
                  </p>
                  <ul className="text-gray-600 space-y-1 mb-4">
                    <li>• Price range</li>
                    <li>• Distance from office</li>
                    <li>• Date range</li>
                  </ul>
                  <button 
                    onClick={() => setShowResults(false)}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Modify Search
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <p className="text-gray-600">Found {searchResults.length} housing options</p>
                    <button 
                      onClick={() => setShowResults(false)}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Modify Search
                    </button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    {searchResults.map((result) => (
                      <div key={result.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="relative">
                          <img 
                            src={result.image} 
                            alt={result.title} 
                            className="w-full h-48 object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267';
                            }}
                          />
                          <div className="absolute top-4 right-4">
                            <span className="bg-white text-blue-800 px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                              ${result.price}/mo
                            </span>
                          </div>
                          {recommendedApartments.includes(result.id) && (
                            <div className="absolute top-4 left-4">
                              <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-medium shadow-sm flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                ChatGPT Highly Recommends!
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="p-6">
                          <h4 className="text-xl font-semibold text-gray-800 mb-2">{result.title}</h4>
                          <p className="text-gray-600 mb-4">{result.location}</p>
                          <div className="flex items-center mb-4">
                            <span className="text-yellow-400">★</span>
                            <span className="ml-1 text-gray-600">{result.rating} rating</span>
                            <span className="mx-2 text-gray-300">•</span>
                            <span className="text-gray-600">{result.distance}</span>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {result.amenities.map((amenity) => (
                              <span key={amenity} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                                {amenity}
                              </span>
                            ))}
                          </div>
                          <a
                            href={result.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
                          >
                            View Details
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
          
          {/* Loading State */}
          {isLoading && (
            <div className="mt-12">
              <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">Searching for Housing</h4>
                  <p className="text-gray-600 text-center">
                    We're finding the best housing options that match your criteria...
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="mt-12">
              <div className="max-w-md mx-auto bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex flex-col items-center">
                  <svg className="w-12 h-12 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">Error Finding Housing</h4>
                  <p className="text-gray-600 text-center mb-4">{error}</p>
                  <button 
                    onClick={() => {
                      setError(null);
                      setShowResults(false);
                    }}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Benefits Section */}
      <BenefitsSection />
    </>
  );
};

// Create router
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorBoundary><div>Something went wrong!</div></ErrorBoundary>,
    children: [
      {
        index: true,
        element: <MainContent />,
      },
      {
        path: 'about',
        element: <About />,
      },
      {
        path: 'contact',
        element: <Contact />,
      },
    ],
  },
]);

// App component
const App = () => {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
};

export default App; 