import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
// import plm from 'passport-local-mongoose';

const userSchema = new Schema({
    // username: String,
    username: String,
    // fullname: String,
    password: String,
}, {timestamps:true});

// userSchema.plugin(plm);

// before user create encrypt the password
userSchema.pre("save", async function(next){
    if(!this.isModified("password")){return next()};
    this.password = await bcrypt.hash(this.password, 10);
    return next();
});

export const User = mongoose.model("user", userSchema);