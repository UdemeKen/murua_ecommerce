import { isKafkaConfigured, kafka } from "@packages/utils/kafka";
import { updateUserAnalytics } from "./services/analytics.service";



const consumer = kafka.consumer({ groupId: "user-events-group"});

const eventQueue: any[] = [];

const processQueue = async () => {
  if(eventQueue.length === 0) return;

  const events = [...eventQueue];
  eventQueue.length = 0;

  for(const event of events) {
    if(event.action === "shop-visit") {
      // update shop analytics
    }

    const validActions = [
      "add_to_wishlist",
      "add_to_cart",
      "product_view",
      "remove_from_wishlist",
      "remove_from_cart",
    ];

    if(!event.action || !validActions.includes(event.action)) {
      continue;
    }
    try {
      await updateUserAnalytics(event);
    } catch (error) {
      console.log("Error processing event:", error);
    }
  }
};

setInterval(processQueue, 3000);

// Kafka consumer for user events
export const consumeKafkaMessages = async () => {
  if (!isKafkaConfigured) {
    console.error(
      "Kafka consumer not started: KAFKA_API_KEY / KAFKA_API_SECRET missing in .env"
    );
    return;
  }

  try {
    await consumer.connect();
    await consumer.subscribe({ topic: "users-events", fromBeginning: false });

    await consumer.run({
      eachMessage: async ({ message }) => {
        if (!message.value) return;
        const event = JSON.parse(message.value.toString());
        eventQueue.push(event);
      },
    });

    console.log("Kafka consumer connected and listening on users-events");
  } catch (error: any) {
    console.error(
      "Kafka consumer failed to connect. Use a cluster API key from Confluent (Cluster → API keys), not a global Cloud API key. Ensure KAFKA_BROKER matches your cluster bootstrap server.",
      error?.message ?? error
    );
  }
};

consumeKafkaMessages().catch(console.error);