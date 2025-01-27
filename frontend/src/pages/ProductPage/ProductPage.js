import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import styles from './ProductPage.module.css';

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.product.getProductById(id);
        setProduct(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div>Chargement...</div>;

  return (
    <div className={styles.productPage}>
      <h1>{product.name}</h1>
      <img src={product.image} alt={product.name} className={styles.productImage} />
      <p>{product.description}</p>
      <p>Prix : {product.price} €</p>
      <button>Ajouter au panier</button>
    </div>
  );
};

export default ProductPage;
