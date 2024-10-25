
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const isLoggedIn = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ').pop();
    if (!token) throw new Error('No token provided');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      where: {
        idUser: decoded.id,
      },
    });
    if (!user) throw new Error('Token invalid');
    if (!user.active) throw new Error('User desactivated');
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ errors: error.message });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role === 'admin') return next();
  res.status(401).send({ errors: 'Not Admin' })
}

const isGestionnaire = (req, res, next) => {
    if (req.user.role === 'gestionnaire') return next();
    res.status(401).send({ errors: 'Not Gestionnaire' })
  }

module.exports = { isLoggedIn, isAdmin, isGestionnaire };
