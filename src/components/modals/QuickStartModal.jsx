import React, { useState } from 'react';
import { XMarkIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const QuickStartModal = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  if (!isOpen) return null;

  const steps = [
    {
      title: 'Create Synapse Account',
      description: 'Sign up with email or use Google Sign-In to get started.',
      details: [
        'Click "Sign Up" on the homepage',
        'Enter your name, email, and a secure password',
        'Or sign in instantly with Google',
        'Verify your email if required',
      ],
      tips: 'Use a strong password with letters, numbers, and symbols.',
    },
    {
      title: 'Set Up Your Profile',
      description: 'Complete your profile with clear and professional information.',
      details: [
        'Upload a clear profile photo',
        'Choose a short, memorable username',
        'Write a concise bio',
        'Add relevant contact details',
      ],
      tips: 'Your username is part of your brand—keep it consistent.',
    },
    {
      title: 'Create Your First Bundle',
      description: 'Build your Link-in-Bio page with a clean, cohesive theme.',
      details: [
        'Go to "My Page" or click "Create Bundle"',
        'Select a theme that aligns with your brand',
        'Add your social media links',
        'Customize colors and layout for consistency',
      ],
      tips: 'Consistent design builds trust and recognition.',
    },
    {
      title: 'Add Custom Links',
      description: 'Link to your key content—products, portfolios, or articles.',
      details: [
        'Click "Add Link" in the Bundle editor',
        'Use clear, action-oriented titles',
        'Paste the destination URL',
        'Reorder links via drag & drop',
      ],
      tips: 'Strong call-to-action titles increase engagement significantly.',
    },
    {
      title: 'Share & Monitor',
      description: 'Publish your Bundle and track audience engagement.',
      details: [
        'Copy your link: synapse.link/yourname',
        'Add it to your social bios',
        'Promote in posts or stories',
        'Review analytics in your dashboard',
        'Refine content based on performance',
      ],
      tips: 'Top creators review analytics weekly to optimize strategy.',
    },
  ];

  const currentStepData = steps[currentStep - 1];

  const handleNext = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleClose = () => {
    setCurrentStep(1);
    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm"
        onClick={(e) => e.target === e.currentTarget && handleClose()}
      >
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] flex flex-col overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="px-5 sm:px-8 py-5 sm:py-6 border-b border-gray-200 flex items-start justify-between">
            <div className="flex-1 pr-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Quick Start Guide</h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">Complete these steps to get started</p>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-900 rounded-lg p-2 hover:bg-gray-100 transition-colors flex-shrink-0"
              aria-label="Close"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="px-5 sm:px-8 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-2">
              <span className="font-medium">Step {currentStep} of {totalSteps}</span>
              <span>{Math.round((currentStep / totalSteps) * 100)}% complete</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-blue-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Content */}
          <div className="p-5 sm:p-8 overflow-y-auto flex-1 custom-scrollbar">
            <div className="text-center mb-6 sm:mb-8">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{currentStepData.title}</h3>
              <p className="text-gray-600 text-sm sm:text-base">{currentStepData.description}</p>
            </div>

            <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
              <h4 className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">Steps to Follow</h4>
              <ol className="space-y-3 sm:space-y-4 pl-0.5">
                {currentStepData.details.map((detail, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 text-xs sm:text-sm font-semibold text-blue-700 bg-blue-50 rounded-full mr-3 flex-shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-gray-700 text-sm sm:text-base leading-relaxed pt-0.5">{detail}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Pro Tip */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-blue-700">Pro Tip:</span> {currentStepData.tips}
              </p>
            </div>

            {/* Completion (Last Step) */}
            {currentStep === totalSteps && (
              <div className="mt-6 sm:mt-8 p-4 sm:p-5 bg-gradient-to-br from-blue-600 to-blue-500 border border-blue-500 rounded-lg shadow-lg shadow-blue-500/20">
                <div className="flex items-start gap-3">
                  <CheckCircleIcon className="w-6 h-6 text-white mt-0.5 flex-shrink-0" />
                  <div>
                    <h5 className="font-semibold text-white">You're all set!</h5>
                    <p className="text-blue-50 text-sm mt-1">
                      Your Synapse Bundle is ready. Start sharing and growing your audience today.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-5 sm:px-8 py-4 sm:py-5 bg-gray-50 border-t border-gray-200 flex items-center justify-between gap-3 sm:gap-4">
            <button
              onClick={handlePrev}
              disabled={currentStep === 1}
              className={`px-4 sm:px-5 py-2 sm:py-2.5 text-sm font-medium rounded-lg transition-colors ${
                currentStep === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900'
              }`}
            >
              <span className="hidden sm:inline">← Back</span>
              <span className="sm:hidden">←</span>
            </button>

            <div className="flex gap-1.5 sm:gap-2">
              {[...Array(totalSteps)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-colors ${
                    currentStep === i + 1 ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {currentStep < totalSteps ? (
              <button
                onClick={handleNext}
                className="px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-300 shadow-md shadow-blue-500/20"
              >
                <span className="hidden sm:inline">Continue →</span>
                <span className="sm:hidden">→</span>
              </button>
            ) : (
              <button
                onClick={handleClose}
                className="px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-300 whitespace-nowrap shadow-md shadow-blue-500/20"
              >
                Get Started
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Scrollbar Styling */}
      <style jsx>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #d1d5db transparent;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #e5e7eb;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #d1d5db;
        }
      `}</style>
    </>
  );
};

export default QuickStartModal;