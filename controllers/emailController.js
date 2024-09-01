const userSchema = require("../models/user");




 const verifyEmail = async (req, res) => {
    const { token } = req.params;

    try {
        const user = await userSchema.findOne({ verificationToken: token });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid verification token.' });
        }

        user.isVerified = true;
        user.verificationToken = null; 
        await user.save();

        res.redirect(`${process.env.FRONTEND_URL}/login`);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


module.exports = {verifyEmail};