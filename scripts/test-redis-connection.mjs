import { config } from "dotenv";
import { existsSync } from "fs";
import { resolve } from "path";
import Redis from "ioredis";

const envCandidates = [
  resolve(process.cwd(), ".env"),
  resolve(process.cwd(), "../.env"),
  resolve(process.cwd(), "../../.env"),
];

for (const envPath of envCandidates) {
  if (existsSync(envPath)) {
    config({ path: envPath });
    break;
  }
}

const normalizeEnv = (value) =>
  (value ?? "").trim().replace(/^["']|["']$/g, "");

const redisUrl = normalizeEnv(
  process.env.REDIS_DATABASE_URI ||
    process.env.REDIS_DATABASE_URI_LOCAL ||
    process.env.UPSTASH_REDIS_URL
);

console.log("Redis URL configured:", Boolean(redisUrl), redisUrl ? "(rediss host set)" : "(missing)");

if (!redisUrl) {
  console.error("Set REDIS_DATABASE_URI or REDIS_DATABASE_URI_LOCAL in .env");
  process.exit(1);
}

const redis = new Redis(redisUrl, {
  maxRetriesPerRequest: 1,
  connectTimeout: 10000,
  lazyConnect: true,
});

redis.on("error", (err) => {
  console.error("Redis error event:", err.message);
});

try {
  await redis.connect();
  const pong = await redis.ping();
  console.log("SUCCESS: Redis PING ->", pong);
  await redis.quit();
} catch (error) {
  console.error("FAIL:", error.message);
  process.exit(1);
}
