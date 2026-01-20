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

const motherChildSchema = new mongoose.Schema(
  {
    // Basic Information
    householdCode: {
      type: String,
      required: [true, "Household code is required"],
      unique: true,
      trim: true,
    },
    nameOfMother: {
      type: String,
      required: [true, "Name of mother is required"],
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
    ageOfMother: {
      type: Number,
      required: [true, "Age of mother is required"],
      min: [15, "Age of mother should be at least 15"],
      max: [50, "Age of mother cannot exceed 50"],
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

    // Child Details
    nameOfChild: {
      type: String,
      required: [true, "Name of child is required"],
      trim: true,
    },
    ageOfChild: {
      type: Number,
      required: [true, "Age of child is required"],
      min: [0, "Age of child cannot be negative"],
      max: [18, "Age of child should be under 18"],
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

    // Maternal Health
    pregnantOrLactatingMother: {
      type: String,
      required: [true, "Pregnant or lactating mother status is required"],
      enum: ["Pregnant", "Lactating", "Both", "Neither"],
      trim: true,
    },
    antenatalCareDetails: {
      type: String,
      trim: true,
    },
    deliveryDetails: {
      type: String,
      trim: true,
    },
    deliveryArea: {
      type: String,
      enum: [
        "Home",
        "Hospital",
        "Primary Health Center",
        "Community Health Center",
        "Private Clinic",
        "Other",
      ],
      trim: true,
    },
    birthCertificate: {
      type: String,
      enum: ["Available", "Not Available", "In Process"],
      trim: true,
    },
    postnatalCareDetails: {
      type: String,
      trim: true,
    },
    immunizationStatus: {
      type: String,
      enum: ["Complete", "Incomplete", "Not Started", "In Progress", "Unknown"],
      trim: true,
    },
    nutritionalStatus: {
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
    healthCheckups: {
      type: String,
      trim: true,
    },

    // Child Health
    childImmunizationStatus: {
      type: String,
      enum: ["Complete", "Incomplete", "Not Started", "In Progress", "Unknown"],
      trim: true,
    },
    childNutritionalStatus: {
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
    childDevelopmentMilestones: {
      type: String,
      trim: true,
    },

    // Support Services
    servicesProvided: {
      type: String,
      trim: true,
    },
    referralsGiven: {
      type: String,
      trim: true,
    },
    governmentSchemes: {
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
motherChildSchema.index({
  nameOfMother: "text",
  nameOfChild: "text",
  habitation: "text",
});
motherChildSchema.index({ wardNo: 1 });
motherChildSchema.index({ ageOfMother: 1 });
motherChildSchema.index({ ageOfChild: 1 });
motherChildSchema.index({ immunizationStatus: 1 });
motherChildSchema.index({ nutritionalStatus: 1 });
motherChildSchema.index({ childImmunizationStatus: 1 });
motherChildSchema.index({ childNutritionalStatus: 1 });
motherChildSchema.index({ createdAt: -1 });

export default mongoose.model("MotherChild", motherChildSchema);
