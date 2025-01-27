const express = require('express');
const router = express.Router();
const { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware'); // Middleware pour authentifier l'utilisateur
const { check } = require('express-validator'); // Pour valider les données d'entrée

// Route pour obtenir tous les produits
router.get('/', getProducts);

// Route pour obtenir un produit par son ID
router.get('/:id', getProductById);

// Route pour créer un produit (réservée aux utilisateurs authentifiés)
router.post(
  '/',
  [
    authMiddleware,
    check('name', 'Le nom du produit est requis').notEmpty(),
    check('price', 'Le prix doit être un nombre positif').isFloat({ gt: 0 }),
    check('quantityAvailable', 'La quantité disponible doit être un entier positif').isInt({ min: 0 }),
  ],
  createProduct
);

// Route pour mettre à jour un produit (réservée au propriétaire du produit)
router.put(
  '/:id',
  [
    authMiddleware,
    check('name').optional().notEmpty().withMessage('Le nom ne peut pas être vide'),
    check('price').optional().isFloat({ gt: 0 }).withMessage('Le prix doit être un nombre positif'),
    check('quantityAvailable').optional().isInt({ min: 0 }).withMessage('La quantité disponible doit être un entier positif'),
  ],
  updateProduct
);

// Route pour supprimer un produit (réservée au propriétaire du produit)
router.delete('/:id', authMiddleware, deleteProduct);

module.exports = router;
