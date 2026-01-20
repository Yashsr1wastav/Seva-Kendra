import mongoose from "mongoose";

const progressReportingSchema = new mongoose.Schema(
  {
    aug24: { type: String, default: "" },
    sep24: { type: String, default: "" },
    oct24: { type: String, default: "" },
    nov24: { type: String, default: "" },
    dec24: { type: String, default: "" },
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
    remarks: { type: String, default: "" },
  },
  { _id: false }
);

const schoolSchema = new mongoose.Schema(
  {
    schoolCode: {
      type: String,
      required: [true, "School code is required"],
      unique: true,
      trim: true,
    },
    wardNo: {
      type: String,
      required: [true, "Ward number is required"],
      trim: true,
    },
    schoolName: {
      type: String,
      required: [true, "School name is required"],
      trim: true,
    },
    educationLevel: {
      type: String,
      required: [true, "Education level is required"],
      enum: [
        "Primary",
        "Upper Primary",
        "Secondary",
        "Higher Secondary",
        "All Levels",
      ],
      trim: true,
    },
    schoolTimings: {
      type: String,
      required: [true, "School timings are required"],
      trim: true,
    },
    mediumOfInstruction: {
      type: String,
      required: [true, "Medium of instruction is required"],
      trim: true,
    },
    typeOfStudents: {
      type: String,
      required: [true, "Type of students is required"],
      enum: ["Boys", "Girls", "Co-educational"],
      trim: true,
    },
    totalStudents: {
      type: Number,
      required: [true, "Total number of students is required"],
      min: [0, "Total students cannot be negative"],
    },
    principalName: {
      type: String,
      required: [true, "Principal name is required"],
      trim: true,
    },
    principalContact: {
      type: String,
      required: [true, "Principal contact is required"],
      trim: true,
      match: [/^[6-9]\d{9}$/, "Please enter a valid mobile number"],
    },
    projectResponsible: {
      type: String,
      required: [true, "Project responsible is required"],
      trim: true,
    },
    keyIssueIdentified: {
      type: String,
      required: [true, "Key issue identified is required"],
      trim: true,
    },
    actionPlan: {
      type: String,
      required: [true, "Action plan is required"],
      trim: true,
    },
    statusOfActionPlanImplementation: {
      type: String,
      enum: [
        "Not Started",
        "In Progress",
        "Partially Completed",
        "Completed",
        "On Hold",
      ],
      default: "Not Started",
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

// Index for better search performance (schoolCode already has unique index)
schoolSchema.index({ schoolName: "text", wardNo: "text" });
schoolSchema.index({ wardNo: 1 });
schoolSchema.index({ educationLevel: 1 });
schoolSchema.index({ createdAt: -1 });

export default mongoose.model("School", schoolSchema);
