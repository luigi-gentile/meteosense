const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require("cors");
const bodyParser = require("body-parser");

const authRoutes = require('./routes/auth.js');
const sensorRoutes = require('./routes/sensors.js');

dotenv.config();
const app = express();
const port = process.env.PORT || 5061;

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.use('/auth', authRoutes);
app.use('/sensors', sensorRoutes);

// database connection
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Database connection successful");
        app.listen(port, () => console.log(`App listening on port: ${port}`));
    })
    .catch(err => console.error(err));