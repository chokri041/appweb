// models/Product.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Définition du schéma pour un produit
const productSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Le nom du produit est requis'],
    trim: true, // Éliminer les espaces autour du nom
    minlength: [3, 'Le nom du produit doit avoir au moins 3 caractères'],
  },
  description: {
    type: String,
    required: [true, 'La description du produit est requise'],
    minlength: [10, 'La description doit comporter au moins 10 caractères'],
  },
  price: {
    type: Number,
    required: [true, 'Le prix est requis'],
    min: [0, 'Le prix ne peut pas être inférieur à 0'],
  },
  quantityAvailable: {
    type: Number,
    required: [true, 'La quantité du produit est requise'],
    min: [0, 'La quantité ne peut pas être inférieure à 0'],
  },
  image: {
    type: String,
    match: [/^https?:\/\/.+/i, 'L\'URL de l\'image doit être valide'], // Validation de l'URL
  },
  threeDModel: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'L\'utilisateur est requis'], // Lier chaque produit à un utilisateur
  },
}, { timestamps: true });

// Middleware pour activer les validations lors des mises à jour
productSchema.pre('findOneAndUpdate', function (next) {
  this.options.runValidators = true; // Activer les validateurs
  next();
});

// Fonction pour formater les erreurs de validation
const formatValidationError = (err) => {
  const errors = Object.values(err.errors).map((val) => val.message);
  return errors.join(', ');
};

// Exporter le modèle
module.exports = mongoose.model('Product', productSchema);