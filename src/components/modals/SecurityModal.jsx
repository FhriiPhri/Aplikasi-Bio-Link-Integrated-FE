import React from 'react';
import { ShieldCheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

const SecurityModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <>
            <div 
                className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm"
                onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        onClose();
                    }
                }}
            >
                <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden animate-slideUp border border-gray-200">
                    {/* Modal Header */}
                    <div className="px-5 sm:px-8 py-5 sm:py-6 border-b border-gray-200 flex items-start justify-between">
                        <div className="flex items-center gap-3 flex-1 pr-4">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20 flex-shrink-0">
                                <ShieldCheckIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                            </div>
                            <div>
                                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Security & Privacy</h2>
                                <p className="text-xs sm:text-sm text-gray-600 mt-0.5">How we protect your data</p>
                            </div>
                        </div>
                        <button 
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-900 rounded-lg p-2 hover:bg-gray-100 transition-colors flex-shrink-0"
                            aria-label="Close"
                        >
                            <XMarkIcon className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Modal Content */}
                    <div className="p-5 sm:p-8 overflow-y-auto max-h-[calc(95vh-180px)] sm:max-h-[calc(90vh-180px)] custom-scrollbar">
                        {/* Introduction */}
                        <div className="mb-6 sm:mb-8">
                            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                                At Synapse, we take the protection of your privacy and data security very seriously. 
                                Here is our commitment to keeping your information safe.
                            </p>
                        </div>

                        {/* Policy Sections */}
                        <div className="space-y-5 sm:space-y-6">
                            {/* Section 1 */}
                            <div className="border-l-4 border-blue-500 pl-4">
                                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                                    1. Data Collection
                                </h3>
                                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                                    We only collect data necessary to provide you with the best service. 
                                    The data collected includes profile information (name, email, username), Bundle data you create, 
                                    and analytics to help you understand your content performance.
                                </p>
                            </div>

                            {/* Section 2 */}
                            <div className="border-l-4 border-blue-500 pl-4">
                                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                                    2. Data Usage
                                </h3>
                                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                                    Your data is used to:
                                </p>
                                <ul className="mt-3 space-y-2 text-sm sm:text-base text-gray-600">
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-600 mt-1 flex-shrink-0">•</span>
                                        <span>Provide and improve Synapse services</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-600 mt-1 flex-shrink-0">•</span>
                                        <span>Deliver analytics and insights about your Bundle performance</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-600 mt-1 flex-shrink-0">•</span>
                                        <span>Send important updates and notifications</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-600 mt-1 flex-shrink-0">•</span>
                                        <span>Prevent abuse and fraudulent activity</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Section 3 */}
                            <div className="border-l-4 border-blue-500 pl-4">
                                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                                    3. Data Security
                                </h3>
                                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                                    We use industry-standard encryption (SSL/TLS) to protect your data in transit. 
                                    Your passwords are hashed using secure bcrypt algorithms. Our servers are protected with 
                                    firewalls and layered security systems to prevent unauthorized access.
                                </p>
                            </div>

                            {/* Section 4 */}
                            <div className="border-l-4 border-blue-500 pl-4">
                                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                                    4. Sharing Data with Third Parties
                                </h3>
                                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                                    We will <strong className="text-gray-900">never</strong> sell your personal data to third parties. 
                                    Your data is only shared with trusted service providers who help us operate 
                                    the platform (such as hosting, email services), and they are contractually bound to maintain the confidentiality of your data.
                                </p>
                            </div>

                            {/* Section 5 */}
                            <div className="border-l-4 border-blue-500 pl-4">
                                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                                    5. User Rights
                                </h3>
                                <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-3">
                                    You have full rights over your data:
                                </p>
                                <ul className="space-y-2 text-sm sm:text-base text-gray-600">
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-600 mt-1 flex-shrink-0">•</span>
                                        <span><strong className="text-gray-900">Access:</strong> You can access all your personal data at any time</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-600 mt-1 flex-shrink-0">•</span>
                                        <span><strong className="text-gray-900">Edit:</strong> You can modify your profile information at any time</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-600 mt-1 flex-shrink-0">•</span>
                                        <span><strong className="text-gray-900">Delete:</strong> You can permanently delete your account and all your data</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-600 mt-1 flex-shrink-0">•</span>
                                        <span><strong className="text-gray-900">Export:</strong> You can export all your data in a readable format</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Section 6 */}
                            <div className="border-l-4 border-blue-500 pl-4">
                                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                                    6. Cookies and Tracking
                                </h3>
                                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                                    We use cookies to maintain your login session and provide a personalized experience. 
                                    You can set cookie preferences in your browser. We also use analytics to 
                                    understand how users interact with our platform, but this data is aggregated and does not 
                                    identify specific individuals.
                                </p>
                            </div>

                            {/* Section 7 */}
                            <div className="border-l-4 border-blue-500 pl-4">
                                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                                    7. Policy Changes
                                </h3>
                                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                                    We may update this privacy policy from time to time. If there are significant changes, 
                                    we will notify you via email or platform notification. We encourage you to 
                                    review this policy periodically.
                                </p>
                            </div>

                            {/* Section 8 */}
                            <div className="border-l-4 border-blue-500 pl-4">
                                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                                    8. Contact Us
                                </h3>
                                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                                    If you have questions about our privacy policy or want to exercise your rights 
                                    regarding personal data, please contact us at:
                                </p>
                                <div className="mt-3 bg-blue-50 border border-blue-200 p-4 rounded-lg">
                                    <p className="text-sm sm:text-base text-gray-700">
                                        <strong className="text-gray-900">Email:</strong> synapsebioapp@gmail.com <br />
                                        <strong className="text-gray-900">Address:</strong> Jakarta, Indonesia
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Last Updated */}
                        <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-gray-200">
                            <p className="text-xs sm:text-sm text-gray-500 text-center">
                                Last updated: December 15, 2024
                            </p>
                        </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="bg-gray-50 px-5 sm:px-8 py-4 sm:py-5 border-t border-gray-200">
                        <button 
                            onClick={onClose}
                            className="w-full px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm sm:text-base font-semibold rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-300 shadow-md shadow-blue-500/20"
                        >
                            I Understand
                        </button>
                    </div>
                </div>
            </div>

            {/* Custom Scrollbar & Animation Styles */}
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

export default SecurityModal;