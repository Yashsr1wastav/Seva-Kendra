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

const dropoutSchema = new mongoose.Schema(
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
    dateOfReporting: {
      type: Date,
      required: [true, "Date of reporting is required"],
    },
    reportedBy: {
      type: String,
      required: [true, "Reported by is required"],
      trim: true,
    },
    yearOfDropout: {
      type: Number,
      required: [true, "Year of dropout is required"],
      min: [1990, "Year of dropout cannot be before 1990"],
    },
    educationLevelWhenDropout: {
      type: String,
      required: [true, "Education level when dropout is required"],
      trim: true,
    },
    schoolNameWhenDropout: {
      type: String,
      required: [true, "School name when dropout is required"],
      trim: true,
    },
    reasonForDropout: {
      type: String,
      required: [true, "Reason for dropout is required"],
      trim: true,
    },
    documentsCheck: {
      birthCertificate: { type: Boolean, default: false },
      polioCard: { type: Boolean, default: false },
      adharCard: { type: Boolean, default: false },
      transferCertificate: { type: Boolean, default: false },
    },
    dateOfEducationalAssessment: {
      type: Date,
    },
    educationalScreeningResults: {
      type: String,
      trim: true,
    },
    careerCounselling: {
      type: String,
      trim: true,
    },
    counselingReport: {
      type: String,
      trim: true,
    },
    individualCarePlan: {
      type: String,
      trim: true,
    },
    enrollmentStatus: {
      type: String,
      enum: ["Pending", "Enrolled", "Not Enrolled", "In Progress"],
      default: "Pending",
    },
    dateOfReAdmission: {
      type: Date,
    },
    educationLevelWhenReAdmission: {
      type: String,
      trim: true,
    },
    schoolNameWhenReAdmission: {
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
dropoutSchema.index({ name: "text", habitation: "text" });
dropoutSchema.index({ wardNo: 1 });
dropoutSchema.index({ enrollmentStatus: 1 });
dropoutSchema.index({ createdAt: -1 });

export default mongoose.model("Dropout", dropoutSchema);
