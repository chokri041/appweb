const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Vérifier si le token est présent dans l'en-tête de la requête
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ msg: 'Aucun token, autorisation refusée' });
  }

  try {
    // Vérifier et décoder le token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Valider la structure du token
    if (!decoded || typeof decoded !== 'object') {
      return res.status(401).json({ msg: 'Token invalide : structure incorrecte' });
    }

    if (!decoded.user || typeof decoded.user !== 'object') {
      return res.status(401).json({ msg: 'Token invalide : utilisateur manquant dans le token' });
    }

    if (!decoded.user.id) {
      return res.status(401).json({ msg: 'Token invalide : ID utilisateur manquant' });
    }

    // Ajouter l'utilisateur décodé à l'objet req pour une utilisation ultérieure
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error('Erreur de validation du token:', err.message);

    // Gestion des erreurs spécifiques
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ msg: 'Token expiré' });
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ msg: 'Token invalide' });
    }

    // Erreur serveur inattendue
    res.status(500).json({ msg: 'Erreur serveur lors de la validation du token' });
  }
};