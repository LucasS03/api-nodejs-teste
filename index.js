const express = require('express');
const cors = require('cors');
var app = express();

const config = require('./config');

app.use(cors());
app.use(express.json());
app.listen(config.PORT || 3000, () => {
    console.log(`APP LISTENING ON http://${config.HOST}:${config.PORT}`);
});

require('./src/routes/index')(app);