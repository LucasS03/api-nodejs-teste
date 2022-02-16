const express = require('express');
const cors = require('cors');
var app = express();

require('dotenv-safe').config();

app.use(cors());
app.use(express.json());
app.listen(3333);

require('./src/routes/index')(app);