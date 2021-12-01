require('dotenv').config();

const { response } = require("express");
const express = require("express");
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.on('open', () => console.log("Connected to database"));

app.use(express.json());

const photosRouter = require('./routes/photos');
app.use('/api', photosRouter);

app.listen(8080);