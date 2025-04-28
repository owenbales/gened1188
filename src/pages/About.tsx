import React from 'react';

const About = () => {
  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">About This Project</h1>
        
        <div className="bg-white rounded-xl shadow-lg p-8">
          <p className="text-gray-600 text-lg mb-6">
            This is a project developed by Owen Bales with the help of artificial intelligence, 
            including Cursor AI, Claude, and ChatGPT. This program not only was developed by AI, 
            but uses it in such a way to determine location and best apartments based upon 
            information provided.
          </p>

          <div className="border-t border-gray-200 pt-6 mt-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Course Information</h2>
            <p className="text-gray-600">
              This project was created for Harvard's GENED 1188 taught by Logan McCarthy and the 
              wonderous, best, teaching fellow Berna.
            </p>
          </div>

          <div className="border-t border-gray-200 pt-6 mt-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Technology Stack</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>React.js with TypeScript for the frontend</li>
              <li>Node.js backend with Express</li>
              <li>Integration with OpenAI's GPT-4 for location services</li>
              <li>RentCast API for real-time apartment listings</li>
              <li>Tailwind CSS for styling</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 