import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import api from '../../services/api';
import styles from './RegisterPage.module.css';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await api.auth.register({ name, email, password });
      localStorage.setItem('token', response.token);
      history.push('/');
    } catch (err) {
      setError('Erreur lors de l\'inscription');
    }
  };

  return (
    <div className={styles.registerPage}>
      <h1>Inscription</h1>
      <form onSubmit={handleRegister} className={styles.registerForm}>
        <input
          type="text"
          placeholder="Nom"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">S'inscrire</button>
        {error && <p className={styles.error}>{error}</p>}
      </form>
    </div>
  );
};

export default RegisterPage;