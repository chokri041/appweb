const express = require('express');
const router = express.Router();
const { validateUser, validateLogin, registerUser, loginUser, getUserProfile } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Route pour l'inscription
router.post('/register', validateUser, registerUser);

// Route pour la connexion
router.post('/login', validateLogin, loginUser);

// Route pour récupérer le profil utilisateur (protégée par un middleware d'authentification)
router.get('/profile', authMiddleware, getUserProfile);

module.exports = router;

