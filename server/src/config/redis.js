const Redis = require("ioredis");

const redis = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",  // .env에 있으면 그 값 사용
  port: process.env.REDIS_PORT || 6379,
  // password: process.env.REDIS_PASS, // 필요할 때만
});

redis.on("connect", () => console.log("✅ Redis Connected"));
redis.on("error", (err) => console.error("❌ Redis Error", err));

module.exports = redis;
