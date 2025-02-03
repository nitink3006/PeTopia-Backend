// Importing required modules and controllers
import express from "express"; // Express for creating and managing routes
import { userRegistration, petTypes } from "../Controller/Dashboard.js"; // Importing controller functions for dashboard-related data

// Initializing the router object to define routes
const router = express.Router();

// Route to get the total number of user registrations
// Calls the 'userRegistration' function, which calculates and returns the total count of registered users
router.get('/user-registrations', userRegistration);

// Route to get the count of pets grouped by their types
// Calls the 'petTypes' function, which retrieves and groups pet data based on their types
router.get('/pet-types', petTypes);

// Exporting the router object to be used in other parts of the application
export default router;
