const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const client = require("../services/redis");

exports.getAllTask = async (req, res) => {
  try {
    const isExist = await prisma.task.findMany();
    if (isExist.length === 0) {
      return res.status(400).json({
        status: false,
        data: [],
        message: "No tasks found",
      });
    }

    await client.setEx(res.locals.cacheKey, process.env.EXPIRES_IN, JSON.stringify(isExist));
    return res.status(200).json({
      success: true,
      data: isExist,
      message: "All tasks retrieved successfully from db and stored in redis",
    });
  } catch (err) {
    console.log(err);
  }
};

exports.addNewTask = async (req, res) => {
  try {
    const { content } = req.body;

    if (content && content !== " ") {
      const isExist = await prisma.task.create({
        data: {
          content,
        },
      });

      if (isExist) {
        await client.del(process.env.CACHE_KEY);

        return res.status(200).json({
          success: true,
          data: [isExist],
          message: "Task created successfully and cache refreshed and ",
        });
      }
    }

    return res.status(400).json({
      success: false,
      data: [],
      message: "unable to add new task",
    });

    
  } catch (err) {
    console.log(err);
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (content && content !== " ") {
      const isExist = await prisma.task.update({
        where: { id },
        data: { content },
      });

      if (isExist) {
        await client.del(process.env.CACHE_KEY);

        return res.status(200).json({
          sucess: true,
          data: [isExist],
          message: "Task updated successfully and cache refreshed",
        });
      }
    }
    return res.status(400).json({
      success: false,
      data: [],
      message: "Unable to update task",
    });
  } catch (err) {
    console.log(err);
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const isExist = await prisma.task.findUnique({
      where: { id },
    });

    if (isExist === null) {
      return res.status(400).json({
        status: false,
        data: [],
        message: "Task not found",
      });
    }

    await prisma.task.delete({
      where: { id },
    });
    await client.del(process.env.CACHE_KEY);

    return res.status(200).json({
      status: true,
      data: [isExist],
      message: "Task deleted successfully and cache refreshed",
    });
  } catch (err) {
    console.log(err);
  }
};
