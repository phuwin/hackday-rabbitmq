import styled from 'styled-components';
import { useRef, useState, useEffect } from 'react';
import axios from 'axios';

const SANDWICH_MAP = [
  { id: 1, title: 'Club' },
  { id: 2, title: 'Dill' },
  { id: 3, title: 'Jalapeno' },
  { id: 4, title: 'Pepper' },
  { id: 5, title: 'Spicy' },
];

const Wrapper = styled.div`
  padding: 1rem;
`;

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const Button = styled.button`
  border: none;
  padding: 10px;
  font: inherit;
  cursor: pointer;
  outline: inherit;
  width: 200px ;
`;

const Li = styled.li`
  list-style: none;
  cursor: pointer;
`;

const Ul = styled.ul`
  list-style: none;
  padding: 0;
`;

const getUrl = (path) => `http://localhost:8080/v1/${path}`;

const getOrders = async () => {
  const response = await axios.get(getUrl('order'));
  return response.data;
};

const Span = styled.span`
  cursor: pointer;
  margin-left: 10px;
`;

function App() {
  const formRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const loadOrders = async () => {
    setLoading(true);
    setOrders(await getOrders());
    setLoading(false);
  };
  useEffect(() => {
    loadOrders();
  }, []);
  const submit = async (e) => {
    e.preventDefault();
    if (formRef && formRef.current) {
      const form = formRef.current;
      const data = new FormData(form);
      const sandwichId = Number(data.get('sandwichId'));
      const order = {
        sandwichId,
        id: Math.floor(Math.random() * 1000000),
        status: 'ordered',
      };
      setLoading(true);
      await axios.post(getUrl('order'), order);
      setOrders([...orders, order]);
      setLoading(false);
    }
  };
  const getDetail = async (orderId) => {
    setLoading(true);
    const { data } = await axios.get(getUrl(`order/${orderId}`));
    setLoading(false);
    setSelectedOrder(data);
  };
  return (
    <Container>
      <Wrapper>
        <h1>Order a sandwich</h1>
        <form onSubmit={submit} ref={formRef}>
          <label htmlFor="sandwichId">
            Sandwich:
            <select id="sandwichId" name="sandwichId">
              {SANDWICH_MAP.map((sandwich) => (
                <option key={sandwich.id} value={sandwich.id}>
                  {sandwich.title}
                </option>
              ))}
            </select>
          </label>
          <br />
          <br />
          <Button disabled={loading} type="submit">{loading ? 'Loading...' : 'Order'}</Button>
        </form>
        <h1>
          Order list (click to see details)
          <Span tabIndex={0} role="button" onKeyPress={loadOrders} onClick={loadOrders}>🔄</Span>
        </h1>
        <Ul>
          {orders.map((order) => (
            <Li onClick={() => { getDetail(order.id); }} key={order.id}>
              {`${SANDWICH_MAP.find(((sw) => sw.id === order.sandwichId)).title} - ${order.status}`}
            </Li>
          ))}
        </Ul>
        {selectedOrder && <h1>Detail</h1>}
        {selectedOrder && (
          <div>
            <div>{`Order id: ${selectedOrder.id}`}</div>
            <div>{`Sandwich id: ${selectedOrder.sandwichId}`}</div>
            <div>{`Status id: ${selectedOrder.status}`}</div>
          </div>
        )}
      </Wrapper>
    </Container>

  );
}

export default App;
