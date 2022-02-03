const express = require('express');
const cors = require('cors');
const app = express();

require('./src/routes/index')(app);

app.use(cors());
app.use(express.json());
app.listen(3333);