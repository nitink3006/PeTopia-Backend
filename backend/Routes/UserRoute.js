// Importing the express module for creating and managing routes
import express from "express";

// Importing controller functions for handling user-related operations
import { loginUser, signupUser, updateUser, updatePassword } from "../Controller/UserController.js";

// Initializing the router object to define routes
const router = express.Router();

// Route for user login
// This route handles POST requests to '/login' and invokes the loginUser controller
router.post('/login', loginUser);

// Route for user signup/registration
// This route handles POST requests to '/signup' and invokes the signupUser controller
router.post('/signup', signupUser);

// Route for updating user details
// This route handles PUT requests to '/update' and invokes the updateUser controller
router.put('/update', updateUser);

// Route for updating user password
// This route handles PUT requests to '/update-password' and invokes the updatePassword controller
router.put('/update-password', updatePassword);

// Exporting the router object so it can be used in other parts of the application
export default router;
