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

const otherDiseasesSchema = new mongoose.Schema(
  {
    // Basic Information
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

    // Information pertaining to Disease
    natureOfIssue: {
      type: String,
      trim: true,
    },
    dateOfMedicalScreening: {
      type: Date,
    },
    screeningResults: {
      type: String,
      trim: true,
    },
    individualCarePlan: {
      type: String,
      trim: true,
    },

    // Treatment status
    nameOfInstitution: {
      type: String,
      trim: true,
    },
    dateOfAdmission: {
      type: Date,
    },
    overallStatus: {
      type: String,
      enum: [
        "Active",
        "Under Treatment",
        "Recovered",
        "Lost to Follow-up",
        "Died",
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
otherDiseasesSchema.index({
  name: "text",
  habitation: "text",
  natureOfIssue: "text",
});
otherDiseasesSchema.index({ wardNo: 1 });
otherDiseasesSchema.index({ age: 1 });
otherDiseasesSchema.index({ natureOfIssue: 1 });
otherDiseasesSchema.index({ overallStatus: 1 });
otherDiseasesSchema.index({ createdAt: -1 });

export default mongoose.model("OtherDiseases", otherDiseasesSchema);
