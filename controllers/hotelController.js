const Hotel = require("../models/hotel");
const fs = require("fs");
const path = require("path");
const mongoose = require('mongoose')


const normalizePath = (filePath) => path.normalize(filePath).replace(/\\/g, '/');

exports.createHotel = async (req, res) => {
  try {
    let image_filename;
    if (req.files.image && req.files.image.length > 0) {
      image_filename = normalizePath(req.files.image[0].path);
    } else {
      return res.status(400).json({ success: false, message: "Main image (image) is required." });
    }

    const parsedAddress = JSON.parse(req.body.address);
    const parsedAmenities = JSON.parse(req.body.amenities);

    const hotel = new Hotel({
      name: req.body.name,
      description: req.body.description,
      image: image_filename, 
      address: parsedAddress,
      amenities: parsedAmenities,
    });

    await hotel.save();
    res.json({ success: true, message: "Hotel Added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error", error: error.message });
  }
};

exports.listHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find({});
    res.json({ success: true, data: hotels });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error", error: error.message });
  }
};

exports.getHotelById = async (req, res) => {
  const { id } = req.params; // Extract the _id from the request parameters

  // Check if id is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid hotel ID' });
  }

  try {
     
      const hotel = await Hotel.findById(id);

      if (!hotel) {
          return res.status(404).json({ message: 'Hotel not found' });
      }

      res.status(200).json(hotel);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
};

exports.removeHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.body.id);

    if (hotel.image) {
      const imagePath = normalizePath(hotel.image);
      fs.unlink(imagePath, (err) => {
        if (err) console.log("Error deleting image file:", err);
      });
    }

    await Hotel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Hotel Removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error", error: error.message });
  }
};
