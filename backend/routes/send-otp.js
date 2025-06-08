// routes/sendOtp.js
const express = require('express');
const sgMail = require('@sendgrid/mail');
const { randomInt } = require('crypto');
const PendingUser = require('../models/PendingUser');

const router = express.Router();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

router.post('/', async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    const code = String(randomInt(100000, 999999));
    const expires = Date.now() + 10 * 60 * 1000;

    await PendingUser.findOneAndUpdate(
      { email },
      { email, code, expires },
      { upsert: true, new: true }
    );

    await sgMail.send({
      to: email,
      from: process.env.SENDGRID_FROM,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${code}. It will expire in 10 minutes.`,
      html: `<p>Your OTP code is <strong>${code}</strong>. It will expire in 10 minutes.</p>`,
    });

    return res.status(200).json({ success: true, message: 'OTP sent' });
  } catch (error) {
    console.error('SendGrid error:', error);
    return res.status(500).json({ error: 'Failed to send OTP' });
  }
});

module.exports = router;
