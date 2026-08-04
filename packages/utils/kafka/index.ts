import { Kafka } from "kafkajs";

const normalizeEnv = (value?: string) =>
    value?.trim().replace(/^["']|["']$/g, "") ?? "";

const kafkaApiKey = normalizeEnv(process.env.KAFKA_API_KEY);
const kafkaApiSecret = normalizeEnv(process.env.KAFKA_API_SECRET);
const kafkaBroker =
    normalizeEnv(process.env.KAFKA_BROKER) ||
    "pkc-619z3.us-east1.gcp.confluent.cloud:9092";

if (!kafkaApiKey || !kafkaApiSecret) {
    console.warn(
        "Kafka credentials missing. Set KAFKA_API_KEY and KAFKA_API_SECRET in .env (cluster API key, not Confluent Cloud global key)."
    );
}

export const kafka = new Kafka({
    clientId: "kafka-service",
    brokers: [kafkaBroker],
    ssl: true,
    sasl: {
        mechanism: "plain",
        username: kafkaApiKey,
        password: kafkaApiSecret,
    },
});

export const isKafkaConfigured = Boolean(kafkaApiKey && kafkaApiSecret);
