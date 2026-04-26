import HealthCamp from "../health/models/healthCamp.model.js";
import Elderly from "../health/models/elderly.model.js";
import MotherChild from "../health/models/motherChild.model.js";
import Adolescent from "../health/models/adolescents.model.js";
import Tuberculosis from "../health/models/tuberculosis.model.js";
import HIV from "../health/models/hiv.model.js";
import Leprosy from "../health/models/leprosy.model.js";
import Addiction from "../health/models/addiction.model.js";
import OtherDisease from "../health/models/otherDiseases.model.js";
import PWD from "../health/models/pwd.model.js";
import StudyCenter from "../education/models/studyCenter.model.js";
import SCStudent from "../education/models/scStudent.model.js";
import Dropout from "../education/models/dropout.model.js";
import School from "../education/models/school.model.js";
import CompetitiveExam from "../education/models/competitiveExam.model.js";
import BoardPreparation from "../education/models/boardPreparation.model.js";
import CBUCBODetails from "../socialJustice/models/cbucboDetails.model.js";
import Entitlement from "../socialJustice/models/entitlements.model.js";
import LegalAidService from "../socialJustice/models/legalAidService.model.js";
import WorkshopAndAwareness from "../socialJustice/models/workshopsAwareness.model.js";
import Tracking from "../tracking/tracking.model.js";

class AnalyticsService {
  constructor() {
    // Simple in-memory cache with 30-second TTL
    this.cache = new Map();
    this.CACHE_TTL = 30000; // 30 seconds
  }

  // Cache helper methods
  _getCacheKey(prefix, params = {}) {
    return `${prefix}_${JSON.stringify(params)}`;
  }

