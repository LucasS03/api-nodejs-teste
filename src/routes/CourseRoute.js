const CourseController = require('../controllers/CourseController');

module.exports = (app) => {
    app.post('/course', CourseController.post);
    app.put('/course/:id', CourseController.put);
    app.delete('/course/:id', CourseController.delete);

    app.get('/courses', CourseController.get);
    app.get('/course/:id', CourseController.getById);
}