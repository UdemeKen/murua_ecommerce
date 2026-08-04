import { config } from "dotenv";
import { existsSync } from "fs";
import { resolve } from "path";
import Redis from "ioredis";

for (const envPath of [
    resolve(process.cwd(), ".env"),
    resolve(process.cwd(), "../.env"),
    resolve(process.cwd(), "../../.env"),
]) {
    if (existsSync(envPath)) {
        config({ path: envPath, override: false });
        break;
    }
}

const normalizeEnv = (value?: string) =>
    value?.trim().replace(/^["']|["']$/g, "") ?? "";

const redisUrl = normalizeEnv(
    process.env.REDIS_DATABASE_URI ||
        process.env.REDIS_DATABASE_URI_LOCAL ||
        process.env.UPSTASH_REDIS_URL
);

if (!redisUrl) {
    console.warn(
        "Redis URL not configured. Set REDIS_DATABASE_URI or REDIS_DATABASE_URI_LOCAL in .env"
    );
}

const redis = redisUrl
    ? new Redis(redisUrl, {
          maxRetriesPerRequest: 3,
          connectTimeout: 10_000,
          retryStrategy(times) {
              if (times > 3) return null;
              return Math.min(times * 200, 1000);
          },
      })
    : (null as unknown as Redis);

if (redis) {
    redis.on("error", (err) => {
        console.error("Redis connection error:", err.message);
    });
}

export default redis;
