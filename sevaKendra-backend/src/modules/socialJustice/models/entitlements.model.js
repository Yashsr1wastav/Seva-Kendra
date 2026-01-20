import mongoose from "mongoose";

const entitlementsSchema = new mongoose.Schema(
  {
    // Basic Information
    householdCode: {
      type: String,
      required: [true, "Household code is required"],
      trim: true,
      index: true,
    },
    idCode: {
      type: String,
      required: [true, "ID code is required"],
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
    headOfHousehold: {
      type: String,
      required: [true, "Head of household is required"],
      trim: true,
    },
    contactNo: {
      type: String,
      required: [true, "Contact number is required"],
      match: [/^[6-9]\d{9}$/, "Please enter a valid contact number"],
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

    // For ID Proof & Domicile Status
    idProofAndDomicile: {
      typeOfDocument: {
        type: String,
        enum: [
          "Aadhar Card",
          "Voter ID",
          "Passport",
          "Driving License",
          "PAN Card",
          "Ration Card",
          "Birth Certificate",
          "Domicile Certificate",
          "Other",
        ],
      },
      natureOfIssue: {
        type: String,
        trim: true,
      },
      status: {
        type: String,
        enum: ["Pending", "In Progress", "Resolved", "Rejected"],
        default: "Pending",
      },
      dateOfReporting: {
        type: Date,
      },
    },

    // For Schemes
    schemes: {
      eligibleSchemes: {
        type: String,
        trim: true,
      },
      natureOfIssue: {
        type: String,
        trim: true,
      },
      status: {
        type: String,
        enum: ["Pending", "In Progress", "Resolved", "Rejected"],
        default: "Pending",
      },
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
    collection: "entitlements",
  }
);

// Additional indexes for better query performance
entitlementsSchema.index({ "idProofAndDomicile.status": 1 });
entitlementsSchema.index({ "schemes.status": 1 });
entitlementsSchema.index({ createdAt: -1 });

// Compound indexes
entitlementsSchema.index({ wardNo: 1, habitation: 1 });
entitlementsSchema.index({ gender: 1, age: 1 });

// Virtual for age group
entitlementsSchema.virtual("ageGroup").get(function () {
  if (!this.age) return null;
  if (this.age < 18) return "Child";
  if (this.age < 60) return "Adult";
  return "Senior";
});

// Pre-save middleware for validation
entitlementsSchema.pre("save", function (next) {
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
entitlementsSchema.statics.getStats = async function () {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalBeneficiaries: { $sum: 1 },
        avgAge: { $avg: "$age" },
      },
    },
  ]);

  const genderStats = await this.aggregate([
    {
      $group: {
        _id: "$gender",
        count: { $sum: 1 },
      },
    },
  ]);

  const statusStats = await this.aggregate([
    {
      $group: {
        _id: "$idProofDetails.status",
        count: { $sum: 1 },
      },
    },
  ]);

  return {
    overview: stats[0] || { totalBeneficiaries: 0, avgAge: 0 },
    genderStats,
    statusStats,
  };
};

// Static method to get scheme statistics
entitlementsSchema.statics.getSchemeStats = async function () {
  const idProofStats = await this.aggregate([
    {
      $group: {
        _id: "$idProofAndDomicile.status",
        count: { $sum: 1 },
      },
    },
  ]);

  const schemeStats = await this.aggregate([
    {
      $group: {
        _id: "$schemes.status",
        count: { $sum: 1 },
      },
    },
  ]);

  return {
    idProofStats,
    schemeStats,
  };
};

const Entitlements = mongoose.model("Entitlements", entitlementsSchema);

export default Entitlements;
