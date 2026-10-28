import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [100, "Title must be at most 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description must be at most 500 characters"],
    },
    status: {
      type: String,
      enum: {
        values: ["todo", "in-progress", "done"],
        message: "{VALUE} is not a valid status",
      },
      default: "todo",
    },
    priority: {
      type: String,
      enum: {
        values: ["low", "medium", "high"],
        message: "{VALUE} is not a valid priority",
      },
      default: "medium",
    },
    dueDate: {
      type: Date,
      validate: {
        validator: (value) => value > new Date(),
        message: "Due date must be in the future",
      },
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner is required"],
    },
  },
  { timestamps: true },
);

taskSchema.index({ status: 1, dueDate: 1 });
taskSchema.index({ project: 1 });
taskSchema.index({ owner: 1, status: 1, dueDate: 1 });

export const Task = mongoose.model("Task", taskSchema);
