export const getOrders = async (db) => {
  await db.read();
  return db.data.orders;
};

export const getOrder = async (db, id) => {
  await db.read();
  return db.data.orders.find(o => Number(o.id) === Number(id));
};

export const updateOrder = async (db, order) => {
  await db.read();
  db.data.orders = db.data.orders.map(o => o.id === order.id ? order : o);
  await db.write();
}

export const addOrder = async (db, order) => {
  await db.read();
  db.data.orders.push(order);
  await db.write();
}
