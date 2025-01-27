const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true, // Index pour améliorer les performances
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1, // La quantité doit être au moins 1
      },
      price: {
        type: Number,
        required: true,
        min: 0, // Le prix ne peut pas être négatif
      },
    },
  ],
  total: {
    type: Number,
    required: true,
    min: 0, // Le total ne peut pas être négatif
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], // Statuts possibles
    default: 'pending', // Statut par défaut
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  deliveryAddress: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now, // Date de création
  },
  updatedAt: {
    type: Date,
    default: Date.now, // Date de mise à jour
  },
});

module.exports = mongoose.model('Order', orderSchema);