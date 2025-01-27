const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, // Un seul panier par utilisateur
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
    default: 0, // Total initialisé à 0
  },
});

module.exports = mongoose.model('Cart', cartSchema);