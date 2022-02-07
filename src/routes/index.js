const UsuarioRoute = require('./UsuarioRoute');
const CourseRoute = require('./CourseRoute');

module.exports = (app) => {
    UsuarioRoute(app);
    CourseRoute(app);
};