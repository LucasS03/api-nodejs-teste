const ClassController = require('../controllers/ClassController');
const upload = require('../../common');

module.exports = (app) => {
    app.post('/class', ClassController.post);
    app.put('/class/:id', ClassController.put);
    app.delete('/class/:id', ClassController.delete);

    app.get('/classes', ClassController.get);
    app.get('/class/:id', ClassController.getById);
    app.post('/class/:id/upload', upload.single('video'), ClassController.videoUpload);
};