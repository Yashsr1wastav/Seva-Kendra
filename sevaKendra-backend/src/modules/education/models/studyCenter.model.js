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

const studyCenterSchema = new mongoose.Schema(
  {
    centreCode: {
      type: String,
      required: [true, "Centre code is required"],
      unique: true,
      trim: true,
    },
    centreName: {
      type: String,
      required: [true, "Centre name is required"],
      trim: true,
    },
    sourceOfFunding: {
      type: String,
      required: [true, "Source of funding is required"],
      trim: true,
    },
    infrastructure: {
      type: String,
      required: [true, "Infrastructure is required"],
      enum: [
        "Own Building",
        "Rented",
        "Community Hall",
        "School Premises",
        "Temple/Church",
        "Other",
      ],
      trim: true,
    },
    timing: {
      type: String,
      required: [true, "Timing is required"],
      trim: true,
    },
    studentsLevelOfEducation: {
      type: [String],
      required: [true, "Students level of education is required"],
      enum: [
        "Class 1-5",
        "Class 6-8",
        "Class 9-10",
        "Class 11-12",
        "College",
        "Other",
      ],
    },
    wardNo: {
      type: String,
      required: [true, "Ward number is required"],
      enum: [
        "Ward 1",
        "Ward 2",
        "Ward 3",
        "Ward 4",
        "Ward 5",
        "Ward 6",
        "Ward 7",
        "Ward 8",
        "Ward 9",
        "Ward 10",
        "Ward 11",
        "Ward 12",
        "Ward 13",
        "Ward 14",
        "Ward 15",
      ],
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
    dateOfEstablishment: {
      type: Date,
      required: [true, "Date of establishment is required"],
    },
    totalStudents: {
      type: Number,
      required: [true, "Total students count is required"],
      min: [0, "Total students cannot be negative"],
    },
    groupLeader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GroupLeader",
      required: [true, "Group leader is required"],
    },
    teachers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
      },
    ],
    // Legacy fields for backward compatibility
    groupLeaderName: {
      type: String,
      default: "",
    },
    groupLeaderContact: {
      type: String,
      default: "",
      match: [/^[6-9]\d{9}$|^$/, "Please enter a valid mobile number"],
    },
    teacherNames: {
      type: [String],
      default: [],
    },
    teacherContacts: {
      type: [String],
      default: [],
      validate: {
        validator: function (contacts) {
          return contacts.length === 0 || contacts.every((contact) => /^[6-9]\d{9}$/.test(contact));
        },
        message: "All teacher contact numbers must be valid mobile numbers",
      },
    },
    functionalAspects: {
      infrastructureQuality: {
        type: String,
        enum: ["Excellent", "Good", "Average", "Poor", "Needs Improvement"],
      },
      teacherAttendance: {
        type: String,
        enum: ["Regular", "Irregular", "Needs Monitoring"],
      },
      studentEngagement: {
        type: String,
        enum: ["High", "Medium", "Low"],
      },
      learningOutcome: {
        type: String,
        enum: ["Excellent", "Good", "Satisfactory", "Needs Improvement"],
      },
      communityParticipation: {
        type: String,
        enum: ["Active", "Moderate", "Low"],
      },
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

// Index for better search performance (centreCode already has unique index)
studyCenterSchema.index({
  centreName: "text",
  habitation: "text",
  wardNo: "text",
});
studyCenterSchema.index({ wardNo: 1 });
studyCenterSchema.index({ createdAt: -1 });

export default mongoose.model("StudyCenter", studyCenterSchema);
