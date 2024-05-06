const express = require("express");
const dotenv = require("dotenv").config()
const cors = require("cors");
const PORT = process.env.PORT || 3000
const taskRoutes = require("./src/routes/taskRoutes")

const app = express();

app.use(express.json());
app.use(cors())
app.use("/tasks", taskRoutes)

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
