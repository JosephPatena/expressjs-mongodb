const mongoose = require("mongoose");
mongoose.set('strictQuery', false);

const projectSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add project name"],
    },
    description: {
      type: String,
      default: null
    },
    due_date: {
      type: Date,
      default: null
    },
    status: {
        type: String,
        required: [true, "Please add task status"],
        enum: ['pending', 'in_progress', 'completed'],
        default: 'pending'
    },
    image_path: {
      type: String,
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

module.exports = mongoose.model("Project", projectSchema);
