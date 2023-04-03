const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const User = require('../models/User.js');

const router = express.Router();

// Register user
router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Utente già esistente!' });
        }
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);
        const user = await User.create({ email, password: hashedPassword });
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password, otp } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Credenziali errate!' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Credenziali errate!' });
        }
        if (otp !== user.otp) {
            return res.status(400).json({ message: 'Codice OTP non valido!' });
        }
        if (user.otpExpiration < Date.now()) {
            return res.status(400).json({ message: 'Codice OTP scaduto!' });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// Send OTP code
router.post('/otp', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Utente inesistente!' });
        }
        const otp = Math.floor(100000 + Math.random() * 900000);
        const transporter = nodemailer.createTransport({
            host: 'smtp.zoho.eu',
            port: 465,
            secure: true, //ssl
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'One-Time Password',
            text: `Il tuo codice OTP è ${otp}. Questo codice scadrà tra 5 minuti.`,
            html: `<p>Il tuo codice OTP è: <h2>${otp}</h2> Questo codice scadrà tra 5 minuti</p>`
        };
        await transporter.sendMail(mailOptions);
        const otpExpiration = new Date();
        otpExpiration.setMinutes(otpExpiration.getMinutes() + 5);
        await User.findOneAndUpdate({ email }, { otp, otpExpiration }, { new: true });
        res.json({ message: 'OTP code sent' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// Verify token to access control
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.status(401).json({ error: 'Non autorizzato' });
        return;
    };

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            res.status(401).json({ error: 'Non autorizzato' });
            return;
        }
        req.userId = decoded.id;
        next();
    })
};

router.get('/verify_token', verifyToken, (req, res) => {
    res.json({ message: 'Protected route' })
});

module.exports = router;
