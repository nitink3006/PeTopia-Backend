// Importing required modules and controllers
import express from "express"; // For creating and managing routes
import { genOtp, verifyOtp, forgotOtp } from "../Controller/OtpController.js"; // Importing OTP-related controller functions

// Initializing the router object to define routes
const router = express.Router();

// Route to generate an OTP
// Calls the 'genOtp' function to create an OTP for a user
router.post('/genotp', genOtp);

// Route to verify an OTP
// Calls the 'verifyOtp' function to validate the OTP provided by the user
router.post('/verifyotp', verifyOtp);

// Route to handle forgot password OTP
// Calls the 'forgotOtp' function to generate and send an OTP for password recovery
router.post('/forgototp', forgotOtp);

// Exporting the router object to use in other parts of the application
export default router;
