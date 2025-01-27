// src/components/ProductCard/ProductCard.js
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import styles from './ProductCard.module.css'; // Import des styles modulaires

const ProductCard = ({ product }) => {
  return (
    <div className={styles.productCard}>
      <div className={styles.productImage}>
        <img src={product.image || 'placeholder.jpg'} alt={product.name || 'Produit'} />
      </div>
      {product.threeDModel ? (
        <div className={styles.product3DContainer}>
          <Canvas>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <OrbitControls enableZoom={true} enablePan={true} />
            <Model3D url={product.threeDModel} />
          </Canvas>
        </div>
      ) : (
        <div className={styles.product3DContainer}>
          <p>Pas de modèle 3D disponible.</p>
        </div>
      )}
      <div className={styles.productDetails}>
        <h3>{product.name || 'Nom du produit'}</h3>
        <p>{product.description || 'Description indisponible.'}</p>
        <p className={styles.price}>
          Prix : €{product.price !== undefined ? product.price : 'Non disponible'}
        </p>
        <button className={styles.btn}>Voir plus</button>
      </div>
    </div>
  );
};

const Model3D = ({ url }) => {
  const gltf = useLoader(GLTFLoader, url);
  return <primitive object={gltf.scene} scale={[1, 1, 1]} />;
};

export default ProductCard;