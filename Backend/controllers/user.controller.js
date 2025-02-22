import User from "../models/user.model.js";
import jwt from "jsonwebtoken"
import bcrypt from 'bcrypt'
import validator from 'validator'
import express from 'express'

const app = express();
app.use(express.json());

//login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User doesn't exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        const token = createToken(user._id);

        res.json({ success: true, token });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' })
}

//register user
const registerUser = async (req, res) => {
    const { name, password, email } = req.body;

    try {
        // Check if email is provided and is a valid string
        if (!email || typeof email !== 'string') {
            return res.json({ success: false, message: "Email must be a valid string" });
        }

        // Validate email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }

        // Additional checks for password length and strength
        if (password.length < 8 || !/(?=.*[0-9])/.test(password) || !/(?=.*[a-z])/.test(password) || !/(?=.*[A-Z])/.test(password)) {
            return res.json({ success: false, message: "Password must be at least 8 characters long and contain a mix of uppercase, lowercase, and numbers" });
        }

        // Hashing user password and saving the user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name: name,
            email: email,
            password: hashedPassword,
        });

        const user = await newUser.save();
        const token = createToken(user._id);
        res.json({ success: true, token });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error during registration" });
    }
};


export { loginUser, registerUser };