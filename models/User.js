const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrpyt = require("bcrypt");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Minimum password length is 8 characters']
    },  
});

//Hooks such as save and pre: https://mongoosejs.com/docs/middleware.html

//fire after doc saved to db (event 'save')
userSchema.post('save', function (doc, next) {
    
    next(); //to go to the next middleware in the stack
});

//fire before doc saved to db
userSchema.pre('save', async function(next){ //Using normal function instead of => to keep "this" referencing the User
    //Hash the password using bcrpyt
    const salt = await bcrpyt.genSalt();
    this.password = await bcrpyt.hash(this.password, salt);
    next();
});

const User = mongoose.model('user', userSchema);

module.exports = User;