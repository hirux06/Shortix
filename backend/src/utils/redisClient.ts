import { createClient } from "redis"

const redisClient = createClient({
  url: process.env.REDIS_URL
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

await redisClient.connect(); 

console.log("Redis client connected")

export default redisClient;