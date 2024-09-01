const profileModel = require("../models/profile")
const userSchema = require("../models/user");

const getProfile = async (req, res) => {
    try {
        const user = req.user;                                        // to get the user from the request
        const userDetails = await userSchema.findById(user._id);
        let profile = await profileModel.findOne({ userId: user._id });
        
        if (!profile) {
            
            profile = new profileModel({                   //this logic is for If no profile exists,then it should create one idea from  gbemi
                userId: user._id,
                firstName: userDetails.name,
                email: userDetails.email,
                address: userDetails.address
            });
            await profile.save();
        }
        console.log("Sending profile:", profile); 
        res.json({ 
            success: true, 
            profile: {
                ...profile.toObject(),
                image: profile.image // to ensure image is included
            }, 
            userDetails 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};


const updateProfile = async (req, res) => {
    console.log('Request file:', req.file);
    try {
        const user = req.user; 
        const { firstName, lastName, phone, address } = req.body;

        let image = req.file ? req.file.filename : null;        // Handle the case where req.file might be undefined

        let profile = await profileModel.findOne({ userId: user._id });

        if (profile) {
            profile.firstName = firstName || profile.firstName;
            profile.lastName = lastName || profile.lastName;
            profile.phone = phone || profile.phone;
            profile.address = address || profile.address;
            profile.image = image || profile.image;
            await profile.save();
        } else {
            profile = new profileModel({
                userId: user._id,
                firstName,
                lastName,
                phone,
                image,
                address
            });
            await profile.save();
        }

        res.json({ success: true, profile });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};


module.exports = { getProfile, updateProfile };
