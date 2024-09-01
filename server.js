const dotenv = require("dotenv");
dotenv.config();

const express = require("express")
const cors = require("cors")
const connectDB = require("./config/db")
const hotelroomsRoute = require("./routes/hotelroomsRoute")
const profileRoute = require ("./routes/profileRoute") 
const userRoute = require("./routes/userRoute")
const hotelRoute = require("./routes/hotelRoute")
const bookingRoute = require("./routes/bookingRoute")
const paymentRoute = require("./routes/paymentRoute")
const emailRoute = require("./routes/emailRoute")
const cookieparser = require("cookie-parser")
const path = require("path")


connectDB();


// mongoose.connect(db.mongoURI)
// .then(()=> console.log("MongoDB connection successful"))
// .catch(error=> console.error("mongodb connection error",error))


const app = express()

app.use(express.json())
app.use(cors({
    origin: ["http://localhost:5173"],
    allowedHeaders: ["Content-Type", "Authorization", "auth-token"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], 
    credentials: true
}));

// app.use("uploads", express.static('uploads'))
app.use(cookieparser())

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static('public'));

app.use("/api/user", userRoute)
app.use("/api", profileRoute)
app.use("/api/hotel", hotelRoute)
app.use("/api/hotelrooms", hotelroomsRoute)
app.use('/api/bookings', bookingRoute);
app.use("/api/payment", paymentRoute)
app.use('/api/email', emailRoute);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.json({ message: 'Something went wrong!' });
  });
  

const port = 5000
app.listen(port, ()=> console.log(`You are listening on port ${port}`))

if (!process.env.JWT_SECRET_KEY) {
    console.error("JWT_SECRET_KEY is not set in the environment variables!");
    process.exit(1);
  }