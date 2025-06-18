import { LogOut, Menu } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();

  useEffect(() => {
    console.log("👤 Logged-in User:", user);
  }, [user]);

  const getWelcomeMessage = () => {
    if (!user) return "👋 Welcome Back, Guest";

    const name = user.name || "";
    const role = (user.role || "").toLowerCase();

    switch (role) {
      case "superadmin":
        return `👋 Welcome Back Super Admin, ${name}`;
      case "admin":
        return `👋 Welcome Back Admin, ${name}`;
      case "user":
        return `👋 Welcome Back`;
      default:
        return `👋 Welcome Back, ${name}`;
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Sidebar toggle button (mobile only) */}
        <button
          className="sm:hidden text-gray-700 mr-3"
          onClick={onMenuClick}
          aria-label="Toggle sidebar"
        >
          <Menu size={24} />
        </button>

        {/* Welcome Message - hidden on small screens */}
        <h1 className="hidden sm:block text-xl font-semibold text-gray-800 flex-1 text-left">
          {getWelcomeMessage()}
        </h1>

        {/* Right side: Role badge and Logout */}
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-xs sm:text-sm font-medium bg-green-100 text-green-800 px-2 sm:px-3 py-1 rounded-full capitalize">
            {user?.role || "user"}
          </span>
          <button
            onClick={logout}
            className="flex items-center justify-center gap-2 px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm bg-red-500 hover:bg-red-600 text-white transition-colors"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
