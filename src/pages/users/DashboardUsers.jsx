import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import Layout from "../../components/layouts/Layout";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [showWelcomeToast, setShowWelcomeToast] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    // Check if user just logged in
    const justLoggedIn = localStorage.getItem("justLoggedIn");

    console.log("Dashboard mounted, justLoggedIn:", justLoggedIn); // Debug

    if (justLoggedIn === "true") {
      console.log("Showing toast!"); // Debug
      setShowWelcomeToast(true);
      localStorage.removeItem("justLoggedIn");

      // Auto hide after 4 seconds
      setTimeout(() => {
        setShowWelcomeToast(false);
      }, 4000);
    }
  }, []);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
    // Add your search logic here
  };

  return (
    <Layout>
      {/* Welcome Toast Notification */}
      {showWelcomeToast && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 animate-slideDown">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-100 p-4 flex items-center gap-4 min-w-[320px] max-w-md">
            {/* Success Icon */}
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            {/* Message */}
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">Welcome back!</h4>
              <p className="text-sm text-gray-600">
                You've successfully logged in.
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowWelcomeToast(false)}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translate(-50%, -20px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.4s ease-out;
        }
        
        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
          }
          50% {
            box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
          }
        }
        .animate-pulse-blue {
          animation: pulse 2s infinite;
        }
      `}</style>

      {/* CONTENT */}
      <div className="max-w-5xl mx-auto mt-6 px-6">
        {/* Header dengan Welcome dan Search Bar di pojok kanan */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              Welcome back, {user?.name} 👋
            </h2>
            <p className="text-gray-600">
              This is your dashboard. You can place your analytics, charts, or
              menu here.
            </p>
          </div>

          {/* Search Bar di Pojok Kanan Atas */}
          <div className="w-full md:w-auto">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative group">
                <div
                  className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none transition-all duration-300 ${
                    isSearchFocused
                      ? "text-blue-500"
                      : "text-gray-500 group-hover:text-blue-400"
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  placeholder="Search..."
                  className={`
                    w-full md:w-64 p-3 pl-10 text-sm text-gray-900 
                    bg-white rounded-lg shadow 
                    border transition-all duration-300
                    ${
                      isSearchFocused
                        ? "border-blue-500 ring-2 ring-blue-200 animate-pulse-blue"
                        : "border-gray-300 group-hover:border-blue-400 group-hover:shadow-md"
                    }
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  `}
                />
                {/* Hover effect overlay */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/0 via-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:via-blue-500/2 group-hover:to-blue-500/5 transition-all duration-300 pointer-events-none"></div>

                {/* Clear button when there's text */}
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="bg-white shadow-lg rounded-2xl p-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Dashboard Overview
          </h3>
          <p className="text-gray-600">
            Your dashboard analytics and important metrics are displayed below.
          </p>
        </div>

        {/* Example Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Users</h3>
            <p className="text-3xl font-bold text-indigo-600">120</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Orders</h3>
            <p className="text-3xl font-bold text-indigo-600">45</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Revenue
            </h3>
            <p className="text-3xl font-bold text-indigo-600">$3,200</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}