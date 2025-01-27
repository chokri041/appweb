import React from 'react';
import styles from './CartItem.module.css';

const CartItem = ({ item }) => {
  return (
    <div className={styles.cartItem}>
      <img src={item.product.image} alt={item.product.name} className={styles.cartItemImage} />
      <h3>{item.product.name}</h3>
      <p>Quantité : {item.quantity}</p>
      <p>Prix unitaire : {item.product.price} €</p>
      <p>Total : {item.quantity * item.product.price} €</p>
      <button>Supprimer</button>
    </div>
  );
};

export default CartItem;