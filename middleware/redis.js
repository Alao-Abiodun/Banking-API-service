const redis = require("redis");
const { promisifyAll } = require("bluebird");

promisifyAll(redis);

const client = redis.createClient({
  host: process.env.REDIS_URL,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
});

client.on("connect", () => {
  console.log("COnnected");
});

client.on("error", (err) => {
  console.error("Redis Failed on Connect");
});

module.exports = client;
