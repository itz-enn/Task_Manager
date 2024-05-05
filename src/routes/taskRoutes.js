const express = require("express");
const taskRoutes = express.Router();
const taskController = require("../controllers/taskController");

taskRoutes.get("/read", taskController.getAllTask);

taskRoutes.post("/add", taskController.addNewTask);

taskRoutes.put("/update/:id", taskController.updateTask);

taskRoutes.delete("/delete/:id", taskController.deleteTask);

module.exports = taskRoutes
