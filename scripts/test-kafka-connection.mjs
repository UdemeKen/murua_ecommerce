import { config } from "dotenv";
import { resolve } from "path";
import { Kafka } from "kafkajs";

config({ path: resolve(process.cwd(), ".env") });

const normalizeEnv = (value) =>
  (value ?? "").trim().replace(/^["']|["']$/g, "");

const username = normalizeEnv(process.env.KAFKA_API_KEY);
const password = normalizeEnv(process.env.KAFKA_API_SECRET);
const broker =
  normalizeEnv(process.env.KAFKA_BROKER) ||
  "pkc-619z3.us-east1.gcp.confluent.cloud:9092";

console.log("Kafka env loaded:", {
  hasKey: Boolean(username),
  hasSecret: Boolean(password),
  keyLength: username.length,
  broker,
});

const kafka = new Kafka({
  clientId: "murua-kafka-test",
  brokers: [broker],
  ssl: true,
  sasl: { mechanism: "plain", username, password },
});

const admin = kafka.admin();

try {
  await admin.connect();
  console.log("SUCCESS: Kafka authentication works with current .env credentials.");
  await admin.disconnect();
} catch (error) {
  console.error("FAIL:", error.message);
  process.exit(1);
}
