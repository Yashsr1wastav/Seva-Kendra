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
  analyticsAPI,
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
  trackingAPI,
} from "../services/api";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState("last_30_days");
  const [activeView, setActiveView] = useState("overview");

  // Custom targets state
  const [isEditingTargets, setIsEditingTargets] = useState(false);
  const [targetInputs, setTargetInputs] = useState({
    health: 100,
    education: 150,
    socialJustice: 80,
  });

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
  const [quickInsights, setQuickInsights] = useState([]);
  const [expandedModules, setExpandedModules] = useState({
    health: false,
    education: false,
    socialJustice: false,
  });
  const [performanceData, setPerformanceData] = useState([]);
  const [urgentAlerts, setUrgentAlerts] = useState([]);

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
    const result = settled.value;
    
    // Handle different API response structures
    if (!result) return 0;
    
    // Structure 1: { data: { pagination: { total, count, totalRecords } } }
    if (result.data?.pagination) {
      return result.data.pagination.total ?? result.data.pagination.totalRecords ?? result.data.pagination.count ?? 0;
    }
    
    // Structure 2: { data: { data: [], pagination: {} } }
    if (result.data?.data?.pagination) {
      return result.data.data.pagination.total ?? result.data.data.pagination.count ?? 0;
    }
    
    // Structure 3: Direct array in data
    if (Array.isArray(result.data?.data)) return result.data.data.length;
    if (Array.isArray(result.data)) return result.data.length;
    
    // Structure 4: Legacy empty or single item
    return 0;
  };

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Use the new analytics API to get all dashboard data and stale urgent reminders
      const [dashboardResult, urgentAlertsResult] = await Promise.allSettled([
        analyticsAPI.getCompleteDashboard(dateRange),
        trackingAPI.getUrgentCaseAlerts(2),
      ]);

      if (dashboardResult.status !== "fulfilled") {
        throw dashboardResult.reason;
      }

      const data = dashboardResult.value.data;

      if (urgentAlertsResult.status === "fulfilled") {
        setUrgentAlerts(urgentAlertsResult.value.data || []);
      } else {
        setUrgentAlerts([]);
      }

      console.log("Complete Dashboard Data:", data);

      // Set overview stats from real data
      setOverviewStats({
        totalBeneficiaries: data.overview.totalBeneficiaries || 0,
        activeCases: data.overview.activeCases || 0,
        pendingLegalAid: data.overview.pendingLegalAid || 0,
        completedThisMonth: data.overview.completedCases || 0,
        recentBeneficiaries: data.overview.recentBeneficiaries || 0,
        urgentCases: data.overview.urgentCases || 0,
      });

      // Set module stats directly from analytics data
      const moduleBreakdown = data.overview.moduleBreakdown || { health: 0, education: 0, socialJustice: 0 };
      const moduleDetails = data.overview.moduleDetails || {};
      
      const healthStats = {
        totalCases: moduleBreakdown.health || 0,
        healthCamps: moduleDetails.healthCamps || 0,
        elderlySupport: moduleDetails.elderly || 0,
        motherChildCare: moduleDetails.motherChild || 0,
        adolescentPrograms: moduleDetails.adolescents || 0,
        tuberculosis: moduleDetails.tuberculosis || 0,
        hiv: moduleDetails.hiv || 0,
        leprosy: moduleDetails.leprosy || 0,
        addiction: moduleDetails.addiction || 0,
        otherDiseases: moduleDetails.otherDiseases || 0,
        pwdSupport: moduleDetails.pwd || 0,
      };

      const educationStats = {
        totalStudents: moduleBreakdown.education || 0,
        studyCenters: moduleDetails.studyCenters || 0,
        scStudents: moduleDetails.scStudents || 0,
        dropoutRecovery: moduleDetails.dropouts || 0,
        schools: moduleDetails.schools || 0,
        competitiveExams: moduleDetails.competitiveExams || 0,
        boardPreparation: moduleDetails.boardPreparation || 0,
      };

      const socialJusticeStats = {
        totalCases: moduleBreakdown.socialJustice || 0,
        cbucboDetails: moduleDetails.cbucbo || 0,
        entitlements: moduleDetails.entitlements || 0,
        legalAidServices: moduleDetails.legalAid || 0,
        workshops: moduleDetails.workshops || 0,
      };

      setModuleStats({
        health: healthStats,
        education: educationStats,
        socialJustice: socialJusticeStats,
      });

      // Set chart data from real analytics
      setChartData({
        monthlyTrends: data.charts.monthlyTrends || [],
        moduleDistribution: (data.charts.moduleDistribution || []).map((item, index) => ({
          ...item,
          color: index === 0 ? COLORS.health : index === 1 ? COLORS.education : COLORS.socialJustice
        })),
        genderDistribution: (data.charts.genderDistribution || []).map((item, index) => ({
          ...item,
          color: index === 0 ? COLORS.accentLight : COLORS.primary
        })),
        ageDistribution: data.charts.ageDistribution || [],
        statusDistribution: (data.charts.statusDistribution || []).map((item, index) => ({
          ...item,
          color: [COLORS.secondary, COLORS.accent, COLORS.primary, COLORS.mediumLight][index] || COLORS.primary
        })),
      });

      // Set recent activities
      setRecentActivities(data.recentActivities || []);

      // Set quick insights
      // Set quick insights
      setQuickInsights(data.quickInsights || []);

      // Load saved targets from localStorage
      const savedTargets = JSON.parse(localStorage.getItem("performance_targets") || "{}");
      const healthTarget = savedTargets.health || Math.max(100, healthStats.totalCases * 1.2);
      const educationTarget = savedTargets.education || Math.max(150, educationStats.totalStudents * 1.2);
      const socialJusticeTarget = savedTargets.socialJustice || Math.max(80, socialJusticeStats.totalCases * 1.2);

      setTargetInputs({
        health: Math.round(healthTarget),
        education: Math.round(educationTarget),
        socialJustice: Math.round(socialJusticeTarget),
      });

      // Generate performance data for comparison using actual module totals
      setPerformanceData([
        {
          id: "health",
          category: "Health Module Total",
          target: Math.round(healthTarget),
          completed: healthStats.totalCases,
          pending: Math.max(0, Math.round(healthTarget) - healthStats.totalCases),
        },
        {
          id: "education",
          category: "Education Module Total",
          target: Math.round(educationTarget),
          completed: educationStats.totalStudents,
          pending: Math.max(0, Math.round(educationTarget) - educationStats.totalStudents),
        },
        {
          id: "socialJustice",
          category: "Social Justice Total",
          target: Math.round(socialJusticeTarget),
          completed: socialJusticeStats.totalCases,
          pending: Math.max(0, Math.round(socialJusticeTarget) - socialJusticeStats.totalCases),
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
    const total = stats.totalCases || stats.totalStudents || 0;
    
    const categoryEntries = Object.entries(stats).filter(
      ([key]) => key !== "totalCases" && key !== "totalStudents"
    );

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
                  {categoryEntries.length} categories
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
              {categoryEntries.map(([key, value]) => (
                <div
                  key={key}
                  className={`p-3 rounded-lg border ${
                    color === "health"
                      ? "border-red-500/30 bg-red-500/10"
                      : color === "education"
                      ? "border-blue-500/30 bg-blue-500/10"
                      : "border-purple-500/30 bg-purple-500/10"
                  }`}
                >
                  <p className="text-xs font-medium text-foreground capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </p>
                  <p className="text-xl font-bold text-foreground">{value}</p>
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
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Performance Overview
          </div>
          <Button
            variant={isEditingTargets ? "default" : "outline"}
            size="sm"
            onClick={() => {
              if (isEditingTargets) {
                // Save
                localStorage.setItem("performance_targets", JSON.stringify(targetInputs));
                fetchDashboardData();
              }
              setIsEditingTargets(!isEditingTargets);
            }}
          >
            {isEditingTargets ? "Save Targets" : "Edit Targets"}
          </Button>
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
                const percentage = row.target > 0 ? Math.round((row.completed / row.target) * 100) : 0;
                const isComplete = percentage >= 100;
                return (
                  <tr
                    key={row.category}
                    className="border-b hover:bg-secondary"
                  >
                    <td className="py-3 px-4 font-medium">{row.category}</td>
                    <td className="text-center py-3 px-4">
                      {isEditingTargets ? (
                        <Input
                          type="number"
                          className="w-20 h-8 text-center mx-auto"
                          value={targetInputs[row.id] || ""}
                          onChange={(e) => setTargetInputs({ ...targetInputs, [row.id]: parseInt(e.target.value) || 0 })}
                        />
                      ) : (
                        row.target
                      )}
                    </td>
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
                  Seva Kendra Calcutta
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

            {urgentAlerts.length > 0 && (
              <Card className="border-red-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-700">
                    <AlertTriangle className="h-5 w-5" />
                    Urgent Follow-Up Alerts
                  </CardTitle>
                  <CardDescription>
                    {urgentAlerts.length} urgent case(s) have no updates in the last 2 days.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {urgentAlerts.slice(0, 5).map((alert) => (
                    <div key={alert.id} className="text-sm">
                      <span className="font-semibold">{alert.recordName}</span> - stale for {alert.staleDays} day(s)
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

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
                    {quickInsights.length > 0 ? (
                      quickInsights.map((insight, index) => (
                        <div
                          key={index}
                          className={`p-3 border-l-4 rounded-lg shadow-sm ${
                            insight.type === "success"
                              ? "bg-green-950/50 border-green-400"
                              : insight.type === "warning"
                              ? "bg-amber-900/80 border-amber-500"
                              : insight.type === "error"
                              ? "bg-red-900/80 border-red-500"
                              : "bg-blue-950/50 border-blue-400"
                          }`}
                        >
                          <p
                            className={`text-sm font-semibold ${
                              insight.type === "success"
                                ? "text-green-300"
                                : insight.type === "warning"
                                ? "text-amber-100"
                                : insight.type === "error"
                                ? "text-red-100"
                                : "text-blue-300"
                            }`}
                          >
                            {insight.type === "success" ? "✓" : insight.type === "error" ? "!" : "→"} {insight.title}
                          </p>
                          <p
                            className={`text-xs mt-1 ${
                              insight.type === "success"
                                ? "text-green-200"
                                : insight.type === "warning"
                                ? "text-amber-200"
                                : insight.type === "error"
                                ? "text-red-200"
                                : "text-blue-200"
                            }`}
                          >
                            {insight.description}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 bg-blue-950/50 border-l-4 border-blue-400 rounded-lg shadow-sm">
                        <p className="text-sm font-semibold text-blue-300">
                          ✓ Health Module Leading
                        </p>
                        <p className="text-xs text-blue-200 mt-1">
                          Health programs show highest engagement with{" "}
                          {moduleStats.health.totalCases || 0} total cases
                        </p>
                      </div>
                    )}
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
