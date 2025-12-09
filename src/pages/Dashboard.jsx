import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import Layout from "../components/layouts/Layout";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [showWelcomeToast, setShowWelcomeToast] = useState(false);

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
      `}</style>

      {/* CONTENT */}
      <div className="max-w-5xl mx-auto mt-6 px-6">
        <div className="bg-white shadow-lg rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            Welcome back, {user?.name} 👋
          </h2>
          <p className="text-gray-600">
            This is your dashboard. You can place your analytics, charts, or
            menu here.
          </p>
        </div>

        {/* Example Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Users</h3>
            <p className="text-3xl font-bold text-indigo-600">120</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Orders</h3>
            <p className="text-3xl font-bold text-indigo-600">45</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
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