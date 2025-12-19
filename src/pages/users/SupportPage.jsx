import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Layout from "../../components/layouts/Layout";
import {
  QuestionMarkCircleIcon,
  ChevronDownIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  LightBulbIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  RocketLaunchIcon,
  PlayCircleIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

// Import Modal Components
import SecurityModal from "../../components/modals/SecurityModal";
import QuickStartModal from "../../components/modals/QuickStartModal";
import DocumentationModal from "../../components/modals/DocumentationModal";

// --- FAQ Data ---
const faqsData = [
  {
    id: 1,
    category: "Customization",
    question: "Can I customize colors or fonts outside of the provided themes?",
    answer:
      "Currently, Bundle appearance customization is only available through our ready-made themes. Custom color palette or font customization features are not yet available.",
  },
  {
    id: 2,
    category: "Premium",
    question:
      "Does Synapse plan to offer Premium or paid features in the future?",
    answer:
      "Yes. This application is currently still in development. We plan to offer more advanced Premium features in the future for users who need in-depth analytics or business integrations.",
  },
  {
    id: 3,
    category: "Analytics",
    question:
      "How can I find out how many times my Bundle has been viewed and accessed by others?",
    answer:
      "You can monitor your Bundle's performance on the main dashboard. Our system records all interactions in logs_bundle and logs_links, so you can see in detail the number of views and clicks for each link.",
  },
  {
    id: 4,
    category: "Getting Started",
    question: "What are the steps to create a new Bundle (Link-in-Bio page)?",
    answer:
      'The process is easy! You just need to click the "My Page" or "Bundles" menu. From there, you will be directed to choose your desired theme, and after that, you can start adding your social media links and custom links.',
  },
  {
    id: 5,
    category: "Privacy",
    question: "Can I set my Bundle to be Private or password-protected?",
    answer:
      "Currently, all Bundles you create in Synapse are designed for Public access so they can be accessed by all your followers. We do not yet provide a feature to set Bundles to Private or password-protected.",
  },
];

// Quick Help Cards Data
const quickHelpCards = [
  {
    id: 1,
    icon: RocketLaunchIcon,
    title: "Quick Start Guide",
    description: "Learn Synapse basics in 5 minutes",
    link: "/guides/quickstart",
  },
  {
    id: 2,
    icon: DocumentTextIcon,
    title: "Documentation",
    description: "Complete documentation of Synapse features",
    link: "/docs",
  },
  {
    id: 3,
    icon: PlayCircleIcon,
    title: "Video Tutorials",
    description: "Step-by-step video tutorials",
    link: "/tutorials",
  },
  {
    id: 4,
    icon: UserGroupIcon,
    title: "Community",
    description: "Join the Synapse community",
    link: "/community",
  },
];

const SupportPage = () => {
  const { user } = useContext(AuthContext);
  const [openId, setOpenId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [isQuickStartModalOpen, setIsQuickStartModalOpen] = useState(false);
  const [isDocumentationModalOpen, setIsDocumentationModalOpen] =
    useState(false);

  const toggleOpen = (id) => {
    setOpenId(openId === id ? null : id);
  };

  // Filter FAQs based on search
  const filteredFaqs = faqsData.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Header Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                <QuestionMarkCircleIcon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Help Center
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                  Hi, {user?.name || "there"}! How can we help you today?
                </p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for help, guides, or FAQ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-5 py-3.5 pl-12 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder:text-gray-500"
                />
                <svg
                  className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Quick Help Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12 sm:mb-16">
            {quickHelpCards.map((card) => {
              const IconComponent = card.icon;
              
              // Quick Start Guide opens modal
              if (card.id === 1) {
                return (
                  <button
                    key={card.id}
                    onClick={() => setIsQuickStartModalOpen(true)}
                    className="bg-white rounded-lg p-5 sm:p-6 border border-gray-200 transition-all duration-300 hover:border-blue-500 hover:shadow-md text-left group"
                  >
                    <IconComponent className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600 mb-3 sm:mb-4 group-hover:text-blue-700 transition-colors" />
                    <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
                      {card.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600">{card.description}</p>
                  </button>
                );
              }

              // Documentation opens modal
              if (card.id === 2) {
                return (
                  <button
                    key={card.id}
                    onClick={() => setIsDocumentationModalOpen(true)}
                    className="bg-white rounded-lg p-5 sm:p-6 border border-gray-200 transition-all duration-300 hover:border-blue-500 hover:shadow-md text-left group"
                  >
                    <IconComponent className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600 mb-3 sm:mb-4 group-hover:text-blue-700 transition-colors" />
                    <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
                      {card.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600">{card.description}</p>
                  </button>
                );
              }

              return (
                <a
                  key={card.id}
                  href={card.link}
                  className="bg-white rounded-lg p-5 sm:p-6 border border-gray-200 transition-all duration-300 hover:border-blue-500 hover:shadow-md group"
                >
                  <IconComponent className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600 mb-3 sm:mb-4 group-hover:text-blue-700 transition-colors" />
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
                    {card.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600">{card.description}</p>
                </a>
              );
            })}
          </div>

          {/* FAQ Section Header */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Find answers to common questions about Synapse
            </p>
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-3 mb-12 sm:mb-16">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg border border-gray-200 transition-all duration-300 hover:border-gray-300"
                >
                  {/* Question Header */}
                  <button
                    onClick={() => toggleOpen(item.id)}
                    className="w-full flex items-center justify-between p-5 sm:p-6 text-left hover:bg-gray-50 transition-colors rounded-lg"
                  >
                    <div className="flex-1 pr-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
                          {item.category}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                        {item.question}
                      </h3>
                    </div>
                    <ChevronDownIcon
                      className={`w-5 h-5 text-gray-500 transition-transform duration-300 flex-shrink-0 ${
                        openId === item.id ? "rotate-180 text-blue-600" : ""
                      }`}
                    />
                  </button>

                  {/* Answer Content */}
                  {openId === item.id && (
                    <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0">
                      <div className="pl-4 border-l-2 border-blue-200">
                        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="bg-white rounded-lg p-12 sm:p-16 text-center border border-gray-200">
                <svg
                  className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <h3 className="font-semibold text-gray-900 mb-2">
                  No results found
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Try another keyword or contact our support team
                </p>
              </div>
            )}
          </div>

          {/* Contact Support CTA */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg p-6 sm:p-8 mb-12 shadow-lg shadow-blue-500/20">
            <div className="max-w-2xl mx-auto text-center">
              <ChatBubbleLeftRightIcon className="w-8 h-8 sm:w-10 sm:h-10 text-white mx-auto mb-3" />
              <h2 className="text-lg sm:text-xl font-bold text-white mb-2">
                Still Need Help?
              </h2>
              <p className="text-blue-50 mb-5 text-sm sm:text-base">
                The Synapse support team is ready to help you 24/7. Contact us
                for further questions or technical assistance.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-6">
                <button className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base">
                  <ChatBubbleLeftRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  Contact Support
                </button>
                <a
                  href="/status"
                  className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-all duration-300 border border-white/30 flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  Check Service Status
                </a>
              </div>

              {/* Contact Info */}
              <div className="pt-5 border-t border-white/20">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 justify-center text-blue-50 text-xs sm:text-sm">
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      className="w-4 h-4 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="break-all">synapsebioapp@gmail.com</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      className="w-4 h-4 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Response time: ~2 hours
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Resources */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 pb-8">
            <div className="bg-white rounded-lg p-5 sm:p-6 border border-gray-200 hover:border-blue-300 transition-colors">
              <LightBulbIcon className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600 mb-3 sm:mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
                Tips & Tricks
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-4">
                Maximize your Synapse usage with tips from experts
              </p>
              <a
                href="/tips"
                className="text-blue-600 text-xs sm:text-sm font-medium hover:text-blue-700 flex items-center gap-1 inline-flex"
              >
                Learn more
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </a>
            </div>

            <div className="bg-white rounded-lg p-5 sm:p-6 border border-gray-200 hover:border-blue-300 transition-colors">
              <ShieldCheckIcon className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600 mb-3 sm:mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
                Security & Privacy
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-4">
                Learn how we protect your data security
              </p>
              <button
                onClick={() => setIsSecurityModalOpen(true)}
                className="text-blue-600 text-xs sm:text-sm font-medium hover:text-blue-700 flex items-center gap-1"
              >
                Read policy
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>

            <div className="bg-white rounded-lg p-5 sm:p-6 border border-gray-200 hover:border-blue-300 transition-colors">
              <DocumentTextIcon className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600 mb-3 sm:mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Changelog</h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-4">
                Latest updates and new features we've released
              </p>
              <a
                href="/changelog"
                className="text-blue-600 text-xs sm:text-sm font-medium hover:text-blue-700 flex items-center gap-1 inline-flex"
              >
                View updates
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <SecurityModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
      />

      <QuickStartModal
        isOpen={isQuickStartModalOpen}
        onClose={() => setIsQuickStartModalOpen(false)}
      />

      <DocumentationModal
        isOpen={isDocumentationModalOpen}
        onClose={() => setIsDocumentationModalOpen(false)}
      />
    </Layout>
  );
};

export default SupportPage;