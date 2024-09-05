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
    project_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Project",
    },
    assigned_user_id: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        ref: "User",
    },
    tester_user_id: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        ref: "User",
    },
    reviewer_user_id: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        ref: "User",
    },
    start_date: {
        type: Date,
        default: null
    },
    complete_date: {
        type: Date,
        default: null
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        ref: "User",
    },
    updated_by: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Task", taskSchema);
