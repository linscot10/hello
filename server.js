const express = require('express')
const bcrypt = require('bcryptjs')
const cors = require('cors')
const mongoose = require('mongoose')
const userRoute = require('./routes/userRoute')
require('dotenv').config()

const connectDB = require('./database/db')

const app = express()
app.use(express.json())
app.use(cors())
const PORT = process.env.PORT || 4000

// mongoose.connect(process.env.PORT)
//     .then(() => console.log("MongoDB Connected"))
//     .catch((err) => console.error("DB Connection Error:", err))

app.use("/api/users", userRoute)

connectDB()

app.listen(PORT, () => {
    console.log(`server is running on port http://localhost:${PORT}`);

})