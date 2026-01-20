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

const tbhivAddictSchema = new mongoose.Schema(
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

    // Condition Type
    conditionType: {
      type: String,
      required: [true, "Condition type is required"],
      enum: [
        "TB",
        "HIV",
        "Drug Addiction",
        "TB + HIV",
        "TB + Drug Addiction",
        "HIV + Drug Addiction",
        "All Three",
      ],
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

    // TB Related Information
    tbDiagnosisDate: {
      type: Date,
    },
    tbTreatmentStatus: {
      type: String,
      enum: [
        "Not Started",
        "In Progress",
        "Completed",
        "Interrupted",
        "Failed",
        "Lost to Follow-up",
      ],
      trim: true,
    },
    tbTreatmentStartDate: {
      type: Date,
    },
    tbMedicationAdherence: {
      type: String,
      enum: ["Good", "Fair", "Poor", "Unknown"],
      trim: true,
    },
    tbTestResults: {
      type: String,
      trim: true,
    },

    // HIV Related Information
    hivDiagnosisDate: {
      type: Date,
    },
    hivStatus: {
      type: String,
      enum: ["Positive", "Negative", "Unknown", "Refused Testing"],
      trim: true,
    },
    artStatus: {
      type: String,
      enum: [
        "Not Started",
        "In Progress",
        "Interrupted",
        "Stopped",
        "Not Applicable",
      ],
      trim: true,
    },
    artStartDate: {
      type: Date,
    },
    cd4Count: {
      type: Number,
      min: [0, "CD4 count cannot be negative"],
    },
    viralLoad: {
      type: String,
      trim: true,
    },

    // Drug Addiction Information
    substanceType: {
      type: String,
      enum: [
        "Alcohol",
        "Tobacco",
        "Opioids",
        "Cannabis",
        "Stimulants",
        "Multiple",
        "Other",
      ],
      trim: true,
    },
    addictionSeverity: {
      type: String,
      enum: ["Mild", "Moderate", "Severe", "Not Assessed"],
      trim: true,
    },
    rehabilitationStatus: {
      type: String,
      enum: [
        "Not Started",
        "In Progress",
        "Completed",
        "Dropped Out",
        "Relapsed",
      ],
      trim: true,
    },
    rehabilitationStartDate: {
      type: Date,
    },
    detoxificationStatus: {
      type: String,
      enum: ["Required", "In Progress", "Completed", "Not Required", "Refused"],
      trim: true,
    },

    // Support Services
    counselingServices: {
      type: String,
      enum: ["Provided", "Not Provided", "In Progress", "Refused"],
      trim: true,
    },
    familyCounseling: {
      type: String,
      enum: ["Provided", "Not Provided", "Required", "Not Required"],
      trim: true,
    },
    communitySupport: {
      type: String,
      trim: true,
    },
    referralsGiven: {
      type: String,
      trim: true,
    },

    // Follow-up and Monitoring
    lastFollowupDate: {
      type: Date,
    },
    nextAppointmentDate: {
      type: Date,
    },
    treatmentOutcome: {
      type: String,
      enum: [
        "Cured",
        "Treatment Completed",
        "In Progress",
        "Lost to Follow-up",
        "Died",
        "Failed",
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

// Index for better search performance (householdCode and uniqueId already have unique index)
tbhivAddictSchema.index({ name: "text", habitation: "text" });
tbhivAddictSchema.index({ wardNo: 1 });
tbhivAddictSchema.index({ age: 1 });
tbhivAddictSchema.index({ conditionType: 1 });
tbhivAddictSchema.index({ tbTreatmentStatus: 1 });
tbhivAddictSchema.index({ hivStatus: 1 });
tbhivAddictSchema.index({ artStatus: 1 });
tbhivAddictSchema.index({ rehabilitationStatus: 1 });
tbhivAddictSchema.index({ treatmentOutcome: 1 });
tbhivAddictSchema.index({ createdAt: -1 });

export default mongoose.model("TBHIVAddict", tbhivAddictSchema);
