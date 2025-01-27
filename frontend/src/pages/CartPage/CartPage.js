import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import CartItem from '../../components/CartItem/CartItem';
import styles from './CartPage.module.css';

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await api.cart.getCart();
        setCart(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  if (loading) return <div>Chargement...</div>;

  return (
    <div className={styles.cartPage}>
      <h1>Votre panier</h1>
      {cart.items.map((item) => (
        <CartItem key={item.product._id} item={item} />
      ))}
      <p>Total : {cart.total} €</p>
      <button>Passer la commande</button>
    </div>
  );
};

export default CartPage;