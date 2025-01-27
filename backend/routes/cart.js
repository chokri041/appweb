const express = require('express');
const router = express.Router();
const CartController = require('../controllers/cartController');
const authMiddleware = require('../middleware/authMiddleware');

// Récupérer le panier de l'utilisateur
router.get('/', authMiddleware, CartController.getCart);

// Ajouter un produit au panier
router.post('/', authMiddleware, CartController.addToCart);

// Supprimer un produit du panier
router.delete('/:productId', authMiddleware, CartController.removeFromCart);

module.exports = router;
