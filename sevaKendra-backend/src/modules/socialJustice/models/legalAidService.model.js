import mongoose from "mongoose";

const legalAidServiceSchema = new mongoose.Schema(
  {
    // Basic Information
    householdCode: {
      type: String,
      required: [true, "Household code is required"],
      trim: true,
      index: true,
    },
    uniqueId: {
      type: String,
      required: [true, "Unique ID is required"],
      unique: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      index: true,
    },
    gender: {
      type: String,
      required: [true, "Gender is required"],
      enum: ["Male", "Female", "Other"],
    },
    age: {
      type: Number,
      required: [true, "Age is required"],
      min: [0, "Age cannot be negative"],
      max: [120, "Age cannot exceed 120"],
    },
    contactNo: {
      type: String,
      required: [true, "Contact number is required"],
      match: [/^[6-9]\d{9}$/, "Please enter a valid contact number"],
    },
    headOfHousehold: {
      type: String,
      required: [true, "Head of household is required"],
      trim: true,
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

    // Reporting Details
    dateOfReporting: {
      type: Date,
      required: [true, "Date of reporting is required"],
      index: true,
    },
    reportedBy: {
      type: String,
      required: [true, "Reported by is required"],
      trim: true,
    },
    natureOfIssue: {
      type: String,
      required: [true, "Nature of issue is required"],
      enum: [
        "Property Dispute",
        "Family Dispute",
        "Domestic Violence",
        "Labor Rights",
        "Consumer Rights",
        "Land Rights",
        "Government Benefits",
        "Legal Documentation",
        "Criminal Case",
        "Civil Case",
        "Other",
      ],
    },

    // Intervention Plan
    actionPlan: {
      type: String,
      required: [true, "Action plan is required"],
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

    // Photo Documentation
    photoDocumentation: [
      {
        description: {
          type: String,
          trim: true,
        },
        filePath: {
          type: String,
          trim: true,
        },
        uploadDate: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Additional Details
    remarks: {
      type: String,
      trim: true,
    },
    followUpRequired: {
      type: Boolean,
      default: false,
    },
    followUpDate: {
      type: Date,
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
    collection: "legalAidServices",
  }
);

// Additional indexes for better query performance
legalAidServiceSchema.index({ natureOfIssue: 1 });
legalAidServiceSchema.index({ createdAt: -1 });

// Compound indexes
legalAidServiceSchema.index({ wardNo: 1, habitation: 1 });
legalAidServiceSchema.index({ natureOfIssue: 1, createdAt: -1 });

// Virtual for age group
legalAidServiceSchema.virtual("ageGroup").get(function () {
  if (!this.age) return null;
  if (this.age < 18) return "Minor";
  if (this.age < 60) return "Adult";
  return "Senior";
});

// Pre-save middleware for validation
legalAidServiceSchema.pre("save", function (next) {
  // Validate contact number format
  if (this.contactNo && !/^[6-9]\d{9}$/.test(this.contactNo)) {
    return next(new Error("Invalid contact number format"));
  }

  // Set follow-up date if follow-up is required and no date is set
  if (this.followUpRequired && !this.followUpDate) {
    this.followUpDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
  }

  next();
});

// Static method to get statistics
legalAidServiceSchema.statics.getStats = async function () {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalCases: { $sum: 1 },
        avgAge: { $avg: "$age" },
      },
    },
  ]);

  const issueTypeStats = await this.aggregate([
    {
      $group: {
        _id: "$natureOfIssue",
        count: { $sum: 1 },
      },
    },
  ]);

  return {
    overview: stats[0] || {
      totalCases: 0,
      avgAge: 0,
    },
    issueTypeStats,
  };
};

const LegalAidService = mongoose.model(
  "LegalAidService",
  legalAidServiceSchema
);

export default LegalAidService;
