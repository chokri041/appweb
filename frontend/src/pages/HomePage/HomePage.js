import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import ProductCard from '../../components/ProductCard/ProductCard';
import styles from './HomePage.module.css';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.product.getProducts();
        setProducts(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <div>Chargement...</div>;

  return (
    <div className={styles.homePage}>
      <h1>Nos produits</h1>
      <div className={styles.productGrid}>
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;