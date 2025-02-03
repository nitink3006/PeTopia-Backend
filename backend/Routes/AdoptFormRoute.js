// Importing required modules and controllers
import express from "express"; // Express for creating and managing routes
import { saveForm, getAdoptForms, deleteForm, deleteAllRequests } from "../Controller/AdoptFormController.js"; // Importing the controller functions for managing adoption forms

// Initializing the router object to define routes
const router = express.Router();

// Route to save a new adoption form
// Calls the 'saveForm' function to create a new adoption form based on the request data
router.post('/save', saveForm);

// Route to get all adoption forms
// Calls the 'getAdoptForms' function to retrieve all adoption forms from the database
router.get('/getForms', getAdoptForms);

// Route to reject and delete a specific adoption form by ID
// Calls the 'deleteForm' function to delete the form with the given ID
router.delete('/reject/:id', deleteForm);

// Route to delete all adoption forms related to a specific pet by pet ID
// Calls the 'deleteAllRequests' function to delete all forms associated with the given pet ID
router.delete('/delete/many/:id', deleteAllRequests);

// Exporting the router object to use in other parts of the application
export default router;
