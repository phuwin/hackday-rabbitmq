import express from 'express';
const { json, urlencoded } = express;

import { connect } from 'amqplib';

import { join, dirname } from 'path';
import { Low, JSONFile } from 'lowdb';
import { fileURLToPath } from 'url';
import {addOrder, getOrder, getOrders, updateOrder} from './src/orders.js';

import { sendOrder, onReceiveDoneOrder } from './src/orderQueue.js';

const rootDir = dirname(fileURLToPath(import.meta.url));
const file = join(rootDir, 'db.json');
const adapter = new JSONFile(file);
const db = new Low(adapter);

const RABBIT = process.env.RABBIT || 'localhost';

const open = connect(`amqp://${RABBIT}`);

// Constants
const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0';

// App
const app = express();
app.get('/', (req, res) => {
  res.send('Hello World');
  db.data = {orders:[]};
  db.write();
});

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// to read post data
app.use(json()); // for parsing application/json
app.use(urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

// update receive order done
onReceiveDoneOrder(open, (order) => {
  console.log(`[SERVER A] Received order done ${order.content.toString()}}`);
  const updatedOrder = JSON.parse(order.content.toString());
  updateOrder(db, updatedOrder);
});

// add an order
app.post('/v1/order', async (req, res) => {
  const order = req.body;
  await addOrder(db, order);
  sendOrder(open, order);  
  res.send('OK');
});

// get all orders
app.get('/v1/order', async (req,res) => {
  const orders = await getOrders(db);
  res.send(orders);
})

app.get('/v1/order/:orderId', async (req,res) => {
  const { orderId } = req.params;
  const order = await getOrder(db, orderId);
  res.send(order);
});
