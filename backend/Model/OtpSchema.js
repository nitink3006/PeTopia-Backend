// Importing required modules
import mongoose from 'mongoose'; // For defining the database schema and interactions
import bcrypt from "bcryptjs"; // For hashing OTP codes
import validator from "validator"; // For email validation
import crypto from "crypto"; // For generating secure random OTPs
import nodemailer from "nodemailer"; // For sending emails
import User from "./UserSchema.js"; // Importing the User model

// Defining the OTP schema
const otpSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Name of the user requesting the OTP
  },
  email: {
    type: String,
    required: true, // Email address for OTP delivery
    unique: true, // Ensures only one OTP entry per email at a time
  },
  otpCode: {
    type: String,
    required: true, // Hashed OTP code
  },
  expiresAt: {
    type: Date,
    required: true, // Expiry time for the OTP
  }
});

// Static method to generate an OTP for a new user
otpSchema.statics.genOtp = async function (name, email, password) {
  const exists = await User.findOne({ email }); // Check if the email already exists
  if (exists) {
    throw Error('Email already in use'); // Prevent duplicate user creation
  }

  // Validate input fields
  if (!name || !email || !password) {
    throw new Error('All fields must be filled');
  }
  if (!validator.isEmail(email)) {
    throw new Error('Email not valid');
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error('Password not strong enough');
  }

  // Check for existing OTP entry and expiration
  const existingOtp = await this.findOne({ email });
  if (existingOtp) {
    if (existingOtp.expiresAt > Date.now()) {
      // Calculate remaining time for the existing OTP
      const timeRemainingMs = existingOtp.expiresAt - Date.now();
      const minutesRemaining = Math.floor(timeRemainingMs / 1000 / 60);
      const secondsRemaining = Math.floor((timeRemainingMs / 1000) % 60);
      throw new Error(`An OTP has already been sent. Please wait ${minutesRemaining} minute(s) and ${secondsRemaining} second(s) before requesting again.`);
    } else {
      await this.deleteOne({ email }); // Remove expired OTP
    }
  }

  // Generate a random OTP
  const otp = crypto.randomInt(100000, 999999).toString();

  // Hash the OTP for secure storage
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(otp, salt);

  // Set the OTP expiration time (10 minutes)
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  // Save the OTP entry in the database
  const userOtp = await this.create({ name, email, otpCode: hash, expiresAt });

  // Configure email transport
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASS
    }
  });

  // Define email content
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'PeTopia - Your OTP Code',
    text: `Dear ${name},\n\nYour OTP code is: ${otp}\n\nIt will expire in 10 minutes.`
  };

  // Send the email
  try {
    await transporter.sendMail(mailOptions);
    return userOtp; // Return the OTP entry
  } catch (error) {
    console.error('Error sending OTP email:', error);
    await this.deleteOne({ email }); // Cleanup the OTP if sending fails
    throw new Error('Failed to send OTP email');
  }
};

// Static method to verify the OTP
otpSchema.statics.verifyOtp = async function (email, otp) {
  // Validate input fields
  if (!email || !otp) {
    throw new Error('All fields must be filled');
  }

  // Find the OTP entry for the given email
  const userOtp = await this.findOne({ email });
  if (!userOtp) {
    throw new Error('OTP not found for this email');
  }

  // Check if the OTP has expired
  if (userOtp.expiresAt < Date.now()) {
    await this.deleteOne({ email }); // Remove expired OTP
    throw new Error('OTP has expired');
  }

  // Compare the provided OTP with the hashed OTP
  const isMatch = await bcrypt.compare(otp, userOtp.otpCode);
  if (!isMatch) {
    throw new Error('Incorrect OTP');
  }

  await this.deleteOne({ email }); // Remove OTP after successful verification
  return { success: true, message: 'OTP verified successfully' };
};

// Static method to handle forgotten password OTP generation
otpSchema.statics.forgotOtp = async function (email) {
  // Validate input fields
  if (!email) {
    throw new Error('Email is required');
  }
  if (!validator.isEmail(email)) {
    throw new Error('Email not valid');
  }

  // Check if the user exists
  const exists = await User.findOne({ email });
  if (!exists) {
    throw new Error('Email not found');
  }

  // Check for existing OTP entry and expiration
  const existingOtp = await this.findOne({ email });
  if (existingOtp) {
    if (existingOtp.expiresAt > Date.now()) {
      // Calculate remaining time for the existing OTP
      const timeRemainingMs = existingOtp.expiresAt - Date.now();
      const minutesRemaining = Math.floor(timeRemainingMs / 1000 / 60);
      const secondsRemaining = Math.floor((timeRemainingMs / 1000) % 60);
      throw new Error(`An OTP has already been sent. Please wait ${minutesRemaining} minute(s) and ${secondsRemaining} second(s) before requesting again.`);
    } else {
      await this.deleteOne({ email }); // Remove expired OTP
    }
  }

  // Generate a random OTP
  const otp = crypto.randomInt(100000, 999999).toString();

  // Hash the OTP for secure storage
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(otp, salt);

  // Set the OTP expiration time (10 minutes)
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  // Save the OTP entry in the database
  const userOtp = await this.create({ name: exists.name, email, otpCode: hash, expiresAt });

  // Configure email transport
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASS
    }
  });

  // Define email content
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'PeTopia - Reset Your Password',
    text: `Dear ${exists.name},\n\nYou requested to reset your password. Your OTP code is: ${otp}\n\nPlease use this code within 10 minutes to reset your password.\n\nIf you did not request this, please ignore this email.`
  };

  // Send the email
  try {
    await transporter.sendMail(mailOptions);
    return userOtp; // Return the OTP entry
  } catch (error) {
    console.error('Error sending OTP email:', error);
    await this.deleteOne({ email }); // Cleanup the OTP if sending fails
    throw new Error('Failed to send OTP email');
  }
};

// Exporting the OTP model
export default mongoose.model('Otp', otpSchema); // Use export default for ES Modules

