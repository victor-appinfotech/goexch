const express = require("express"),
  router = express.Router(),
  // csurf = require('csurf'),
  { validationResult, check } = require("express-validator");

const Auth = require('../models/Auth');
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");
var bcrypt = require('bcryptjs');
/* CSRF */
/* const { csrfProtection } = require("../config/csrf");
router.use(csrfProtection); */

/* GET home page. */
router.get('/', (req, res, next) => {
  res.redirect('/login');
});

router.get("/login", forwardAuthenticated, (req, res, next) => {
  res.render("login", { title: "Login",layout: 'loginLayout',token:req.csrfToken() });
});

router.get("/dashboard", ensureAuthenticated, (req, res, next) => {
  res.render("dashboard", { title: "Welcome " + req.session.user.user_name });
});

router.post('/login',[
  check('username','Enter username').notEmpty(),
  check('password','Enter password').notEmpty()
], (req, res, next) => {  
  const errors = validationResult(req);

  if (!errors.isEmpty()){
    req.flash("error_msg", "Please check you login details and try again!");
    res.redirect('/login');
    // return res.status(422).json({ errors: errors.array() });
  }else{
    Auth.check(req,(err,user)=>{
      if (err) {
        console.log('error');
        res.redirect('/login');
      }else{        
        console.log('No error');
        res.redirect("/client");
      }
    });
  }
});

// Logout
router.get('/logout', (req, res) => {
  
  req.flash('success_msg', 'You are logged out');
  req.session.destroy();
  res.redirect('/login');
});

module.exports = router;
