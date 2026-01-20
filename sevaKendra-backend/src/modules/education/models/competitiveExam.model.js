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

const competitiveExamSchema = new mongoose.Schema(
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
    socialStatus: {
      type: String,
      enum: ["SC", "ST", "OBC", "General", "EWS"],
      trim: true,
    },
    educationalStatus: {
      type: String,
      required: [true, "Educational status is required"],
      trim: true,
    },
    typeOfExam: {
      type: String,
      required: [true, "Type of exam is required"],
      enum: [
        "JEE Main",
        "JEE Advanced",
        "NEET",
        "UPSC",
        "SSC",
        "Bank PO",
        "Bank Clerk",
        "Railway",
        "Police",
        "Teaching",
        "State PSC",
        "Other",
      ],
      trim: true,
    },
    status: {
      type: String,
      required: [true, "Status is required"],
      enum: [
        "Preparing",
        "Appeared",
        "Qualified",
        "Not Qualified",
        "Discontinued",
      ],
      default: "Preparing",
    },
    // Enrollment Details
    dateOfEnrollment: {
      type: Date,
      required: [true, "Date of enrollment is required"],
    },
    enrolledBy: {
      type: String,
      required: [true, "Enrolled by is required"],
      trim: true,
    },
    // Assessment Details
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
    // Examination Details
    applicationDate: {
      type: Date,
    },
    examDate: {
      type: Date,
    },
    result: {
      type: String,
      enum: [
        "Pending",
        "Qualified",
        "Not Qualified",
        "Appeared",
        "Not Appeared",
      ],
      default: "Pending",
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

// Index for better search performance (householdCode already has unique index)
competitiveExamSchema.index({ name: "text", habitation: "text" });
competitiveExamSchema.index({ wardNo: 1 });
competitiveExamSchema.index({ typeOfExam: 1 });
competitiveExamSchema.index({ status: 1 });
competitiveExamSchema.index({ createdAt: -1 });

export default mongoose.model("CompetitiveExam", competitiveExamSchema);
