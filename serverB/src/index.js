const RABBIT = process.env.RABBIT || 'localhost';

const open = require('amqplib').connect(`amqp://${RABBIT}`);

const {
  sendDoneOrder,
  onReceiveOrder,
} = require('./orderQueue');

onReceiveOrder(open, (msg) => {
  const order = JSON.parse(msg.content.toString());
  console.log('[SERVER B] Cooking order');
  setTimeout(() => {
    sendDoneOrder(open, { ...order, status: 'ready' });
  }, 5000);
});
