const UserController = require('../controllers/UserController');

module.exports = (app) => {
    app.post('/user', UserController.post);
    app.put('/user/:id', UserController.put);
    app.delete('/user/:id', UserController.delete);

    app.get('/users', UserController.get);
    app.get('/user/:id', UserController.getById);

    // login
    app.post('/user/login', UserController.login);

    // reset password
    app.post('/user/:email', UserController.sendPasswordResetEmail);
    app.post('/user/reset/:id/:token', UserController.receiveNewPassword);
};