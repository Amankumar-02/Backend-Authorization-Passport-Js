import { Router } from 'express';
import { User } from '../model/user.model.js';
import passport from "passport";
import { isLoggedIn, isLoggedOut } from '../passportConfig.js';

export const userRouter = Router();

userRouter.get('/', isLoggedOut, function(req, res) {
  // res.send('respond with a resource');
  res.render("login")
});
userRouter.get('/registerPage', isLoggedOut, (req, res)=>{
  const {registerErrorAlert} = req.flash();
  res.render("register", {"registerErrorAlert": registerErrorAlert || ""})
});
userRouter.get('/profile', isLoggedIn, (req, res)=>{
  res.render("profile")
})

// do register and redirect to loginpage
userRouter.post('/registerUser', async(req, res)=>{
  const {username, password} = req.body;
  if(!(username && passport)){req.flash("registerErrorAlert", "All fields are required");
  return res.redirect("/users/registerPage");}
  const exists = await User.findOne({username});
  if(exists){req.flash("registerErrorAlert", "User Already Exists");
  return res.redirect("/users/registerPage");}
  const userData = await User.create({
    username: username,
    password: password,
  });
  res.redirect("/users")
});

userRouter.post('/loginUser', passport.authenticate("local", {
  // login successfull ==> go to profile
  successRedirect: "/users/profile",
  // login unsuccessfull ==> go to home
  failureRedirect: "/users",
}), (req, res) => {
});

userRouter.get('/logoutUser', (req, res, next)=>{
  req.logout((err)=>{
      if(err){return next(err)};
      res.redirect('/users');
  });
});