import { useState, useEffect } from "react";
import { 
  Link2, 
  MousePointerClick, 
  Package, 
  Eye, 
  TrendingUp,
  ExternalLink,
  Activity,
  BarChart3,
  ArrowUpRight,
  Sparkles,
  HelpCircle,
  BookOpen,
  MessageCircle
} from "lucide-react";
import Layout from "../../components/layouts/Layout";

function DashboardPage() {
  const [stats, setStats] = useState({
    totalBundles: 0,
    totalLinks: 0,
    totalClicks: 0,
    activeBundles: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentBundles, setRecentBundles] = useState([]);
  const [topBundles, setTopBundles] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch("/api/user/bundles", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch data");

      const result = await response.json();
      const bundles = result.data;

      setStats({
        totalBundles: bundles.length,
        totalLinks: bundles.reduce((acc, b) => acc + (b.links?.length || 0), 0),
        totalClicks: bundles.reduce((acc, b) => acc + (b.clicks || 0), 0),
        activeBundles: bundles.filter(b => b.is_active).length,
      });

      setRecentBundles(bundles.slice(0, 5));

      const sorted = [...bundles].sort((a, b) => (b.clicks || 0) - (a.clicks || 0));
      setTopBundles(sorted.slice(0, 5));

    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-100 border-t-blue-600 mx-auto"></div>
            <p className="mt-6 text-gray-700 font-semibold text-lg">Loading dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap");

        .dashboard-page {
          font-family: "Inter", sans-serif;
        }

        .stat-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          background: white;
          border: 1px solid #e5e7eb;
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px -12px rgba(59, 130, 246, 0.15);
          border-color: #dbeafe;
        }

        .activity-item {
          transition: all 0.2s ease;
        }

        .activity-item:hover {
          background: #f9fafb;
          transform: translateX(4px);
        }

        .support-card {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          transition: all 0.3s ease;
        }

        .support-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 20px 40px -12px rgba(37, 99, 235, 0.4);
        }

        .help-card {
          transition: all 0.3s ease;
          border: 2px solid #e5e7eb;
        }

        .help-card:hover {
          border-color: #3b82f6;
          transform: translateY(-2px);
          box-shadow: 0 8px 16px -4px rgba(59, 130, 246, 0.2);
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

        .animate-slide-up {
          animation: slideUp 0.4s ease-out forwards;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>

      <div className="dashboard-page">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
          {/* Header */}
          <div className="mb-6 md:mb-8 animate-slide-up">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl sm:rounded-2xl flex items-center justify-center">
                <BarChart3 className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                  Dashboard
                </h1>
                <p className="text-gray-600 text-xs sm:text-sm mt-1">
                  Welcome back! Here's your overview
                </p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 md:mb-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
            {/* Total Bundles */}
            <div className="stat-card rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6">
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <Package className="text-white" size={18} />
                </div>
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 sm:px-3 py-1 rounded-full">
                  Total
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                {stats.totalBundles}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 font-medium">Total Bundles</p>
            </div>

            {/* Total Links */}
            <div className="stat-card rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6">
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <Link2 className="text-white" size={18} />
                </div>
                <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 sm:px-3 py-1 rounded-full">
                  Links
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                {stats.totalLinks}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 font-medium">Total Links</p>
            </div>

            {/* Total Clicks */}
            <div className="stat-card rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6">
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <MousePointerClick className="text-white" size={18} />
                </div>
                <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 sm:px-3 py-1 rounded-full">
                  Clicks
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                {stats.totalClicks.toLocaleString()}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 font-medium">Total Clicks</p>
            </div>

            {/* Active Bundles */}
            <div className="stat-card rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6">
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <Eye className="text-white" size={18} />
                </div>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 sm:px-3 py-1 rounded-full">
                  Active
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                {stats.activeBundles}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 font-medium">Active Bundles</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Left Column - 2/3 width */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* Need Help Section */}
              <div className="support-card rounded-xl sm:rounded-2xl p-6 sm:p-8 text-white animate-slide-up cursor-pointer" 
                   style={{ animationDelay: '200ms' }}
                   onClick={() => window.location.href = '/support'}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                  <div className="flex-shrink-0 animate-float">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center">
                      <HelpCircle className="text-white" size={28} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl sm:text-2xl font-bold mb-2 flex items-center gap-2">
                      Need Help?
                      <Sparkles size={18} className="animate-pulse" />
                    </h2>
                    <p className="text-blue-100 mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base">
                      Get assistance with your bundles, explore documentation, watch tutorials, or contact our support team 24/7.
                    </p>
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <span>Visit Support Center</span>
                      <ArrowUpRight size={16} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Help Resources Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 animate-slide-up" style={{ animationDelay: '250ms' }}>
                <button
                  onClick={() => window.location.href = '/support?tab=documentation'}
                  className="help-card bg-white rounded-xl p-4 sm:p-5 text-left"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                    <BookOpen className="text-blue-600" size={20} />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1 text-sm sm:text-base">Documentation</h3>
                  <p className="text-xs text-gray-600">Complete guides & tutorials</p>
                </button>

                <button
                  onClick={() => window.location.href = '/support?tab=faq'}
                  className="help-card bg-white rounded-xl p-4 sm:p-5 text-left"
                >
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mb-3">
                    <HelpCircle className="text-indigo-600" size={20} />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1 text-sm sm:text-base">FAQs</h3>
                  <p className="text-xs text-gray-600">Common questions answered</p>
                </button>

                <button
                  onClick={() => window.location.href = '/support?tab=contact'}
                  className="help-card bg-white rounded-xl p-4 sm:p-5 text-left"
                >
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                    <MessageCircle className="text-purple-600" size={20} />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1 text-sm sm:text-base">Contact Us</h3>
                  <p className="text-xs text-gray-600">Get personalized support</p>
                </button>
              </div>

              {/* Top Performing Bundles */}
              <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 border border-gray-200 animate-slide-up" style={{ animationDelay: '300ms' }}>
                <div className="flex items-center justify-between mb-4 sm:mb-5">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="text-blue-600" size={18} />
                    <h2 className="text-base sm:text-lg font-bold text-gray-900">Top Performing</h2>
                  </div>
                  <button
                    onClick={() => window.location.href = '/bundles'}
                    className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 transition-colors"
                  >
                    <span className="hidden xs:inline">View All</span>
                    <ExternalLink size={14} />
                  </button>
                </div>

                {topBundles.length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <Package className="text-gray-300 mx-auto mb-3" size={40} />
                    <p className="text-gray-600 font-medium mb-2 text-sm sm:text-base">No bundles yet</p>
                    <p className="text-xs sm:text-sm text-gray-500 mb-4">Create your first bundle to see performance</p>
                    <button
                      onClick={() => window.location.href = '/bundles?action=create'}
                      className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-xs sm:text-sm"
                    >
                      <Package size={16} />
                      Create Bundle
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2 sm:space-y-3">
                    {topBundles.map((bundle, index) => (
                      <div
                        key={bundle.id}
                        className="activity-item flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-200 cursor-pointer"
                        onClick={() => window.location.href = `/bundles/${bundle.id}/edit`}
                      >
                        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-xs sm:text-sm">#{index + 1}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate text-sm sm:text-base">{bundle.name}</h3>
                          <p className="text-xs text-gray-600 font-mono truncate">/{bundle.slug}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 sm:gap-1.5 text-blue-600 font-bold text-sm sm:text-base">
                            <MousePointerClick size={14} className="sm:w-4 sm:h-4" />
                            <span>{(bundle.clicks || 0).toLocaleString()}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">clicks</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - 1/3 width */}
            <div className="space-y-4 sm:space-y-6">
              {/* Recent Activity */}
              <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 border border-gray-200 animate-slide-up" style={{ animationDelay: '400ms' }}>
                <div className="flex items-center gap-2 mb-4 sm:mb-5">
                  <Activity className="text-blue-600" size={18} />
                  <h2 className="text-base sm:text-lg font-bold text-gray-900">Recent Bundles</h2>
                </div>

                {recentBundles.length === 0 ? (
                  <div className="text-center py-6 sm:py-8">
                    <Package className="text-gray-300 mx-auto mb-2" size={36} />
                    <p className="text-xs sm:text-sm text-gray-600">No recent activity</p>
                  </div>
                ) : (
                  <div className="space-y-2 sm:space-y-3">
                    {recentBundles.map((bundle) => (
                      <div
                        key={bundle.id}
                        className="activity-item p-3 rounded-lg border border-gray-200 cursor-pointer"
                        onClick={() => window.location.href = `/bundles/${bundle.id}/edit`}
                      >
                        <div className="flex items-start gap-2 sm:gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Link2 className="text-white" size={14} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-xs sm:text-sm text-gray-900 truncate">
                              {bundle.name}
                            </h3>
                            <p className="text-xs text-gray-500 font-mono truncate">
                              /{bundle.slug}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Performance Summary */}
              <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl sm:rounded-2xl p-5 sm:p-6 text-white animate-slide-up" style={{ animationDelay: '500ms' }}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <BarChart3 className="text-white" size={18} />
                  </div>
                  <h2 className="text-base sm:text-lg font-bold">Performance</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs sm:text-sm font-medium opacity-90">Click Rate</span>
                      <span className="text-xs sm:text-sm font-bold">
                        {stats.totalLinks > 0 
                          ? Math.round((stats.totalClicks / stats.totalLinks) * 100) 
                          : 0}%
                      </span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div 
                        className="bg-white rounded-full h-2 transition-all duration-1000"
                        style={{ 
                          width: `${stats.totalLinks > 0 
                            ? Math.min((stats.totalClicks / stats.totalLinks) * 100, 100) 
                            : 0}%` 
                        }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs sm:text-sm font-medium opacity-90">Active Bundles</span>
                      <span className="text-xs sm:text-sm font-bold">
                        {stats.totalBundles > 0 
                          ? Math.round((stats.activeBundles / stats.totalBundles) * 100) 
                          : 0}%
                      </span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div 
                        className="bg-white rounded-full h-2 transition-all duration-1000"
                        style={{ 
                          width: `${stats.totalBundles > 0 
                            ? Math.round((stats.activeBundles / stats.totalBundles) * 100) 
                            : 0}%` 
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/20">
                    <p className="text-xs opacity-90 leading-relaxed">
                      {stats.totalBundles > 0 
                        ? "Great job! Keep creating and sharing your bundles." 
                        : "Start creating bundles to see your performance metrics."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default DashboardPage;