const mongoose = require("mongoose");
mongoose.set('strictQuery', false);

const taskSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add task name"],
    },
    description: {
      type: String,
      default: null
    },
    status: {
        type: String,
        required: [true, "Please add task status"],
        enum: ['pending', 'in_progress', 'testing', 'completed'],
        default: 'pending'
    },
    priority: {
        type: String,
        required: [true, "Please add task priority"],
        enum: ['low', 'medium', 'high'],
        default: 'low'
    },
    due_date: {
      type: Date,
      default: null
    },
    start_date: {
        type: Date,
        default: null
    },
    complete_date: {
        type: Date,
        default: null
    },
    assigned_user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    tester_user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    reviewer_user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    updated_by: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    project_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Project",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Task", taskSchema);
