const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');
const { body, validationResult } = require('express-validator');

// Récupérer les commandes d'un utilisateur
router.get('/', authMiddleware, orderController.getUserOrders);

// Créer une nouvelle commande
router.post(
  '/',
  authMiddleware,
  [
    body('items').isArray().withMessage('Items doit être un tableau'),
    body('items.*.product').isMongoId().withMessage('ID de produit invalide'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantité invalide'),
    body('items.*.price').isFloat({ min: 0 }).withMessage('Prix invalide'),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  orderController.createOrder
);

// Récupérer les détails d'une commande spécifique
router.get('/:id', authMiddleware, orderController.getOrderDetails);

// Passer une commande
router.post('/checkout', authMiddleware, [
  body('email').isEmail().withMessage('Email invalide'),
  body('phone').isLength({ min: 8 }).withMessage('Le téléphone doit contenir au moins 8 chiffres'),
  body('deliveryAddress').notEmpty().withMessage('L\'adresse de livraison est obligatoire'),
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}, orderController.placeOrder);

// Dans routes/order.js
router.get('/current', authMiddleware, orderController.getCurrentOrders);

module.exports = router;