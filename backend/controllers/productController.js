const Product = require('../models/Product');
const { validationResult } = require('express-validator');

// Obtenir tous les produits
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error('Erreur lors de la récupération des produits:', err.message);
    res.status(500).json({ msg: 'Erreur serveur lors de la récupération des produits' });
  }
};

// Obtenir un produit par son ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: 'Produit non trouvé' });
    }
    res.json(product);
  } catch (err) {
    console.error('Erreur lors de la récupération du produit:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'ID de produit invalide' });
    }
    res.status(500).json({ msg: 'Erreur serveur lors de la récupération du produit' });
  }
};

// Créer un produit
exports.createProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, description, price, quantityAvailable, image, threeDModel } = req.body;

  try {
    // Vérification de l'utilisateur authentifié
    if (!req.user || typeof req.user !== 'object' || !req.user.id) {
      return res.status(403).json({ msg: 'Utilisateur non autorisé' });
    }

    // Vérification de la quantité disponible
    if (quantityAvailable < 0) {
      return res.status(400).json({ msg: 'La quantité disponible doit être positive' });
    }

    // Créer un nouveau produit
    const newProduct = new Product({
      name,
      description,
      price,
      quantityAvailable,
      image,
      threeDModel,
      user: req.user.id, // Lier le produit à l'utilisateur authentifié
    });

    // Sauvegarder le produit dans la base de données
    const product = await newProduct.save();
    res.status(201).json(product);
  } catch (err) {
    console.error('Erreur lors de la création du produit:', err.message);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ msg: 'Données du produit invalides', errors: err.errors });
    }
    res.status(500).json({ msg: 'Erreur serveur lors de la création du produit' });
  }
};

// Mettre à jour un produit
exports.updateProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, description, price, quantityAvailable, image, threeDModel } = req.body;

  try {
    // Vérifier que le produit existe
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: 'Produit non trouvé' });
    }

    // Vérifier que l'utilisateur est le propriétaire du produit
    if (product.user.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Non autorisé à modifier ce produit' });
    }

    // Vérification de la quantité disponible
    if (quantityAvailable !== undefined && quantityAvailable < 0) {
      return res.status(400).json({ msg: 'La quantité disponible doit être positive' });
    }

    // Mettre à jour le produit
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name: name || product.name,
          description: description || product.description,
          price: price || product.price,
          quantityAvailable: quantityAvailable !== undefined ? quantityAvailable : product.quantityAvailable,
          image: image || product.image,
          threeDModel: threeDModel || product.threeDModel,
        },
      },
      { new: true } // Retourner le document mis à jour
    );

    res.json(updatedProduct);
  } catch (err) {
    console.error('Erreur lors de la mise à jour du produit:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'ID de produit invalide' });
    }
    res.status(500).json({ msg: 'Erreur serveur lors de la mise à jour du produit' });
  }
};

// Supprimer un produit
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: 'Produit non trouvé' });
    }

    // Vérifier que l'utilisateur est le propriétaire du produit
    if (product.user.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Non autorisé à supprimer ce produit' });
    }

    // Supprimer le produit de la base de données
    await product.deleteOne();
    res.json({ msg: 'Produit supprimé avec succès' });
  } catch (err) {
    console.error('Erreur lors de la suppression du produit:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'ID de produit invalide' });
    }
    res.status(500).json({ msg: 'Erreur serveur lors de la suppression du produit' });
  }
};