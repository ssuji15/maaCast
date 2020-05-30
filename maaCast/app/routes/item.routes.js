module.exports = (app) => {
    const item = require('../controllers/item.controller.js');

    // Delete Items
    app.delete('/item/delete', item.deleteItem);

    // Update Items
    app.put('/item/update', item.update);
}