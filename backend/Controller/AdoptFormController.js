// Importing the AdoptForm model to interact with the adoption form data in the database
import AdoptForm from "../Model/AdoptFormSchema.js";
import express from "express";

// Handler to save a new adoption form submitted by the user
const saveForm = async (req, res) => {
    try {
        // Extracting form fields from the request body
        const { email, livingSituation, phoneNo, previousExperience, anyPet, petId, fee } = req.body;

        // Creating a new adoption form entry in the database
        const form = await AdoptForm.create({ email, livingSituation, phoneNo, previousExperience, anyPet, petId, fee });

        // Responding with the saved form data upon successful creation
        res.status(200).json(form);
    } catch (err) {
        // Responding with an error message if form saving fails
        res.status(400).json({ message: err.message });
    }
};

// Handler to fetch all adoption forms from the database, sorted by creation date
const getAdoptForms = async (req, res) => {
    try {
        // Fetching and sorting all adoption forms in descending order of creation date
        const forms = await AdoptForm.find().sort({ createdAt: -1 });

        // Responding with the list of adoption forms
        res.status(200).json(forms);
    } catch (err) {
        // Responding with an error message if fetching forms fails
        res.status(400).json({ message: err.message });
    }
};

// Handler to delete a specific adoption form by its ID
const deleteForm = async (req, res) => {
    try {
        // Extracting the form ID from request parameters
        const { id } = req.params;

        // Finding and deleting the adoption form by ID
        const form = await AdoptForm.findByIdAndDelete(id);

        // Checking if the form was found and deleted, else responding with a not found message
        if (!form) {
            return res.status(404).json({ message: 'Form not found' });
        }

        // Responding with a success message after deletion
        res.status(200).json({ message: 'Form deleted successfully' });
    } catch (err) {
        // Responding with an error message if form deletion fails
        res.status(400).json({ message: err.message });
    }
};

// Handler to delete all adoption forms related to a specific pet ID
const deleteAllRequests = async (req, res) => {
    try {
        // Extracting the pet ID from request parameters
        const { id } = req.params;

        // Deleting all adoption forms related to the specified pet ID
        const result = await AdoptForm.deleteMany({ petId: id });

        // If no forms were deleted, respond with an error message
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Forms not found' });
        }

        // Responding with a success message after deletion of all forms
        res.status(200).json({ message: 'Forms deleted successfully' });
    } catch (error) {
        // Responding with an error message if deletion fails
        res.status(400).json({ message: error.message });
    }
};

// Exporting the handlers to be used in other parts of the application
export{
    saveForm,         // Exporting saveForm handler
    getAdoptForms,    // Exporting getAdoptForms handler
    deleteForm,       // Exporting deleteForm handler
    deleteAllRequests // Exporting deleteAllRequests handler
};
