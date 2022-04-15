const CourseController = require('../controllers/CourseController');

module.exports = (app) => {
    app.post('/course', CourseController.post);
    app.put('/course/:id', CourseController.put);
    app.delete('/course/:id', CourseController.delete);

    app.get('/courses', CourseController.get);
    app.get('/course/:id', CourseController.getById);
    app.get('/course/:id/classes', CourseController.getClassesByCourseId);

    app.get('/courses/:courseId/progress/:userId', CourseController.checkProgress);
    app.post('/courses/:courseId/progress/:userId', CourseController.updateProgress);

    app.get('/courses/:courseId/status/:userId', CourseController.checkStatus);
    app.post('/courses/:courseId/status/:userId', CourseController.addToCourse);
    app.put('/courses/:courseId/status/:userId', CourseController.setCompleted);

    app.get('/courses/:courseId/certificate/:userId', CourseController.generatePDF);
};