import React from 'react';

const Contact = () => {
  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Contact Information</h1>
        
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Owen Bales</h2>
              <p className="text-gray-600">Harvard College Student</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:owenbales@college.harvard.edu" className="text-blue-600 hover:text-blue-800">
                  owenbales@college.harvard.edu
                </a>
              </div>
              
              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-gray-600">
                  Stoughton Hall
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 