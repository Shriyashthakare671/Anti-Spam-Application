const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const callRoutes = require('./routes/callRoutes');


const app = express();
app.use(bodyParser.json());

app.use('/api/users', userRoutes);
app.use('/api/calls', callRoutes);

app.listen(3000, () => console.log('Server running on port 3000'));
