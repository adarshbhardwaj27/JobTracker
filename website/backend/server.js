const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
require('./models/dbConnect');
const authRoutes = require('./routes/authRoutes');
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use('/auth/', authRoutes);
app.post('/ai', (req, res) => {
    console.log(req.body);
    res.send(req.body);
})

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on the server`, 404));
});

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})