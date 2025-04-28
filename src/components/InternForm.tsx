// InternForm.tsx
import React, { useState } from 'react';

type FormData = {
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  maxPrice: number;
  maxDistance: number;
  roomType: string;
  cleanliness: string;
  amenities: string[];
  preferences: string[];
};

const InternForm = ({ onSubmit }: { onSubmit: (data: FormData) => void }) => {
  const [formData, setFormData] = useState<FormData>({
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    maxPrice: 2000,
    maxDistance: 5,
    roomType: 'Any',
    cleanliness: 'Any',
    amenities: [],
    preferences: [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name.includes('Price') || name.includes('Distance') ? +value : value }));
  };

  const handleToggle = (arrayName: 'amenities' | 'preferences', value: string) => {
    setFormData((prev) => ({
      ...prev,
      [arrayName]: prev[arrayName].includes(value)
        ? prev[arrayName].filter((item) => item !== value)
        : [...prev[arrayName], value],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const amenitiesList = [
    'WiFi',
    'Parking',
    'Washer/Dryer',
    'Gym',
    'Pet Friendly',
    'Air Conditioning',
    'Furnished',
    'Balcony',
    'Pool',
    'Security'
  ];

  const preferencesList = [
    'Quiet Area',
    'Near Public Transport',
    'Near Restaurants',
    'Near Shopping',
    'Near Parks',
    'Student Friendly',
    'Nightlife',
    'Family Friendly'
  ];

  const roomTypes = ['Any', 'Studio', '1 Bedroom', '2 Bedrooms', '3+ Bedrooms', 'Shared Room'];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Company */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
          <select
            name="company"
            value={formData.company}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="">Select a company</option>
            <option value="Meta">Meta</option>
            <option value="Apple">Apple</option>
            <option value="Amazon">Amazon</option>
            <option value="Netflix">Netflix</option>
            <option value="Google">Google</option>
            <option value="Microsoft">Microsoft</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Internship Location</label>
          <input
            name="location"
            placeholder="City or Address"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Dates */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Max Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Monthly Rent ($)</label>
          <input
            name="maxPrice"
            type="number"
            value={formData.maxPrice}
            onChange={handleChange}
            min="0"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Max Distance */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Max Distance (miles)</label>
          <input
            name="maxDistance"
            type="number"
            value={formData.maxDistance}
            onChange={handleChange}
            min="0"
            max="50"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Room Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
          <select
            name="roomType"
            value={formData.roomType}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            {roomTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Cleanliness */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Cleanliness Rating</label>
        <select
          name="cleanliness"
          value={formData.cleanliness}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        >
          <option value="Any">Any</option>
          <option value="3+">3+ stars</option>
          <option value="4+">4+ stars</option>
          <option value="5">5 stars</option>
        </select>
      </div>

      {/* Amenities */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {amenitiesList.map((amenity) => (
            <label key={amenity} className="flex items-center space-x-2 p-2 bg-gray-50 rounded border border-gray-200 hover:bg-gray-100 transition-colors">
              <input
                type="checkbox"
                checked={formData.amenities.includes(amenity)}
                onChange={() => handleToggle('amenities', amenity)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
              />
              <span className="text-sm text-gray-700">{amenity}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Preferences */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Preferences</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {preferencesList.map((preference) => (
            <label key={preference} className="flex items-center space-x-2 p-2 bg-gray-50 rounded border border-gray-200 hover:bg-gray-100 transition-colors">
              <input
                type="checkbox"
                checked={formData.preferences.includes(preference)}
                onChange={() => handleToggle('preferences', preference)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
              />
              <span className="text-sm text-gray-700">{preference}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Submit */}
      <div className="mt-8">
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Find Housing
        </button>
      </div>
    </form>
  );
};

export default InternForm; 