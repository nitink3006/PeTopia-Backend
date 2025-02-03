// Importing required modules and dependencies
import User from "../Model/UserSchema.js"; // Importing the User model for database operations
import jwt from "jsonwebtoken"; // For creating and verifying JSON Web Tokens
import validator from "validator"; // For validating inputs (like email, password)
import bcrypt from "bcryptjs"; // For hashing passwords securely

// Function to create a JSON Web Token
const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '10d' }); // Signing the token with a secret and setting an expiration of 10 days
};

// Controller to handle user login
const loginUser = async (req, res) => {
    const { email, password } = req.body; // Extracting email and password from request body
    try {
        // Attempting to log in the user using a custom login method from the User model
        const user = await User.login(email, password);
        const userName = user.name; // Getting the user's name
        const token = createToken(user._id); // Generating a token for the logged-in user
        res.status(200).json({ userName, email, token }); // Sending a success response with user details and token
    } catch (error) {
        res.status(400).json({ error: error.message }); // Sending an error response if login fails
    }
};

// Controller to handle user signup
const signupUser = async (req, res) => {
    const { name, email, password } = req.body; // Extracting name, email, and password from request body
    try {
        // Attempting to sign up the user using a custom signup method from the User model
        const user = await User.signup(name, email, password);
        const userName = user.name; // Getting the user's name
        const token = createToken(user._id); // Generating a token for the new user
        res.status(200).json({ userName, email, token }); // Sending a success response with user details and token
    } catch (error) {
        res.status(400).json({ error: error.message }); // Sending an error response if signup fails
    }
};

// Controller to handle user profile update (name and email)
const updateUser = async (req, res) => {
    const { name, email, newEmail } = req.body; // Extracting fields from request body

    try {
        if (!name || !email || !newEmail) { // Ensuring all fields are provided
            throw Error('All fields must be filled');
        }

        const user = await User.findOne({ email }); // Checking if the user exists in the database

        if (!user) {
            throw Error('User not found');
        }

        if (user.name === name && user.email === newEmail) { // Checking if there are no changes
            throw Error('No changes detected');
        }

        if (!validator.isEmail(newEmail)) { // Validating the new email format
            throw Error('New email is not valid');
        }

        if (user.email !== newEmail) { // Ensuring the new email is not already in use
            const exists = await User.findOne({ email: newEmail });
            if (exists) {
                throw Error('Email already in use');
            }
        }

        // Updating user details
        user.name = name;
        user.email = newEmail;

        const updatedUser = await user.save(); // Saving the updated user details to the database

        res.status(200).json({ updatedUser }); // Sending a success response with updated user details
    } catch (error) {
        res.status(400).json({ error: error.message }); // Sending an error response if the update fails
    }
};

// Controller to handle password updates
const updatePassword = async (req, res) => {
    const { email, newPassword, newConfirmPassword } = req.body; // Extracting fields from request body
    try {
        if (!email || !newPassword || !newConfirmPassword) { // Ensuring all fields are provided
            throw Error('All fields must be filled');
        }

        if (!validator.isStrongPassword(newPassword)) { // Validating the strength of the new password
            throw Error('Password not strong enough');
        }

        if (!(newPassword === newConfirmPassword)) { // Checking if the new password and confirmation match
            throw Error('Both passwords do not match');
        }

        const exists = await User.findOne({ email }); // Checking if the user exists in the database

        if (!exists) {
            throw Error('Email not found');
        }

        const match = await bcrypt.compare(newPassword, exists.password); // Ensuring the new password is not the same as the old one
        if (match) {
            throw Error("You can't reuse your old password");
        }

        // Hashing the new password and updating it in the database
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(newPassword, salt);
        exists.password = hashed;
        const updatedUser = await exists.save(); // Saving the updated user details

        res.status(200).json({ success: true, email: updatedUser.email }); // Sending a success response with updated user email
    } catch (error) {
        res.status(400).json({ error: error.message }); // Sending an error response if the update fails
    }
};

// Exporting the controller functions for use in routes
export { loginUser, signupUser, updateUser, updatePassword };
