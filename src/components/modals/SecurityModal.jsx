import React from 'react';
import { ShieldCheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

const SecurityModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden animate-slideUp">
                    {/* Modal Header */}
                    <div className="bg-gradient-to-r from-purple-600 to-purple-400 px-6 py-5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <ShieldCheckIcon className="w-8 h-8 text-white" />
                            <h2 className="text-2xl font-bold text-white">Security & Privacy</h2>
                        </div>
                        <button 
                            onClick={onClose}
                            className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                        >
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Modal Content */}
                    <div className="p-6 overflow-y-auto max-h-[calc(85vh-80px)] custom-scrollbar">
                        {/* Introduction */}
                        <div className="mb-6">
                            <p className="text-gray-600 leading-relaxed">
                                At Synapse, we take the protection of your privacy and data security very seriously. 
                                Here is our commitment to keeping your information safe.
                            </p>
                        </div>

                        {/* Policy Sections */}
                        <div className="space-y-6">
                            {/* Section 1 */}
                            <div className="border-l-4 border-purple-500 pl-4">
                                <h3 className="text-lg font-bold text-gray-900 mb-2">
                                    1. Data Collection
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    We only collect data necessary to provide you with the best service. 
                                    The data collected includes profile information (name, email, username), Bundle data you create, 
                                    and analytics to help you understand your content performance.
                                </p>
                            </div>

                            {/* Section 2 */}
                            <div className="border-l-4 border-purple-500 pl-4">
                                <h3 className="text-lg font-bold text-gray-900 mb-2">
                                    2. Data Usage
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Your data is used to:
                                </p>
                                <ul className="mt-2 space-y-2 text-gray-600">
                                    <li className="flex items-start gap-2">
                                        <span className="text-purple-600 mt-1">•</span>
                                        <span>Provide and improve Synapse services</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-purple-600 mt-1">•</span>
                                        <span>Deliver analytics and insights about your Bundle performance</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-purple-600 mt-1">•</span>
                                        <span>Send important updates and notifications</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-purple-600 mt-1">•</span>
                                        <span>Prevent abuse and fraudulent activity</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Section 3 */}
                            <div className="border-l-4 border-purple-500 pl-4">
                                <h3 className="text-lg font-bold text-gray-900 mb-2">
                                    3. Data Security
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    We use industry-standard encryption (SSL/TLS) to protect your data in transit. 
                                    Your passwords are hashed using secure bcrypt algorithms. Our servers are protected with 
                                    firewalls and layered security systems to prevent unauthorized access.
                                </p>
                            </div>

                            {/* Section 4 */}
                            <div className="border-l-4 border-purple-500 pl-4">
                                <h3 className="text-lg font-bold text-gray-900 mb-2">
                                    4. Sharing Data with Third Parties
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    We will <strong>never</strong> sell your personal data to third parties. 
                                    Your data is only shared with trusted service providers who help us operate 
                                    the platform (such as hosting, email services), and they are contractually bound to maintain the confidentiality of your data.
                                </p>
                            </div>

                            {/* Section 5 */}
                            <div className="border-l-4 border-purple-500 pl-4">
                                <h3 className="text-lg font-bold text-gray-900 mb-2">
                                    5. User Rights
                                </h3>
                                <p className="text-gray-600 leading-relaxed mb-2">
                                    You have full rights over your data:
                                </p>
                                <ul className="space-y-2 text-gray-600">
                                    <li className="flex items-start gap-2">
                                        <span className="text-purple-600 mt-1">•</span>
                                        <span><strong>Access:</strong> You can access all your personal data at any time</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-purple-600 mt-1">•</span>
                                        <span><strong>Edit:</strong> You can modify your profile information at any time</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-purple-600 mt-1">•</span>
                                        <span><strong>Delete:</strong> You can permanently delete your account and all your data</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-purple-600 mt-1">•</span>
                                        <span><strong>Export:</strong> You can export all your data in a readable format</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Section 6 */}
                            <div className="border-l-4 border-purple-500 pl-4">
                                <h3 className="text-lg font-bold text-gray-900 mb-2">
                                    6. Cookies and Tracking
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    We use cookies to maintain your login session and provide a personalized experience. 
                                    You can set cookie preferences in your browser. We also use analytics to 
                                    understand how users interact with our platform, but this data is aggregated and does not 
                                    identify specific individuals.
                                </p>
                            </div>

                            {/* Section 7 */}
                            <div className="border-l-4 border-purple-500 pl-4">
                                <h3 className="text-lg font-bold text-gray-900 mb-2">
                                    7. Policy Changes
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    We may update this privacy policy from time to time. If there are significant changes, 
                                    we will notify you via email or platform notification. We encourage you to 
                                    review this policy periodically.
                                </p>
                            </div>

                            {/* Section 8 */}
                            <div className="border-l-4 border-purple-500 pl-4">
                                <h3 className="text-lg font-bold text-gray-900 mb-2">
                                    8. Contact Us
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    If you have questions about our privacy policy or want to exercise your rights 
                                    regarding personal data, please contact us at:
                                </p>
                                <div className="mt-3 bg-purple-50 p-4 rounded-lg">
                                    <p className="text-gray-700">
                                        <strong>Email:</strong> synapse@gmail.com<br />
                                        <strong>Address:</strong> Jakarta, Indonesia
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Last Updated */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <p className="text-sm text-gray-500 text-center">
                                Last updated: December 15, 2024
                            </p>
                        </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                        <button 
                            onClick={onClose}
                            className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-400 text-white font-semibold rounded-xl hover:opacity-90 transition-all"
                        >
                            I Understand
                        </button>
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

export default SecurityModal;