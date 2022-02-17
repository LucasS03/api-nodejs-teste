const UserRoute = require('./UserRoute');
const CourseRoute = require('./CourseRoute');
const ClassRoute = require('./ClassRoute');

module.exports = (app) => {
    UserRoute(app);
    CourseRoute(app);
    ClassRoute(app);
};