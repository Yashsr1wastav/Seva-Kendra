import mongoose from "mongoose";

const monthlyUpdateSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    notes: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed", "Cancelled", "On Hold"],
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    attachments: [
      {
        fileName: String,
        fileUrl: String,
        uploadDate: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { _id: true }
);

const trackingSchema = new mongoose.Schema(
  {
    // Reference to the original record
    recordType: {
      type: String,
      required: true,
      enum: [
        "Adolescents",
        "Elderly",
        "HealthCamps",
        "Tuberculosis",
        "HIV",
        "Leprosy",
        "OtherDiseases",
        "Addiction",
        "PWD",
        "MotherChild",
        "BoardPreparation",
        "CompetitiveExams",
        "Dropouts",
        "Schools",
        "SCStudents",
        "StudyCenters",
        "CBUCBODetails",
        "Entitlements",
        "LegalAid",
        "Workshops",
      ],
    },
    recordId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    recordName: {
      type: String,
      required: true, // Store name/identifier for easy reference
    },

    // Follow-up details
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Urgent"],
      default: "Medium",
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed", "Cancelled", "On Hold"],
      default: "Pending",
    },

    // Scheduling
    followUpDate: {
      type: Date,
      required: true,
    },
    nextFollowUpDate: {
      type: Date,
    },
    reminderDate: {
      type: Date,
    },

    // Assignment
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // Location/Module info
    module: {
      type: String,
      required: true,
      enum: ["Health", "Education", "Social Justice"],
    },
    wardNo: String,
    habitation: String,
    projectResponsible: String,

    // Monthly updates
    monthlyUpdates: [monthlyUpdateSchema],

    // Completion details
    completedDate: Date,
    completionNotes: String,

    // Tags and categories
    tags: [String],
    category: String,

    // Metadata
    isOverdue: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
trackingSchema.index({ recordType: 1, recordId: 1 });
trackingSchema.index({ status: 1 });
trackingSchema.index({ followUpDate: 1 });
trackingSchema.index({ assignedTo: 1 });
trackingSchema.index({ module: 1 });
trackingSchema.index({ createdBy: 1 });
trackingSchema.index({ isOverdue: 1, isActive: 1 });

// Virtual to check if follow-up is overdue
trackingSchema.virtual("overdueStatus").get(function () {
  if (this.status === "Completed" || this.status === "Cancelled") {
    return false;
  }
  return new Date() > this.followUpDate;
});

// Update isOverdue field before saving
trackingSchema.pre("save", function (next) {
  if (this.status !== "Completed" && this.status !== "Cancelled") {
    this.isOverdue = new Date() > this.followUpDate;
  } else {
    this.isOverdue = false;
  }
  next();
});

// Method to add monthly update
trackingSchema.methods.addMonthlyUpdate = function (updateData) {
  this.monthlyUpdates.push(updateData);
  if (updateData.status) {
    this.status = updateData.status;
  }
  return this.save();
};

// Method to complete tracking
trackingSchema.methods.complete = function (notes, completedBy) {
  this.status = "Completed";
  this.completedDate = new Date();
  this.completionNotes = notes;
  this.isActive = false;
  this.isOverdue = false;

  // Add final monthly update
  this.monthlyUpdates.push({
    date: new Date(),
    notes: notes || "Follow-up completed",
    status: "Completed",
    updatedBy: completedBy,
  });

  return this.save();
};

// Static method to get overdue follow-ups
trackingSchema.statics.getOverdue = function () {
  return this.find({
    isActive: true,
    status: { $nin: ["Completed", "Cancelled"] },
    followUpDate: { $lt: new Date() },
  });
};

// Static method to get upcoming follow-ups (next 7 days)
trackingSchema.statics.getUpcoming = function (days = 7) {
  const now = new Date();
  const futureDate = new Date();
  futureDate.setDate(now.getDate() + days);

  return this.find({
    isActive: true,
    status: { $nin: ["Completed", "Cancelled"] },
    followUpDate: { $gte: now, $lte: futureDate },
  });
};

const Tracking = mongoose.model("Tracking", trackingSchema);

export default Tracking;
