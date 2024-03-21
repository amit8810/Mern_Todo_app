import mongoose from "mongoose";
import { Todo } from "../models/todo.model.js";

const createTodo = async (req, res) => {
  try {
    // Check if user is authenticated
    const user = req.user;
    if (!user) {
      return res.status(401).json({
        error:
          "Unauthorized: User not found. Please login first to create a todo.",
      });
    }

    // Validate input data
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({
        error: "Content is required to create a todo.",
      });
    }

    // Create todo
    const todo = new Todo({ content, createdBy: user._id });
    await todo.save();

    return res.status(201).json({
      status: 200,
      todo,
      message: "Todo created successfully.",
    });
  } catch (error) {
    console.error("Error while creating the todo:", error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

const editTodo = async (req, res) => {
  try {
    const { content } = req.body;
    const todoId = req.params.todoId;

    // Validate input data
    if (!content || content.trim() === "") {
      return res
        .status(400)
        .json({ error: "Content is required to edit a todo." });
    }

    // Check if the provided ID is valid
    if (!mongoose.Types.ObjectId.isValid(todoId)) {
      return res.status(400).json({ error: "Invalid Todo ID." });
    }

    // Update the todo
    const updatedTodo = await Todo.findByIdAndUpdate(
      todoId,
      { content, updatedAt: Date.now() },
      { new: true }
    );

    return res.status(200).json({
      status: 200,
      updatedTodo,
      message: "Todo updated successfully.",
    });
  } catch (error) {
    console.error("Error while updating the Todo:", error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

const changeTodoStatus = async (req, res) => {
  try {
    const todoId = req.params.todoId;

    // Validate input data
    if (!mongoose.Types.ObjectId.isValid(todoId)) {
      return res.status(400).json({
        error: "Invalid Todo ID.",
      });
    }

    // Update the todo status
    const updatedTodo = await Todo.findByIdAndUpdate(
      todoId,
      { complete: true, updatedAt: Date.now() },
      { new: true }
    );

    // If no todo found with the provided ID
    if (!updatedTodo) {
      return res.status(404).json({
        error: "Todo not found.",
      });
    }

    return res.status(200).json({
      updatedTodo,
      message: "Todo status changed successfully.",
    });
  } catch (error) {
    console.error("Error while changing the status of the todo:", error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

const deleteTodo = async (req, res) => {
  try {
    const todoId = req.params.todoId;
    if (!mongoose.Types.ObjectId.isValid(todoId)) {
      return res.status(400).json({
        error: "Invalid todo id",
      });
    }

    await Todo.findByIdAndDelete(todoId);

    return res.status(200).json({
      status: 200,
      message: "Todo deleted successfully",
    });
  } catch (error) {
    console.error("Error while deleting the todo ", error);
    return res.status(200).json({
      error: "Internal server error",
    });
  }
};

const getTodos = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Validate input data
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        error: "Invalid User ID.",
      });
    }

    // Fetch todos for the specified user
    const todos = await Todo.find({ createdBy: userId });

    // Check if any todos are found
    if (todos.length === 0) {
      return res.status(404).json({
        error: "No todos found for the specified user.",
      });
    }

    return res.status(200).json({
      todos,
      message: "Todos fetched successfully.",
    });
  } catch (error) {
    console.error("Error while fetching the todos:", error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

export { createTodo, editTodo, changeTodoStatus, deleteTodo, getTodos };
