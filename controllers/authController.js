const User = require('../models/User');
const jwt = require('jsonwebtoken');


const key = process.env.SECRET_KEY;

//handle errors
const handleErrors = (err) =>{
    console.log(err.message, err.code);
    let errors = { email: '', password: '' };

    //incorrect email
    if (err.message === 'incorrect email'){
        errors.email = 'there is no user with that email';
    }

    //incorrect password
    if (err.message === 'incorrect password'){
        errors.password = 'password is incorrect';
    }

    //duplicate error
    if(err.code == 11000){
        errors.email = 'Email is already in use';
    }

    //validation errs
    if(err.message.includes('user validation failed')){
        Object.values(err.errors).forEach(({properties}) =>{
            errors[properties.path] = properties.message;
        });
    }

    return errors;
};

const maxAge = 3 * 24 * 60 * 60; //3 days in seconds
const createToken = (id) => {
    return jwt.sign({ id }, key,{
        expiresIn: maxAge
    });
};

module.exports.signup_get = (req, res) => {
    res.render('signup');
};

module.exports.signup_post = async(req, res) => {
    const { email, password } = req.body;
    
    try{
        const user = await User.create({email, password});
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000});
        res.status(201).json({user: user._id});
    }catch(err){
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
};

module.exports.login_get = (req, res) => {
    res.render('login');
};

module.exports.login_post = async(req, res) => {
    const { email, password } = req.body;
        
    try {
        const user = await User.login(email, password);

        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000}); 

        res.status(200).json({user: user._id});            
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });        
    }
};

module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', {maxAge: 1}); //Re-create jwt cookie with small lifetime 
    res.redirect('/');
};