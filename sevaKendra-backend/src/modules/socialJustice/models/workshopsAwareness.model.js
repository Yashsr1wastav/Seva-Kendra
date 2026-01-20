import mongoose from "mongoose";

const workshopsAwarenessSchema = new mongoose.Schema(
  {
    // Group Details
    groupId: {
      type: String,
      required: [true, "Group ID is required"],
      trim: true,
      index: true,
    },
    groupName: {
      type: String,
      required: [true, "Group name is required"],
      trim: true,
      index: true,
    },
    groupType: {
      type: String,
      required: [true, "Group type is required"],
      enum: [
        "CBUCBO",
        "SHG",
        "Youth Group",
        "Women Group",
        "Community Group",
        "Farmer Group",
        "Student Group",
        "Other",
      ],
    },
    wardNo: {
      type: String,
      required: [true, "Ward number is required"],
      trim: true,
      index: true,
    },
    habitation: {
      type: String,
      required: [true, "Habitation is required"],
      trim: true,
      index: true,
    },
    projectResponsible: {
      type: String,
      required: [true, "Project responsible is required"],
      trim: true,
    },

    // Training Details
    topic: {
      type: String,
      required: [true, "Training topic is required"],
      trim: true,
      index: true,
    },
    dateOfTraining: {
      type: Date,
      required: [true, "Date of training is required"],
      index: true,
    },
    resourcePerson: {
      type: String,
      required: [true, "Resource person is required"],
      trim: true,
    },
    profileOfResourcePerson: {
      type: String,
      required: [true, "Profile of resource person is required"],
      trim: true,
    },
    agenda: {
      type: String,
      required: [true, "Training agenda is required"],
      trim: true,
    },
    totalParticipants: {
      type: Number,
      required: [true, "Total participants is required"],
      min: [1, "Total participants must be at least 1"],
    },
    outcome: {
      type: String,
      required: [true, "Training outcome is required"],
      trim: true,
    },

    // Audit fields
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
    collection: "workshopsAwareness",
  }
);

// Additional indexes for better query performance
workshopsAwarenessSchema.index({ groupType: 1 });
workshopsAwarenessSchema.index({ createdAt: -1 });

// Compound indexes
workshopsAwarenessSchema.index({ wardNo: 1, habitation: 1 });
workshopsAwarenessSchema.index({ dateOfTraining: -1, groupType: 1 });

// Static method to get statistics
workshopsAwarenessSchema.statics.getStats = async function () {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalWorkshops: { $sum: 1 },
        totalParticipants: { $sum: "$totalParticipants" },
        avgParticipants: { $avg: "$totalParticipants" },
      },
    },
  ]);

  const groupTypeStats = await this.aggregate([
    {
      $group: {
        _id: "$groupType",
        count: { $sum: 1 },
        totalParticipants: { $sum: "$totalParticipants" },
      },
    },
  ]);

  return {
    overview: stats[0] || {
      totalWorkshops: 0,
      totalParticipants: 0,
      avgParticipants: 0,
    },
    groupTypeStats,
  };
};

const WorkshopsAwareness = mongoose.model(
  "WorkshopsAwareness",
  workshopsAwarenessSchema
);

export default WorkshopsAwareness;
