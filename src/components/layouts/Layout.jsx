import { useState, useEffect, useCallback } from "react";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check screen size
  const checkScreenSize = useCallback(() => {
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);

    if (mobile) {
      setIsCollapsed(true);
    } else {
      setIsCollapsed(false);
      setMobileMenuOpen(false);
    }
  }, []);

  useEffect(() => {
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, [checkScreenSize]);

  // Toggle mobile menu
  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

  // Close mobile menu
  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  // Handle sidebar collapse (desktop only)
  const handleSidebarCollapse = useCallback(
    (collapsed) => {
      if (!isMobile) {
        setIsCollapsed(collapsed);
      }
    },
    [isMobile]
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Menu Button - Hanya muncul di mobile dan ketika sidebar tertutup */}
      {isMobile && !mobileMenuOpen && (
        <button
          onClick={toggleMobileMenu}
          className="fixed top-4 left-4 z-50 p-3 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 transition-colors md:hidden focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Open menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      )}

      {/* Mobile Overlay */}
      {isMobile && mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`
        fixed left-0 top-0 h-full z-40
        transition-all duration-300 ease-in-out
        ${
          isMobile
            ? mobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full"
            : isCollapsed
            ? "w-16"
            : "w-64"
        }
      `}
      >
        <Sidebar
          onCollapseChange={handleSidebarCollapse}
          isMobile={isMobile}
          mobileMenuOpen={mobileMenuOpen}
          onCloseMobileMenu={closeMobileMenu}
          isCollapsed={isCollapsed}
        />
      </div>

      {/* MAIN CONTENT */}
      <main
        className={`
        flex-1 w-full min-h-screen
        transition-all duration-300 ease-in-out
        ${
          isMobile
            ? "ml-0 pt-20 px-4 sm:px-6"
            : isCollapsed
            ? "ml-16 p-6"
            : "ml-64 p-6"
        }
      `}
      >
        {children}
      </main>
    </div>
  );
}