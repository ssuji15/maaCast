module.exports = (app) => {
    const restaurant = require('../controllers/restaurant.controller.js');
    const menu = require('../controllers/menu.controller.js');

    // Create new Restaurant
    app.post('/restaurant/create', restaurant.create);

    // List all Restaurants
    app.post('/restaurant/list', restaurant.findAll);

    //Restaurant Details
    app.post('/restaurant/details', restaurant.viewDetails);

    // Update Restaurant details
    app.put('/restaurant/update', restaurant.update);

    // Delete Restaurant
    app.delete('/restaurant/delete', restaurant.delete);

    // Adds items to Menu
    app.post('/item/create', menu.create);

    // View Menu to owner
    app.post('/menu/list', menu.findMenu);

    //View Menu to consumer
    app.post('/menu/item', menu.findMenuItem);
}