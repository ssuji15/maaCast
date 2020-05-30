module.exports = (app) => {
    const users = require('../controllers/user.controller.js');

    // Create a new user
    app.post('/users/register', users.register);

    // Login User
    app.post('/users/login', users.login);

    // Logout User
    app.get('/users/logout', users.logout);

    // Retrieve all users
    app.get('/users/list', users.findAll);

    // Retrieve a single todo by id
    app.get('/users/find', users.findOne);

    // Update a Todo with id
    app.put('/users/update', users.update);

    // Delete a Todo by id
    app.delete('/users/delete', users.delete);

    //session

    app.get('/users/sessionCheck',users.sessionCheck);
}