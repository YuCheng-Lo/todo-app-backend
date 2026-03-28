const mongoose = require("mongoose");
const { Schema } = mongoose;

const todoSchema = new Schema(
  {
    title: { type: String, required: [true, "任務標題必須填寫..."] },
    content: { type: String, required: [true, "任務內容必須填寫..."] },
    status: {
      type: String,
      default: "進行中",
      enum: ["進行中", "已完成"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Todo = mongoose.model("Todo", todoSchema);

module.exports = Todo;
