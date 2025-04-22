// producer.js
const { Kafka } = require('kafkajs');
const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092'],
});

const producer = kafka.producer();

const run = async (statement) => {
  console.log("event is triggered "+statement);
  await producer.connect();
  await producer.send({
    topic: 'test-topic',
    messages: [
      { value: statement },
    ],
  });

  console.log('Message sent');
  await producer.disconnect();
};

// run().catch(console.error);


// Middleware to parse URL-encoded bodies (form data)
app.use(express.urlencoded({ extended: true }));

// Serve static HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle form submission (POST request)
app.post('/submit', (req, res) => {
    const { name, email } = req.body; // Extract name and email from the form data
    
    run(name+"  "+email).catch(console.error);
    // Send a response with the submitted data
    res.send(`
        <h1>Form Submitted Successfully!</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
    `);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
