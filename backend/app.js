require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');

// Connexion à MongoDB
const { connectDB } = require('./config/db');
connectDB(); // Appel de la fonction pour connecter MongoDB

// Importation des routes
const userRoutes = require('./routes/user');
const productRoutes = require('./routes/product');
const orderRoutes = require('./routes/order');
const cartRoutes = require('./routes/cart');

// Importation du middleware d'authentification
const authMiddleware = require('./middleware/authMiddleware');

// Initialisation de l'application Express
const app = express();
const PORT = process.env.PORT || 5000;

// Configuration de CORS
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions)); // Autorise les requêtes cross-origin

// Middleware
app.use(bodyParser.json()); // Parse les requêtes JSON

// Middleware pour gérer les erreurs asynchrones
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Routes
app.use('/api/users', userRoutes); // Routes pour les utilisateurs
app.use('/api/products', productRoutes); // Routes pour les produits
app.use('/api/cart', cartRoutes); // Routes pour le panier

// Appliquer le middleware d'authentification sur les routes des commandes
app.use('/api/orders', authMiddleware, orderRoutes); // Routes pour les commandes (protégées)

// Exemple d'utilisation de asyncHandler
app.get('/api/async-route', asyncHandler(async (req, res) => {
  throw new Error('Erreur asynchrone');
}));

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ msg: 'Route non trouvée' });
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ msg: 'Erreur interne du serveur' });
});

// Démarrer le serveur
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
