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

const hivSchema = new mongoose.Schema(
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

    // HH Details
    householdCode: {
      type: String,
      required: [true, "Household code is required"],
      unique: true,
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

    // HIV Information
    hivStage: {
      type: String,
      enum: ["Stage 1", "Stage 2", "Stage 3", "Stage 4", "Unknown"],
      trim: true,
    },
    durationOfIllness: {
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
    nutritionStatus: {
      type: String,
      enum: [
        "Normal",
        "Underweight",
        "Overweight",
        "Malnourished",
        "Severely Malnourished",
      ],
      trim: true,
    },
    individualCarePlan: {
      type: String,
      trim: true,
    },

    // Treatment status
    statusOfTreatment: {
      type: String,
      enum: [
        "Not Started",
        "On ART",
        "Treatment Interrupted",
        "Stopped",
        "Completed",
      ],
      trim: true,
    },
    overallStatus: {
      type: String,
      enum: ["Active", "On Treatment", "Lost to Follow-up", "Died", "Unknown"],
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
hivSchema.index({ name: "text", habitation: "text" });
// householdCode already has unique index, no need to add again
hivSchema.index({ wardNo: 1 });
hivSchema.index({ age: 1 });
hivSchema.index({ hivStage: 1 });
hivSchema.index({ statusOfTreatment: 1 });
hivSchema.index({ overallStatus: 1 });
hivSchema.index({ createdAt: -1 });

export default mongoose.model("HIV", hivSchema);
