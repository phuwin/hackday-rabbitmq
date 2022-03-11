export const sendOrder = (open, order) => {
  open.then((conn) => conn.createChannel().then((ch) => {
    const q = 'sendOrder';
    console.log(order);
    const ok = ch.assertQueue(q, { durable: false });

    return ok.then(() => {
      ch.sendToQueue(q, Buffer.from(JSON.stringify(order)));
      console.log(" [SERVER A] Sent '%s'", order);
      return ch.close();
    });
  })).catch(console.warn);
};

export const onReceiveDoneOrder = (open, callback) => {
  const q = 'orderDone';
  open.then((conn) => {
    process.once('SIGINT', () => { conn.close(); });
    return conn.createChannel().then((channel) => {
      const ok = channel.assertQueue(q, { durable: false });

      ok.then(() => channel.consume(q, (msg) => {
        console.log(" [SERVER A] Received '%s'", msg.content.toString());
        callback(msg);
      }, { noAck: true }));
      return ok.then(() => {
        console.log(' [SERVER A] Waiting for orders done');
      });
    });
  }).catch(console.warn);
};

