require('dotenv').config();
const express = require('express');
const connectDB = require('./src/config/db');
const cors = require('cors');
const app = express();
connectDB();
app.use(express.json()); 
app.use(cors());
app.get('/', (req, res) => {
    res.send('Inkle Backend Assignment API is Running 🚀');
});
app.use('/api', require('./src/routes/api'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));