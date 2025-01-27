const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Product = require('../models/Product');

// Récupérer toutes les commandes d'un utilisateur
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ user: userId }).populate('items.product');
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({
      message: 'Erreur lors de la récupération des commandes',
      error: err.message,
    });
  }
};

// Créer une nouvelle commande
const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    // Calculer le total en fonction des items
    const total = req.body.items.reduce((sum, item) => sum + item.quantity * item.price, 0);

    const newOrder = new Order({
      user: userId,
      items: req.body.items,
      total: total, // Utiliser le total calculé
      status: 'pending', // Statut initial
    });

    await newOrder.save();
    res.status(201).json({ message: 'Commande créée avec succès', order: newOrder });
  } catch (err) {
    res.status(500).json({
      message: 'Erreur lors de la création de la commande',
      error: err.message,
    });
  }
};

// Récupérer les détails d'une commande spécifique
const getOrderDetails = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId).populate('items.product');

    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Accès refusé à cette commande' });
    }

    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({
      message: 'Erreur lors de la récupération des détails de la commande',
      error: err.message,
    });
  }
};

// Passer une commande à partir du panier
const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { email, phone, deliveryAddress } = req.body;

    // Récupérer le panier de l'utilisateur
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Votre panier est vide' });
    }

    // Vérifier la disponibilité des produits
    for (const item of cart.items) {
      if (item.quantity > item.product.quantityAvailable) {
        return res.status(400).json({
          message: `Le produit ${item.product.name} n'a pas assez de stock disponible.`,
        });
      }
    }

    // Créer une commande à partir du panier
    const order = new Order({
      user: userId,
      items: cart.items.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
      })),
      total: cart.total,
      email,
      phone,
      deliveryAddress,
      status: 'pending',
    });

    await order.save();

    // Mettre à jour les stocks des produits
    for (const item of cart.items) {
      const product = item.product;
      product.quantityAvailable -= item.quantity;
      await product.save();
    }

    // Vider le panier après commande
    cart.items = [];
    cart.total = 0;
    await cart.save();

    res.status(201).json({
      message: 'Commande passée avec succès',
      order,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Erreur lors du passage de la commande',
      error: err.message,
    });
  }
};

// Récupérer les commandes en cours d'un utilisateur
const getCurrentOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ user: userId, status: { $nin: ['delivered', 'cancelled'] } })
      .populate('items.product');

    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({
      message: 'Erreur lors de la récupération des commandes en cours',
      error: err.message,
    });
  }
};

module.exports = {
  getUserOrders,
  createOrder,
  getOrderDetails,
  placeOrder,
  getCurrentOrders,
};
