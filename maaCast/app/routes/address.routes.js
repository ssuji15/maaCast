module.exports = (app) => {
    const address = require('../controllers/address.controller.js');

    // Create a new address
    app.post('/users/address/create', address.addAddress);

    // Update address
    app.put('/users/address/update', address.updateAddress);

    // Remove address
    app.delete('/users/address/delete', address.deleteAddress);

    // Update retaurant address
    app.put('/restaurant/address/update', address.updateRestaurantAddress);
}