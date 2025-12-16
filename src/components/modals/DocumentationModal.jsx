import React, { useState } from 'react';
import { X, Book, Code, Database, Settings, Shield, Users, ChevronDown } from 'lucide-react';

const DocumentationModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('getting-started');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!isOpen) return null;

  const documentationSections = {
    'getting-started': {
      title: 'Getting Started',
      icon: <Book className="w-5 h-5" />,
      content: [
        {
          title: 'Introduction to Synapse',
          description: 'Learn the basics of Synapse and how to get started with your first project.',
          steps: [
            'Create your Synapse account',
            'Set up your profile and preferences',
            'Explore the dashboard interface',
            'Create your first link'
          ]
        },
        {
          title: 'Dashboard Overview',
          description: 'Understanding the main features and navigation.',
          steps: [
            'Navigate through main menu sections',
            'Access My Page for link management',
            'View analytics and insights',
            'Customize your workspace'
          ]
        }
      ]
    },
    'features': {
      title: 'Features',
      icon: <Code className="w-5 h-5" />,
      content: [
        {
          title: 'Bundle Management',
          description: 'Create, edit, and organize your bundles effectively.',
          steps: [
            'Add new bundles to your page',
            'Edit existing bundles properties',
            'Organize bundles with drag-and-drop',
            'Enable or disable bundles visibility'
          ]
        },
        {
          title: 'Customization Options',
          description: 'Personalize your Synapse page appearance.',
          steps: [
            'Choose from various themes',
            'Upload custom background images',
            'Select fonts and color schemes',
            'Add custom CSS for advanced styling'
          ]
        },
        {
          title: 'Analytics & Tracking',
          description: 'Monitor your page performance and visitor insights.',
          steps: [
            'View total clicks and impressions',
            'Track visitor demographics',
            'Analyze click-through rates',
            'Export analytics reports'
          ]
        }
      ]
    },
    'integration': {
      title: 'Integrations',
      icon: <Database className="w-5 h-5" />,
      content: [
        {
          title: 'Social Media Integration',
          description: 'Connect your social media accounts seamlessly.',
          steps: [
            'Link Instagram account',
            'Connect Twitter/X profile',
            'Add YouTube channel',
            'Integrate TikTok content'
          ]
        },
        {
          title: 'Third-Party Tools',
          description: 'Integrate with popular tools and platforms.',
          steps: [
            'Google Analytics integration',
            'Facebook Pixel setup',
            'Mailchimp email marketing',
            'Zapier automation'
          ]
        }
      ]
    },
    'settings': {
      title: 'Settings & Configuration',
      icon: <Settings className="w-5 h-5" />,
      content: [
        {
          title: 'Account Settings',
          description: 'Manage your account preferences and security.',
          steps: [
            'Update profile information',
            'Change email and password',
            'Configure notification preferences',
            'Manage connected devices'
          ]
        },
        {
          title: 'Privacy & Security',
          description: 'Control your data and security settings.',
          steps: [
            'Enable two-factor authentication',
            'Manage privacy settings',
            'Control data sharing preferences',
            'Review login history'
          ]
        }
      ]
    },
    'advanced': {
      title: 'Advanced Features',
      icon: <Shield className="w-5 h-5" />,
      content: [
        {
          title: 'Custom Domain',
          description: 'Use your own domain with Synapse.',
          steps: [
            'Purchase or use existing domain',
            'Configure DNS settings',
            'Verify domain ownership',
            'Enable SSL certificate'
          ]
        },
        {
          title: 'API Access',
          description: 'Integrate Synapse with your applications.',
          steps: [
            'Generate API keys',
            'Read API documentation',
            'Make your first API call',
            'Handle authentication tokens'
          ]
        }
      ]
    },
    'collaboration': {
      title: 'Team Collaboration',
      icon: <Users className="w-5 h-5" />,
      content: [
        {
          title: 'Team Management',
          description: 'Collaborate with your team members.',
          steps: [
            'Invite team members',
            'Assign roles and permissions',
            'Share workspace access',
            'Monitor team activity'
          ]
        },
        {
          title: 'Workflow Optimization',
          description: 'Streamline your team workflow.',
          steps: [
            'Set up approval processes',
            'Create content templates',
            'Automate repetitive tasks',
            'Schedule content publishing'
          ]
        }
      ]
    }
  };

  const tabs = Object.keys(documentationSections);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500 p-2.5 rounded-lg">
              <Book className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Documentation</h2>
              <p className="text-gray-500 text-sm hidden sm:block">Complete guide to Synapse features</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-gray-100 p-2 rounded-lg transition-colors text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Category Selector */}
        <div className="lg:hidden border-b border-gray-200 flex-shrink-0">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              {documentationSections[activeTab].icon}
              <span className="font-semibold text-gray-900">
                {documentationSections[activeTab].title}
              </span>
            </div>
            <ChevronDown 
              className={`w-5 h-5 text-gray-500 transition-transform ${
                isMobileMenuOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
          
          {isMobileMenuOpen && (
            <div className="bg-white border-t border-gray-200 max-h-60 overflow-y-auto">
              {tabs.map((tab) => {
                const section = documentationSections[tab];
                return (
                  <button
                    key={tab}
                    onClick={() => handleTabChange(tab)}
                    className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-colors ${
                      activeTab === tab
                        ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-500'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    {section.icon}
                    <span className="font-medium text-sm">{section.title}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-56 bg-gray-50 border-r border-gray-200 overflow-y-auto flex-shrink-0">
            <div className="p-3 space-y-1">
              {tabs.map((tab) => {
                const section = documentationSections[tab];
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                      activeTab === tab
                        ? 'bg-blue-500 text-white'
                        : 'hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    {section.icon}
                    <span className="font-medium text-sm">{section.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-6 bg-white">
            <div className="max-w-2xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                {documentationSections[activeTab].title}
              </h3>

              <div className="space-y-5">
                {documentationSections[activeTab].content.map((item, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-5 hover:border-blue-300 transition-colors">
                    <h4 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h4>
                    <p className="text-gray-600 mb-4 text-sm">{item.description}</p>
                    
                    <div className="space-y-2.5">
                      <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Steps:</p>
                      {item.steps.map((step, stepIndex) => (
                        <div key={stepIndex} className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                            {stepIndex + 1}
                          </div>
                          <p className="text-gray-700 text-sm pt-0.5">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pro Tip */}
              <div className="mt-6 bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">💡</span>
                  <div>
                    <p className="font-semibold text-blue-900">Pro Tip</p>
                    <p className="text-blue-800 text-sm mt-1">
                      Bookmark this documentation for quick access. You can also search for specific topics using Ctrl+F (Cmd+F on Mac).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50 flex-shrink-0">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-sm text-gray-600 text-center sm:text-left">
              Need more help? mailto:{" "}
              <a
                href="mailto:synapsebioapp@gmail.com"
                className="text-blue-600 hover:text-blue-700 font-medium underline"
              >
                synapsebioapp@gmail.com
              </a>
            </p>

            <button
              onClick={onClose}
              className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
            >
              Close Documentation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentationModal;