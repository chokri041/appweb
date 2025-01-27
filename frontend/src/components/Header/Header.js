import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>Mon e-Commerce</div>
      <nav className={styles.nav}>
        <Link to="/" className={styles.navLink}>Accueil</Link>
        <Link to="/cart" className={styles.navLink}>Panier</Link>
        <Link to="/login" className={styles.navLink}>Connexion</Link>
      </nav>
    </header>
  );
};

export default Header;