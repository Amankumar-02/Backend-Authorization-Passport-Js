import { Strategy as LocalStrategy } from "passport-local";
import { User } from "./model/user.model.js";
import bcrypt from 'bcrypt';

export const initializingPassport = (passport)=>{
    passport.use(new LocalStrategy(async function(username, password, done){
        try {
            const user = await User.findOne({username});
            // no error and no user
            if(!user) return done(null, false);
            // no error and password incorrect
            // if(user.password !== password) return done(null, false);
            const checkPassword = await bcrypt.compare(password, user.password);
            // no error and password incorrect
            if(!checkPassword){
                return done(null, false)
            };
            return done(null, user);
        } catch (error) {
            return done(error, false);
        }
    }));
    passport.serializeUser((user, done)=>{
        done(null, user.id);
    });
    passport.deserializeUser(async(id, done)=>{
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (error) {
            done(error, false);
        }
    });
};

export const isLoggedIn = (req, res, next)=>{
    if(req.isAuthenticated("local")){
        return next();
    }
    res.redirect("/users");
  };

export const isLoggedOut = (req, res, next)=>{
    if(req.isAuthenticated("local")){
        res.redirect("/users/profile");
    }else{
        return next();
    }
  };