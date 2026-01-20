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

const pwdSchema = new mongoose.Schema(
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
    district: {
      type: String,
      required: [true, "District is required"],
      trim: true,
    },
    state: {
      type: String,
      required: [true, "State is required"],
      trim: true,
    },

    // Disability Details
    typeOfDisability: {
      type: String,
      required: [true, "Type of disability is required"],
      enum: [
        "Visual Impairment",
        "Hearing Impairment",
        "Speech and Language Disability",
        "Locomotor Disability",
        "Mental Retardation",
        "Mental Illness",
        "Multiple Disabilities",
        "Autism",
        "Cerebral Palsy",
        "Muscular Dystrophy",
        "Chronic Neurological Conditions",
        "Others",
      ],
    },
    percentageOfDisability: {
      type: Number,
      required: [true, "Percentage of disability is required"],
      min: [0, "Percentage cannot be negative"],
      max: [100, "Percentage cannot exceed 100"],
    },
    disabilityCertificate: {
      type: String,
      enum: ["Available", "Not Available", "In Process", "Expired"],
      required: [true, "Disability certificate status is required"],
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

    // Assessment and Support
    dateOfAssessment: {
      type: Date,
    },
    assessmentResults: {
      type: String,
      trim: true,
    },
    assistiveDevicesProvided: {
      type: String,
      trim: true,
    },
    therapyServices: {
      type: String,
      trim: true,
    },
    rehabilitationServices: {
      type: String,
      trim: true,
    },
    educationalSupport: {
      type: String,
      trim: true,
    },
    vocationalTraining: {
      type: String,
      trim: true,
    },
    employmentStatus: {
      type: String,
      enum: [
        "Employed",
        "Unemployed",
        "Self-Employed",
        "Student",
        "Retired",
        "Other",
      ],
      trim: true,
    },

    // Government Schemes
    beneficiaryOfGovernmentSchemes: {
      type: String,
      trim: true,
    },
    pensionStatus: {
      type: String,
      enum: ["Receiving", "Not Receiving", "Applied", "Rejected", "Unknown"],
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
pwdSchema.index({ name: "text", habitation: "text" });
pwdSchema.index({ wardNo: 1 });
pwdSchema.index({ age: 1 });
pwdSchema.index({ typeOfDisability: 1 });
pwdSchema.index({ percentageOfDisability: 1 });
pwdSchema.index({ disabilityCertificate: 1 });
pwdSchema.index({ employmentStatus: 1 });
pwdSchema.index({ pensionStatus: 1 });
pwdSchema.index({ createdAt: -1 });

export default mongoose.model("PWD", pwdSchema);
