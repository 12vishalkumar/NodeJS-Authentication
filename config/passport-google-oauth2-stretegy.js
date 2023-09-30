//------------------------------------------- importing required libaries ---------------------------//
//----------------------- requiring passport ---------------------------------//
const passport = require("passport");

//---------------------- require google stretegy -----------------------------//
const googleStretegy = require("passport-google-oauth").OAuth2Strategy;

//----------------- require crypto for generating random password ------------//
const crypto = require("crypto");

//----------------------- require user model ---------------------------------//
const User = require("../models/User");




// ---------------------- google login --------------------------------------//
passport.use(new googleStretegy({
        clientID: "169313980583-trp25t265ptc95l668kvns3m51aan0g0.apps.googleusercontent.com",   // Client ID
        clientSecret: "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",   // Client Secret
        callbackURL: 'http://localhost:8000/user/auth/google/callback',  // Callback URL
        passReqToCallback: true,
    },
    async function(request, accessToken, refreseToken, profile, done) {
        try {
            const user = await User.findOne({ email: profile.emails[0].value });
            if (user) {
                return done(null, user);
            }
            if (!user) {
                const newUser = await User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                })
                if (newUser) {
                    return done(null, newUser);
                }
            }
        } catch (error) {
            // console.log("Error in google stretegy passport", error);
            req.flash('error', 'Error in google stretegy passport');
        }
    }
));

//------------------------- exporting passport --------------------------//
module.exports = passport;