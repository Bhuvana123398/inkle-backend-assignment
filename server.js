require('dotenv').config();
const express = require('express');
const connectDB = require('./src/config/db');
const cors = require('cors');

const app = express();

// Connect Database
connectDB();

// --- MIDDLEWARE (Crucial Step: This allows JSON reading) ---
app.use(express.json()); 
app.use(cors());

// --- ROUTES ---
app.use('/api', require('./src/routes/api'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));