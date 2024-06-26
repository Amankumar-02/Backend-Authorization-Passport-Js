import passport from "passport";
import { Router } from "express";
import { OAuth } from "../model/oAuth.model.js";

export const oAuthRouter = Router();
oAuthRouter.get('/google',
  passport.authenticate('google', { scope: ['profile'] 
}));

oAuthRouter.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/auth/google/failure', successRedirect: "/auth/protected" }
));

oAuthRouter.get("/google/failure", (req, res)=>{
  res.send("Something went wrong!!")
});

oAuthRouter.get("/protected", (req, res, next)=>{
  req.user? next() : res.sendStatus(401)
}, async(req, res)=>{
  const exists = await OAuth.findOne({username:req.user.displayName});
  if(!exists){
    const userData = await OAuth.create({
      _id: req.user.id,
      username: req.user.displayName,
      photos: req.user.photos[0].value || "",
      provider: req.user.provider,
    });
  }
  res.redirect("/users/profile")
});



oAuthRouter.get('/github',
  passport.authenticate('github', { scope: ['user:email'] 
}));

oAuthRouter.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: '/auth/github/failure', successRedirect: "/auth/github/protected" }
));

oAuthRouter.get("/github/failure", (req, res)=>{
  res.send("Something went wrong!!")
});

oAuthRouter.get("/github/protected", (req, res, next)=>{
  req.user? next() : res.sendStatus(401)
}, async(req, res)=>{
  const exists = await OAuth.findOne({username:req.user.displayName});
  if(!exists){
    const userData = await OAuth.create({
      _id: req.user.id,
      username: req.user.displayName,
      photos: req.user.photos[0].value || "",
      provider: req.user.provider,
    });
  }
  res.redirect("/users/profile")
});