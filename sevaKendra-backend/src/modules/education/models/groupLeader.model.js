import mongoose from "mongoose";

const groupLeaderSchema = new mongoose.Schema(
  {
    leaderId: {
      type: String,
      required: [true, "Leader ID is required"],
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
    experience: {
      type: Number,
      min: [0, "Experience cannot be negative"],
      default: 0,
    },
    qualifications: {
      type: [String],
      default: [],
    },
    assignedStudyCenters: [
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
groupLeaderSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Index for better search performance
groupLeaderSchema.index({
  firstName: "text",
  lastName: "text",
  email: "text",
});
groupLeaderSchema.index({ status: 1 });
groupLeaderSchema.index({ createdAt: -1 });

export default mongoose.model("GroupLeader", groupLeaderSchema);
