import React, { useState } from 'react';
import { XMarkIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const QuickStartModal = ({ isOpen, onClose }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 5;

    if (!isOpen) return null;

    const steps = [
        {
            step: 1,
            title: 'Create Synapse Account',
            icon: '👤',
            description: 'Sign up with email or use Google Sign-In to start your journey.',
            details: [
                'Click the "Sign Up" button on the main page',
                'Fill in basic information: Name, Email, and Password',
                'Or use Google Sign-In for a faster process',
                'Verify your email if required'
            ],
            tips: 'Use a strong password with a combination of letters, numbers, and symbols for maximum security.'
        },
        {
            step: 2,
            title: 'Setup Your Profile',
            icon: '⚙️',
            description: 'Complete your profile with interesting information for your audience.',
            details: [
                'Upload a professional profile photo',
                'Enter a unique username that is easy to remember',
                'Add a bio that explains who you are',
                'Set up relevant contact information'
            ],
            tips: 'A good username is short, memorable, and represents your brand.'
        },
        {
            step: 3,
            title: 'Create Your First Bundle',
            icon: '🎨',
            description: 'Create your first Link-in-Bio page with a theme you like.',
            details: [
                'Click "My Page" or "Create Bundle" on the dashboard',
                'Choose a theme that matches your brand',
                'Add social media links (Instagram, Twitter, TikTok, etc.)',
                'Customize the appearance with your favorite colors and layout'
            ],
            tips: 'Choose a theme consistent with your brand identity for a professional look.'
        },
        {
            step: 4,
            title: 'Add Custom Links',
            icon: '🔗',
            description: 'Add links to products, articles, or other important content.',
            details: [
                'Click the "Add Link" button in the Bundle editor',
                'Enter an attractive and descriptive title',
                'Paste your destination URL',
                'Choose an icon or emoji to make the link more appealing',
                'Arrange link order with drag & drop'
            ],
            tips: 'Use action-oriented titles like "Buy Now" or "Free Download" to increase clicks.'
        },
        {
            step: 5,
            title: 'Share & Monitor',
            icon: '📊',
            description: 'Share your Bundle and monitor its performance with analytics.',
            details: [
                'Copy your Bundle link (synapse.link/username)',
                'Add the link to your Instagram, TikTok, or Twitter bio',
                'Share in Stories or feed for awareness',
                'Monitor analytics on the dashboard to see views & clicks',
                'Optimize based on the data you get'
            ],
            tips: 'Monitor analytics regularly to understand which content is most popular with your audience.'
        }
    ];

    const currentStepData = steps[currentStep - 1];

    const handleNext = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrev = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleClose = () => {
        setCurrentStep(1); // Reset to first step when closing
        onClose();
    };

    return (
        <>
            <div 
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                onClick={(e) => {
                    // Klik backdrop untuk close modal
                    if (e.target === e.currentTarget) {
                        handleClose();
                    }
                }}
            >
                <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden animate-slideUp">
                    {/* Modal Header */}
                    <div className="bg-gradient-to-r from-purple-600 to-purple-400 px-6 py-5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl">🎯</span>
                            <div>
                                <h2 className="text-2xl font-bold text-white">Quick Start Guide</h2>
                                <p className="text-purple-100 text-sm">Learn Synapse in 5 minutes</p>
                            </div>
                        </div>
                        <button 
                            onClick={handleClose}
                            className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                        >
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Progress Bar */}
                    <div className="px-6 pt-6 pb-4 bg-gray-50 border-b border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-600">
                                Step {currentStep} of {totalSteps}
                            </span>
                            <span className="text-sm font-medium text-purple-600">
                                {Math.round((currentStep / totalSteps) * 100)}% Complete
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                                className="bg-gradient-to-r from-purple-600 to-purple-400 h-2.5 rounded-full transition-all duration-500"
                                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Modal Content */}
                    <div className="p-6 overflow-y-auto max-h-[calc(90vh-250px)] custom-scrollbar">
                        {/* Step Header */}
                        <div className="text-center mb-6">
                            <div className="text-6xl mb-4">{currentStepData.icon}</div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                {currentStepData.title}
                            </h3>
                            <p className="text-gray-600">
                                {currentStepData.description}
                            </p>
                        </div>

                        {/* Step Details */}
                        <div className="space-y-4 mb-6">
                            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                                <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm">
                                    ✓
                                </span>
                                Steps:
                            </h4>
                            <ul className="space-y-3">
                                {currentStepData.details.map((detail, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <span className="w-6 h-6 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                                            {index + 1}
                                        </span>
                                        <span className="text-gray-700">{detail}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Tips Section */}
                        <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg">
                            <div className="flex items-start gap-2">
                                <span className="text-xl">💡</span>
                                <div>
                                    <h5 className="font-semibold text-purple-900 mb-1">Pro Tip:</h5>
                                    <p className="text-purple-800 text-sm">{currentStepData.tips}</p>
                                </div>
                            </div>
                        </div>

                        {/* Completed Message (Last Step) */}
                        {currentStep === totalSteps && (
                            <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4">
                                <div className="flex items-center gap-3">
                                    <CheckCircleIcon className="w-8 h-8 text-green-600" />
                                    <div>
                                        <h5 className="font-semibold text-green-900">Congratulations! 🎉</h5>
                                        <p className="text-green-700 text-sm">
                                            You are ready to maximize Synapse. Start creating your Bundle now!
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Modal Footer - Navigation */}
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between gap-4">
                        <button 
                            onClick={handlePrev}
                            disabled={currentStep === 1}
                            className={`px-6 py-3 font-semibold rounded-xl transition-all ${
                                currentStep === 1
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    : 'bg-white text-purple-600 border-2 border-purple-600 hover:bg-purple-50'
                            }`}
                        >
                            ← Previous
                        </button>

                        <div className="flex gap-2">
                            {[...Array(totalSteps)].map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentStep(index + 1)}
                                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                                        currentStep === index + 1
                                            ? 'bg-purple-600 w-8'
                                            : 'bg-gray-300 hover:bg-gray-400'
                                    }`}
                                />
                            ))}
                        </div>

                        {currentStep < totalSteps ? (
                            <button 
                                onClick={handleNext}
                                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-400 text-white font-semibold rounded-xl hover:opacity-90 transition-all"
                            >
                                Next →
                            </button>
                        ) : (
                            <button 
                                onClick={handleClose}
                                className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-400 text-white font-semibold rounded-xl hover:opacity-90 transition-all"
                            >
                                Get Started! 🚀
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Custom Scrollbar Styles */}
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #a855f7;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #9333ea;
                }
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-slideUp {
                    animation: slideUp 0.3s ease-out;
                }
            `}</style>
        </>
    );
};

export default QuickStartModal;