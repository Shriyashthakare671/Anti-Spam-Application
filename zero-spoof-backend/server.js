const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config(); // ✅ Load environment variables

const userRoutes = require('./routes/userRoutes');
const callRoutes = require('./routes/callRoutes');

const app = express();

// ✅ Middleware
app.use(cors({ origin: '*' })); // Allow all origins (change if needed)
app.use(bodyParser.json()); // ✅ Parses JSON requests properly
app.use(bodyParser.urlencoded({ extended: true })); // ✅ Supports URL-encoded data
app.use(express.json());

// ✅ Routes
app.use('/api/users', userRoutes);
app.use('/api/calls', callRoutes);

// ✅ Error Handling Middleware
app.use((err, req, res, next) => {
    console.error('❌ Server Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
});

// ✅ Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
