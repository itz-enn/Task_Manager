const client = require("../services/redis");

exports.getTasksFromRedis = async (req, res, next) => {
  try {
    const cacheKey = process.env.CACHE_KEY;
    const cachedValue = await client.get(cacheKey);
    if (cachedValue) {
      return res.status(200).json({
        success: true,
        data: JSON.parse(cachedValue),
        message: "cached tasks found in redis",
      });
    } else {
      res.locals.cacheKey = cacheKey;
      next();
    }
  } catch (err) {
    console.error(err);
    next();
  }
};