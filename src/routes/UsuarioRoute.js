const UserController = require('../controllers/UserController');

module.exports = (app) => {
    app.post('/usuario', UserController.post);
    app.put('/usuario/:id', UserController.put);
    app.delete('/usuario/:id', UserController.delete);

    app.get('/usuarios', UserController.get);
    app.get('/usuario/:id', UserController.getById);
}