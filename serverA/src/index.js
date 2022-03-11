const express = require('express');

const amqp = require('amqplib');

const RABBIT = process.env.RABBIT || 'localhost';
const { sendOrder, onReceiveDoneOrder } = require('./orderQueue');

const open = amqp.connect(`amqp://${RABBIT}`);
// Constants
const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0';

// App
const app = express();
app.get('/', (req, res) => {
  res.send('Hello World');
});

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// to read post data
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

onReceiveDoneOrder(open, (order) => {
  console.log(order.content.toString());
});

app.post('/v1/order', (req, res) => {
  const order = req.body;
  sendOrder(open, order);
  res.send('OK');
});
