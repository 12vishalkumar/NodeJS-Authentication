//---------------------------- Importing required libaries --------------------------//
const User = require('../models/User');
const passport = require('passport');
const LocalStretegy = require("passport-local");



//--------------------------- authentication using passport ------------------------//
passport.use(new LocalStretegy({
        usernameField: 'email',
        passReqToCallback: true
    },
    async function(req, email, password, done) {
        try {
            //------------ find user and establish identity -----------------------//
            let user = await User.findOne({ email: email });
            // console.log(user);
            if (!user || user.password !== password) {
                req.flash('error', 'Invalid Email/Password');
                // console.log("User does not exist!")
                return done(null, false);
            }
            return done(null, user);
        } catch (error) {
            req.flash('error', error);
            // console.log(error, "something is wrong. Please! try again");
            return done(error);
        }
    }
));

//----------------------------------- seralizing the use------------------------------//
passport.serializeUser(function(user, done) {
    done(null, user.id);
})

//---------------------------------- deserializing the use---------------------------//
passport.deserializeUser(async function(id, done) {
    try {
        let user = await User.findById(id);
        if (!user) {
            return done(null, false);
        }
        return done(null, user);
    } catch (error) {
        // console.log("Error to finding user in db", error);
        req.flash('error', 'User does not exits.');
        return done(error);
    }
})

//------------------------------- check user authenticated or not  --------------------------------//
passport.checkAuthentication = function(req, res, next) {
    if (req.isAuthenticated()) {
        // console.log("user is authenticated!");
        req.flash('success', 'User is authenticated!');
        return next();
    }
    return res.redirect('/user/login');
}

//--------------------------------- set the user for views ---------------------------------------// 
passport.setAuthenticatedUser = function(req, res, next) {
    if (req.isAuthenticated()) {
        res.locals.user = req.user;
    }
    next();
}

//--------------- exporting passport ------------------------//
module.exports = passport;