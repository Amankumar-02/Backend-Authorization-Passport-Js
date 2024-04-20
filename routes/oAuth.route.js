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

// {
//   id: '108661269875854717495',
//   displayName: 'Movies mkv',
//   name: { familyName: 'mkv', givenName: 'Movies' },
//   photos: [
//     {
//       value: 'https://lh3.googleusercontent.com/a/ACg8ocIWAz6RESgJ-Yf6JykxSgYDRuAZpnVfPgFLXG3RJX5FusIF1g=s96-c'
//     }
//   ],
//   provider: 'google',
//   _raw: '{\n' +
//     '  "sub": "108661269875854717495",\n' +
//     '  "name": "Movies mkv",\n' +
//     '  "given_name": "Movies",\n' +
//     '  "family_name": "mkv",\n' +
//     '  "picture": "https://lh3.googleusercontent.com/a/ACg8ocIWAz6RESgJ-Yf6JykxSgYDRuAZpnVfPgFLXG3RJX5FusIF1g\\u003ds96-c",\n' +
//     '  "locale": "en"\n' +
//     '}',
//   _json: {
//     sub: '108661269875854717495',
//     name: 'Movies mkv',
//     given_name: 'Movies',
//     family_name: 'mkv',
//     picture: 'https://lh3.googleusercontent.com/a/ACg8ocIWAz6RESgJ-Yf6JykxSgYDRuAZpnVfPgFLXG3RJX5FusIF1g=s96-c',
//     locale: 'en'
//   }
// }