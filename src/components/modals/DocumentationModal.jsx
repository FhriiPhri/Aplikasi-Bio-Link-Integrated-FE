import React, { useState, useEffect } from 'react';
import {
  XMarkIcon,
  BookOpenIcon,
  CodeBracketIcon,
  CpuChipIcon,
  Cog6ToothIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';

const DocumentationModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('getting-started');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Lock scroll saat modal terbuka
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const hasScrollbar = window.innerWidth > document.documentElement.clientWidth;
      if (hasScrollbar) {
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const documentationSections = {
    'getting-started': {
      title: 'Getting Started',
      icon: <BookOpenIcon className="w-5 h-5" />,
      content: [
        {
          title: 'Introduction to Synapse',
          description: 'Learn the basics of Synapse and how to get started with your first project.',
          steps: [
            'Create your Synapse account',
            'Set up your profile and preferences',
            'Explore the dashboard interface',
            'Create your first link',
          ],
        },
        {
          title: 'Dashboard Overview',
          description: 'Understanding the main features and navigation.',
          steps: [
            'Navigate through main menu sections',
            'Access My Page for link management',
            'View analytics and insights',
            'Customize your workspace',
          ],
        },
      ],
    },
    'features': {
      title: 'Features',
      icon: <CodeBracketIcon className="w-5 h-5" />,
      content: [
        {
          title: 'Bundle Management',
          description: 'Create, edit, and organize your bundles effectively.',
          steps: [
            'Add new bundles to your page',
            'Edit existing bundle properties',
            'Organize bundles with drag-and-drop',
            'Enable or disable bundle visibility',
          ],
        },
        {
          title: 'Customization Options',
          description: 'Personalize your Synapse page appearance.',
          steps: [
            'Choose from various themes',
            'Upload custom background images',
            'Select fonts and color schemes',
            'Add custom CSS for advanced styling',
          ],
        },
        {
          title: 'Analytics & Tracking',
          description: 'Monitor your page performance and visitor insights.',
          steps: [
            'View total clicks and impressions',
            'Track visitor demographics',
            'Analyze click-through rates',
            'Export analytics reports',
          ],
        },
      ],
    },
    'integration': {
      title: 'Integrations',
      icon: <CpuChipIcon className="w-5 h-5" />,
      content: [
        {
          title: 'Social Media Integration',
          description: 'Connect your social media accounts seamlessly.',
          steps: [
            'Link Instagram account',
            'Connect Twitter/X profile',
            'Add YouTube channel',
            'Integrate TikTok content',
          ],
        },
        {
          title: 'Third-Party Tools',
          description: 'Integrate with popular tools and platforms.',
          steps: [
            'Google Analytics integration',
            'Facebook Pixel setup',
            'Mailchimp email marketing',
            'Zapier automation',
          ],
        },
      ],
    },
    'settings': {
      title: 'Settings & Configuration',
      icon: <Cog6ToothIcon className="w-5 h-5" />,
      content: [
        {
          title: 'Account Settings',
          description: 'Manage your account preferences and security.',
          steps: [
            'Update profile information',
            'Change email and password',
            'Configure notification preferences',
            'Manage connected devices',
          ],
        },
        {
          title: 'Privacy & Security',
          description: 'Control your data and security settings.',
          steps: [
            'Enable two-factor authentication',
            'Manage privacy settings',
            'Control data sharing preferences',
            'Review login history',
          ],
        },
      ],
    },
    'advanced': {
      title: 'Advanced Features',
      icon: <ShieldCheckIcon className="w-5 h-5" />,
      content: [
        {
          title: 'Custom Domain',
          description: 'Use your own domain with Synapse.',
          steps: [
            'Purchase or use existing domain',
            'Configure DNS settings',
            'Verify domain ownership',
            'Enable SSL certificate',
          ],
        },
        {
          title: 'API Access',
          description: 'Integrate Synapse with your applications.',
          steps: [
            'Generate API keys',
            'Read API documentation',
            'Make your first API call',
            'Handle authentication tokens',
          ],
        },
      ],
    },
    'collaboration': {
      title: 'Team Collaboration',
      icon: <UserGroupIcon className="w-5 h-5" />,
      content: [
        {
          title: 'Team Management',
          description: 'Collaborate with your team members.',
          steps: [
            'Invite team members',
            'Assign roles and permissions',
            'Share workspace access',
            'Monitor team activity',
          ],
        },
        {
          title: 'Workflow Optimization',
          description: 'Streamline your team workflow.',
          steps: [
            'Set up approval processes',
            'Create content templates',
            'Automate repetitive tasks',
            'Schedule content publishing',
          ],
        },
      ],
    },
  };

  const tabs = Object.keys(documentationSections);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  const currentSection = documentationSections[activeTab];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[95vh] sm:max-h-[90vh] flex flex-col overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="px-5 sm:px-8 py-5 sm:py-6 border-b border-gray-200 flex items-start justify-between">
          <div className="flex-1 pr-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Documentation</h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Complete guide to Synapse features</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-900 rounded-lg p-2 hover:bg-gray-100 transition-colors flex-shrink-0"
            aria-label="Close"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">
          {/* Mobile Menu Dropdown */}
          <div className="lg:hidden w-full border-b border-gray-200">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-full px-5 py-3.5 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                {React.cloneElement(currentSection.icon, {
                  className: 'w-5 h-5 text-blue-600',
                })}
                <span className="font-medium text-gray-900 text-sm">{currentSection.title}</span>
              </div>
              <ChevronDownIcon
                className={`w-4 h-4 text-gray-500 transition-transform ${
                  isMobileMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            {isMobileMenuOpen && (
              <div className="bg-white max-h-60 overflow-y-auto border-t border-gray-200">
                {tabs.map((tab) => {
                  const section = documentationSections[tab];
                  return (
                    <button
                      key={tab}
                      onClick={() => handleTabChange(tab)}
                      className={`w-full px-6 py-3 flex items-center gap-3 text-left text-sm transition-colors ${
                        activeTab === tab
                          ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {React.cloneElement(section.icon, {
                        className: activeTab === tab ? 'text-blue-600 w-5 h-5' : 'text-gray-700 w-5 h-5',
                      })}
                      <span className="font-medium">{section.title}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-64 bg-gray-50 border-r border-gray-200 overflow-y-auto custom-scrollbar">
            <div className="p-4 space-y-1">
              {tabs.map((tab) => {
                const section = documentationSections[tab];
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm transition-colors ${
                      activeTab === tab
                        ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md shadow-blue-500/20'
                        : 'text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {React.cloneElement(section.icon, {
                      className: activeTab === tab ? 'text-white w-5 h-5' : 'text-gray-700 w-5 h-5',
                    })}
                    <span className="font-medium">{section.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-8 custom-scrollbar">
            <div className="max-w-2xl">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">{currentSection.title}</h3>

              <div className="space-y-4 sm:space-y-6">
                {currentSection.content.map((item, idx) => (
                  <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5 hover:border-blue-300 transition-colors">
                    <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">{item.title}</h4>
                    <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                    <div className="space-y-2.5">
                      <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Steps to Follow</p>
                      {item.steps.map((step, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-semibold text-blue-700 bg-blue-50 rounded-full flex-shrink-0">
                            {i + 1}
                          </span>
                          <span className="text-gray-700 text-sm sm:text-base pt-0.5">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Tip */}
              <div className="mt-6 sm:mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold text-blue-700">Pro Tip:</span> Bookmark this page for quick access. You can search topics using <kbd className="px-1.5 py-0.5 bg-white border border-blue-200 rounded text-xs font-mono text-blue-700">Ctrl+F</kbd>.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-8 py-4 sm:py-5 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <p className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
            Need help? Contact{' '}
            <a href="mailto:synapsebioapp@gmail.com" className="text-blue-600 font-medium hover:text-blue-700 underline">
              synapsebioapp@gmail.com
            </a>
          </p>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-300 shadow-md shadow-blue-500/20"
          >
            Close
          </button>
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
    </div>
  );
};

export default DocumentationModal;