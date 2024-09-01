const HotelRoom = require("../models/hotelrooms");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose")

// Helper function to validate ObjectId
const isValidObjectId = (id) => {
  return /^[a-fA-F0-9]{24}$/.test(id);
};

exports.createHotelrooms = async (req, res) => {
  try {
  
    if (!isValidObjectId(req.body.hotel)) {
      return res.status(400).json({ success: false, message: "Invalid hotel ID format." });
    }

    
    const { hotel, name, description, price, standard, deluxe, suite, presidential } = req.body;
    if (!name || !description || !price) {
      return res.status(400).json({ success: false, message: "Name, description, and price are required." });
    }

   
    let image_filenames = req.files ? req.files.map((file) => file.path) : [];

    
    const hotelRoom = new HotelRoom({
      hotel: req.body.hotel,
      name: req.body.name,
      description: req.body.description,
      image: image_filenames,
      price: req.body.price,
      standard: req.body.standard === 'true',
      deluxe: req.body.deluxe === 'true',
      suite: req.body.suite === 'true',
      presidential: req.body.presidential === 'true',
    });

    
    await hotelRoom.save();
    res.json({ success: true, message: "Room Available Now" });
  } catch (error) {
    console.log("Create hotel room error:", error.message);
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

exports.getAllhotelrooms = async (req, res) => {
  try {
    const hotelRooms = await HotelRoom.find().populate('hotel');
    res.json({ success: true, data: hotelRooms });
  } catch (error) {
    console.log("Get all hotel rooms error:", error.message);
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

exports.getHotelRoomById = async (req, res) => {
  try {
    const { id } = req.params;

    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid room ID" });
    }

    const hotelRoom = await HotelRoom.findById(id).populate('hotel');
    if (!hotelRoom) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }

    res.json({ success: true, data: hotelRoom });
  } catch (error) {
    console.log("Get hotel room by ID error:", error.message);
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

exports.deleteHotelRoom = async (req, res) => {
  try {
    const hotelRoom = await HotelRoom.findById(req.body.id);
    if (!hotelRoom) {
      return res.status(404).json({ success: false, message: "Hotel room not found" });
    }

    
    if (hotelRoom.image && hotelRoom.image.length > 0) {
      hotelRoom.image.forEach((imgPath) => {
        fs.unlink(path.resolve(imgPath), (err) => {
          if (err) console.log("File deletion error:", err);
        });
      });
    }

    await HotelRoom.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Hotel Room Removed" });
  } catch (error) {
    console.log("Delete hotel room error:", error.message);
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};
