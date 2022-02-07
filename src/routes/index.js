const UserRoute = require('./UserRoute');
const CourseRoute = require('./CourseRoute');

module.exports = (app) => {
    UserRoute(app);
    CourseRoute(app);
};