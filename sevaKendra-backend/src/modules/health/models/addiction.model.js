import mongoose from "mongoose";

const progressReportingSchema = new mongoose.Schema(
  {
    jan25: { type: String, default: "" },
    feb25: { type: String, default: "" },
    mar25: { type: String, default: "" },
    apr25: { type: String, default: "" },
    may25: { type: String, default: "" },
    jun25: { type: String, default: "" },
    jul25: { type: String, default: "" },
    aug25: { type: String, default: "" },
    sep25: { type: String, default: "" },
    oct25: { type: String, default: "" },
    nov25: { type: String, default: "" },
    dec25: { type: String, default: "" },
    jan26: { type: String, default: "" },
    feb26: { type: String, default: "" },
    mar26: { type: String, default: "" },
  },
  { _id: false }
);

const addictionSchema = new mongoose.Schema(
  {
    // Basic Information
    caseId: {
      type: String,
      required: [true, "Case ID is required"],
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
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
      trim: true,
      match: [/^[6-9]\d{9}$/, "Please enter a valid mobile number"],
    },
    occupation: {
      type: String,
      trim: true,
    },

    // HH Details
    householdCode: {
      type: String,
      required: [true, "Household code is required"],
      trim: true,
    },
    headOfHousehold: {
      type: String,
      required: [true, "Head of household is required"],
      trim: true,
    },
    nameOfRespondant: {
      type: String,
      trim: true,
    },
    contactNoOfRespondant: {
      type: String,
      trim: true,
      match: [/^[6-9]\d{9}$/, "Please enter a valid mobile number"],
    },
    wardNo: {
      type: String,
      required: [true, "Ward number is required"],
      trim: true,
    },
    habitation: {
      type: String,
      required: [true, "Habitation is required"],
      trim: true,
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
    },
    reportedBy: {
      type: String,
      required: [true, "Reported by is required"],
      trim: true,
    },

    // Information pertaining to Addiction
    typeOfSubstancesUsed: {
      type: String,
      trim: true,
    },
    durationOfUse: {
      type: Number,
      min: [0, "Duration cannot be negative"],
      trim: true,
    },
    diagnosticDetails: {
      type: String,
      trim: true,
    },
    comorbidities: {
      type: String,
      trim: true,
    },
    individualCarePlan: {
      type: String,
      trim: true,
    },

    // Rehabilitation status
    nameOfInstitution: {
      type: String,
      trim: true,
    },
    dateOfAdmission: {
      type: Date,
    },
    dateOfRelease: {
      type: Date,
    },
    statusOfLinkageWithSkillDevelopment: {
      type: String,
      enum: ["Not Linked", "In Progress", "Linked", "Completed", "Dropped Out"],
      trim: true,
    },
    overallStatus: {
      type: String,
      enum: [
        "Active",
        "In Rehabilitation",
        "Recovered",
        "Relapsed",
        "Lost to Follow-up",
        "Unknown",
      ],
      trim: true,
    },

    progressReporting: {
      type: progressReportingSchema,
      default: () => ({}),
    },
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
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for better search performance
addictionSchema.index({ name: "text", habitation: "text" });
// caseId already has unique index, no need to add again
addictionSchema.index({ wardNo: 1 });
addictionSchema.index({ age: 1 });
addictionSchema.index({ typeOfSubstancesUsed: 1 });
addictionSchema.index({ statusOfLinkageWithSkillDevelopment: 1 });
addictionSchema.index({ overallStatus: 1 });
addictionSchema.index({ createdAt: -1 });

export default mongoose.model("Addiction", addictionSchema);
