import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  Home,
  PawPrint,
  Calendar,
  Users,
  VeganIcon,
} from "lucide-react";

const Sidebar = ({ onLinkClick }) => {
  const { user } = useAuth();
  const location = useLocation();

  const role = (user?.role || "USER").toUpperCase();
  const isActive = (path) => location.pathname.startsWith(path);

  const menuConfig = {
    USER: [
      { name: "Dashboard", path: "/user/dashboard", icon: <Home size={18} /> },
      { name: "My Pets", path: "/pets", icon: <PawPrint size={18} /> },
      { name: "Appointments", path: "/visits", icon: <Calendar size={18} /> },
    ],
    ADMIN: [
      { name: "Dashboard", path: "/admin/dashboard", icon: <Home size={18} /> },
      { name: "Pets", path: "/pets", icon: <PawPrint size={18} /> },
      { name: "Appointments", path: "/visits", icon: <Calendar size={18} /> },
      { name: "Vets", path: "/vets", icon: <VeganIcon size={18} /> },
      { name: "Owners", path: "/owner", icon: <Users size={18} /> },
    ],
    SUPERADMIN: [
      { name: "Dashboard", path: "/superadmin/dashboard", icon: <Home size={18} /> },
      { name: "Pets", path: "/pets", icon: <PawPrint size={18} /> },
      { name: "Appointments", path: "/visits", icon: <Calendar size={18} /> },
      { name: "Vets", path: "/vets", icon: <VeganIcon size={18} /> },
      { name: "Owners", path: "/owner", icon: <Users size={18} /> },
    ],
  };

  const menuItems = menuConfig[role] || menuConfig["USER"];

  return (
    <aside className="w-full sm:w-64 bg-green-700 text-white min-h-screen shadow-md flex flex-col">
      {/* Logo / Title */}
      <div className="px-6 py-5 text-2xl font-bold border-b border-green-600">
        🐾 PetClinic
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map(({ name, path, icon }) => (
          <Link
            key={name}
            to={path}
            onClick={onLinkClick} // ✅ optional close trigger
            aria-current={isActive(path) ? "page" : undefined}
            className={`flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              isActive(path) ? "bg-green-600" : "hover:bg-green-600"
            }`}
          >
            {icon}
            <span>{name}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
