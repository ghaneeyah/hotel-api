const express = require ("express")
const hotelController = require("../controllers/hotelController")
const multer = require("multer")



const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});


const upload = multer({ storage: storage }).fields([
  { name: "image", maxCount: 1 },     // Only one main image
  { name: "gallery", maxCount: 5 }  // Up to 5 images in the gallery
]);

router.post("/create", upload, (req, res, next) => {
  console.log('Received request body:', req.body);
  console.log('Received files:', req.files); 
  next();
}, hotelController.createHotel);

router.get("/list", hotelController.listHotels);
router.get('/:id', hotelController.getHotelById);
router.delete("/delete", hotelController.removeHotel);

module.exports = router;



