const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt; //Get cookie named 'jwt'

    //check if jwt token exists and is valid
    if(token) {
        jwt.verify(token, 'changethislater secret', (err, decodedToken) => {
            if(err){
                console.log(err.message);
                res.redirect('/login');
            }else{
                console.log(decodedToken);
                next();
            }
        });
    }else{
        res.redirect('/login');
    }
}

//Check current user
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;

    if(token){
        jwt.verify(token, 'changethislater secret', async (err, decodedToken) => {
            if(err){
                console.log(err.message);
                res.locals.user = null; //Make user to null
                next();
            }else{ //valid user logged in
                console.log(decodedToken); //in decoded token there is a payload with id (added on creation)
                let user = await User.findById(decodedToken.id);
                res.locals.user = user; //Make user accesable in views
                next();
            }
        });
    }else{
        res.locals.user = null;
        next();
    }
};

module.exports = {requireAuth, checkUser};