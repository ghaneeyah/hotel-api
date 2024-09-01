const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
 
const userSchema = new mongoose.Schema({
    UserName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true},
    img: { type: String, default: "uploads/avater.png" },
    role: { type: String, enum: ["admin", "client"], default: "client"},
});

userSchema.methods.generateAuthToken = function (){
    const token = jwt.sign(
        {id: this._id, role: this.role },
        process.env.JWT_SECRET_KEY
    );
    
    return token
};

module.exports = mongoose.model("User", userSchema)

