//-------------------- importing required libaries ------------------//
const express = require("express");
const passport = require("passport");
const router = express.Router();



//------------------ requiring user controller --------------------//
const user_Controller = require("../controllers/userController");

//------------------ rendering home page ------------------------//
router.get("/home", user_Controller.homepage);

//-------------------- rendering signup page --------------------//
router.get("/", user_Controller.signupPage);

//-------------------- rendering login page ---------------------//
router.get("/login", user_Controller.loginPage);

//--------------------- rendering reset page --------------------//
router.get("/reset", user_Controller.resetPage)

//----------------- destroy session -----------------------------//
router.get("/logout", user_Controller.destroy);

//------------------ create new user in database ----------------//
router.post("/signup", user_Controller.signup);

//-------------------- reset password ---------------------------//
router.post("/reset", user_Controller.reset);

//------------------- create new session for user ---------------//
router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/user/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/"}),
  (req, res) => {
    req.flash("success", "You logged in successfully using google authentication!");
    res.redirect("/home"); 
  }
);

//------------------- create new session for user ---------------//
router.post("/signin", passport.authenticate("local", { failureRedirect: "/login" }), user_Controller.signin);

//------------------------- exporting router --------------------//
module.exports = router;