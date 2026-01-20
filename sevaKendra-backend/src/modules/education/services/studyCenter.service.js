import StudyCenter from "../models/studyCenter.model.js";
import { APIError } from "../../../errors/apiError.js";
import { getPaginationOptions } from "../../../utils/pagination.utils.js";

class StudyCenterService {
  // Get all study centers with pagination, search, and filters
  async getAllStudyCenters(query) {
    const {
      page = 1,
      limit = 10,
      search = "",
      wardNo = "",
      projectResponsible = "",
      sortBy = "createdAt",
      sortOrder = "desc",
    } = query;

    const filter = {};

    // Search functionality
    if (search) {
      filter.$or = [
        { centreName: { $regex: search, $options: "i" } },
        { habitation: { $regex: search, $options: "i" } },
        { groupLeader: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by ward number
    if (wardNo) {
      filter.wardNo = wardNo;
    }

    // Filter by project responsible
    if (projectResponsible) {
      filter.projectResponsible = { $regex: projectResponsible, $options: "i" };
    }

    const { skip, limitNum } = getPaginationOptions(page, limit);
    const sortOptions = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

    const [studyCenters, total] = await Promise.all([
      StudyCenter.find(filter)
        .populate("createdBy", "firstName lastName")
        .populate("updatedBy", "firstName lastName")
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      StudyCenter.countDocuments(filter),
    ]);

    return {
      data: studyCenters,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  // Get study center by ID
  async getStudyCenterById(id) {
    const studyCenter = await StudyCenter.findById(id)
      .populate("createdBy", "firstName lastName")
      .populate("updatedBy", "firstName lastName");

    if (!studyCenter) {
      throw new APIError("Study center not found", 404);
    }

    return studyCenter;
  }

  // Create a new study center
  async createStudyCenter(data, userId) {
    const studyCenterData = {
      ...data,
      createdBy: userId,
    };

    const studyCenter = new StudyCenter(studyCenterData);
    await studyCenter.save();

    return await this.getStudyCenterById(studyCenter._id);
  }

  // Update study center by ID
  async updateStudyCenterById(id, data, userId) {
    const updateData = {
      ...data,
      updatedBy: userId,
    };

    const studyCenter = await StudyCenter.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!studyCenter) {
      throw new APIError("Study center not found", 404);
    }

    return await this.getStudyCenterById(id);
  }

  // Delete study center by ID
  async deleteStudyCenterById(id) {
    const studyCenter = await StudyCenter.findByIdAndDelete(id);

    if (!studyCenter) {
      throw new APIError("Study center not found", 404);
    }

    return studyCenter;
  }

  // Get study centers statistics
  async getStudyCentersStats() {
    const [total, byWard, byFunding] = await Promise.all([
      StudyCenter.countDocuments(),
      StudyCenter.aggregate([
        { $group: { _id: "$wardNo", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      StudyCenter.aggregate([
        { $group: { _id: "$sourceOfFunding", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ]);

    return {
      total,
      byWard,
      byFunding,
    };
  }

  // Get unique values for filters
  async getFilterOptions() {
    const [wardNumbers, projectResponsibles, fundingSources] =
      await Promise.all([
        StudyCenter.distinct("wardNo"),
        StudyCenter.distinct("projectResponsible"),
        StudyCenter.distinct("sourceOfFunding"),
      ]);

    return {
      wardNumbers: wardNumbers.sort(),
      projectResponsibles: projectResponsibles.sort(),
      fundingSources: fundingSources.sort(),
    };
  }
}

export default new StudyCenterService();
