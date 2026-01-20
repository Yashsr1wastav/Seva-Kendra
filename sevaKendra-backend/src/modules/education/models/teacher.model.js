import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    teacherId: {
      type: String,
      required: [true, "Teacher ID is required"],
      unique: true,
      trim: true,
    },
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please provide a valid email address"],
      lowercase: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^[6-9]\d{9}$/, "Please enter a valid mobile number"],
      trim: true,
    },
    specialization: {
      type: String,
      enum: [
        "Mathematics",
        "Science",
        "English",
        "Social Studies",
        "Physical Education",
        "Computer Science",
        "Arts",
        "Vocational",
        "General",
        "Other",
      ],
      default: "General",
    },
    experience: {
      type: Number,
      min: [0, "Experience cannot be negative"],
      default: 0,
    },
    qualifications: {
      type: [String],
      default: [],
    },
    studyCenters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "StudyCenter",
      },
    ],
    status: {
      type: String,
      enum: ["Active", "Inactive", "On Leave"],
      default: "Active",
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

// Add virtual for full name
teacherSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Index for better search performance
teacherSchema.index({ firstName: "text", lastName: "text", email: "text" });
teacherSchema.index({ status: 1 });
teacherSchema.index({ createdAt: -1 });

export default mongoose.model("Teacher", teacherSchema);
