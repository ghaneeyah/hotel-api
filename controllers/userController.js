const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const userSchema = require("../models/user");
const transporter = require("../config/nodemailer");  // Import transporter
const { v4 : uuidv4 } = require("uuid");       // Import uuid for generating tokens


const createToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
};

exports.registerUser = async (req, res) => {
  const { UserName, email, password } = req.body;

  try {
    const exist = await userSchema.findOne({ email });
    if (exist) {
      return res.json({ success: false, message: "User already exists" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please provide a valid email" });
    }
    

    if (password.length < 8) {
      return res.json({ success: false, message: "Please enter a strong password" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const verificationToken = uuidv4(); 

    const newUser = new userSchema({
      UserName,
      email,
      password: hashedPassword,
      verificationToken, 
      isVerified: false
    });
    const User = await newUser.save();

  
    const token = createToken(User._id);

    const verificationUrl = `${process.env.FRONTEND_URL}/api/email/verify/${verificationToken}`;
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Email Verification',
            text: `Please verify your email by clicking the link: ${verificationUrl}`
        };

        await transporter.sendMail(mailOptions);

      res.json({ success: true, message: "Registration Successful", token, user: User });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userSchema.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }

   
    const token = createToken(user._id);

    res.json({ success: true, message: "You are now logged in", token, user });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};
