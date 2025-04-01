const mongoose = require('mongoose')
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5
    },
    role: {
        type: String,
        required: [true, 'Role is required'],
        enum: ["user", "admin"],
        default: "user"
    },
    createdAt: { type: Date, default: Date.now }
})

userSchema.pre('save', async function (next) {
    if (!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password, 10);
    next()
})

userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.methods.generateToken = function () {
    return jwt.sign({ id: this._id ,role:this.role  }, process.env.JWT_SECRET, { expiresIn: '1hr' })
}

module.exports = mongoose.model('User', userSchema)