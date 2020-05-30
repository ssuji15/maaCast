module.exports = (app) => {
    const cart = require('../controllers/cart.controller.js');

    // Add item to cart
    app.post('/users/cart/add', cart.addItem);

    // Delete Item from cart
    app.delete('/users/cart/delete', cart.deleteItem);

    // Update Item Quantity
    app.put('/users/cart/update', cart.updateQuantity);
}