  _getFromCache(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }
    // Remove expired cache
    if (cached) this.cache.delete(key);
    return null;
  }

  _setInCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  /**
   * Get dashboard overview statistics
   */
  async getDashboardOverview(dateRange = "all") {
    try {
      // Check cache first
      const cacheKey = this._getCacheKey("dashboard_overview", { dateRange });
      const cachedResult = this._getFromCache(cacheKey);
      if (cachedResult) {
        return cachedResult;
      }

      const dateFilter = this._getDateFilter(dateRange);
      
      // Optimize: Get all module counts in parallel using aggregation
      const [dashboardStats, trackingStats] = await Promise.all([
        this._getAllModuleCountsAggregated(dateFilter),
        Tracking.aggregate([
          { $match: dateFilter },
          {
            $group: {
              _id: "$status",
              count: { $sum: 1 }
            }
          }
        ])
      ]);

      const {
        healthCamps, elderly, motherChild, adolescents,
        tuberculosis, hiv, leprosy, addiction, otherDiseases, pwd,
        studyCenters, scStudents, dropouts, schools,
        competitiveExams, boardPreparation,
        cbucbo, entitlements, legalAid, workshops,
        pendingLegalAid
      } = dashboardStats;

      const healthTotal = healthCamps + elderly + motherChild + adolescents + 
                         tuberculosis + hiv + leprosy + addiction + 
                         otherDiseases + pwd;
      
      const educationTotal = studyCenters + scStudents + dropouts + 
                            schools + competitiveExams + boardPreparation;
      
      const socialJusticeTotal = cbucbo + entitlements + legalAid + workshops;
      
      const totalBeneficiaries = healthTotal + educationTotal + socialJusticeTotal;

      // Process tracking stats
      const trackingStatsMap = trackingStats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {});

      const activeCases = trackingStatsMap.active || 0;
      const completedCases = trackingStatsMap.completed || 0;
      const pendingCases = trackingStatsMap.pending || 0;
      const onHoldCases = trackingStatsMap.on_hold || 0;

      const result = {
        totalBeneficiaries,
        activeCases,
        completedCases,
        pendingCases,
        onHoldCases,
        pendingLegalAid: pendingLegalAid !== undefined ? pendingLegalAid : 0,
        urgentCases: await this._getUrgentCasesCount(),
        moduleBreakdown: {
          health: healthTotal,
          education: educationTotal,
          socialJustice: socialJusticeTotal
        },
        moduleDetails: dashboardStats,
        recentBeneficiaries: await this._getRecentBeneficiariesCount()
      };

      // Cache the result
      this._setInCache(cacheKey, result);
      return result;
    } catch (error) {
      console.error("Error getting dashboard overview:", error);
      throw error;
    }
  }

  /**
   * Get monthly trends data for the charts
   */
  async getMonthlyTrends(moduleType = null) {
    try {
      // Check cache
      const cacheKey = this._getCacheKey("monthly_trends", { moduleType });
      const cachedResult = this._getFromCache(cacheKey);
      if (cachedResult) {
        return cachedResult;
      }

      const months = this._getLast6Months();
      const trendData = [];

      for (const month of months) {
        const startDate = month.start;
        const endDate = month.end;
        const filter = {
          createdAt: { $gte: startDate, $lte: endDate }
        };

        const [healthCount, educationCount, socialJusticeCount] = await Promise.all([
          this._getHealthModuleCount(filter),
          this._getEducationModuleCount(filter),
          this._getSocialJusticeModuleCount(filter)
        ]);

        trendData.push({
          month: month.label,
          health: healthCount,
          education: educationCount,
          socialJustice: socialJusticeCount,
          total: healthCount + educationCount + socialJusticeCount
        });
      }

      // Cache the result
      this._setInCache(cacheKey, trendData);
      return trendData;
    } catch (error) {
      console.error("Error getting monthly trends:", error);
      throw error;
    }
  }

  /**
   * Get gender distribution across all modules
   */
  async getGenderDistribution() {
    try {
      const models = await this._getAllModelsWithGender();
      const genderData = { male: 0, female: 0, other: 0, total: 0 };

      for (const Model of models) {
        const results = await Model.aggregate([
          {
            $group: {
              _id: "$gender",
              count: { $sum: 1 }
            }
          }
        ]);

        results.forEach(result => {
          const gender = (result._id || "other").toLowerCase();
          if (gender === "male" || gender === "m") {
            genderData.male += result.count;
          } else if (gender === "female" || gender === "f") {
            genderData.female += result.count;
          } else {
            genderData.other += result.count;
          }
          genderData.total += result.count;
        });
      }

      return [
        {
          name: "Female",
          value: genderData.female,
          percentage: genderData.total > 0 
            ? Math.round((genderData.female / genderData.total) * 100) 
            : 0
        },
        {
          name: "Male",
          value: genderData.male,
          percentage: genderData.total > 0 
            ? Math.round((genderData.male / genderData.total) * 100) 
            : 0
        },
        ...(genderData.other > 0 ? [{
          name: "Other",
          value: genderData.other,
          percentage: Math.round((genderData.other / genderData.total) * 100)
        }] : [])
      ];
    } catch (error) {
      console.error("Error getting gender distribution:", error);
      throw error;
    }
  }

  /**
   * Get age distribution across all modules
   */
  async getAgeDistribution() {
    try {
      const models = await this._getAllModelsWithAge();
      const ageGroups = {
        "0-17": 0,
        "18-25": 0,
        "26-35": 0,
        "36-45": 0,
        "46-55": 0,
        "55+": 0
      };

      for (const Model of models) {
        const results = await Model.aggregate([
          {
            $project: {
              age: {
                $floor: {
                  $divide: [
                    { $subtract: [new Date(), "$dateOfBirth"] },
                    365.25 * 24 * 60 * 60 * 1000
                  ]
                }
              }
            }
          },
          {
            $group: {
              _id: {
                $switch: {
                  branches: [
                    { case: { $lt: ["$age", 18] }, then: "0-17" },
                    { case: { $lt: ["$age", 26] }, then: "18-25" },
                    { case: { $lt: ["$age", 36] }, then: "26-35" },
                    { case: { $lt: ["$age", 46] }, then: "36-45" },
                    { case: { $lt: ["$age", 56] }, then: "46-55" }
                  ],
                  default: "55+"
                }
              },
              count: { $sum: 1 }
            }
          }
        ]);

        results.forEach(result => {
          if (ageGroups.hasOwnProperty(result._id)) {
            ageGroups[result._id] += result.count;
          }
        });
      }

      return Object.entries(ageGroups)
        .filter(([_, value]) => value > 0)
        .map(([name, value]) => ({ name, value }));
    } catch (error) {
      console.error("Error getting age distribution:", error);
      throw error;
    }
  }

  /**
   * Get module distribution for pie chart
   */
  async getModuleDistribution() {
    try {
      // Check cache
      const cacheKey = this._getCacheKey("module_distribution");
      const cachedResult = this._getFromCache(cacheKey);
      if (cachedResult) {
        return cachedResult;
      }

      const [healthCount, educationCount, socialJusticeCount] = await Promise.all([
        this._getHealthModuleCount({}),
        this._getEducationModuleCount({}),
        this._getSocialJusticeModuleCount({})
      ]);

      const total = healthCount + educationCount + socialJusticeCount;

      // Cache and return
      const result = [
        {
          name: "Health",
          value: healthCount,
          percentage: total > 0 ? Math.round((healthCount / total) * 100) : 0
        },
        {
          name: "Education",
          value: educationCount,
          percentage: total > 0 ? Math.round((educationCount / total) * 100) : 0
        },
        {
          name: "Social Justice",
          value: socialJusticeCount,
          percentage: total > 0 ? Math.round((socialJusticeCount / total) * 100) : 0
        }
      ].filter(item => item.value > 0);

      this._setInCache(cacheKey, result);
      return result;
    } catch (error) {
      console.error("Error getting module distribution:", error);
      throw error;
    }
  }

  /**
   * Get case status distribution
   */
  async getStatusDistribution() {
    try {
      const trackingStats = await Tracking.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 }
          }
        }
      ]);

      const statusMap = trackingStats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {});

      return [
        { name: "Active", value: statusMap.active || 0 },
        { name: "Pending", value: statusMap.pending || 0 },
        { name: "Completed", value: statusMap.completed || 0 },
        { name: "On Hold", value: statusMap.on_hold || 0 }
      ].filter(item => item.value > 0);
    } catch (error) {
      console.error("Error getting status distribution:", error);
      throw error;
    }
  }

  /**
   * Get recent activities with lean query for better performance
   */
  async getRecentActivities(limit = 10) {
    try {
      const trackings = await Tracking.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .select("_id status module createdAt createdBy")
        .populate("createdBy", "firstName lastName", null, { lean: true })
        .lean()
        .exec();

      return trackings.map(tracking => ({
        _id: tracking._id,
        type: this._getActivityType(tracking),
        description: this._getActivityDescription(tracking),
        timestamp: tracking.createdAt,
        user: tracking.createdBy && tracking.createdBy.firstName
          ? `${tracking.createdBy.firstName} ${tracking.createdBy.lastName}`
          : "System",
        status: tracking.status,
        module: tracking.module
      }));
    } catch (error) {
      console.error("Error getting recent activities:", error);
      return [];
    }
  }

  /**
   * Get quick insights
   */
  async getQuickInsights() {
    try {
      const [
        totalTracking,
        completedTracking,
        overdueTracking,
        moduleLeader
      ] = await Promise.all([
        Tracking.countDocuments(),
        Tracking.countDocuments({ status: "completed" }),
        Tracking.countDocuments({ 
          status: { $in: ["active", "pending"] },
          followUpDate: { $lt: new Date() }
        }),
        this._getLeadingModule()
      ]);

      const completionRate = totalTracking > 0 
        ? Math.round((completedTracking / totalTracking) * 100) 
        : 0;

      const insights = [];

      // Leading module insight
      if (moduleLeader.module && moduleLeader.count > 0) {
        insights.push({
          type: "info",
          title: `${moduleLeader.module} Module Leading`,
          description: `${moduleLeader.module} programs show highest engagement with ${moduleLeader.count} total cases`
        });
      }

      // Completion rate insight
      if (completionRate >= 50) {
        insights.push({
          type: "success",
          title: "Case Completion Rate",
          description: `${completionRate}% of cases completed this period`
        });
      } else if (totalTracking > 0) {
        insights.push({
          type: "warning",
          title: "Case Completion Rate",
          description: `Only ${completionRate}% of cases completed - needs attention`
        });
      }

      // Overdue cases insight
      if (overdueTracking > 0) {
        insights.push({
          type: "error",
          title: "Urgent Cases",
          description: `${overdueTracking} urgent cases require immediate attention`
        });
      } else {
        insights.push({
          type: "success",
          title: "Urgent Cases",
          description: "0 urgent cases require immediate attention"
        });
      }

      // Focus area insight
      const focusArea = await this._getFocusArea();
      if (focusArea) {
        insights.push({
          type: "info",
          title: `Focus Area: ${focusArea.name}`,
          description: `${focusArea.name} module requires attention for growth - currently ${focusArea.count} beneficiaries`
        });
      }

      return insights;
    } catch (error) {
      console.error("Error getting quick insights:", error);
      throw error;
    }
  }

  // Helper methods
  _getDateFilter(dateRange) {
    const now = new Date();
    let startDate;

    switch (dateRange) {
      case "today":
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case "last_7_days":
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case "last_30_days":
        startDate = new Date(now.setDate(now.getDate() - 30));
        break;
      case "last_90_days":
        startDate = new Date(now.setDate(now.getDate() - 90));
        break;
      case "last_year":
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      case "this_month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "last_month":
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        break;
      default:
        return {}; // All time
    }

    return { createdAt: { $gte: startDate } };
  }

  _getLast6Months() {
    const months = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);
      
      months.push({
        label: date.toLocaleString('en-US', { month: 'short' }),
        start: date,
        end: endDate
      });
    }

    return months;
  }

  async _getHealthModuleCount(filter) {
    const [
      healthCamps, elderly, motherChild, adolescents,
      tuberculosis, hiv, leprosy, addiction, otherDiseases, pwd
    ] = await Promise.all([
      HealthCamp.countDocuments(filter),
      Elderly.countDocuments(filter),
      MotherChild.countDocuments(filter),
      Adolescent.countDocuments(filter),
      Tuberculosis.countDocuments(filter),
      HIV.countDocuments(filter),
      Leprosy.countDocuments(filter),
      Addiction.countDocuments(filter),
      OtherDisease.countDocuments(filter),
      PWD.countDocuments(filter)
    ]);

    return healthCamps + elderly + motherChild + adolescents + 
           tuberculosis + hiv + leprosy + addiction + otherDiseases + pwd;
  }

  async _getEducationModuleCount(filter) {
    const [studyCenters, scStudents, dropouts, schools, competitiveExams, boardPreparation] = 
      await Promise.all([
        StudyCenter.countDocuments(filter),
        SCStudent.countDocuments(filter),
        Dropout.countDocuments(filter),
        School.countDocuments(filter),
        CompetitiveExam.countDocuments(filter),
        BoardPreparation.countDocuments(filter)
      ]);

    return studyCenters + scStudents + dropouts + schools + competitiveExams + boardPreparation;
  }

  async _getSocialJusticeModuleCount(filter) {
    const [cbucbo, entitlements, legalAid, workshops] = await Promise.all([
      CBUCBODetails.countDocuments(filter),
      Entitlement.countDocuments(filter),
      LegalAidService.countDocuments(filter),
      WorkshopAndAwareness.countDocuments(filter)
    ]);

    return cbucbo + entitlements + legalAid + workshops;
  }

  async _getAllModelsWithGender() {
    return [
      Elderly, MotherChild, Adolescent, Tuberculosis, HIV, 
      Leprosy, Addiction, OtherDisease, PWD, SCStudent, Dropout
    ];
  }

  async _getAllModelsWithAge() {
    return [
      Elderly, MotherChild, Adolescent, Tuberculosis, HIV,
      Leprosy, Addiction, OtherDisease, PWD, SCStudent, Dropout
    ];
  }

  async _getUrgentCasesCount() {
    try {
      return await Tracking.countDocuments({
        status: { $in: ["active", "pending"] },
        priority: "high",
        followUpDate: { $lt: new Date() }
      });
    } catch (error) {
      return 0;
    }
  }

  async _getRecentBeneficiariesCount() {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const filter = { createdAt: { $gte: thirtyDaysAgo } };
      
      // Optimized: use aggregation to count all in one query
      const [healthCount, educationCount, socialJusticeCount] = await Promise.all([
        this._getHealthModuleCount(filter),
        this._getEducationModuleCount(filter),
        this._getSocialJusticeModuleCount(filter)
      ]);
      
      return healthCount + educationCount + socialJusticeCount;
    } catch (error) {
      return 0;
    }
  }

  // Optimized batch counting method using aggregation
  async _getAllModuleCountsAggregated(dateFilter = {}) {
    try {
      const [
        healthCampsResult,
        elderlyResult,
        motherChildResult,
        adolescentsResult,
        tuberculosisResult,
        hivResult,
        leprosyResult,
        addictionResult,
        otherDiseasesResult,
        pwdResult,
        studyCentersResult,
        scStudentsResult,
        dropoutsResult,
        schoolsResult,
        competitiveExamsResult,
        boardPreparationResult,
        cbucboResult,
        entitlementsResult,
        legalAidResult,
        workshopsResult,
        pendingLegalAidResult
      ] = await Promise.all([
        HealthCamp.countDocuments(dateFilter),
        Elderly.countDocuments(dateFilter),
        MotherChild.countDocuments(dateFilter),
        Adolescent.countDocuments(dateFilter),
        Tuberculosis.countDocuments(dateFilter),
        HIV.countDocuments(dateFilter),
        Leprosy.countDocuments(dateFilter),
        Addiction.countDocuments(dateFilter),
        OtherDisease.countDocuments(dateFilter),
        PWD.countDocuments(dateFilter),
        StudyCenter.countDocuments(dateFilter),
        SCStudent.countDocuments(dateFilter),
        Dropout.countDocuments(dateFilter),
        School.countDocuments(dateFilter),
        CompetitiveExam.countDocuments(dateFilter),
        BoardPreparation.countDocuments(dateFilter),
        CBUCBODetails.countDocuments(dateFilter),
        Entitlement.countDocuments(dateFilter),
        LegalAidService.countDocuments(dateFilter),
        WorkshopAndAwareness.countDocuments(dateFilter),
        LegalAidService.countDocuments({ ...dateFilter, status: "Pending" })
      ]);

      return {
        healthCamps: healthCampsResult,
        elderly: elderlyResult,
        motherChild: motherChildResult,
        adolescents: adolescentsResult,
        tuberculosis: tuberculosisResult,
        hiv: hivResult,
        leprosy: leprosyResult,
        addiction: addictionResult,
        otherDiseases: otherDiseasesResult,
        pwd: pwdResult,
        studyCenters: studyCentersResult,
        scStudents: scStudentsResult,
        dropouts: dropoutsResult,
        schools: schoolsResult,
        competitiveExams: competitiveExamsResult,
        boardPreparation: boardPreparationResult,
        cbucbo: cbucboResult,
        entitlements: entitlementsResult,
        legalAid: legalAidResult,
        workshops: workshopsResult,
        pendingLegalAid: pendingLegalAidResult
      };
    } catch (error) {
      console.error("Error in _getAllModuleCountsAggregated:", error);
      throw error;
    }
  }

  async _getLeadingModule() {
    try {
      const [healthCount, educationCount, socialJusticeCount] = await Promise.all([
        this._getHealthModuleCount({}),
        this._getEducationModuleCount({}),
        this._getSocialJusticeModuleCount({})
      ]);

      const modules = [
        { module: "Health", count: healthCount },
        { module: "Education", count: educationCount },
        { module: "Social Justice", count: socialJusticeCount }
      ];

      return modules.reduce((max, current) => 
        current.count > max.count ? current : max, 
        modules[0]
      );
    } catch (error) {
      return { module: null, count: 0 };
    }
  }

  async _getFocusArea() {
    try {
      const [healthCount, educationCount, socialJusticeCount] = await Promise.all([
        this._getHealthModuleCount({}),
        this._getEducationModuleCount({}),
        this._getSocialJusticeModuleCount({})
      ]);

      const modules = [
        { name: "Health", count: healthCount },
        { name: "Education", count: educationCount },
        { name: "Social Justice", count: socialJusticeCount }
      ];

      // Return the module with the lowest count (needs focus)
      return modules.reduce((min, current) => 
        current.count < min.count ? current : min, 
        modules[0]
      );
    } catch (error) {
      return null;
    }
  }

  _getActivityType(tracking) {
    const statusTypes = {
      completed: "case_completed",
      active: "case_active",
      pending: "case_pending",
      on_hold: "case_on_hold"
    };

    return statusTypes[tracking.status] || "case_created";
  }

  _getActivityDescription(tracking) {
    const moduleNames = {
      health: "Health",
      education: "Education",
      socialJustice: "Social Justice"
    };

    const moduleName = moduleNames[tracking.module] || tracking.module;
    const statusText = tracking.status === "completed" ? "completed" : "filed";

    return `New ${moduleName.toLowerCase()} case ${statusText} for ${tracking.recordType || "beneficiary"}`;
  }
}

export default new AnalyticsService();
