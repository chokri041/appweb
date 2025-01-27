const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Fonction utilitaire : trouver un panier par utilisateur
const findCartByUserId = async (userId) => {
  return await Cart.findOne({ user: userId }).populate('items.product');
};

// Ajouter un produit au panier
const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    if (quantity > product.quantityAvailable) {
      return res.status(400).json({
        message: `Quantité demandée (${quantity}) non disponible. Stock actuel : ${product.quantityAvailable}`,
      });
    }

    let cart = await findCartByUserId(userId);
    if (!cart) {
      cart = new Cart({ user: userId, items: [], total: 0 });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      const newQuantity = cart.items[itemIndex].quantity + quantity;

      if (newQuantity > product.quantityAvailable) {
        return res.status(400).json({
          message: `Quantité totale (${newQuantity}) dépasse le stock disponible (${product.quantityAvailable})`,
        });
      }

      cart.items[itemIndex].quantity = newQuantity;
    } else {
      cart.items.push({ product: productId, quantity, price: product.price });
    }

    cart.total = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    product.quantityAvailable -= quantity;
    await product.save();

    await cart.save();
    res.status(200).json({ message: 'Produit ajouté au panier', cart });
  } catch (err) {
    res.status(500).json({
      message: "Erreur lors de l'ajout au panier",
      error: err.message,
    });
  }
};

// Récupérer le panier de l'utilisateur
const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await findCartByUserId(userId);
    if (!cart || cart.items.length === 0) {
      return res.status(404).json({ message: 'Votre panier est vide' });
    }

    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({
      message: 'Erreur lors de la récupération du panier',
      error: err.message,
    });
  }
};

// Supprimer un produit du panier
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    const cart = await findCartByUserId(userId);
    if (!cart) {
      return res.status(404).json({ message: 'Panier non trouvé' });
    }

    const itemToRemove = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (!itemToRemove) {
      return res.status(404).json({ message: 'Produit non trouvé dans le panier' });
    }

    const product = await Product.findById(productId);
    if (product) {
      product.quantityAvailable += itemToRemove.quantity;
      await product.save();
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    cart.total = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    await cart.save();
    res.status(200).json({ message: 'Produit supprimé du panier', cart });
  } catch (err) {
    res.status(500).json({
      message: 'Erreur lors de la suppression du produit du panier',
      error: err.message,
    });
  }
};

module.exports = {
  addToCart,
  getCart,
  removeFromCart,
};
