require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const { requireAuth, checkUser } = require("./middleware/authMiddleware");

const app = express();

//middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

//view engine
app.set('view engine', 'ejs');

//connect to mongoDb
const dbURI = process.env.MONGODB_URI;
mongoose.connect(dbURI)
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err));

//routes
app.get('*', checkUser) // * - applies to every route
app.get("/", (req, res) => res.render('home'));
app.get("/mainpage", requireAuth, (req, res) => res.render('mainpage'));

app.use(authRoutes);

