const express = require("express");
const hotelroomsController = require("../controllers/hotelroomsController");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

const router = express.Router();


router.post("/build", upload.array("image", 10), hotelroomsController.createHotelrooms);


router.get("/get", hotelroomsController.getAllhotelrooms);


router.get("/:id", hotelroomsController.getHotelRoomById);


router.delete("/delete", hotelroomsController.deleteHotelRoom);

module.exports = router;


