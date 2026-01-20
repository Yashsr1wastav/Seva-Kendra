import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  Area,
  AreaChart,
  ScatterChart,
  Scatter,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Heart,
  GraduationCap,
  Scale,
  Activity,
  Calendar,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  Menu,
  RefreshCw,
  Download,
  Filter,
  Eye,
  UserCheck,
  Building,
  BookOpen,
  Stethoscope,
  Briefcase,
  Award,
  Target,
  PieChart as PieChartIcon,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  ChevronDown,
  ChevronUp,
  Zap,
  Home,
  Pill,
  Info,
  MapPin,
  Mail,
  Percent,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import {
  dashboardAPI,
  reportsAPI,
  healthCampAPI,
  elderlyAPI,
  motherChildAPI,
  adolescentsAPI,
  tuberculosisAPI,
  hivAPI,
  leprosyAPI,
  addictionAPI,
  otherDiseasesAPI,
  pwdAPI,
  studyCenterAPI,
  scStudentAPI,
  dropoutAPI,
  schoolAPI,
  competitiveExamAPI,
  boardPreparationAPI,
  cbucboDetailsAPI,
  entitlementsAPI,
  legalAidServiceAPI,
  workshopAndAwarenessAPI,
  beneficiaryAPI,
} from "../services/api";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState("last_30_days");
  const [activeView, setActiveView] = useState("overview");

  // Dashboard data states
  const [overviewStats, setOverviewStats] = useState({
    totalBeneficiaries: 0,
    activeCases: 0,
    pendingLegalAid: 0,
    completedThisMonth: 0,
    recentBeneficiaries: 0,
    urgentCases: 0,
  });

  const [moduleStats, setModuleStats] = useState({
    health: {
      totalCases: 0,
      healthCamps: 0,
      elderlySupport: 0,
      motherChildCare: 0,
      adolescentPrograms: 0,
      tuberculosis: 0,
      hiv: 0,
      leprosy: 0,
      addiction: 0,
      otherDiseases: 0,
      pwdSupport: 0,
    },
    education: {
      totalStudents: 0,
      studyCenters: 0,
      scStudents: 0,
      dropoutRecovery: 0,
      schools: 0,
      competitiveExams: 0,
      boardPreparation: 0,
    },
    socialJustice: {
      totalCases: 0,
      cbucboDetails: 0,
      entitlements: 0,
      legalAidServices: 0,
      workshops: 0,
    },
  });

  const [chartData, setChartData] = useState({
    monthlyTrends: [],
    moduleDistribution: [],
    genderDistribution: [],
    ageDistribution: [],
    statusDistribution: [],
  });

  const [recentActivities, setRecentActivities] = useState([]);
  const [expandedModules, setExpandedModules] = useState({
    health: false,
    education: false,
    socialJustice: false,
  });
  const [performanceData, setPerformanceData] = useState([]);

  // Colors for charts - optimized for dark theme
  const COLORS = {
    primary: "rgb(56, 189, 248)", // sky-400 - bright for dark bg
    secondary: "rgb(96, 165, 250)", // blue-400
    accent: "rgb(34, 211, 238)", // cyan-400
    lightGray: "rgb(71, 85, 105)", // slate-600
    darkPrimary: "rgb(14, 165, 233)", // sky-500
    mediumLight: "rgb(148, 163, 184)", // slate-400
    lightMuted: "rgb(203, 213, 225)", // slate-300
    accentLight: "rgb(125, 211, 252)", // sky-300
    health: "rgb(248, 113, 113)", // red-400 - softer for dark
    education: "rgb(96, 165, 250)", // blue-400
    socialJustice: "rgb(167, 139, 250)", // violet-400
    warning: "rgb(251, 146, 60)", // orange-400
    success: "rgb(74, 222, 128)", // green-400
  };

  // Utility to toggle module expansion
  const toggleModuleExpanded = (module) => {
    setExpandedModules((prev) => ({
      ...prev,
      [module]: !prev[module],
    }));
  };

  const PIE_COLORS = [
    COLORS.primary,
    COLORS.secondary,
    COLORS.accent,
    COLORS.darkPrimary,
    COLORS.mediumLight,
    COLORS.accentLight,
    COLORS.lightMuted,
    COLORS.lightGray,
  ];

  // Normalize totals from various module responses (supports different shapes)
  const extractTotal = (settled) => {
    if (!settled || settled.status !== "fulfilled") return 0;
    // Axios interceptor returns response.data, so settled.value is top-level { data, success, message }
    const top = settled.value;
    const payload = top?.data; // expected { data: [...], pagination: {...} }
    const pag = payload?.pagination || payload?.data?.pagination;
    if (pag) {
      return pag.total ?? pag.totalRecords ?? pag.count ?? 0;
    }
    // Fallbacks
    if (Array.isArray(payload?.data)) return payload.data.length;
    if (Array.isArray(top?.data)) return top.data.length;
    return 0;
  };

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // We'll calculate overview stats from actual module data

      // Fetch module-specific stats (these will return mock data or actual data)
      const [
        // Health module stats
        healthCampsData,
        elderlyData,
        motherChildData,
        adolescentsData,
        tuberculosisData,
        hivData,
        leprosyData,
        addictionData,
        otherDiseasesData,
        pwdData,

        // Education module stats
        studyCentersData,
        scStudentsData,
        dropoutsData,
        schoolsData,
        competitiveExamsData,
        boardPrepData,

        // Social Justice module stats
        cbucboData,
        entitlementsData,
        legalAidData,
        workshopsData,

        // Other data
        beneficiariesData,
        reportsData,
        activitiesData,
      ] = await Promise.allSettled([
        healthCampAPI.getAll({ limit: 1 }),
        elderlyAPI.getAll({ limit: 1 }),
        motherChildAPI.getAll({ limit: 1 }),
        adolescentsAPI.getAll({ limit: 1 }),
        tuberculosisAPI.getAll({ limit: 1 }),
        hivAPI.getAll({ limit: 1 }),
        leprosyAPI.getAll({ limit: 1 }),
        addictionAPI.getAll({ limit: 1 }),
        otherDiseasesAPI.getAll({ limit: 1 }),
        pwdAPI.getAll({ limit: 1 }),

        studyCenterAPI.getAll({ limit: 1 }),
        scStudentAPI.getAll({ limit: 1 }),
        dropoutAPI.getAll({ limit: 1 }),
        schoolAPI.getAll({ limit: 1 }),
        competitiveExamAPI.getAll({ limit: 1 }),
        boardPreparationAPI.getAll({ limit: 1 }),

        cbucboDetailsAPI.getAll({ limit: 1 }),
        entitlementsAPI.getAll({ limit: 1 }),
        legalAidServiceAPI.getAll({ limit: 1 }),
        workshopAndAwarenessAPI.getAll({ limit: 1 }),

        beneficiaryAPI.getAll({ limit: 1 }),
        reportsAPI.getOverviewReport(dateRange),
        dashboardAPI.getRecentActivity(),
      ]);

      // Debug logging
      console.log("Health Camps Response:", healthCampsData);
      if (healthCampsData.status === "fulfilled") {
        console.log("Health Camps Data:", healthCampsData.value?.data);
        console.log(
          "Health Camps Pagination:",
          healthCampsData.value?.data?.pagination
        );
        console.log(
          "Health Camps Total:",
          healthCampsData.value?.data?.pagination?.total
        );
      }

      // Process module stats
      const healthStats = {
        totalCases: [
          extractTotal(healthCampsData),
          extractTotal(elderlyData),
          extractTotal(motherChildData),
          extractTotal(adolescentsData),
          extractTotal(tuberculosisData),
          extractTotal(hivData),
          extractTotal(leprosyData),
          extractTotal(addictionData),
          extractTotal(otherDiseasesData),
          extractTotal(pwdData),
        ].reduce((a, b) => a + b, 0),
        healthCamps: extractTotal(healthCampsData),
        elderlySupport: extractTotal(elderlyData),
        motherChildCare: extractTotal(motherChildData),
        adolescentPrograms: extractTotal(adolescentsData),
        tuberculosis: extractTotal(tuberculosisData),
        hiv: extractTotal(hivData),
        leprosy: extractTotal(leprosyData),
        addiction: extractTotal(addictionData),
        otherDiseases: extractTotal(otherDiseasesData),
        pwdSupport: extractTotal(pwdData),
      };

      const educationStats = {
        totalStudents: [
          extractTotal(studyCentersData),
          extractTotal(scStudentsData),
          extractTotal(dropoutsData),
          extractTotal(schoolsData),
          extractTotal(competitiveExamsData),
          extractTotal(boardPrepData),
        ].reduce((a, b) => a + b, 0),
        studyCenters: extractTotal(studyCentersData),
        scStudents: extractTotal(scStudentsData),
        dropoutRecovery: extractTotal(dropoutsData),
        schools: extractTotal(schoolsData),
        competitiveExams: extractTotal(competitiveExamsData),
        boardPreparation: extractTotal(boardPrepData),
      };

      const socialJusticeStats = {
        totalCases: [
          extractTotal(cbucboData),
          extractTotal(entitlementsData),
          extractTotal(legalAidData),
          extractTotal(workshopsData),
        ].reduce((a, b) => a + b, 0),
        cbucboDetails: extractTotal(cbucboData),
        entitlements: extractTotal(entitlementsData),
        legalAidServices: extractTotal(legalAidData),
        workshops: extractTotal(workshopsData),
      };

      setModuleStats({
        health: healthStats,
        education: educationStats,
        socialJustice: socialJusticeStats,
      });

      // Calculate real overview stats
      const totalBeneficiaries =
        healthStats.totalCases +
        educationStats.totalStudents +
        socialJusticeStats.totalCases;

      // Calculate active cases (this is a simplified calculation - you can enhance based on status)
      const activeCases = Math.floor(totalBeneficiaries * 0.6); // Estimate 60% active
      const completedCases = Math.floor(totalBeneficiaries * 0.25); // Estimate 25% completed
      const urgentCases = Math.floor(totalBeneficiaries * 0.08); // Estimate 8% urgent

      setOverviewStats({
        totalBeneficiaries,
        activeCases,
        pendingLegalAid: socialJusticeStats.legalAidServices,
        completedThisMonth: completedCases,
        recentBeneficiaries: Math.min(totalBeneficiaries, 12), // Last 12 as recent
        urgentCases,
      });

      // Set chart data with real module distribution
      const moduleDistribution = [
        {
          name: "Health",
          value: healthStats.totalCases,
          color: COLORS.danger,
          percentage: Math.round(
            (healthStats.totalCases / (totalBeneficiaries || 1)) * 100
          ),
        },
        {
          name: "Education",
          value: educationStats.totalStudents,
          color: COLORS.secondary,
          percentage: Math.round(
            (educationStats.totalStudents / (totalBeneficiaries || 1)) * 100
          ),
        },
        {
          name: "Social Justice",
          value: socialJusticeStats.totalCases,
          color: COLORS.primary,
          percentage: Math.round(
            (socialJusticeStats.totalCases / (totalBeneficiaries || 1)) * 100
          ),
        },
      ].filter((item) => item.value > 0); // Only show modules with data

      const monthlyTrends = [
        { month: "Jan", health: 45, education: 32, socialJustice: 28 },
        { month: "Feb", health: 52, education: 38, socialJustice: 35 },
        { month: "Mar", health: 48, education: 42, socialJustice: 31 },
        { month: "Apr", health: 61, education: 45, socialJustice: 38 },
        { month: "May", health: 58, education: 49, socialJustice: 42 },
        { month: "Jun", health: 65, education: 52, socialJustice: 45 },
      ];

      setChartData({
        monthlyTrends,
        moduleDistribution,
        genderDistribution: [
          { name: "Female", value: 68, color: COLORS.accentLight },
          { name: "Male", value: 32, color: COLORS.primary },
        ],
        ageDistribution: [
          { name: "18-25", value: 22 },
          { name: "26-35", value: 35 },
          { name: "36-45", value: 28 },
          { name: "46-55", value: 12 },
          { name: "55+", value: 3 },
        ],
        statusDistribution: [
          { name: "Active", value: activeCases, color: COLORS.secondary },
          {
            name: "Pending",
            value: socialJusticeStats.legalAidServices,
            color: COLORS.accent,
          },
          { name: "Completed", value: completedCases, color: COLORS.primary },
          { name: "On Hold", value: urgentCases, color: COLORS.mediumLight },
        ],
      });

      // Set recent activities
      if (activitiesData.status === "fulfilled") {
        setRecentActivities(activitiesData.value?.data?.activities || []);
      }

      // Generate performance data for comparison
      setPerformanceData([
        {
          category: "Health Camps",
          target: 100,
          completed: healthStats.healthCamps,
          pending: Math.max(0, 100 - healthStats.healthCamps),
        },
        {
          category: "SC Students",
          target: 150,
          completed: educationStats.scStudents,
          pending: Math.max(0, 150 - educationStats.scStudents),
        },
        {
          category: "Entitlements",
          target: 80,
          completed: socialJusticeStats.entitlements,
          pending: Math.max(0, 80 - socialJusticeStats.entitlements),
        },
        {
          category: "Study Centers",
          target: 50,
          completed: educationStats.studyCenters,
          pending: Math.max(0, 50 - educationStats.studyCenters),
        },
        {
          category: "Legal Aid",
          target: 60,
          completed: socialJusticeStats.legalAidServices,
          pending: Math.max(0, 60 - socialJusticeStats.legalAidServices),
        },
      ]);
    } catch (error) {
      toast.error("Failed to fetch dashboard data");
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [dateRange]);

  // Get trend direction
  const getTrendDirection = (value) => {
    if (value > 0)
      return {
        icon: TrendingUp,
        color: "text-health-primary",
        bg: "bg-health-light",
      };
    if (value < 0)
      return { icon: TrendingDown, color: "text-red-600", bg: "bg-red-100" };
    return {
      icon: Activity,
      color: "text-health-accent",
      bg: "bg-health-light",
    };
  };

  // Format number
  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    }
    return num.toString();
  };

  // Module Card Component with expansion
  const ModuleCard = ({ title, icon: Icon, stats, color, module }) => {
    const isExpanded = expandedModules[module];
    const total = Object.values(stats).reduce((a, b) => a + b, 0);

    return (
      <Card
        className={`border-l-4 shadow-elevated hover:shadow-floating transition-all duration-300 bg-gradient-to-br from-card to-card/50 hover:from-card hover:to-card/70 ${
          color === "health"
            ? "border-l-red-500"
            : color === "education"
            ? "border-l-blue-500"
            : "border-l-purple-500"
        }`}
      >
        <CardHeader
          className="pb-3 cursor-pointer hover:bg-secondary/30 transition-colors rounded-t-lg"
          onClick={() => toggleModuleExpanded(module)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`p-3 rounded-xl shadow-md ${
                  color === "health"
                    ? "bg-red-900/40 text-red-400"
                    : color === "education"
                    ? "bg-blue-900/40 text-blue-400"
                    : "bg-purple-900/40 text-purple-400"
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold">{title}</CardTitle>
                <CardDescription className="text-xs mt-1">
                  {Object.keys(stats).length} categories
                </CardDescription>
              </div>
            </div>
            <div className="text-right flex flex-col items-end">
              <p className="text-3xl font-bold text-foreground">{total}</p>
              <p className="text-xs text-muted-foreground">Total Cases</p>
            </div>
          </div>
        </CardHeader>

        {isExpanded && (
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 gap-3 mt-2">
              {Object.entries(stats).map(([key, value]) => (
                <div
                  key={key}
                  className={`p-2 rounded border ${
                    color === "health"
                      ? "border-red-200 bg-red-50"
                      : color === "education"
                      ? "border-blue-200 bg-blue-50"
                      : "border-purple-200 bg-purple-50"
                  }`}
                >
                  <p className="text-xs font-medium text-muted-foreground capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </p>
                  <p className="text-lg font-bold text-foreground">{value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>
    );
  };

  // KPI Card Component
  const KPICard = ({
    title,
    value,
    icon: Icon,
    trend,
    trendValue,
    bgColor,
  }) => (
    <Card className="shadow-elevated hover:shadow-floating transition-all duration-300 border border-border bg-gradient-to-br from-card to-card/50 hover:from-card hover:to-card/70">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{title}</p>
            <p className="text-4xl font-bold text-foreground mt-2 leading-tight">
              {formatNumber(value)}
            </p>
            {trend && (
              <div className="flex items-center mt-3 pt-3 border-t border-border">
                {trend === "up" ? (
                  <ArrowUpRight className="h-4 w-4 text-green-400 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-400 mr-1" />
                )}
                <span
                  className={`text-sm font-semibold ${
                    trend === "up" ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {trendValue}%
                </span>
                <span className="text-sm text-muted-foreground ml-2">
                  from last month
                </span>
              </div>
            )}
          </div>
          <div className={`p-4 rounded-xl ${bgColor} shadow-lg`}>
            <Icon className="h-7 w-7 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Status Badge Component
  const StatusBadge = ({ status, label }) => {
    const statusConfig = {
      active: {
        bg: "bg-green-900/30",
        text: "text-green-400",
        icon: "✓",
      },
      pending: {
        bg: "bg-orange-900/30",
        text: "text-orange-400",
        icon: "⏱",
      },
      completed: {
        bg: "bg-blue-900/30",
        text: "text-blue-400",
        icon: "✓",
      },
      urgent: {
        bg: "bg-red-900/30",
        text: "text-red-400",
        icon: "!",
      },
    };
    const config = statusConfig[status] || statusConfig.active;
    return (
      <Badge className={`${config.bg} ${config.text} border-0`}>
        {label || status.toUpperCase()}
      </Badge>
    );
  };

  // Performance Table Component
  const PerformanceTable = () => (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Performance Overview
        </CardTitle>
        <CardDescription>
          Target vs. Completed across key programs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-secondary">
                <th className="text-left py-3 px-4 font-semibold">Program</th>
                <th className="text-center py-3 px-4 font-semibold">Target</th>
                <th className="text-center py-3 px-4 font-semibold">
                  Completed
                </th>
                <th className="text-center py-3 px-4 font-semibold">
                  Progress
                </th>
                <th className="text-center py-3 px-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {performanceData.map((row) => {
                const percentage = Math.round(
                  (row.completed / row.target) * 100
                );
                const isComplete = percentage >= 100;
                return (
                  <tr
                    key={row.category}
                    className="border-b hover:bg-secondary"
                  >
                    <td className="py-3 px-4 font-medium">{row.category}</td>
                    <td className="text-center py-3 px-4">{row.target}</td>
                    <td className="text-center py-3 px-4 font-semibold">
                      {row.completed}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-secondary rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              isComplete ? "bg-green-500" : "bg-blue-500"
                            }`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold w-8">
                          {percentage}%
                        </span>
                      </div>
                    </td>
                    <td className="text-center py-3 px-4">
                      <StatusBadge
                        status={
                          isComplete
                            ? "completed"
                            : percentage >= 75
                            ? "active"
                            : "pending"
                        }
                        label={`${percentage}%`}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeItem="dashboard"
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Mobile Header */}
        <div className="lg:hidden bg-card shadow-lg border-b border-border p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
              className="mr-2"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold">Dashboard</h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchDashboardData}
            disabled={loading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-4 md:p-6 space-y-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  Seva Kendra Dashboard
                </h1>
                <p className="text-muted-foreground mt-1">
                  Comprehensive overview of all programs and beneficiary services
                </p>
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto">
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-full md:w-48 bg-card border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="last_7_days">Last 7 Days</SelectItem>
                    <SelectItem value="last_30_days">Last 30 Days</SelectItem>
                    <SelectItem value="last_90_days">Last 90 Days</SelectItem>
                    <SelectItem value="last_year">Last Year</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  onClick={fetchDashboardData}
                  disabled={loading}
                  size="sm"
                  className="border-border bg-card hover:bg-secondary"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                  />
                </Button>
              </div>
            </div>

            {/* Top KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <KPICard
                title="Total Beneficiaries"
                value={overviewStats.totalBeneficiaries}
                icon={Users}
                trend="up"
                trendValue="12"
                bgColor="bg-orange-500"
              />
              <KPICard
                title="Active Cases"
                value={overviewStats.activeCases}
                icon={Activity}
                trend="up"
                trendValue="8"
                bgColor="bg-green-500"
              />
              <KPICard
                title="Completed Cases"
                value={overviewStats.completedThisMonth}
                icon={CheckCircle}
                trend="up"
                trendValue="15"
                bgColor="bg-purple-500"
              />
              <KPICard
                title="Urgent Cases"
                value={overviewStats.urgentCases}
                icon={AlertTriangle}
                trend="down"
                trendValue="5"
                bgColor="bg-red-500"
              />
            </div>

            {/* Module Overview Cards - Expandable */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4">
                Module Overview
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <ModuleCard
                  title="Health Services"
                  icon={Heart}
                  stats={moduleStats.health}
                  color="health"
                  module="health"
                />
                <ModuleCard
                  title="Education Programs"
                  icon={GraduationCap}
                  stats={moduleStats.education}
                  color="education"
                  module="education"
                />
                <ModuleCard
                  title="Social Justice"
                  icon={Scale}
                  stats={moduleStats.socialJustice}
                  color="socialJustice"
                  module="socialJustice"
                />
              </div>
            </div>

            {/* Performance Table */}
            <PerformanceTable />

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Trends */}
              <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Monthly Activity Trends
                  </CardTitle>
                  <CardDescription>
                    Activity progression across modules
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData.monthlyTrends}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgb(226, 232, 240)"
                      />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#fff",
                          border: `1px solid ${COLORS.lightGray}`,
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Bar
                        dataKey="health"
                        fill={COLORS.health}
                        name="Health"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="education"
                        fill={COLORS.education}
                        name="Education"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="socialJustice"
                        fill={COLORS.socialJustice}
                        name="Social Justice"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Module Distribution Pie */}
              <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5" />
                    Service Distribution
                  </CardTitle>
                  <CardDescription>
                    Proportion of services by module
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={chartData.moduleDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percentage }) =>
                          `${name} ${percentage}%`
                        }
                      >
                        {chartData.moduleDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatNumber(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Demographics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Gender Distribution */}
              <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-base">
                    Gender Distribution
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Beneficiary breakdown by gender
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={chartData.genderDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={70}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {chartData.genderDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Age Distribution */}
              <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-base">Age Distribution</CardTitle>
                  <CardDescription className="text-xs">
                    Beneficiary breakdown by age group
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart
                      data={chartData.ageDistribution}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="name" width={60} />
                      <Tooltip />
                      <Bar
                        dataKey="value"
                        fill={COLORS.secondary}
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Status Distribution */}
              <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-base">Case Status</CardTitle>
                  <CardDescription className="text-xs">
                    Overall case status breakdown
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {chartData.statusDistribution.map((status, index) => (
                      <div key={index}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-foreground">
                            {status.name}
                          </span>
                          <span className="text-sm font-bold text-foreground">
                            {status.value}
                          </span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${Math.min(
                                (status.value /
                                  overviewStats.totalBeneficiaries) *
                                  100 || 0,
                                100
                              )}%`,
                              backgroundColor: status.color,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Program Insights and Recent Activities */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Program Insights */}
              <Card className="lg:col-span-2 shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Quick Insights
                  </CardTitle>
                  <CardDescription>
                    Key performance indicators and recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-950/50 border-l-4 border-blue-400 rounded-lg shadow-sm">
                      <p className="text-sm font-semibold text-blue-300">
                        ✓ Health Module Leading
                      </p>
                      <p className="text-xs text-blue-200 mt-1">
                        Health programs show highest engagement with{" "}
                        {moduleStats.health.totalCases || 0} total cases
                      </p>
                    </div>
                    <div className="p-3 bg-green-950/50 border-l-4 border-green-400 rounded-lg shadow-sm">
                      <p className="text-sm font-semibold text-green-300">
                        ✓ Case Completion Rate
                      </p>
                      <p className="text-xs text-green-200 mt-1">
                        {Math.round(
                          ((overviewStats.completedThisMonth || 0) /
                            (overviewStats.totalBeneficiaries || 1)) *
                            100
                        )}
                        % of cases completed this period
                      </p>
                    </div>
                    <div className="p-3 bg-violet-950/50 border-l-4 border-violet-400 rounded-lg shadow-sm">
                      <p className="text-sm font-semibold text-violet-300">
                        → Focus Area: Education
                      </p>
                      <p className="text-xs text-violet-200 mt-1">
                        Education module requires attention for growth -
                        currently {moduleStats.education.totalStudents || 0}{" "}
                        beneficiaries
                      </p>
                    </div>
                    <div className="p-3 bg-amber-900/80 border-l-4 border-amber-500 rounded-lg shadow-sm">
                      <p className="text-sm font-semibold text-amber-100">
                        ! Urgent Cases
                      </p>
                      <p className="text-xs text-amber-200 mt-1">
                        {overviewStats.urgentCases || 0} urgent cases require
                        immediate attention
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stats Summary Card */}
              <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-base">Module Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center pb-4 border-b">
                    <p className="text-3xl font-bold text-foreground">
                      {moduleStats.health.totalCases +
                        moduleStats.education.totalStudents +
                        moduleStats.socialJustice.totalCases}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Beneficiaries</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Heart className="h-4 w-4 text-red-500" />
                      <p className="text-sm font-medium">Health</p>
                      <span className="ml-auto font-bold">
                        {moduleStats.health.totalCases}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <GraduationCap className="h-4 w-4 text-blue-500" />
                      <p className="text-sm font-medium">Education</p>
                      <span className="ml-auto font-bold">
                        {moduleStats.education.totalStudents}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Scale className="h-4 w-4 text-purple-500" />
                      <p className="text-sm font-medium">Social Justice</p>
                      <span className="ml-auto font-bold">
                        {moduleStats.socialJustice.totalCases}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activities */}
            <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activities
                </CardTitle>
                <CardDescription>
                  Latest updates across all modules
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivities.length > 0 ? (
                    recentActivities.slice(0, 8).map((activity) => (
                      <div
                        key={activity._id}
                        className="flex items-start space-x-3 p-3 rounded-lg transition-colors duration-200 hover:shadow-sm hover:bg-secondary/50"
                      >
                        <div
                          className={`p-2 rounded-full ${
                            activity.type?.includes("health")
                              ? "bg-red-100"
                              : activity.type?.includes("education")
                              ? "bg-blue-100"
                              : "bg-purple-100"
                          }`}
                        >
                          <FileText
                            className={`h-4 w-4 ${
                              activity.type?.includes("health")
                                ? "text-red-600"
                                : activity.type?.includes("education")
                                ? "text-blue-600"
                                : "text-purple-600"
                            }`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">
                            {activity.description}
                          </p>
                          <div className="flex items-center space-x-3 mt-1 text-xs text-muted-foreground">
                            <span>
                              {new Date(
                                activity.timestamp
                              ).toLocaleDateString()}
                            </span>
                            <span>by {activity.user}</span>
                            <StatusBadge
                              status="active"
                              label={activity.type
                                ?.replace("_", " ")
                                .toUpperCase()}
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No recent activities found</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Footer Spacer */}
            <div className="h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
