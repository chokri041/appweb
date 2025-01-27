const mongoose = require('mongoose');

const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce';

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('MongoDB connecté');
  } catch (err) {
    console.error('Erreur de connexion à MongoDB :', err.message);
    console.error('Stack trace :', err.stack);
    process.exit(1);
  }
};

module.exports = { connectDB };