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

const photoDocumentationSchema = new mongoose.Schema(
  {
    before: { type: String, default: "" }, // Photo URL
    intermediate: { type: String, default: "" }, // Photo URL
    after: { type: String, default: "" }, // Photo URL
  },
  { _id: false }
);

const scStudentSchema = new mongoose.Schema(
  {
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
    gender: {
      type: String,
      required: [true, "Gender is required"],
      enum: ["Boy", "Girl", "Other"],
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
    category: {
      type: String,
      enum: ["SC", "ST", "OBC", "Muslim", "General", "Other"],
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
    natureOfIssue: {
      type: String,
      required: [true, "Nature of issue is required"],
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
    dateOfEducationalAssessment: {
      type: Date,
    },
    educationalScreeningResults: {
      type: String,
      trim: true,
    },
    dateOfCareerCounselling: {
      type: Date,
    },
    counselingReport: {
      type: String,
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
    photoDocumentation: {
      type: photoDocumentationSchema,
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

// Index for better search performance (householdCode already has unique index)
scStudentSchema.index({ name: "text", habitation: "text" });
scStudentSchema.index({ wardNo: 1 });
scStudentSchema.index({ createdAt: -1 });

export default mongoose.model("SCStudent", scStudentSchema);
