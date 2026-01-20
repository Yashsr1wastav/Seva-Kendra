import React, { useState, useEffect } from "react";
import sevaLogo from "../assets/seva_logo.png";
import {
  BarChart3,
  FileText,
  Download,
  Calendar,
  Users,
  Scale,
  BookOpen,
  TrendingUp,
  Filter,
  RefreshCw,
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { reportsAPI } from "../services/api";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  color = "blue",
}) => {
  const colorClasses = {
    blue: "text-blue-600",
    green: "text-green-600",
    yellow: "text-yellow-600",
    purple: "text-purple-600",
    red: "text-red-600",
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center">
          <Icon className={`w-8 h-8 ${colorClasses[color]}`} />
          <div className="ml-4 flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            {trend && (
              <div className="flex items-center mt-1">
                <TrendingUp
                  className={`w-4 h-4 mr-1 ${
                    trend === "up" ? "text-green-500" : "text-red-500"
                  }`}
                />
                <span
                  className={`text-sm ${
                    trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {trendValue}%
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ChartCard = ({ title, children, actions }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-base font-semibold">{title}</CardTitle>
      {actions && <div className="flex gap-2">{actions}</div>}
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

const SimpleBarChart = ({ data, title }) => {
  const maxValue = Math.max(...data.map((item) => item.value));

  return (
    <div className="space-y-3">
      {data.map((item, index) => (
        <div key={index} className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{item.label}</span>
            <span className="font-medium">{item.value}</span>
          </div>
          <Progress value={(item.value / maxValue) * 100} className="h-2" />
        </div>
      ))}
    </div>
  );
};

const SimpleLineChart = ({ data, title }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
      {data.map((item, index) => (
        <div key={index} className="text-center">
          <div className="text-xs text-muted-foreground mb-1">{item.month}</div>
          <div className="h-16 bg-secondary rounded flex items-end justify-center">
            <div
              className="bg-blue-500 rounded-t w-6"
              style={{
                height: `${
                  (item.count / Math.max(...data.map((d) => d.count))) * 100
                }%`,
              }}
            />
          </div>
          <div className="text-xs font-medium mt-1">{item.count}</div>
        </div>
      ))}
    </div>
  </div>
);

const OverviewReport = ({ data, dateRange, onDateRangeChange }) => {
  if (!data) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      {/* Header with date range selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Overview Report</h2>
        <Select value={dateRange} onValueChange={onDateRangeChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="last_7_days">Last 7 Days</SelectItem>
            <SelectItem value="last_30_days">Last 30 Days</SelectItem>
            <SelectItem value="last_3_months">Last 3 Months</SelectItem>
            <SelectItem value="last_6_months">Last 6 Months</SelectItem>
            <SelectItem value="last_year">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Beneficiaries"
          value={data.summary.totalBeneficiaries}
          icon={Users}
          trend="up"
          trendValue={data.trends.beneficiaryGrowth}
          color="blue"
        />
        <StatCard
          title="Active Cases"
          value={data.summary.totalCases}
          icon={Scale}
          trend="up"
          trendValue={data.trends.caseResolutionRate}
          color="green"
        />
        <StatCard
          title="Legal Aid Provided"
          value={data.summary.totalLegalAid}
          icon={FileText}
          trend="up"
          trendValue={data.trends.legalAidSuccessRate}
          color="purple"
        />
        <StatCard
          title="Workshops Conducted"
          value={data.summary.totalWorkshops}
          icon={BookOpen}
          trend="up"
          trendValue={data.trends.workshopAttendanceRate}
          color="yellow"
        />
      </div>

      {/* Demographics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard title="Gender Distribution">
          <SimpleBarChart
            data={[
              {
                label: "Female",
                value: data.demographics.genderDistribution.female,
              },
              {
                label: "Male",
                value: data.demographics.genderDistribution.male,
              },
            ]}
          />
        </ChartCard>

        <ChartCard title="Age Groups">
          <SimpleBarChart
            data={Object.entries(data.demographics.ageGroups).map(
              ([label, value]) => ({
                label,
                value,
              })
            )}
          />
        </ChartCard>

        <ChartCard title="Top Locations">
          <SimpleBarChart
            data={Object.entries(data.demographics.locations).map(
              ([label, value]) => ({
                label,
                value,
              })
            )}
          />
        </ChartCard>
      </div>

      {/* Impact Score */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Impact Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Progress value={data.summary.impactScore} className="h-4" />
            </div>
            <div className="text-2xl font-bold text-green-600">
              {data.summary.impactScore}/100
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Based on case resolution rates, beneficiary satisfaction, and
            community impact metrics
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

const BeneficiaryReport = ({ data }) => {
  if (!data) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Beneficiary Report</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Beneficiaries"
          value={data.totalBeneficiaries}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Active Status"
          value={data.activeStatus}
          icon={TrendingUp}
          color="green"
        />
        <StatCard
          title="Female Beneficiaries"
          value={data.byGender.female}
          icon={Users}
          color="purple"
        />
        <StatCard
          title="Male Beneficiaries"
          value={data.byGender.male}
          icon={Users}
          color="yellow"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Age Distribution">
          <SimpleBarChart
            data={Object.entries(data.byAge).map(([label, value]) => ({
              label,
              value,
            }))}
          />
        </ChartCard>

        <ChartCard title="Occupation Distribution">
          <SimpleBarChart
            data={Object.entries(data.byOccupation).map(([label, value]) => ({
              label,
              value,
            }))}
          />
        </ChartCard>
      </div>

      {/* Monthly Growth Trend */}
      <ChartCard title="Monthly Registration Trend">
        <SimpleLineChart data={data.monthlyGrowth} />
      </ChartCard>
    </div>
  );
};

const CaseReport = ({ data }) => {
  if (!data) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Case Management Report</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Cases"
          value={data.totalCases}
          icon={Scale}
          color="blue"
        />
        <StatCard
          title="Active Cases"
          value={data.activeCases}
          icon={TrendingUp}
          color="green"
        />
        <StatCard
          title="Resolution Rate"
          value={`${data.resolutionRate}%`}
          icon={BarChart3}
          color="purple"
        />
        <StatCard
          title="Avg Resolution Time"
          value={`${data.averageResolutionTime} days`}
          icon={Calendar}
          color="yellow"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Cases by Type">
          <SimpleBarChart
            data={Object.entries(data.byCaseType).map(([label, value]) => ({
              label: label.replace("_", " ").toUpperCase(),
              value,
            }))}
          />
        </ChartCard>

        <ChartCard title="Cases by Priority">
          <SimpleBarChart
            data={Object.entries(data.byPriority).map(([label, value]) => ({
              label: label.toUpperCase(),
              value,
            }))}
          />
        </ChartCard>
      </div>

      {/* Success Rates */}
      <ChartCard title="Success Rate by Case Type">
        <div className="space-y-3">
          {Object.entries(data.successRate).map(([type, rate]) => (
            <div key={type} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {type.replace("_", " ").toUpperCase()}
                </span>
                <span className="font-medium">{rate}%</span>
              </div>
              <Progress value={rate} className="h-2" />
            </div>
          ))}
        </div>
      </ChartCard>

      {/* Monthly Trend */}
      <ChartCard title="Monthly Case Trend">
        <div className="space-y-4">
          <div className="grid grid-cols-6 gap-2">
            {data.monthlyTrend.map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-xs text-muted-foreground mb-2">{item.month}</div>
                <div className="space-y-1">
                  <div className="h-8 bg-blue-100 rounded flex items-end justify-center">
                    <div
                      className="bg-blue-500 rounded-t w-4"
                      style={{ height: `${(item.filed / 20) * 100}%` }}
                    />
                  </div>
                  <div className="text-xs">Filed: {item.filed}</div>
                  <div className="h-8 bg-green-100 rounded flex items-end justify-center">
                    <div
                      className="bg-green-500 rounded-t w-4"
                      style={{ height: `${(item.resolved / 20) * 100}%` }}
                    />
                  </div>
                  <div className="text-xs">Resolved: {item.resolved}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ChartCard>
    </div>
  );
};

const LegalAidReport = ({ data }) => {
  if (!data) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Legal Aid Report</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Legal Aid"
          value={data.totalLegalAid}
          icon={FileText}
          color="blue"
        />
        <StatCard
          title="Active Cases"
          value={data.activeLegalAid}
          icon={TrendingUp}
          color="green"
        />
        <StatCard
          title="Completion Rate"
          value={`${data.completionRate}%`}
          icon={BarChart3}
          color="purple"
        />
        <StatCard
          title="Avg Completion Time"
          value={`${data.averageCompletionTime} days`}
          icon={Calendar}
          color="yellow"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Legal Aid by Type">
          <SimpleBarChart
            data={Object.entries(data.byAidType).map(([label, value]) => ({
              label: label.replace("_", " ").toUpperCase(),
              value,
            }))}
          />
        </ChartCard>

        <ChartCard title="Lawyer Assignments">
          <SimpleBarChart
            data={Object.entries(data.lawyerAssignments).map(
              ([label, value]) => ({
                label,
                value,
              })
            )}
          />
        </ChartCard>
      </div>

      {/* Monthly Progress */}
      <ChartCard title="Monthly Legal Aid Progress">
        <div className="grid grid-cols-6 gap-2">
          {data.monthlyProgress.map((item, index) => (
            <div key={index} className="text-center">
              <div className="text-xs text-muted-foreground mb-2">{item.month}</div>
              <div className="space-y-1">
                <div className="h-6 bg-yellow-100 rounded flex items-end justify-center">
                  <div
                    className="bg-yellow-500 rounded-t w-3"
                    style={{ height: `${(item.requested / 10) * 100}%` }}
                  />
                </div>
                <div className="text-xs">Req: {item.requested}</div>
                <div className="h-6 bg-blue-100 rounded flex items-end justify-center">
                  <div
                    className="bg-blue-500 rounded-t w-3"
                    style={{ height: `${(item.assigned / 10) * 100}%` }}
                  />
                </div>
                <div className="text-xs">Asgn: {item.assigned}</div>
                <div className="h-6 bg-green-100 rounded flex items-end justify-center">
                  <div
                    className="bg-green-500 rounded-t w-3"
                    style={{ height: `${(item.completed / 10) * 100}%` }}
                  />
                </div>
                <div className="text-xs">Comp: {item.completed}</div>
              </div>
            </div>
          ))}
        </div>
      </ChartCard>
    </div>
  );
};

const WorkshopReport = ({ data }) => {
  if (!data) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Workshop Report</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Workshops"
          value={data.totalWorkshops}
          icon={BookOpen}
          color="blue"
        />
        <StatCard
          title="Total Participants"
          value={data.totalParticipants}
          icon={Users}
          color="green"
        />
        <StatCard
          title="Avg Attendance"
          value={`${data.averageAttendance}%`}
          icon={TrendingUp}
          color="purple"
        />
        <StatCard
          title="Avg Rating"
          value={`${data.averageRating}/5`}
          icon={BarChart3}
          color="yellow"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Workshops by Category">
          <SimpleBarChart
            data={Object.entries(data.byCategory).map(([label, value]) => ({
              label: label.replace("_", " ").toUpperCase(),
              value,
            }))}
          />
        </ChartCard>

        <ChartCard title="Workshop Type Distribution">
          <SimpleBarChart
            data={Object.entries(data.byType).map(([label, value]) => ({
              label: label.replace("_", " ").toUpperCase(),
              value,
            }))}
          />
        </ChartCard>
      </div>

      {/* Impact Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Participant Feedback">
          <SimpleBarChart
            data={Object.entries(data.participantFeedback).map(
              ([label, value]) => ({
                label: label.toUpperCase(),
                value,
              })
            )}
          />
        </ChartCard>

        <ChartCard title="Impact Metrics">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Follow-up Cases</span>
              <span className="font-medium">
                {data.impactMetrics.followUpCases}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Skills Certified</span>
              <span className="font-medium">
                {data.impactMetrics.skillsCertified}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Employment Assisted</span>
              <span className="font-medium">
                {data.impactMetrics.employmentAssisted}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Legal Aid Requested</span>
              <span className="font-medium">
                {data.impactMetrics.legalAidRequested}
              </span>
            </div>
          </div>
        </ChartCard>
      </div>
    </div>
  );
};

const ImpactReport = ({ data }) => {
  if (!data) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Social Justice Impact Report</h2>

      {/* Overall Impact */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          title="Lives Impacted"
          value={data.overallImpact.livesImpacted}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Cases Resolved"
          value={data.overallImpact.casesResolved}
          icon={Scale}
          color="green"
        />
        <StatCard
          title="Legal Aid Provided"
          value={data.overallImpact.legalAidProvided}
          icon={FileText}
          color="purple"
        />
        <StatCard
          title="Skills Training"
          value={data.overallImpact.skillsTraining}
          icon={BookOpen}
          color="yellow"
        />
        <StatCard
          title="Employment Assisted"
          value={data.overallImpact.employmentAssisted}
          icon={TrendingUp}
          color="green"
        />
        <StatCard
          title="Families Supported"
          value={data.overallImpact.familiesSupported}
          icon={Users}
          color="blue"
        />
      </div>

      {/* Social Justice Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Social Justice Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Domestic Violence Cases Resolved
                </span>
                <Badge variant="outline">
                  {data.socialJusticeMetrics.domesticViolenceCasesResolved}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Labor Rights Violations Addressed
                </span>
                <Badge variant="outline">
                  {data.socialJusticeMetrics.laborRightsViolationsAddressed}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Child Welfare Cases Handled
                </span>
                <Badge variant="outline">
                  {data.socialJusticeMetrics.childWelfareCasesHandled}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Property Rights Secured
                </span>
                <Badge variant="outline">
                  {data.socialJusticeMetrics.propertyRightsSecured}
                </Badge>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Legal Awareness Programs
                </span>
                <Badge variant="outline">
                  {data.socialJusticeMetrics.legalAwarenessPrograms}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Community Outreach Events
                </span>
                <Badge variant="outline">
                  {data.socialJusticeMetrics.communityOutreachEvents}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Impact */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Impact Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                ₹{(data.financialImpact.totalBudget / 100000).toFixed(1)}L
              </div>
              <div className="text-sm text-muted-foreground">Total Budget</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                ₹{(data.financialImpact.utilized / 100000).toFixed(1)}L
              </div>
              <div className="text-sm text-muted-foreground">Utilized</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {data.financialImpact.utilizationRate}%
              </div>
              <div className="text-sm text-muted-foreground">Utilization Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                ₹{(data.financialImpact.costPerBeneficiary / 1000).toFixed(0)}K
              </div>
              <div className="text-sm text-muted-foreground">Cost per Beneficiary</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Geographical Reach & Sustainability */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Geographical Reach</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">States Covered</span>
              <Badge>{data.geographicalReach.states}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Districts Reached</span>
              <Badge>{data.geographicalReach.districts}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Communities Served</span>
              <Badge>{data.geographicalReach.communities}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Rural Beneficiaries</span>
              <Badge variant="outline">
                {data.geographicalReach.ruralBeneficiaries}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Urban Beneficiaries</span>
              <Badge variant="outline">
                {data.geographicalReach.urbanBeneficiaries}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sustainability Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Follow-up Rate</span>
                <span>{data.sustainabilityMetrics.followUpRate}%</span>
              </div>
              <Progress value={data.sustainabilityMetrics.followUpRate} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Long-term Support</span>
                <span>{data.sustainabilityMetrics.longTermSupport}%</span>
              </div>
              <Progress value={data.sustainabilityMetrics.longTermSupport} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Community Engagement</span>
                <span>{data.sustainabilityMetrics.communityEngagement}%</span>
              </div>
              <Progress
                value={data.sustainabilityMetrics.communityEngagement}
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Volunteer Participation</span>
                <span>
                  {data.sustainabilityMetrics.volunteerParticipation}%
                </span>
              </div>
              <Progress
                value={data.sustainabilityMetrics.volunteerParticipation}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const Reports = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState("last_30_days");
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState({});

  useEffect(() => {
    fetchReportData(activeTab);
  }, [activeTab, dateRange]);

  const fetchReportData = async (reportType) => {
    try {
      setLoading(true);
      let response;

      switch (reportType) {
        case "overview":
          response = await reportsAPI.getOverviewReport(dateRange);
          break;
        case "beneficiaries":
          response = await reportsAPI.getBeneficiaryReport();
          break;
        case "cases":
          response = await reportsAPI.getCaseReport();
          break;
        case "legal-aid":
          response = await reportsAPI.getLegalAidReport();
          break;
        case "workshops":
          response = await reportsAPI.getWorkshopReport();
          break;
        case "impact":
          response = await reportsAPI.getImpactReport(dateRange);
          break;
        default:
          return;
      }

      setReportData((prev) => ({
        ...prev,
        [reportType]: response.data,
      }));
    } catch (error) {
      toast.error(`Failed to fetch ${reportType} report`);
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = async (format) => {
    try {
      if (format === "pdf") {
        // Generate PDF client-side from the report container
        const element = document.getElementById("report-content");
        if (!element) {
          toast.error("Report content not found for PDF export");
          return;
        }

        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
        });
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 14;

        // Header band
        const headerH = 26;
        pdf.setFillColor(237, 243, 255);
        pdf.rect(0, 0, pageWidth, headerH, "F");

        // Logo + title in header
        let currentY = 8;
        try {
          const logoImg = await fetch(sevaLogo);
          const blob = await logoImg.blob();
          const reader = new FileReader();
          const logoDataUrl = await new Promise((resolve, reject) => {
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
          const imgProps = pdf.getImageProperties(logoDataUrl);
          const logoW = 18; // mm
          const logoH = (imgProps.height * logoW) / imgProps.width;
          pdf.addImage(logoDataUrl, "PNG", margin, currentY - 2, logoW, logoH);
        } catch (err) {
          console.error("Logo load error:", err);
        }

        pdf.setFontSize(15);
        pdf.text(`${activeTab.toUpperCase()} Report`, pageWidth / 2, currentY + 4, {
          align: "center",
        });

        currentY = headerH + 4;
        pdf.setFontSize(10);
        pdf.text(`Generated: ${new Date().toLocaleString()}`, margin, currentY);
        currentY += 5;
        if (dateRange?.from || dateRange?.to) {
          const from = dateRange?.from ? dateRange.from : "N/A";
          const to = dateRange?.to ? dateRange.to : "N/A";
          pdf.text(`Period: ${from} - ${to}`, margin, currentY);
          currentY += 5;
        }
        currentY += 4;
        pdf.setDrawColor(215);
        pdf.line(margin, currentY, pageWidth - margin, currentY);
        currentY += 6;

        const imgProps = pdf.getImageProperties(imgData);
        const maxWidth = pageWidth - margin * 2;
        const maxHeight = pageHeight - currentY - margin;
        const scale = Math.min(
          maxWidth / imgProps.width,
          maxHeight / imgProps.height
        );
        const renderW = imgProps.width * scale;
        const renderH = imgProps.height * scale;
        const x = (pageWidth - renderW) / 2;

        // Light canvas background to separate from white page
        pdf.setFillColor(248, 249, 252);
        pdf.rect(x - 2, currentY - 2, renderW + 4, renderH + 4, "F");

        pdf.addImage(imgData, "PNG", x, currentY, renderW, renderH);

        pdf.setFontSize(8);
        pdf.text(
          `Page 1 | Seva Kendra CRM`,
          pageWidth - margin,
          pageHeight - 8,
          { align: "right" }
        );

        const fileName = `${activeTab}_report_${new Date()
          .toISOString()
          .slice(0, 10)}.pdf`;
        pdf.save(fileName);
        toast.success(`PDF generated: ${fileName}`);
      } else {
        const response = await reportsAPI.exportReport(activeTab, format);
        toast.success(
          `Report exported successfully as ${response.data.fileName}`
        );
        // You could trigger download from response.data.downloadUrl here
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to export report");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Reports & Analytics
          </h1>
          <p className="text-muted-foreground">
            Comprehensive insights into social justice impact and organizational
            performance
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => fetchReportData(activeTab)}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" onClick={() => handleExportReport("pdf")}>
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={() => handleExportReport("xlsx")}>
            <Download className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Report Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="beneficiaries">Beneficiaries</TabsTrigger>
          <TabsTrigger value="cases">Cases</TabsTrigger>
          <TabsTrigger value="legal-aid">Legal Aid</TabsTrigger>
          <TabsTrigger value="workshops">Workshops</TabsTrigger>
          <TabsTrigger value="impact">Impact</TabsTrigger>
        </TabsList>

        <div id="report-content" className="mt-6">
          {loading && (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}

          <TabsContent value="overview">
            <OverviewReport
              data={reportData.overview}
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
            />
          </TabsContent>

          <TabsContent value="beneficiaries">
            <BeneficiaryReport data={reportData.beneficiaries} />
          </TabsContent>

          <TabsContent value="cases">
            <CaseReport data={reportData.cases} />
          </TabsContent>

          <TabsContent value="legal-aid">
            <LegalAidReport data={reportData["legal-aid"]} />
          </TabsContent>

          <TabsContent value="workshops">
            <WorkshopReport data={reportData.workshops} />
          </TabsContent>

          <TabsContent value="impact">
            <ImpactReport data={reportData.impact} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default Reports;
