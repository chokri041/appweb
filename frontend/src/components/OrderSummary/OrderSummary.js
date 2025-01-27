import React from 'react';
import styles from './OrderSummary.module.css';

const OrderSummary = ({ order }) => {
  return (
    <div className={styles.orderSummary}>
      <h3>Commande #{order._id}</h3>
      <p>Statut : {order.status}</p>
      <p>Total : {order.total} €</p>
      <ul>
        {order.items.map((item) => (
          <li key={item.product._id}>
            {item.product.name} - {item.quantity} x {item.product.price} €
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderSummary;