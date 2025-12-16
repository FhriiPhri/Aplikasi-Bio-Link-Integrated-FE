import React from 'react';
import Layout from "../../components/layouts/Layout";

const PremiumPackPage = () => {
  // Data untuk premium features
  const premiumFeatures = [
    {
      id: 1,
      icon: '🤖',
      title: 'AI Advanced Analysis',
      description: 'Deep analysis with AI for more detailed and accurate insights',
      badges: ['Premium', 'AI Powered']
    },
    {
      id: 2,
      icon: '📊',
      title: 'Custom Reports',
      description: 'Create custom reports according to your needs with various professional templates',
      badges: ['Premium', 'Customizable']
    },
    {
      id: 3,
      icon: '💎',
      title: 'Priority Support',
      description: 'Get priority assistance from our support team 24/7',
      badges: ['Premium', '24/7']
    },
    {
      id: 4,
      icon: '🔗',
      title: 'Advanced Integrations',
      description: 'Integration with various popular platforms and tools for more efficient workflow',
      badges: ['Premium', 'Integration']
    },
    {
      id: 5,
      icon: '☁️',
      title: 'Unlimited Storage',
      description: 'Unlimited storage for all your data and files',
      badges: ['Premium', 'Unlimited']
    },
    {
      id: 6,
      icon: '👥',
      title: 'Team Collaboration',
      description: 'Real-time collaboration with your team with sharing and editing features',
      badges: ['Premium', 'Team']
    }
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Premium Pack</h1>
          <p className="text-gray-600">Exclusive features to enhance your Synapse experience</p>
        </div>

        {/* Development Notice Banner */}
        <div className="alert alert-warning bg-yellow-50 border border-yellow-200 mb-8 shadow-sm">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="stroke-yellow-600 shrink-0 h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
            />
          </svg>
          <div>
            <h3 className="font-bold text-yellow-800">Under Development</h3>
            <div className="text-sm text-yellow-700">
              This application is still in the development stage. Premium features will be available soon.
            </div>
          </div>
        </div>

        {/* Premium Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {premiumFeatures.map((feature) => (
            <div 
              key={feature.id} 
              className="card bg-white shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden"
            >
              {/* Lock Overlay */}
              <div className="absolute inset-0 bg-white/60 z-10 flex flex-col items-center justify-center">
                <div className="text-6xl mb-4">🔒</div>
                <div className="badge badge-warning badge-lg font-semibold mb-2">
                  COMING SOON
                </div>
                <p className="text-gray-600 text-sm px-4 text-center">
                  This feature is currently under development
                </p>
              </div>
              
              {/* Slightly Blurred Card Content */}
              <div className="card-body" style={{ filter: 'blur(1px)' }}>
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h2 className="card-title text-xl font-bold">{feature.title}</h2>
                <p className="text-gray-600">{feature.description}</p>
                <div className="card-actions justify-end mt-4">
                  <div className="badge badge-primary">{feature.badges[0]}</div>
                  <div className="badge badge-outline">{feature.badges[1]}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default PremiumPackPage;