import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Loader2, ExternalLink } from "lucide-react";

function PublicBundlePage() {
  const { slug } = useParams();
  const [bundle, setBundle] = useState(null);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (slug) {
      fetchBundleData();
    }
  }, [slug]);

  const fetchBundleData = async () => {
    try {
      setLoading(true);
      setError(null);

      const API_BASE = import.meta.env.VITE_API_BASE_URL;

      console.log("Fetching bundle with slug:", slug);

      // Fetch bundle data (sudah include links)
      const bundleResponse = await fetch(`${API_BASE}/b/${slug}`);

      if (!bundleResponse.ok) {
        throw new Error("Bundle not found");
      }

      const bundleData = await bundleResponse.json();
      console.log("Bundle data:", bundleData);

      setBundle(bundleData.data);

      // Set links dari bundle data
      if (bundleData.data && bundleData.data.links) {
        console.log("Setting links:", bundleData.data.links);
        setLinks(bundleData.data.links);
      }
    } catch (err) {
      console.error("Error loading bundle:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLinkClick = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-base-content/70 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100 p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-error"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-base-content mb-2">
            Bundle Not Found
          </h1>
          <p className="text-base-content/70">
            The bundle you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      data-theme={bundle?.theme?.name || "light"}
      className="min-h-screen bg-base-100"
    >
      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");

        * {
          font-family: "Inter", sans-serif;
        }

        .link-card {
          transition: all 0.2s ease;
        }

        .link-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
        }

        .social-icon {
          transition: all 0.2s ease;
        }

        .social-icon:hover {
          transform: scale(1.1);
        }

        .fade-in {
          animation: fadeIn 0.6s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="fade-in">
          {/* Profile Section */}
          <div className="text-center mb-8">
            {/* Avatar */}
            <div className="w-32 h-32 mx-auto mb-6 relative">
              {bundle?.profile_image_url ? (
                <img
                  src={bundle.profile_image_url}
                  alt={bundle.name}
                  className="w-full h-full rounded-full object-cover border-4 border-base-200 shadow-xl"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-4xl font-bold shadow-xl">
                  {bundle?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
              )}
            </div>

            {/* Name */}
            <h1 className="text-3xl font-bold text-base-content mb-3">
              {bundle?.name}
            </h1>

            {/* Description */}
            {bundle?.description && (
              <p className="text-base-content/70 max-w-md mx-auto mb-6 text-lg">
                {bundle.description}
              </p>
            )}

            {/* Social Media Icons */}
            {(bundle?.instagram_url ||
              bundle?.github_url ||
              bundle?.tiktok_url ||
              bundle?.youtube_url ||
              bundle?.facebook_url ||
              bundle?.x_url) && (
              <div className="flex gap-3 justify-center flex-wrap mb-8">
                {bundle.instagram_url && (
                  <a
                    href={bundle.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon btn btn-circle bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-0 text-white"
                    aria-label="Instagram"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                )}

                {bundle.github_url && (
                  <a
                    href={bundle.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon btn btn-circle bg-gray-800 hover:bg-gray-900 border-0 text-white"
                    aria-label="GitHub"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </a>
                )}

                {bundle.tiktok_url && (
                  <a
                    href={bundle.tiktok_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon btn btn-circle bg-black hover:bg-gray-900 border-0 text-white"
                    aria-label="TikTok"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                    </svg>
                  </a>
                )}

                {bundle.youtube_url && (
                  <a
                    href={bundle.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon btn btn-circle bg-red-600 hover:bg-red-700 border-0 text-white"
                    aria-label="YouTube"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                    </svg>
                  </a>
                )}

                {bundle.facebook_url && (
                  <a
                    href={bundle.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon btn btn-circle bg-blue-600 hover:bg-blue-700 border-0 text-white"
                    aria-label="Facebook"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                    </svg>
                  </a>
                )}

                {bundle.x_url && (
                  <a
                    href={bundle.x_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon btn btn-circle bg-black hover:bg-gray-900 border-0 text-white"
                    aria-label="X (Twitter)"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                )}
              </div>
            )}
          </div>
          {/* Custom Links */}
          <div className="space-y-4">
            {links.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-base-content/50 text-lg">No links yet</p>
              </div>
            ) : (
              links.map((link, index) => (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.url)}
                  className="link-card w-full btn btn-primary btn-lg h-auto min-h-[60px] text-base font-semibold shadow-md normal-case justify-between"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  <span className="flex-1 text-left">{link.name}</span>
                  <ExternalLink size={20} className="flex-shrink-0 ml-2" />
                </button>
              ))
            )}
          </div>
          {/* Footer */}
          <div className="text-center mt-12 pt-8 border-t border-base-300">
            <p className="text-base-content/50 text-sm">
              Powered by{" "}
              <a
                href="https://synapze.my.id"
                className="font-semibold text-primary hover:underline transition-all"
              >
                Synapze
              </a>
            </p>
          </div>{" "}
        </div>
      </div>
    </div>
  );
}

export default PublicBundlePage;