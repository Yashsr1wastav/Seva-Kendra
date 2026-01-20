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

const healthCampSchema = new mongoose.Schema(
  {
    // Group Details
    dateOfCamp: {
      type: Date,
      required: [true, "Date of camp is required"],
    },
    targetGroup: {
      type: String,
      required: [true, "Target group is required"],
      enum: [
        "Children",
        "Women",
        "Elderly",
        "General",
        "Pregnant Women",
        "Adolescents",
        "PwD",
        "Other",
      ],
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
    village: {
      type: String,
      required: [true, "Village is required"],
      trim: true,
    },
    projectResponsible: {
      type: String,
      required: [true, "Project responsible is required"],
      trim: true,
    },

    // Camp Details
    typeOfHealthCamp: {
      type: String,
      required: [true, "Type of health camp is required"],
      enum: [
        "General Health Checkup",
        "Eye Checkup",
        "Dental Checkup",
        "Maternal Health",
        "Child Health",
        "Vaccination",
        "Mental Health",
        "Nutrition",
        "Chronic Disease",
        "Other",
      ],
      trim: true,
    },
    medicineType: {
      type: String,
      required: [true, "Medicine type is required"],
      enum: ["Allopathic", "Ayurvedic", "Homeopathic", "Unani", "Others"],
      trim: true,
    },
    specialisation: {
      type: String,
      required: [true, "Specialisation is required"],
      trim: true,
    },
    organiser: {
      type: String,
      required: [true, "Organiser is required"],
      trim: true,
    },
    numberOfDoctors: {
      type: Number,
      required: [true, "Number of doctors is required"],
      min: [0, "Number of doctors cannot be negative"],
    },
    numberOfGDA: {
      type: Number,
      required: [true, "Number of GDA is required"],
      min: [0, "Number of GDA cannot be negative"],
    },
    totalBeneficiaries: {
      type: Number,
      required: [true, "Total beneficiaries is required"],
      min: [0, "Total beneficiaries cannot be negative"],
    },
    majorFindings: {
      type: String,
      required: [true, "Major findings are required"],
      trim: true,
    },
    followUpDate: {
      type: Date,
      required: false,
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
healthCampSchema.index({
  targetGroup: "text",
  habitation: "text",
  organiser: "text",
});
healthCampSchema.index({ wardNo: 1 });
healthCampSchema.index({ targetGroup: 1 });
healthCampSchema.index({ dateOfCamp: -1 });
healthCampSchema.index({ createdAt: -1 });

export default mongoose.model("HealthCamp", healthCampSchema);
