const redis = require("redis");

const client = redis.createClient({
  host: process.env.REDIS_HOSTNAME,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
});

client.on("connect", () => {
  // eslint-disable-next-line no-console
  console.log("You're now connected db redis ...");
});

module.exports = client;
