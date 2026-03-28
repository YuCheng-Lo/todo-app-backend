const Todo = require("../models/todo");

exports.getAllTodos = async (req, res) => {
  try {
    const { status } = req.query;

    const filter = { author: req.userId };

    if (status) {
      filter.status = status;
    }

    const todos = await Todo.find(filter).exec();

    res.json(todos);
  } catch (e) {
    console.error("取得任務時發生錯誤：", e);
    res.status(500).json({ message: "伺服器發生錯誤", err: e.message });
  }
};
exports.createTodo = async (req, res) => {
  //待操作
  try {
    const { title, content } = req.body;
    const newTodo = new Todo({ title, content, author: req.userId });
    const result = await newTodo.save();
    console.log("saved: ", result);
    res
      .status(201)
      .json({ type: "success", message: "任務新增成功", todo: result });
  } catch (err) {
    res
      .status(400)
      .json({ type: "failed", message: "新增任務失敗", error: err.message });
  }
};
exports.editTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const result = await Todo.findOneAndUpdate(
      { _id: id, author: req.userId },
      { title, content },
      { new: true },
    );

    if (!result) {
      return res
        .status(404)
        .json({ type: "failed", message: "任務不存在或無權限修改" });
    }

    return res.status(200).json({
      type: "success",
      message: `任務已修改完成`,
      todo: result,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      type: "failed",
      message: "任務修改時發生錯誤",
      error: err.message,
    });
  }
};
exports.updateTodoStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    console.log("狀態是: " + status);

    // 使用 findOneAndUpdate 同時檢查 _id 和 author
    const result = await Todo.findOneAndUpdate(
      { _id: id, author: req.userId }, // 條件：任務 ID + 作者必須是當前登入者
      { status },
      { new: true },
    );

    if (!result) {
      return res
        .status(404)
        .json({ type: "failed", message: "任務不存在或無權限修改" });
    }

    return res.status(200).json({
      type: "success",
      message: `任務已修改為${status}`,
      todo: result,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      type: "failed",
      message: "任務修改時發生錯誤",
      error: err.message,
    });
  }
};
exports.deleteTodo = async (req, res) => {
  try {
    const result = await Todo.deleteOne({
      _id: req.params.id,
      author: req.userId,
    }).exec();
    if (result.deletedCount === 0)
      return res
        .status(404)
        .json({ type: "failed", message: "找不到該任務 刪除失敗" });

    return res.status(200).json({ type: "success", message: "任務成功刪除" });
  } catch (err) {
    return res.status(500).json({
      type: "failed",
      message: "任務刪除時發生錯誤",
      error: err.message,
    });
  }
};
