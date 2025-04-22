const { Kafka } = require('kafkajs');

// Create a new Kafka instance
const kafka = new Kafka({
  clientId: 'my-app', // Client ID for your application
  brokers: ['localhost:9092'], // Kafka brokers (e.g., localhost for local setup)
});

// Create a consumer instance
const consumer = kafka.consumer({ groupId: 'test-group' }); // Consumer group

async function run() {
  // Connect the consumer
  await consumer.connect();

  // Subscribe to a Kafka topic
  await consumer.subscribe({ topic: 'test-topic', fromBeginning: true });

  console.log('Waiting for messages...');

  // Handle incoming messages
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(`Received message: ${message.value.toString()}`);
      // Process the message
      // For example, you can parse JSON if the message is in JSON format
      try {
        // const parsedMessage = JSON.parse(message.value.toString());
        console.log('Parsed Message:', message);
      } catch (e) {
        console.error('Error parsing message:', e);
      }
    },
  });
}

run().catch(console.error);
