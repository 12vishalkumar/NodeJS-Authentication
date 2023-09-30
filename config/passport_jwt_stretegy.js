//----------------------------- importing required libaries ---------------------//
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/User');



var opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: "v85cdgfnvGFfg5bvfd9R"
}

//-------------------------- finding user -------------------------------------//
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    User.findOne({ email: jwt_payload.email }, function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    });
}));