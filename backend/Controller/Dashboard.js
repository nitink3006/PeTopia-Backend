// Importing required modules: express for creating the server, User model for user data interaction, Pet model for pet data interaction
import express from "express";
import User from "../Model/UserSchema.js"; // User model for user data schema
import Pet from "../Model/PetSchema.js";   // Pet model for pet data schema

// Handler for user registration stats, to get the total number of registered users
const userRegistration = async (req, res) => {
    try {
        // Using MongoDB aggregation to count the total number of users
        const users = await User.aggregate([
            {
                $group: {
                    _id: null,          // Grouping all users together (null means no specific grouping field)
                    count: { $sum: 1 }  // Summing up 1 for each user, effectively counting the total number of users
                }
            }
        ]);

        // Since aggregation returns an array, checking and returning the count properly
        const totalUsers = users.length > 0 ? users[0].count : 0;  

        // Sending the total user count as a response
        res.json({ count: totalUsers });
    } catch (err) {
        // Catching any errors and sending a 500 error response with the error message
        res.status(500).json({ message: err.message });
    }
};

// Handler for retrieving the different types of pets and their counts
const petTypes = async (req, res) => {
    try {
        // Using MongoDB aggregation to count the number of pets for each type (e.g., dog, cat)
        const pets = await Pet.aggregate([
            {
                $group: {
                    _id: "$type",      // Grouping by pet type
                    count: { $sum: 1 }  // Counting the number of pets in each group
                }
            }
        ]);

        // Sending the aggregated pet data as a response (includes type and count)
        res.json(pets);
    } catch (err) {
        // Catching any errors and sending a 500 error response with the error message
        res.status(500).json({ message: err.message });
    }
}

// Exporting the handlers so they can be used in other parts of the application
export{
    userRegistration, // Exporting userRegistration handler
    petTypes          // Exporting petTypes handler
};
