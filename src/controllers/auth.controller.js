
require('dotenv').config();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../models/User.js');
const asyncHandler = require('../services/asyncHandler.js');
const CustomError = require('../services/customError.js');

export const signUp = asyncHandler(async(req, res) => {
    const {name, email, password} = req.body;

    if (!name || !email || !password) {
        throw new CustomError ('Please Fill All The Fields', 400);
    }
    if (password.length < 8) {
        throw new CustomError('Password must be of 8 characters', 400);
    }

    const existingUser = await User.findOne({email})

    if (existingUser) {
        throw new CustomError('User already exists', 400)
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await User.create({
        name,
        email,
        password: hashedPassword
    })
    const token = jwt.sign({
        email: user.email,
        id: user._id,
    }, 'test', {expiresIn: '1y'})

    res.cookie("token", token)

    res.status(200).json({
        success: true,
        token,
        result: user
    })
})


export const logIn = asyncHandler( async(req, res) => {
    const {email, password} = req.body;

    if (!email || !password) {
        throw new CustomError('Provide Email and Password', 400);
    }

    const user = User.findOne({email}).select("+password");

    if (!user) {
        throw new CustomError("Invalid credentials! Please try again.", 400);
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (isPasswordMatched) {
        const token = jwt.sign({
            email: user.email,
            id: user._id,
        }, process.env.JWT_SECRET, {expiresIn: '1y'})
        res.cookie('token', token);
        res.status(200).json({
            success: true,
            token,
            result: user
        })
    }
    throw new CustomError('Incorrect password', 400)
} )


export const logOut = asyncHandler(async(req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: 'Logged Out'
    })
})