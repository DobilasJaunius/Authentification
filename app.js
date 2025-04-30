require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(express.static('public'));

app.set('view engine', 'ejs');

//connect to mongoDb
const dbURI = process.env.MONGODB_URI;
mongoose.connect(dbURI)
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err));

//routes
app.get("/", (req, res) => res.render('home'));

app.use(authRoutes);