//----------------------- importing required libaries ---------------------------//
const User = require("../models/User");



//--------------------------- Rendering home page -------------------------------//
module.exports.homepage = function (req, res) {
  if (req.isAuthenticated()) {
    return res.render("home");
  }
  return res.redirect("/login");
};

//--------------------------- Rendering signup  page ----------------------------//
module.exports.signupPage = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/home");
  }
  return res.render("signup");
};

//--------------------------- Rendering login page ------------------------------//
module.exports.loginPage = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/home");
  }
  return res.render("login");
};

//----------------------- rendering reset page ----------------------------------//
module.exports.resetPage = function (req, res) {
  return res.render("resetPassword");
};

//---------------------- signup functionality -----------------------------------//
module.exports.signup = async (req, res) => {
  try {
    const { name, email, password, confirm_Password } = req.body;
    //--------- check password and confirm password id match or not ------------//
    if (password !== confirm_Password) {
      req.flash("error", "Please! enter the correct password");
      return res.redirect("/");
    }
    //------------ check if user is exist already in database ------------------//
    const existUser = await User.findOne({ email: email });
    if (existUser) {
      req.flash("error", "User already exits.");
      // console.log("User already exits.");
      return res.redirect("/");
    }
    const user = await User.create({
      name: name,
      email: email,
      password: password,
    });
    req.flash("success", "You are singed successfully!");
    return res.redirect("/login");
  } catch (error) {
    req.flash("error", "opps! Something went wrong. Please! try again.");
    // console.log("opps! Something went wrong. Please! try again.");
  }
};

//------------------------------ signIn functionality ------------------------//
module.exports.signin = async (req, res) => {
  req.flash("success", "You are logged in successfully!");
  // console.log("You are logged in successfully!");
  return res.redirect("/home");
};

//-------------------------- password reser functionality -------------------//
module.exports.reset = async (req, res) => {
  const { email, oldpassword, newpassword } = req.body;
  const user = await User.findOne({ email: email });
  if (!user) {
    req.flash("error", "User does not exist.");
    // console.log("User does not exist.");
    return req.redirect("/reset");
  }

  //------------- check password exist database or not ---------------------//
  if (user.password !== oldpassword) {
    req.flash("error", "Your password does not match. Please! Enter the correct password.");
    // console.log("Your password does not match. Please! Enter the correct password.");
    return res.redirect("/reset");
  }
  user.password = newpassword;
  user.save();
  // console.log("Your password updated succesfully!");
  req.flash("success", "Your password updated successfully!");
  res.redirect("/login");
};

//------------------------ destroy session ------------------------------//
module.exports.destroy = function (req, res, next) {
  req.logout(function (error) {
    if (error) {
      req.flash("error", "Error in destroying session");
      return next(error);
    }
    req.flash("success", "You logged out successfully!");
    res.redirect("/");
  });
};