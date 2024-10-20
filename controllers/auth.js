/* eslint-disable prefer-destructuring */
const express = require('express');
const User = require('../models/user');
const auth = require('../config/auth');

const router = express.Router();
// sign-up --------------------------------------------

router.get('/sign-up', async (req, res) => {
  res.render('auth/sign-up.ejs');
});

router.post('/sign-up', async (req, res) => {
  // grab the values from the req body
  const username = req.body.username;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  // Check if the user already exists
  const existingUser = await User.findOne({ username });

  // if the user exists,then dont bother doing anything, just send a message to the browser
  if (existingUser) {
    return res.send('Username is taken');
  }
  // verify that the password matches
  if (password !== confirmPassword) {
    return res.send("Passwords don't match!");
  }

  // create the user in the database
  // -b make the password secure
  const hashPassword = auth.encryptPassword(password);
  const payload = { username, password: hashPassword };

  const newUser = await User.create(payload);
  // respond back to the browser
  res.send(`Thanks for signing up ${newUser.username}`);
  
});

//sign-in -------------------------------------------------
router.get('/sign-in', async(req, res) =>{
    res.render('auth/sign-in.ejs')
}); 

router.post('/sign-in', async(req, res) =>{
  const username = req.body.username;
  const password = req.body.password;
//find a user from the username they filled out
const user = await User.findOne({ username});

 //if the user doesnt exist, send an error message
if(!user){
  return res.send('Login failed, please try again');
}

 //compare entered password with db password 
const validPassword = auth.comparePassword(password, user.password)

if(!validPassword){
  return res.send('Login failed, please try again');
}
// else sign them in 
req.session.user = {
  username: user.username,
};


// create a session cookie 
req.session.save(() => {
  res.redirect("/");
});

}); 

router.get("/sign-out", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});


module.exports = router;