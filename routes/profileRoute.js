const express = require('express');
const profileController = require('../controllers/profileController');
const auth = require('../middleware/Auth'); 
const multer = require('multer') 

const router = express.Router();

const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}_${file.originalname}`)
    }
})

const upload = multer({storage:storage})

router.get("/profile", auth, profileController.getProfile);
router.post("/profile/update", auth, upload.single("image"), profileController.updateProfile); 



module.exports = router;
