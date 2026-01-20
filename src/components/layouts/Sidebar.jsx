import {
  Home,
  Search,
  Bell,
  Mail,
  Inbox,
  ClipboardList,
  Settings,
  HelpCircle,
  FileText,
  Users,
  UserCircle,
  X,
  LogOut,
  ChevronRight,
  ChevronLeft,
  MessageSquare,
  Target,
  Briefcase,
  Calendar,
  CheckSquare,
  FolderKanban,
  FileCheck,
  BookOpen,
  LifeBuoy,
  Shield,
  Database,
  Star,
  BarChart2,
  Package,
} from "lucide-react";
import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";

import icon2 from "../../assets/icon2.png";

export default function Sidebar({
  onCollapseChange,
  isMobile,
  mobileMenuOpen,
  onCloseMobileMenu,
  isCollapsed,
}) {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [internalCollapsed, setInternalCollapsed] = useState(isCollapsed);

  const dropdownRef = useRef(null);
  const sidebarRef = useRef(null);
  const isAdmin = user?.role === "admin";

  // Sync with parent collapsed state
  useEffect(() => {
    setInternalCollapsed(isCollapsed);
  }, [isCollapsed]);

  // Close dropdown ketika klik di luar
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get avatar URL from user or use default
  const avatarUrl = user?.avatar_url || "https://i.pravatar.cc/40";

  // Close mobile menu on route change
  useEffect(() => {
    if (isMobile && onCloseMobileMenu) {
      onCloseMobileMenu();
    }
  }, [location.pathname, isMobile, onCloseMobileMenu]);

  // Toggle sidebar collapse (desktop only)
  const toggleCollapse = () => {
    const newCollapsed = !internalCollapsed;
    setInternalCollapsed(newCollapsed);
    if (onCollapseChange) {
      onCollapseChange(newCollapsed);
    }
  };

  // Handle menu item click
  const handleMenuItemClick = (to) => {
    if (isMobile && onCloseMobileMenu) {
      onCloseMobileMenu();
    }
    navigate(to);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    setOpen(false);
    if (isMobile && onCloseMobileMenu) {
      onCloseMobileMenu();
    }
  };

  return (
    <div
      ref={sidebarRef}
      className="h-full w-full bg-white border-r border-gray-200 flex flex-col"
    >
      {/* Mobile Header dengan close button */}
      {isMobile && mobileMenuOpen && (
        <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={icon2}
              alt="logo"
              className="w-8 h-8 rounded-md object-cover"
            />
            <span className="text-lg font-bold text-gray-800">Menu</span>
          </div>
          <button
            onClick={onCloseMobileMenu}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>
      )}

      {/* Desktop Header dengan toggle button */}
      {!isMobile && (
        <div
          className={`sticky top-0 z-50 bg-white border-b border-gray-200 px-${
            internalCollapsed ? "4" : "5"
          } py-4 flex items-center ${
            internalCollapsed ? "justify-center" : "justify-between"
          }`}
        >
          <div
            className={`flex items-center gap-3 ${
              internalCollapsed ? "justify-center" : ""
            }`}
          >
            <img
              src={icon2}
              alt="logo"
              className="w-8 h-8 rounded-md object-cover"
            />
            {!internalCollapsed && (
              <span className="text-lg font-bold text-gray-800">Synapse</span>
            )}
          </div>
          {!internalCollapsed && (
            <button
              onClick={toggleCollapse}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Collapse sidebar"
            >
              <ChevronLeft size={20} className="text-gray-600" />
            </button>
          )}
        </div>
      )}

      {/* TOP SECTION */}
      <div
        className={`flex-1 overflow-y-auto px-${
          internalCollapsed ? "3" : "4"
        } pb-4 ${isMobile && mobileMenuOpen ? "pt-4" : "pt-6"}`}
      >
        {/* Menu untuk desktop collapsed */}
        {!isMobile && internalCollapsed ? (
          <nav className="flex flex-col gap-2 pt-4">
            {/* ADMIN COLLAPSED MENU */}
            {isAdmin ? (
              <>
                <SidebarItemCollapsed
                  icon={<Home size={22} />}
                  label="Dashboard"
                  to="/admin"
                  onClick={() => handleMenuItemClick("/admin")}
                />
                <SidebarItemCollapsed
                  icon={<Package size={22} />}
                  label="Manage Bundles"
                  to="/admin/bundles"
                  onClick={() => handleMenuItemClick("/admin/bundles")}
                />
                <SidebarItemCollapsed
                  icon={<UserCircle size={22} />}
                  label="Appeals"
                  to="/banding"
                  onClick={() => handleMenuItemClick("/banding")}
                />
              </>
            ) : (
              /* USER COLLAPSED MENU */
              <>
                <SidebarItemCollapsed
                  icon={<Home size={22} />}
                  label="Dashboard"
                  to="/dashboard"
                  onClick={() => handleMenuItemClick("/dashboard")}
                />
                <SidebarItemCollapsed
                  icon={<Home size={22} />}
                  label="My Page"
                  to="/bundles-page"
                  onClick={() => handleMenuItemClick("/bundles-page")}
                />
                <SidebarItemCollapsed
                  icon={<Star size={22} />}
                  label="Premium Pack"
                  to="/premium-pack"
                  onClick={() => handleMenuItemClick("/premium-pack")}
                />
                <SidebarItemCollapsed
                  icon={<Bell size={22} />}
                  label="Notifications"
                  to="/notifications"
                  onClick={() => handleMenuItemClick("/notifications")}
                />
              </>
            )}
            
            {/* SHARED - Profile (both admin & user) */}
            <SidebarItemCollapsed
              icon={<UserCircle size={22} />}
              label="Profile"
              to="/profile"
              onClick={() => handleMenuItemClick("/profile")}
            />

            <div className="mt-6 pt-6 border-t border-gray-200">
              <SidebarItemCollapsed
                icon={<ChevronRight size={22} />}
                label="Expand"
                onClick={toggleCollapse}
              />
            </div>
          </nav>
        ) : (
          /* Menu lengkap untuk desktop expanded atau mobile */
          <nav className="flex flex-col gap-1.5 text-gray-700">
            {/* ============================================ */}
            {/* ADMIN MENU */}
            {/* ============================================ */}
            {isAdmin ? (
              <>
                {/* Admin Main Navigation */}
                <SidebarItem
                  icon={<Home size={20} />}
                  label="Dashboard"
                  to="/admin"
                  onClick={() => handleMenuItemClick("/admin")}
                />
                <SidebarItem
                  icon={<Package size={20} />}
                  label="Manage Bundles"
                  to="/admin/bundles"
                  onClick={() => handleMenuItemClick("/admin/bundles")}
                />

                {/* Admin Support Section */}
                <div className="mt-6 mb-2">
                  <p className="px-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Support
                  </p>
                </div>
                <SidebarItem
                  icon={<UserCircle size={20} />}
                  label="Appeals"
                  to="/banding"
                  onClick={() => handleMenuItemClick("/banding")}
                />
                <SidebarItem
                  icon={<Settings size={20} />}
                  label="Settings"
                  to="/settings"
                  onClick={() => handleMenuItemClick("/settings")}
                />
              </>
            ) : (
              /* ============================================ */
              /* USER MENU */
              /* ============================================ */
              <>
                {/* User Main Navigation */}
                <SidebarItem
                  icon={<Home size={20} />}
                  label="Dashboard"
                  to="/dashboard"
                  onClick={() => handleMenuItemClick("/dashboard")}
                />

                {/* Main Menu Section */}
                <div className="mt-6 mb-2">
                  <p className="px-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Main Menu
                  </p>
                </div>
                <SidebarItem
                  icon={<Home size={20} />}
                  label="My Page"
                  to="/bundles-page"
                  onClick={() => handleMenuItemClick("/bundles-page")}
                />
                <SidebarItem
                  icon={<Star size={20} />}
                  label="Premium Pack"
                  to="/premium-pack"
                  onClick={() => handleMenuItemClick("/premium-pack")}
                />
                <SidebarItem
                  icon={<BarChart2 size={20} />}
                  label="Analystic History"
                  to="/career"
                  onClick={() => handleMenuItemClick("/career")}
                />

                {/* Communication */}
                <div className="mt-6 mb-2">
                  <p className="px-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Communication
                  </p>
                </div>
                <SidebarItem
                  icon={<Bell size={20} />}
                  label="Notifications"
                  to="/notifications"
                  onClick={() => handleMenuItemClick("/notifications")}
                />

                {/* Help & Settings */}
                <div className="mt-6 mb-2">
                  <p className="px-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Support
                  </p>
                </div>
                <SidebarItem
                  icon={<FileText size={20} />}
                  label="Documentation"
                  to="/docs"
                  onClick={() => handleMenuItemClick("/docs")}
                />
                <SidebarItem
                  icon={<BookOpen size={20} />}
                  label="Knowledge Base"
                  to="/knowledge"
                  onClick={() => handleMenuItemClick("/knowledge")}
                />
                <SidebarItem
                  icon={<LifeBuoy size={20} />}
                  label="Support"
                  to="/support"
                  onClick={() => handleMenuItemClick("/support")}
                />
                <SidebarItem
                  icon={<Settings size={20} />}
                  label="Settings"
                  to="/settings"
                  onClick={() => handleMenuItemClick("/settings")}
                />
              </>
            )}

            {/* ============================================ */}
            {/* SHARED MENU (both admin & user) */}
            {/* ============================================ */}
            <div className="mt-6 mb-2">
              <p className="px-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                Account
              </p>
            </div>
            <SidebarItem
              icon={<UserCircle size={20} />}
              label="Profile"
              to="/profile"
              onClick={() => handleMenuItemClick("/profile")}
            />
          </nav>
        )}
      </div>

      {/* USER PROFILE SECTION - Hanya untuk desktop expanded atau mobile */}
      {(!isMobile && !internalCollapsed) || (isMobile && mobileMenuOpen) ? (
        <div
          className="border-t border-gray-200 px-4 py-4 flex items-center gap-3 sticky bottom-0 bg-white cursor-pointer hover:bg-gray-50 transition-colors group"
          onClick={() => setOpen(!open)}
          ref={dropdownRef}
        >
          <div className="relative">
            <img
              src={avatarUrl}
              className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 group-hover:border-gray-300 transition-colors"
              alt="User avatar"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
          </div>

          <div className="flex flex-col overflow-hidden flex-1 min-w-0">
            <p className="font-semibold text-sm text-gray-900 truncate">
              {user?.name || "Guest User"}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.email || "guest@example.com"}
            </p>
          </div>

          {/* DROPDOWN MENU */}
          {open && (
            <div
              className="
              absolute left-4 right-4
              bottom-16 bg-white border border-gray-200 shadow-xl rounded-lg p-2 z-50
              animate-scaleIn
            "
            >
              {/* LOGOUT */}
              <button
                className="w-full flex items-center gap-3 px-3 py-2.5 text-red-500 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 text-red transition-colors"
                onClick={handleLogout}
              >
                <LogOut size={18} className="text-red-500" />
                <div className="flex-1 text-left">
                  <p>Logout</p>
                  <p className="text-xs text-red-500">
                    Sign out of your account
                  </p>
                </div>
              </button>
            </div>
          )}
        </div>
      ) : !isMobile && internalCollapsed ? (
        /* User avatar mini untuk desktop collapsed */
        <div className="border-t border-gray-200 p-4 flex items-center justify-center group">
          <div className="relative">
            <img
              src={avatarUrl}
              className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 group-hover:border-gray-300 transition-colors cursor-pointer"
              alt="User avatar"
              onClick={() => setOpen(!open)}
            />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

// Sidebar Item untuk expanded state
function SidebarItem({ icon, label, to, onClick }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  const handleClick = (e) => {
    e.preventDefault();
    if (onClick) {
      onClick();
    }
  };

  return (
    <Link
      to={to}
      className={`
        flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all cursor-pointer
        ${
          isActive
            ? "bg-indigo-50 text-indigo-700 border-l-4 border-indigo-500"
            : "text-gray-700 hover:bg-gray-100 border-l-4 border-transparent"
        }
      `}
      onClick={handleClick}
    >
      <div
        className={`
        ${isActive ? "text-indigo-600" : "text-gray-500"}
      `}
      >
        {icon}
      </div>
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
}

// Sidebar Item untuk collapsed state
function SidebarItemCollapsed({ icon, label, to, onClick }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  const handleClick = (e) => {
    if (to) {
      e.preventDefault();
    }
    if (onClick) {
      onClick();
    }
  };

  return (
    <div
      className={`
        flex items-center justify-center p-2.5 rounded-lg transition-all cursor-pointer
        ${
          isActive && to
            ? "bg-indigo-50 text-indigo-600"
            : "text-gray-600 hover:bg-gray-100"
        }
      `}
      onClick={handleClick}
      title={label}
    >
      <div
        className={`
        ${isActive && to ? "text-indigo-600" : "text-gray-500"}
      `}
      >
        {icon}
      </div>
    </div>
  );
}