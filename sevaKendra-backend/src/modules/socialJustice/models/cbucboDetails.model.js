import mongoose from "mongoose";

const cbucboDetailsSchema = new mongoose.Schema(
  {
    // Basic Information
    groupId: {
      type: String,
      required: [true, "Group ID is required"],
      unique: true,
      trim: true,
      index: true,
    },
    groupName: {
      type: String,
      required: [true, "Group name is required"],
      trim: true,
      index: true,
    },
    functionalArea: {
      type: String,
      required: [true, "Functional area is required"],
      trim: true,
    },
    groupType: {
      type: String,
      required: [true, "Group type is required"],
      enum: [
        "CBUCBO",
        "SHG",
        "Youth Group",
        "Women Group",
        "Farmer Producer Group",
        "Other",
      ],
    },
    wardNo: {
      type: String,
      required: [true, "Ward number is required"],
      trim: true,
      index: true,
    },
    habitation: {
      type: String,
      required: [true, "Habitation is required"],
      trim: true,
      index: true,
    },
    projectResponsible: {
      type: String,
      required: [true, "Project responsible is required"],
      trim: true,
    },
    dateOfFormation: {
      type: Date,
      required: [true, "Date of formation is required"],
      index: true,
    },
    totalMembers: {
      type: Number,
      required: [true, "Total members is required"],
      min: [1, "Total members must be at least 1"],
    },
    groupLeader: {
      type: String,
      required: [true, "Group leader is required"],
      trim: true,
    },
    contactNo: {
      type: String,
      required: [true, "Contact number is required"],
      match: [/^[6-9]\d{9}$/, "Please enter a valid contact number"],
    },
    groupMentor: {
      type: String,
      trim: true,
    },

    // Action Planning through Capacity Building Trainings
    listOfCapacityBuildingTrainings: {
      type: String,
      trim: true,
    },
    trainingOutcomes: {
      type: String,
      trim: true,
    },
    actionPlanForGroup: {
      type: String,
      trim: true,
    },
    remarks: {
      type: String,
      trim: true,
    },

    // Progress Reporting (2025-2026)
    progressReporting: {
      jan25: { type: String, trim: true },
      feb25: { type: String, trim: true },
      mar25: { type: String, trim: true },
      apr25: { type: String, trim: true },
      may25: { type: String, trim: true },
      jun25: { type: String, trim: true },
      jul25: { type: String, trim: true },
      aug25: { type: String, trim: true },
      sep25: { type: String, trim: true },
      oct25: { type: String, trim: true },
      nov25: { type: String, trim: true },
      dec25: { type: String, trim: true },
      jan26: { type: String, trim: true },
      feb26: { type: String, trim: true },
      mar26: { type: String, trim: true },
    },

    majorAchievements: {
      type: String,
      trim: true,
    },

    // Photo Documentation
    photoDocumentation: {
      before: {
        type: String, // URL or file path
        trim: true,
      },
      intermediate: {
        type: String, // URL or file path
        trim: true,
      },
      after: {
        type: String, // URL or file path
        trim: true,
      },
    },

    // Audit fields
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    collection: "cbucboDetails",
  }
);

// Compound indexes for better query performance
cbucboDetailsSchema.index({ wardNo: 1, habitation: 1 });
cbucboDetailsSchema.index({ groupType: 1, wardNo: 1 });
cbucboDetailsSchema.index({ dateOfFormation: -1 });
cbucboDetailsSchema.index({ createdAt: -1 });

// Virtual for group age
cbucboDetailsSchema.virtual("groupAge").get(function () {
  if (!this.dateOfFormation) return null;
  const today = new Date();
  const diffTime = Math.abs(today - this.dateOfFormation);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Pre-save middleware for validation
cbucboDetailsSchema.pre("save", function (next) {
  // Validate contact number format
  if (this.contactNo && !/^[6-9]\d{9}$/.test(this.contactNo)) {
    return next(new Error("Invalid contact number format"));
  }

  // Validate date of formation (cannot be in future)
  if (this.dateOfFormation && this.dateOfFormation > new Date()) {
    return next(new Error("Date of formation cannot be in the future"));
  }

  next();
});

// Static method to get statistics
cbucboDetailsSchema.statics.getStats = async function () {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalGroups: { $sum: 1 },
        totalMembers: { $sum: "$totalMembers" },
        avgMembersPerGroup: { $avg: "$totalMembers" },
      },
    },
  ]);

  const groupTypeStats = await this.aggregate([
    {
      $group: {
        _id: "$groupType",
        count: { $sum: 1 },
        totalMembers: { $sum: "$totalMembers" },
      },
    },
  ]);

  const wardStats = await this.aggregate([
    {
      $group: {
        _id: "$wardNo",
        count: { $sum: 1 },
        totalMembers: { $sum: "$totalMembers" },
      },
    },
  ]);

  return {
    overview: stats[0] || {
      totalGroups: 0,
      totalMembers: 0,
      avgMembersPerGroup: 0,
    },
    groupTypeStats,
    wardStats,
  };
};

const CBUCBODetails = mongoose.model("CBUCBODetails", cbucboDetailsSchema);

export default CBUCBODetails;
