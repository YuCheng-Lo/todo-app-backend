require("dotenv").config();

const isProd = process.env.NODE_ENV === "production";

console.log(isProd ? "Production mode" : "Development mode");

const chalk = require("chalk");
console.log(chalk.green.bold(`目前環境是：${process.env.NODE_ENV}`));

const express = require("express");
const app = express();

const userRoutes = require("./routes/users");
const todoRoutes = require("./routes/todos");
const authRoutes = require("./routes/auth");

const mongoose = require("mongoose");
const cors = require("cors");

const cookieParser = require("cookie-parser");

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("成功連結MongoDB Atlas...");
  })
  .catch((e) => {
    console.log("連線失敗：", e);
  });

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use("/users", userRoutes);

app.use("/todos", todoRoutes);

app.use("/auth", authRoutes);

app.listen(process.env.PORT || 3001, () => {
  console.log(`伺服器正在聆聽port ${process.env.PORT || 3001}...`);
});
