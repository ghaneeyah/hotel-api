const mongoose = require("mongoose")

const hotelroomsSchema = new mongoose.Schema({
   hotel:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hotel",
        required: true
    },
    name: {type: String, required: true},
    image: {type: Array, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    standard: {
        type: Boolean,
         default: false
    },
    deluxe: {
        type: Boolean,
         default: false
    },
    suite: {
        type: Boolean,
         default: false
    },
    presidential: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})

module.exports = mongoose.model("hotelRooms", hotelroomsSchema)

