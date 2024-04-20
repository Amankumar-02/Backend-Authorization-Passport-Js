import { Router } from 'express';
import { User } from '../model/user.model.js';
import passport from "passport";
import { isLoggedIn, isLoggedOut } from '../passportConfig.js';
import { OAuth } from '../model/oAuth.model.js';

export const userRouter = Router();

// loginDashboard
userRouter.get('/', isLoggedOut, function(req, res) {
  const loginErrorAlert = req.flash('error');
  console.log(loginErrorAlert)
  res.render("login", {"loginErrorAlert": loginErrorAlert || ""});
});

// registerDashboard
userRouter.get('/registerPage', isLoggedOut, (req, res)=>{
  const {registerErrorAlert} = req.flash();
  res.render("register", {"registerErrorAlert": registerErrorAlert || ""})
});

// profileDashboard
userRouter.get('/profile', isLoggedIn, async(req, res)=>{
  const user = req.user;
  const userData = await User.findOne({username: user.username}) || await OAuth.findOne({username: user.displayName});
  res.render("profile", {"profileUserData" : userData});
})

// do registerUser and immediate login
userRouter.post('/registerUser', async(req, res)=>{
  const {username, fullname, password} = req.body;
  if(!(username && fullname && passport)){req.flash("registerErrorAlert", "All fields are required");
  return res.redirect("/users/registerPage");}
  const exists = await User.findOne({username});
  if(exists){req.flash("registerErrorAlert", "User Already Exists");
  return res.redirect("/users/registerPage");}
  const userData = await User.create({
    username: username,
    fullname: fullname,
    password: password,
  });
  // res.redirect("/users")
  req.login(userData, (err) => {
    if (err) return next(err);
    res.redirect("/users/profile");
  });
});

// loginUser
userRouter.post('/loginUser', passport.authenticate("local", {
  // login successfull ==> go to profile
  successRedirect: "/users/profile",
  // login unsuccessfull ==> go to home
  failureRedirect: "/users",
  failureFlash: true
}), (req, res) => {
});

// logoutUser
userRouter.get('/logoutUser', (req, res, next)=>{
  req.logout((err)=>{
      if(err) return next(err);
      res.redirect('/users');
  });
});