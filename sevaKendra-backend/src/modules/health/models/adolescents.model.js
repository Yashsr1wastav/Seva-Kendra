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

const adolescentsSchema = new mongoose.Schema(
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
      min: [10, "Age should be at least 10 for adolescent"],
      max: [19, "Age should not exceed 19 for adolescent"],
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

    // Education Status
    educationStatus: {
      type: String,
      required: [true, "Education status is required"],
      enum: [
        "In School",
        "Dropped Out",
        "Completed",
        "Never Enrolled",
        "Vocational Training",
      ],
    },
    currentClass: {
      type: String,
      trim: true,
    },
    schoolName: {
      type: String,
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

    // Health Assessment
    dateOfHealthScreening: {
      type: Date,
    },
    heightCm: {
      type: Number,
      min: [50, "Height should be at least 50 cm"],
      max: [250, "Height cannot exceed 250 cm"],
    },
    weightKg: {
      type: Number,
      min: [10, "Weight should be at least 10 kg"],
      max: [200, "Weight cannot exceed 200 kg"],
    },
    bmi: {
      type: Number,
      min: [10, "BMI should be at least 10"],
      max: [50, "BMI cannot exceed 50"],
    },
    nutritionalStatus: {
      type: String,
      enum: [
        "Normal",
        "Underweight",
        "Overweight",
        "Obese",
        "Severely Underweight",
      ],
      trim: true,
    },

    // Sexual and Reproductive Health
    menstrualHygiene: {
      type: String,
      enum: ["Good", "Poor", "Fair", "Not Applicable"],
      trim: true,
    },
    reproductiveHealthEducation: {
      type: String,
      enum: ["Provided", "Not Provided", "Partially Provided", "Refused"],
      trim: true,
    },

    // Mental Health
    mentalHealthScreening: {
      type: String,
      enum: ["Normal", "At Risk", "Needs Support", "Referred", "Not Assessed"],
      trim: true,
    },
    counselingProvided: {
      type: String,
      enum: ["Yes", "No", "In Progress", "Referred"],
      trim: true,
    },

    // Life Skills and Development
    lifeSkillsTraining: {
      type: String,
      enum: ["Completed", "In Progress", "Not Started", "Dropped Out"],
      trim: true,
    },
    vocationalSkills: {
      type: String,
      trim: true,
    },
    peerEducatorRole: {
      type: String,
      enum: ["Yes", "No", "Training", "Interested"],
      trim: true,
    },

    // Risk Factors
    substanceUse: {
      type: String,
      enum: ["None", "Tobacco", "Alcohol", "Drugs", "Multiple", "Unknown"],
      trim: true,
    },
    socialIssues: {
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
adolescentsSchema.index({
  name: "text",
  habitation: "text",
  schoolName: "text",
});
adolescentsSchema.index({ wardNo: 1 });
adolescentsSchema.index({ age: 1 });
adolescentsSchema.index({ educationStatus: 1 });
adolescentsSchema.index({ nutritionalStatus: 1 });
adolescentsSchema.index({ mentalHealthScreening: 1 });
adolescentsSchema.index({ substanceUse: 1 });
adolescentsSchema.index({ createdAt: -1 });

export default mongoose.model("Adolescents", adolescentsSchema);
