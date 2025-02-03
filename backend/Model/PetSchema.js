// Importing required module
import mongoose from "mongoose"; // For database schema and interactions

// Initializing the schema object
const schema = mongoose.Schema;

// Defining the Pet schema
const PetSchema = new schema(
  {
    name: {
      type: String,
      required: true, // The name of the pet is mandatory
    },
    age: {
      type: String,
      required: true, // The age of the pet is mandatory (stored as a string, e.g., "2 years")
    },
    area: {
      type: String,
      required: true, // The area/location of the pet is mandatory
    },
    justification: {
      type: String,
      required: true, // The reason/justification for putting up the pet is mandatory
    },
    email: {
      type: String,
      required: true, // The email of the pet owner is mandatory for communication
    },
    phone: {
      type: String,
      required: true, // The phone number of the pet owner is mandatory for contact
    },
    type: {
      type: String,
      required: true, // The type of pet (e.g., dog, cat) is mandatory
    },
    filename: {
      type: String,
      required: true, // The name of the file (e.g., image of the pet) is mandatory
    },
    status: {
      type: String,
      required: true, // The status of the pet (e.g., "Available", "Adopted") is mandatory
    },
    amount: {
      type: String,
      required: true, // The donation or adoption fee (if any) is mandatory
    },
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt` fields to track data changes
);

// Exporting the Pet model based on the schema
export default mongoose.model('Pet', PetSchema); // Use export default
