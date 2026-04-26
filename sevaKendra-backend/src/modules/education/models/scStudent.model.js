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

const scStudentSchema = new mongoose.Schema(
  {
    householdCode: {
      type: String,
      required: [true, "Beneficiary ID is required"],
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
      enum: ["Boy", "Girl", "Other"],
    },
    dateOfBirth: {
      type: Date,
    },
    age: {
      type: Number,
      min: [0, "Age cannot be negative"],
      max: [120, "Age cannot exceed 120"],
    },
    contactNo: {
      type: String,
      trim: true,
      match: [/^[6-9]\d{9}$/, "Please enter a valid mobile number"],
    },
    headOfHousehold: {
      type: String,
      trim: true,
    },
    fatherName: {
      type: String,
      trim: true,
    },
    motherName: {
      type: String,
      trim: true,
    },
    fatherOccupation: {
      type: String,
      trim: true,
    },
    motherOccupation: {
      type: String,
      trim: true,
    },
    classGrade: {
      type: String,
      enum: [
        "Pre-Primary",
        "Class 1",
        "Class 2",
        "Class 3",
        "Class 4",
        "Class 5",
        "Class 6",
        "Class 7",
        "Class 8",
        "Class 9",
        "Class 10",
        "Class 11",
        "Class 12",
      ],
    },
    studentStatus: {
      type: String,
      enum: ["Dropout", "School-Going", "Study Centre Attendee"],
    },
    schoolName: {
      type: String,
      trim: true,
    },
    wardNo: {
      type: String,
      required: [true, "Ward number is required"],
      trim: true,
    },
    habitation: {
      type: String,
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
    // Reporting Details
    dateOfReporting: {
      type: Date,
    },
    reportedBy: {
      type: String,
      trim: true,
    },
    natureOfIssue: {
      type: String,
      trim: true,
    },
    // Assessment Details
    dateOfMedicalScreening: {
      type: Date,
    },
    medicalScreeningResults: {
      type: String,
      trim: true,
    },
    dateOfPsychologicalAssessment: {
      type: Date,
    },
    psychologicalScreeningResults: {
      type: String,
      trim: true,
    },
    dateOfEducationalAssessment: {
      type: Date,
    },
    educationalScreeningResults: {
      type: String,
      trim: true,
    },
    dateOfCareerCounselling: {
      type: Date,
    },
    counselingReport: {
      type: String,
      trim: true,
    },
    individualCarePlan: {
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
scStudentSchema.index({ name: "text", habitation: "text" });
scStudentSchema.index({ wardNo: 1 });
scStudentSchema.index({ createdAt: -1 });

scStudentSchema.pre("save", function (next) {
  if (this.dateOfBirth && !this.age) {
    const now = new Date();
    const dob = new Date(this.dateOfBirth);
    let age = now.getFullYear() - dob.getFullYear();
    const monthDiff = now.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) {
      age -= 1;
    }
    this.age = Math.max(age, 0);
  }
  next();
});

export default mongoose.model("SCStudent", scStudentSchema);
