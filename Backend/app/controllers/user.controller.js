const User = require('../models/Users.model.js');

// Create and Save a new User
exports.create = (req, res) => {
    // // Validate request
    // if(!req.body.description) {
    //     return res.status(400).send({
    //         message: "Users description can not be empty"
    //     });
    // }

    console.log("UserId : " + req.body.userid);

    // Create a User
    const user = new UserModel({
        userid: req.body.userid,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        contactNumber: req.body.contactNumber,
        userType: req.body.userType,
        emailid: req.body.emailid
    });

    // Save User in the database
    user.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the User."
        });
    });
};

// Retrieve and return all todos from the database.
exports.findAll = (req, res) => {
    User.find()
    .then(users => {
        res.send(users);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving users."
        });
    });
};

// Find a single todo with a id
exports.findOne = (req, res) => {
    User.findById(req.params.userid)
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "User not found with id " + req.params.userid
            });            
        }
        res.send(user);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "User not found with id " + req.params.userid
            });                
        }
        return res.status(500).send({
            message: "Error retrieving user with id " + req.params.userid
        });
    });
};

// // Update a todo identified by the id in the request
// exports.update = (req, res) => {
//     // Validate Request
//     if(!req.body.description) {
//         return res.status(400).send({
//             message: "Todo description can not be empty"
//         });
//     }

//     // Find todo and update it with the request body
//     Todo.findByIdAndUpdate(req.params.id, {
//         title: req.body.name || "Untitled Todo",
//         description: req.body.description
//     }, {new: true})
//     .then(todo => {
//         if(!todo) {
//             return res.status(404).send({
//                 message: "Todo not found with id " + req.params.id
//             });
//         }
//         res.send(todo);
//     }).catch(err => {
//         if(err.kind === 'ObjectId') {
//             return res.status(404).send({
//                 message: "Todo not found with id " + req.params.id
//             });                
//         }
//         return res.status(500).send({
//             message: "Error updating todo with id " + req.params.id
//         });
//     });
// };

// // Delete a todo with the specified id in the request
// exports.delete = (req, res) => {
//     Todo.findByIdAndRemove(req.params.id)
//     .then(todo => {
//         if(!todo) {
//             return res.status(404).send({
//                 message: "Todo not found with id " + req.params.id
//             });
//         }
//         res.send({message: "Todo deleted successfully!"});
//     }).catch(err => {
//         if(err.kind === 'ObjectId' || err.name === 'NotFound') {
//             return res.status(404).send({
//                 message: "Todo not found with id " + req.params.todo
//             });                
//         }
//         return res.status(500).send({
//             message: "Could not delete todo with id " + req.params.id
//         });
//     });
// };
