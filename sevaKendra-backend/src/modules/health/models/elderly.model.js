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

const elderlySchema = new mongoose.Schema(
  {
    // Basic Information
    householdCode: {
      type: String,
      required: [true, "Household code is required"],
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    uniqueId: {
      type: String,
      required: [true, "Unique ID is required"],
      unique: true,
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
      min: [60, "Age should be 60 or above for elderly"],
      max: [120, "Age cannot exceed 120"],
    },
    contactNo: {
      type: String,
      required: [true, "Contact number is required"],
      trim: true,
      match: [/^[6-9]\d{9}$/, "Please enter a valid mobile number"],
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
    nameOfLocalSelfGovernment: {
      type: String,
      required: [true, "Name of local self government is required"],
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

    // Assessment Details
    dateOfMedicalScreening: {
      type: Date,
    },
    medicalScreeningResults: {
      type: String,
      trim: true,
    },
    dateOfPsychologicalAssessment: {
      type: Date,
    },
    psychologicalScreeningResults: {
      type: String,
      trim: true,
    },
    statusOfBankAccount: {
      type: String,
      enum: ["Available", "Not Available", "In Process", "Blocked", "Other"],
      trim: true,
    },
    individualCarePlan: {
      type: String,
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

// Index for better search performance (householdCode and uniqueId already have unique index)
elderlySchema.index({ name: "text", habitation: "text" });
elderlySchema.index({ wardNo: 1 });
elderlySchema.index({ age: 1 });
elderlySchema.index({ statusOfBankAccount: 1 });
elderlySchema.index({ createdAt: -1 });

export default mongoose.model("Elderly", elderlySchema);
