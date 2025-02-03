// Importing mongoose for schema creation and database interaction
import mongoose from "mongoose";
const Schema = mongoose.Schema;

// Defining the schema for the adoption form
const adoptFormSchema = new Schema({
  email: {
    type: String, // Email address of the applicant
    required: true, // This field is mandatory
  },
  phoneNo: {
    type: String, // Phone number of the applicant
    required: true, // This field is mandatory
  },
  livingSituation: {
    type: String, // Description of the applicant's living situation (e.g., apartment, house, etc.)
    required: true, // This field is mandatory
  },
  previousExperience: {
    type: String, // Details about the applicant's previous experience with pets
    required: true, // This field is mandatory
  },
  anyPet: {
    type: String, // Information about whether the applicant currently has any pets
    required: true, // This field is mandatory
  },
  petId: {
    type: String, // ID of the pet the applicant wants to adopt
    required: true, // This field is mandatory
  },
  fee: {
    type: String, // Adoption fee associated with the pet
    required: true, // This field is mandatory
  },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

// Exporting the AdoptForm model to interact with the adoption form collection in the database
export default mongoose.model('AdoptForm', adoptFormSchema); // Use export default
