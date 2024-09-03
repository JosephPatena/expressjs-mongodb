const mongoose = require("mongoose");
mongoose.set('strictQuery', false);

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add user name"],
    },
    email: {
      type: String,
      required: [true, "Please add the user email address"],
      unique: [true, "Email address already taken"],
    },
    email_verified_at: {
      type: Date,
      default: null
    },
    password: {
      type: String,
      required: [true, "Please add the user password"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
