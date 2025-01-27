import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import OrderSummary from '../../components/OrderSummary/OrderSummary';
import styles from './OrderPage.module.css';

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.order.getOrders();
        setOrders(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div>Chargement...</div>;

  return (
    <div className={styles.orderPage}>
      <h1>Vos commandes</h1>
      {orders.map((order) => (
        <OrderSummary key={order._id} order={order} />
      ))}
    </div>
  );
};

export default OrderPage;