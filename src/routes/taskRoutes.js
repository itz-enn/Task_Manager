const express = require("express");
const taskRoutes = express.Router();
const taskController = require("../controllers/taskController");
const cacheMiddleware = require("../middlewares/cacheMiddleware")

taskRoutes.get("/read", cacheMiddleware.getTasksFromRedis, taskController.getAllTask);

taskRoutes.post("/add", taskController.addNewTask);

taskRoutes.put("/update/:id", taskController.updateTask);

taskRoutes.delete("/delete/:id", taskController.deleteTask);

module.exports = taskRoutes
