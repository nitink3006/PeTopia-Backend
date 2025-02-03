// Importing required modules
import mongoose from "mongoose"; // For database schema and interactions
import bcrypt from "bcryptjs"; // For hashing passwords
import validator from "validator"; // For validating email and password strength
import nodemailer from "nodemailer"; // For sending emails

const Schema = mongoose.Schema;

// Defining the User schema with fields for name, email, and password
const UserSchema = new Schema({
    name: {
        type: String,
        required: true, // Name is mandatory
    },
    email: {
        type: String,
        required: true, // Email is mandatory
        unique: true, // Email must be unique across users
    },
    password: {
        type: String,
        required: true, // Password is mandatory
    },
}, { timestamps: true }); // Automatically adds `createdAt` and `updatedAt` timestamps

// Static method for user signup
UserSchema.statics.signup = async function (name, email, password) {
    // Check if the email already exists in the database
    const exits = await this.findOne({ email });
    if (exits) {
        throw Error('Email Already in Use'); // Throw error if the email is taken
    }

    // Validate input fields
    if (!name || !email || !password) {
        throw Error('All fields must be filled'); // Ensure no field is empty
    }
    if (!validator.isEmail(email)) {
        throw Error('Email not valid'); // Check if email format is valid
    }
    if (!validator.isStrongPassword(password)) {
        throw Error('Password not strong enough'); // Check password strength
    }

    // Hash the password using bcrypt before saving to the database
    const salt = await bcrypt.genSalt(10); // Generate a salt
    const hash = await bcrypt.hash(password, salt); // Hash the password with the salt

    // Create a new user document in the database
    const user = await this.create({ name, email, password: hash });

    // Email setup: Creating a transporter using Gmail
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Specify email service
        auth: {
            user: process.env.EMAIL_USER, // Your email from environment variable
            pass: process.env.EMAIL_APP_PASS, // App password from environment variable
        },
    });

    // Email options: Defining the welcome email content
    const mailOptions = {
        from: process.env.EMAIL_USER, // Sender email
        to: email, // Recipient email
        subject: 'Welcome to PeTopia!', // Email subject
        text: `Hello ${name},\n\nWelcome to PeTopia!\n\nWe’re so excited to have you as part of our growing family of pet lovers. Whether you're looking to find a loving home for your pet or hoping to adopt your next furry friend, you’ve come to the right place.\n\nStart exploring today and discover how PeTopia makes connecting pets with loving homes easier than ever. If you have any questions or need support, our team is always here to help.\n\nThank you for being a part of this incredible journey with us!\n\nPaws and hugs,\nThe PeTopia Team`, // Email body
    };

    // Try to send the welcome email
    try {
        await transporter.sendMail(mailOptions); // Sends the email
    } catch (error) {
        console.error('Error sending welcome email:', error); // Log any errors during email sending
    }

    return user; // Return the newly created user object
};

// Static method for user login
UserSchema.statics.login = async function (email, password) {
    // Validate input fields
    if (!email || !password) {
        throw Error('All fields must be filled'); // Ensure both email and password are provided
    }
    if (!validator.isEmail(email)) {
        throw Error('Email not valid'); // Check if the email format is valid
    }

    // Find the user by email in the database
    const user = await this.findOne({ email });
    if (!user) {
        throw Error('User not Found'); // Throw error if no user is found
    }

    // Compare the provided password with the hashed password stored in the database
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        throw Error('Incorrect Password'); // Throw error if passwords do not match
    }

    return user; // Return the authenticated user object
};

// Exporting the User model based on the schema
export default mongoose.model('User', UserSchema); // Use export default

