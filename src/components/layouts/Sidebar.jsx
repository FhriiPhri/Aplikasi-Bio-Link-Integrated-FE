import {
  Home, Search, Bell, Mail, Inbox,
  ClipboardList, Settings, HelpCircle, FileText
} from "lucide-react";
import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";

import icon2 from "../../assets/icon2.png";

export default function Sidebar() {
  const { user, logout } = useContext(AuthContext);

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

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

  return (
    <div className="w-56 h-full bg-white border-r flex flex-col relative">

      {/* TOP SECTION */}
      <div className="flex-1 overflow-y-auto px-4 pt-10 pb-4">

        {/* Logo */}
        <div className="px-2 pb-6 mb-6 border-b flex items-center gap-3 text-xl font-bold text-gray-800">
          <img
            src={icon2}
            alt="logo"
            className="w-8 h-8 rounded-md object-cover"
          />
          <span className="text-gray-800">Synapse</span>
        </div>

        {/* Menu */}
        <nav className="flex flex-col gap-1 text-gray-700">
          <SidebarItem icon={<Home size={18} />} label="Dashboard" to="/" />
          <SidebarItem icon={<Search size={18} />} label="Search" to="/search" />

          <div className="mt-4">
            <p className="px-3 text-xs text-gray-400 uppercase">Reporting</p>
            <SidebarItem icon={<ClipboardList size={18} />} label="Check-ins" to="/checkins" />
            <SidebarItem icon={<ClipboardList size={18} />} label="Objectives" to="/objectives" />
            <SidebarItem icon={<ClipboardList size={18} />} label="Career Hub" to="/career" />
          </div>

          <SidebarItem icon={<Bell size={18} />} label="Notifications" to="/notifications" />
          <SidebarItem icon={<Mail size={18} />} label="Mail" to="/mail" />
          <SidebarItem icon={<Inbox size={18} />} label="Inbox" to="/inbox" />
          <SidebarItem icon={<ClipboardList size={18} />} label="Kanban" to="/kanban" />
          <SidebarItem icon={<ClipboardList size={18} />} label="Tasks" to="/tasks" />

          <div className="mt-4">
            <SidebarItem icon={<FileText size={18} />} label="Documentation" to="/docs" />
            <SidebarItem icon={<HelpCircle size={18} />} label="Support" to="/support" />
            <SidebarItem icon={<Settings size={18} />} label="Settings" to="/settings" />
          </div>
        </nav>
      </div>

      {/* USER PROFILE */}
      <div
        className="border-t p-4 flex items-center gap-3 sticky bottom-0 bg-white cursor-pointer"
        onClick={() => setOpen(!open)}
        ref={dropdownRef}
      >
        <img
          src={avatarUrl}
          className="w-10 h-10 rounded-full object-cover"
          alt="avatar"
        />

        <div className="flex flex-col overflow-hidden">
          <p className="font-medium text-sm text-gray-800 truncate">
            {user?.name || "Guest User"}
          </p>

          <p className="text-sm text-gray-500 truncate max-w-[150px]">
            {user?.email}
          </p>
        </div>

        {/* DROPDOWN */}
        {open && (
          <div className="absolute bottom-16 left-4 w-44 bg-white border shadow-lg rounded-xl p-2 z-50">

            {/* PROFILE LINK */}
            <Link
              to="/profile"
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5.121 17.804A4 4 0 018 16h8a4 4 0 012.879 1.804M12 12a4 4 0 100-8 4 4 0 000 8z"
                />
              </svg>
              Profile
            </Link>

            {/* LOGOUT */}
            <button
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100"
              onClick={logout}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12H3m12 0l-4-4m4 4l-4 4m8-12v16"
                />
              </svg>

              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, to }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer hover:bg-gray-100 text-gray-700"
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
}