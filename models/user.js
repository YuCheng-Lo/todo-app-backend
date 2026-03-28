const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "姓名為必填"],
      maxlength: [25, "最多不得超過25個字元"],
    },
    age: {
      type: Number,
      required: [true, "年齡為必填"],
      min: [1, "年齡不得小於1"],
      max: [125, "年齡不得大於125"],
    },
    email: {
      type: String,
      required: [true, "電子郵件為必填"],
    },
    password: {
      type: String,
      required: [true, "密碼為必填"],
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);

module.exports = User;
