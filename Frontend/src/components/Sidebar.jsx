import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import sevaLogo from "../assets/seva_logo.png";
import {
  Users,
  User,
  Home,
  GraduationCap,
  Building2,
  UserMinus,
  School,
  Trophy,
  Book,
  Heart,
  Stethoscope,
  Baby,
  Users2,
  Shield,
  Scale,
  Briefcase,
  FileText,
  Gavel,
  Megaphone,
  ChevronRight,
  Activity,
  Syringe,
  Pill,
  Cross,
  ClipboardCheck,
  BookOpen,
  Award,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";


const Sidebar = ({ sidebarOpen, setSidebarOpen, activeItem = null }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/signin");
  };

  // Determine active tab based on current pathname
  const getActiveTab = () => {
    const pathname = location.pathname;
    if (pathname.startsWith("/education/")) return "education";
    if (pathname.startsWith("/health/")) return "health";
    if (pathname.startsWith("/social-justice/")) return "socialJustice";
    return null;
  };

  const [activeTab, setActiveTab] = useState(getActiveTab());

  // Update active tab when location changes
  useEffect(() => {
    setActiveTab(getActiveTab());
  }, [location.pathname]);

  // Check if user has permission for a module
  const hasModuleAccess = (module) => {
    if (!user) return false;
    if (user.role === "admin") return true;
    // Check if user has any permission for this module (view, create, edit, delete, export)
    return user.permissions?.some(p => p.startsWith(`${module}:`));
  };

  const tabs = {
    education: {
      name: "Education",
      icon: GraduationCap,
      module: "education",
      subtabs: [
        {
          name: "Study Centers",
          icon: Building2,
          path: "/education/study-centers",
        },
        { name: "SC Students", icon: Users, path: "/education/sc-students" },
        { name: "Teachers", icon: BookOpen, path: "/education/teachers" },
        {
          name: "Group Leaders",
          icon: Award,
          path: "/education/group-leaders",
        },
        { name: "Dropouts", icon: UserMinus, path: "/education/dropouts" },
        { name: "Schools", icon: School, path: "/education/schools" },
        {
          name: "Competitive Exams",
          icon: Trophy,
          path: "/education/competitive-exams",
        },
        {
          name: "Board Preparation",
          icon: Book,
          path: "/education/board-preparation",
        },
      ],
    },
    health: {
      name: "Health",
      icon: Heart,
      module: "health",
      subtabs: [
        {
          name: "Health Camps",
          icon: Stethoscope,
          path: "/health/health-camps",
        },
        { name: "Elderly", icon: Users2, path: "/health/elderly" },
        { name: "Mother & Child", icon: Baby, path: "/health/mother-child" },
        { name: "PwD", icon: User, path: "/health/pwd" },
        { name: "Adolescents", icon: Users, path: "/health/adolescents" },
        { name: "Tuberculosis", icon: Activity, path: "/health/tuberculosis" },
        { name: "HIV", icon: Shield, path: "/health/hiv" },
        { name: "Leprosy", icon: Cross, path: "/health/leprosy" },
        { name: "Addiction", icon: Pill, path: "/health/addiction" },
        {
          name: "Other Diseases",
          icon: Syringe,
          path: "/health/other-diseases",
        },
      ],
    },
    socialJustice: {
      name: "Social Justice",
      icon: Scale,
      module: "socialJustice",
      subtabs: [
        {
          name: "CBUCBO Details",
          icon: Briefcase,
          path: "/social-justice/cbucbo-details",
        },
        {
          name: "Entitlements",
          icon: FileText,
          path: "/social-justice/entitlements",
        },
        {
          name: "Legal Aid Services",
          icon: Gavel,
          path: "/social-justice/legal-aid",
        },
        {
          name: "Workshops & Awareness",
          icon: Megaphone,
          path: "/social-justice/workshops",
        },
      ],
    },
  };

  // Filter tabs based on user permissions
  const accessibleTabs = Object.entries(tabs).filter(([tabKey, tab]) => 
    hasModuleAccess(tab.module)
  );

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-80 bg-card shadow-2xl transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 min-h-screen flex flex-col border-r border-border`}
      >
        <div className="flex items-center justify-between h-20 px-4 border-b border-border bg-gradient-to-br from-primary via-primary/95 to-accent shadow-lg flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white rounded-xl shadow-lg">
              <img src={sevaLogo} alt="Seva Kendra" className="w-10 h-10 object-contain" />
            </div>
            <div className="hidden lg:block">
              <span className="text-lg font-bold text-white leading-tight">Seva Kendra</span>
              <p className="text-xs text-white/80 font-medium">CRM System</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 mt-6 overflow-y-auto pb-4 overflow-x-hidden">
          {/* Dashboard Link */}
          <div className="px-4 mb-6">
            <Link
              to="/dashboard"
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                location.pathname === "/dashboard"
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground hover:shadow-sm"
              }`}
            >
              <Home className="mr-3 h-5 w-5" />
              Dashboard
            </Link>
          </div>

          {/* Tracking Link */}
          <div className="px-4 mb-6">
            <Link
              to="/tracking"
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                location.pathname === "/tracking"
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground hover:shadow-sm"
              }`}
            >
              <ClipboardCheck className="mr-3 h-5 w-5" />
              Follow-ups & Tracking
            </Link>
          </div>

          {/* Module Reports Link */}
          <div className="px-4 mb-6">
            <Link
              to="/module-reports"
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                location.pathname === "/module-reports"
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground hover:shadow-sm"
              }`}
            >
              <FileText className="mr-3 h-5 w-5" />
              Module Reports
            </Link>
          </div>

          {/* User Management Link - Admin Only */}
          {user?.role === "admin" && (
            <div className="px-4 mb-6">
              <Link
                to="/users"
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  location.pathname === "/users"
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground hover:shadow-sm"
                }`}
              >
                <Settings className="mr-3 h-5 w-5" />
                User Management
              </Link>
            </div>
          )}

          {/* Tabbed Navigation */}
          <div className="px-4">
            {accessibleTabs.map(([tabKey, tab]) => (
              <div key={tabKey} className="mb-4">
                {/* Main Tab Header */}
                <button
                  onClick={() =>
                    setActiveTab(activeTab === tabKey ? null : tabKey)
                  }
                  className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    activeTab === tabKey
                      ? "bg-gradient-to-r from-primary to-accent text-white shadow-md hover:shadow-lg"
                      : "text-foreground hover:bg-secondary/80 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-center">
                    <tab.icon className="mr-3 h-5 w-5" />
                    {tab.name}
                  </div>
                  <ChevronRight
                    className={`h-4 w-4 transition-transform ${
                      activeTab === tabKey ? "rotate-90" : ""
                    }`}
                  />
                </button>

                {/* Subtabs */}
                {activeTab === tabKey && (
                  <div className="mt-2 ml-4 space-y-1">
                    {tab.subtabs.map((subtab) => {
                      const isActive = location.pathname === subtab.path;
                      return (
                        <Link
                          key={subtab.name}
                          to={subtab.path}
                          className={`flex items-center px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
                            isActive
                              ? "bg-primary/10 text-primary font-medium shadow-sm border-l-2 border-primary"
                              : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                          }`}
                        >
                          <subtab.icon className="mr-3 h-4 w-4" />
                          {subtab.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </nav>
        {/* User Info and Logout */}
        <div className="border-t border-border p-4 mt-auto">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email}
              </p>
              <span className="text-xs text-primary capitalize">
                {user?.role}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
