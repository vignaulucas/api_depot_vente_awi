const express = require('express');
const { isLoggedIn } = require('../middlewares/auth');
const wishlistController = require('../controllers/wishlist.controllers');

module.exports = app => {
    const router = express.Router();

    // Routes POST
    router.post('/add', isLoggedIn, wishlistController.addToWishlist);

    // Routes GET
    router.get('/:userId', isLoggedIn, wishlistController.getWishlist);

    // Routes DELETE
    router.delete('/:gameId', isLoggedIn, wishlistController.removeFromWishlist);

    app.use('/wishlist', router);
};
