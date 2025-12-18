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
} from "@heroicons/react/24/outline";

// Import Modal Components (Modular & Easy Maintenance)
import SecurityModal from "../../components/modals/SecurityModal";
import QuickStartModal from "../../components/modals/QuickStartModal";
import DocumentationModal from "../../components/modals/DocumentationModal";

// --- FAQ Data (FINAL - Adjusted with Latest Clarifications) ---
const faqsData = [
  {
    id: 1,
    icon: "🎨",
    category: "Customization",
    question: "Can I customize colors or fonts outside of the provided themes?",
    answer:
      "Currently, Bundle appearance customization is only available through our ready-made themes. Custom color palette or font customization features are not yet available.",
  },
  {
    id: 2,
    icon: "💎",
    category: "Premium",
    question:
      "Does Synapse plan to offer Premium or paid features in the future?",
    answer:
      "Yes. This application is currently still in development. We plan to offer more advanced Premium features in the future for users who need in-depth analytics or business integrations.",
  },
  {
    id: 3,
    icon: "📊",
    category: "Analytics",
    question:
      "How can I find out how many times my Bundle has been viewed and accessed by others?",
    answer:
      "You can monitor your Bundle's performance on the main dashboard. Our system records all interactions in logs_bundle and logs_links, so you can see in detail the number of views and clicks for each link.",
  },
  {
    id: 4,
    icon: "🚀",
    category: "Getting Started",
    question: "What are the steps to create a new Bundle (Link-in-Bio page)?",
    answer:
      'The process is easy! You just need to click the "My Page" or "Bundles" menu. From there, you will be directed to choose your desired theme, and after that, you can start adding your social media links and custom links.',
  },
  {
    id: 5,
    icon: "🔒",
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
    icon: "🎯",
    title: "Quick Start Guide",
    description: "Learn Synapse basics in 5 minutes",
    link: "/guides/quickstart",
  },
  {
    id: 2,
    icon: "📖",
    title: "Documentation",
    description: "Complete documentation of Synapse features",
    link: "/docs",
  },
  {
    id: 3,
    icon: "🎥",
    title: "Video Tutorials",
    description: "Step-by-step video tutorials",
    link: "/tutorials",
  },
  {
    id: 4,
    icon: "💬",
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
      {/* FIXED: Proper background that covers entire viewport */}
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
        {/* Hero Header Section */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-400 rounded-xl flex items-center justify-center shadow-lg">
                <QuestionMarkCircleIcon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Help Center
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                  Hi, {user?.name || "there"}! How can we help you? 👋
                </p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mt-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for help, guides, or FAQ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-5 py-3.5 pl-12 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400"
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Quick Help Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {quickHelpCards.map((card) => {
              // Quick Start Guide opens modal instead of navigation
              if (card.id === 1) {
                return (
                  <button
                    key={card.id}
                    onClick={() => setIsQuickStartModalOpen(true)}
                    className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md border border-gray-100 transition-all duration-300 group hover:border-blue-200 text-left"
                  >
                    <div className="text-3xl mb-3">{card.icon}</div>
                    <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-sm text-gray-500">{card.description}</p>
                  </button>
                );
              }

              // Documentation opens modal instead of navigation
              if (card.id === 2) {
                return (
                  <button
                    key={card.id}
                    onClick={() => setIsDocumentationModalOpen(true)}
                    className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md border border-gray-100 transition-all duration-300 group hover:border-blue-200 text-left"
                  >
                    <div className="text-3xl mb-3">{card.icon}</div>
                    <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-sm text-gray-500">{card.description}</p>
                  </button>
                );
              }

              return (
                <a
                  key={card.id}
                  href={card.link}
                  className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md border border-gray-100 transition-all duration-300 group hover:border-blue-200"
                >
                  <div className="text-3xl mb-3">{card.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-sm text-gray-500">{card.description}</p>
                </a>
              );
            })}
          </div>

          {/* FAQ Section Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-500">
              Find answers to common questions about Synapse
            </p>
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-3 mb-12">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md"
                >
                  {/* Question Header */}
                  <button
                    onClick={() => toggleOpen(item.id)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors rounded-xl"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <span className="text-2xl mt-0.5 flex-shrink-0">
                        {item.icon}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                            {item.category}
                          </span>
                        </div>
                        <h3 className="font-semibold text-gray-900 text-base">
                          {item.question}
                        </h3>
                      </div>
                    </div>
                    <ChevronDownIcon
                      className={`w-5 h-5 text-gray-400 transition-transform duration-300 flex-shrink-0 ml-4 ${
                        openId === item.id ? "rotate-180 text-blue-600" : ""
                      }`}
                    />
                  </button>

                  {/* Answer Content */}
                  {openId === item.id && (
                    <div className="px-5 pb-5 pt-0">
                      <div className="ml-14 pl-4 border-l-2 border-blue-200">
                        <p className="text-gray-600 leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  No results found
                </h3>
                <p className="text-gray-500">
                  Try another keyword or contact our support team
                </p>
              </div>
            )}
          </div>

          {/* Contact Support CTA */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-400 rounded-2xl p-8 shadow-xl relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>

            <div className="relative z-10 max-w-3xl mx-auto text-center">
              <ChatBubbleLeftRightIcon className="w-12 h-12 text-white mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-3">
                Still Need Help?
              </h2>
              <p className="text-blue-100 mb-6 text-lg">
                The Synapse support team is ready to help you 24/7. Contact us
                for further questions or technical assistance.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <button className="px-8 py-3.5 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2">
                  <ChatBubbleLeftRightIcon className="w-5 h-5" />
                  Contact Support
                </button>
                <a
                  href="/status"
                  className="px-8 py-3.5 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/20 flex items-center gap-2"
                >
                  <CheckCircleIcon className="w-5 h-5" />
                  Check Service Status
                </a>
              </div>

              {/* Contact Info */}
              <div className="mt-8 pt-6 border-t border-white/20">
                <div className="flex flex-col sm:flex-row gap-6 justify-center text-white/90 text-sm">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
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
                    synapsebioapp@gmail.com
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
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
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 pb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <LightBulbIcon className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">
                Tips & Tricks
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Maximize your Synapse usage with tips from experts
              </p>
              <a
                href="/tips"
                className="text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center gap-1"
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

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <ShieldCheckIcon className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">
                Security & Privacy
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Learn how we protect your data security
              </p>
              {/* Click handler to open modal */}
              <button
                onClick={() => setIsSecurityModalOpen(true)}
                className="text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center gap-1"
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

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <svg
                className="w-8 h-8 text-blue-600 mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="font-semibold text-gray-900 mb-2">Changelog</h3>
              <p className="text-sm text-gray-500 mb-4">
                Latest updates and new features we've released
              </p>
              <a
                href="/changelog"
                className="text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center gap-1"
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

      {/* Security Modal - Imported from separate file for easy maintenance */}
      <SecurityModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
      />

      {/* Quick Start Modal - Imported from separate file for easy maintenance */}
      <QuickStartModal
        isOpen={isQuickStartModalOpen}
        onClose={() => setIsQuickStartModalOpen(false)}
      />

      {/* Documentation Modal - Imported from separate file for easy maintenance */}
      <DocumentationModal
        isOpen={isDocumentationModalOpen}
        onClose={() => setIsDocumentationModalOpen(false)}
      />
    </Layout>
  );
};

export default SupportPage;