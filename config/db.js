const mongoose = require ("mongoose")
const dotenv = require("dotenv")


dotenv.config();

const connectDB = async () =>{
    await mongoose.connect('mongodb+srv://sakaganiyat183:TbflsLyYH1RwNk3s@clustertechnotronix.ldhcgir.mongodb.net/hotel-api').then (() => console.log("DB Connected"));
}


module.exports = connectDB;

