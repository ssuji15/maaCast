module.exports = (app) => {
    const users = require('../controllers/user.controller.js');

    // Create a new todo
    app.post('/users', users.create);

    // Retrieve all todos
    app.get('/users', users.findAll);

    // Retrieve a single todo by id
    app.get('/users/:id', users.findOne);

    // Update a Todo with id
    // app.put('/todos/:id', todos.update);

    // Delete a Todo by id
    // app.delete('/todos/:id', todos.delete);
}