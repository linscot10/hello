const express = require('express')
const UserModel = require('../models/User.model')
const authMiddleware = require("../middlewares/authMiddlewares")
require('dotenv').config()

const router = express.Router()

router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body
        const userExists = await UserModel.findOne({ email })
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: "User with this email already exists"
            })
        }


        const user = new UserModel({ name, email, password })
        await user.save()

        const token = user.generateToken()
        if (user) {
            res.status(201).json({
                success: true,
                message: "User created successfully",
                user,
                token
            })
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error });
    }
})

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            })
        }

        const isMatch = await user.comparePassword(password)
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            })
        }
        const token = await user.generateToken()
        res.status(201).json({
            success: true,
            message: "logged in successfully",
            user,
            token
        })
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error });
    }
})


router.get('/', async (req, res) => {
    try {
        // const users = await UserModel.find();
        const users = await UserModel.find().select('-password'); // Exclude password field
        const userCount = await UserModel.countDocuments();
        res.status(200).json({

            success: true,
            message: "Users fetched successfully",
            userCount: userCount,
            users: users
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error });
    }
})


router.get("/profile", authMiddleware, async (req, res) => {
    try {
        const user = await UserModel.findById(req.user.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});


router.get("/:id", async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id)
        if (!user) {
            res.status(404).json({

                success: false,
                message: "User Not Found",
                user: user
            })
        }
        res.status(200).json({

            success: true,
            message: "User fetched successfully",
            users: user
        })

    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error });
    }
})


router.put("/:id", async (req, res) => {
    try {
        const { name, email } = req.body
        const updatedUser = await UserModel.findByIdAndUpdate(
            req.params.id,
            { name, email },
            { new: true })

        if (!updatedUser) return res.status(404).json({ message: "User not found" });
        res.status(200).json({

            success: true,
            message: "User fetched successfully",
            updatedUser: updatedUser
        })
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error });
    }
})
router.delete("/:id", async (req, res) => {
    try {
        // const { name, email } = req.body
        const deletedUser = await UserModel.findByIdAndDelete(req.params.id)
        if (!deletedUser) return res.status(404).json({ message: "User not found" });
        res.status(200).json({

            success: true,
            message: "User deleted successfully",
            updatedUser: deletedUser
        })
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error });
    }
})


module.exports = router
