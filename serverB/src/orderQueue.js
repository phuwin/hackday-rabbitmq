const sendDoneOrder = (open, order) => {
  open.then((conn) => conn.createChannel().then((ch) => {
    const q = 'orderDone';

    const ok = ch.assertQueue(q, { durable: false });

    return ok.then(() => {
      ch.sendToQueue(q, Buffer.from(JSON.stringify(order)));
      console.log(" [SERVER B] Sent '%s'", order);
      return ch.close();
    });
  })).catch(console.warn);
};

const onReceiveOrder = (open, callback) => {
  const q = 'sendOrder';
  open.then((conn) => {
    process.once('SIGINT', () => { conn.close(); });
    return conn.createChannel().then((channel) => {
      const ok = channel.assertQueue(q, { durable: false });

      ok.then(() => channel.consume(q, (msg) => {
        console.log(" [SERVER B] Received '%s'", msg.content.toString());
        callback(msg);
      }, { noAck: true }));
      return ok.then(() => {
        console.log(' [SERVER B] Waiting for orders');
      });
    });
  }).catch(console.warn);
};

module.exports = {
  sendDoneOrder,
  onReceiveOrder,
};
