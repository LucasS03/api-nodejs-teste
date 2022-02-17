const ClassController = require('../controllers/ClassController');
const upload = require('../../common');
const fs = require('fs');

module.exports = (app) => {
    app.get('/', (req, res) => {
        fs.readFile('./index.html', (err, html) => res.end(html));
    });
    app.get('/class/:id/video', ClassController.getVideoByClassId);

    app.post('/class', ClassController.post);
    app.put('/class/:id', ClassController.put);
    app.delete('/class/:id', ClassController.delete);

    app.get('/classes', ClassController.get);
    app.get('/class/:id', ClassController.getById);
    app.post('/class/:id/upload', upload.single('video'), ClassController.videoUpload);
};