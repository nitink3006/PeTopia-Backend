// Importing required modules and packages
import Pet from "../Model/PetSchema.js"; // Importing the Pet model to interact with the pet data in the database
import fs from "fs"; // File system module to interact with files (for image deletion)
import path from "path"; // Path module for handling file paths
import nodemailer from "nodemailer"; // Nodemailer module for sending emails

// Handler for posting a new pet request
const postPetRequest = async (req, res) => {
  try {
    // Extracting pet details from the request body
    const { name, age, area, justification, email, phone, type, amount } = req.body;
    const { filename } = req.file;

    // Creating a new pet entry in the database
    const pet = await Pet.create({
      name,
      age,
      area,
      justification,
      email,
      phone,
      type,
      filename,
      status: 'Pending',
      amount
    });

    // Setting up the transporter for sending an email using Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_APP_PASS
      }
  });
  
  // Setting up the email content
  const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Pet Submission Received - PeTopia',
      text: `Hi ${name},\n\nThank you for trusting PeTopia to help find a loving home for your pet!\n\nWe’re thrilled to assist you in this important journey. Our team has received your submission and is currently reviewing the details. Once everything checks out, your pet’s profile will be featured on our platform, connecting them with potential adopters who care just as much as you do.\n\nYou’ll receive a confirmation email as soon as your pet’s listing goes live. Until then, if you have any questions or need assistance, our team is here to support you every step of the way.\n\nThank you for being part of the PeTopia community, where pets and people find their perfect match.\n\nWith gratitude,\nThe PeTopia Team`
  };
  
  // Attempt to send the email, log error if failed
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending submission email:', error);
  }
  
    // Respond with the created pet data
    res.status(200).json(pet);
  } catch (error) {
    // Respond with error if something goes wrong
    res.status(500).json({ error: error.message });
  }
};

// Handler for approving a pet request
const approveRequest = async (req, res) => {
  try {
    // Extracting pet ID and updated information from the request
    const id = req.params.id;
    const { name, email, phone, status } = req.body;

    // Updating the pet details in the database
    const pet = await Pet.findByIdAndUpdate(id, { email, phone, status }, { new: true });

    if (!pet) {
      // Respond if pet not found
      return res.status(404).json({ error: 'Pet not found' });
    }

    // Setting up the transporter for sending approval email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_APP_PASS
      }
  });
  
  // Setting up the approval email content
  const mailOptions = {
      from: process.env.EMAIL_USER,
      to: pet.email,
      subject: 'Your Pet is Now Live on PeTopia!',
      text: `Hello ${pet.name}’s Proud Owner,\n\nExciting news! Your pet’s adoption profile has been approved and is now live on the PeTopia platform.\n\nOur pet-loving community can now connect with your furry friend and help them find their perfect forever home. Thank you for being a part of this meaningful journey and making a difference in their life.\n\nYou can check out your pet’s listing by logging into your account on our website. If you have any questions or need assistance, our team is here to support you at every step.\n\nTogether, we’re making tails wag and hearts happy!\n\nWarm regards,\nThe PeTopia Team`
  };
  
  // Attempt to send the approval email, log error if failed
  try {
      await transporter.sendMail(mailOptions);
  } catch (error) {
      console.error('Error sending approval email:', error);
  }

    // Respond with the updated pet data
    res.status(200).json(pet);
  } catch (err) {
    // Respond with error if something goes wrong
    res.status(500).json({ error: err.message });
  }
};

// Handler to get all pets based on status (approved/pending)
const allPets = async (reqStatus, req, res) => {
  try {
    // Fetching pets with a given status and sorting them
    const data = await Pet.find({ status: reqStatus }).sort({ updatedAt: -1 });
    if (data.length > 0) {
      // Respond if pets are found
      res.status(200).json(data);
    } else {
      // Respond if no pets are found
      res.status(200).json({ error: 'No data found' });
    }
  } catch (err) {
    // Respond with error if something goes wrong
    res.status(500).json({ error: err.message });
  }
};

// Handler for deleting a pet post
const deletePost = async (req, res) => {
  try {
    // Extracting pet ID from the request
    const id = req.params.id;

    // Deleting pet from the database
    const pet = await Pet.findByIdAndDelete(id);
    if (!pet) {
      // Respond if pet not found
      return res.status(404).json({ error: 'Pet not found' });
    }

    // Removing the associated pet image file from the server
    const filePath = path.join(__dirname, '../images', pet.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Setting up the transporter for sending removal email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_APP_PASS
      }
  });
  
  // Setting up the removal email content
  const mailOptions = {
      from: process.env.EMAIL_USER,
      to: pet.email,
      subject: 'Pet Submission Removed - PeTopia',
      text: `Hello ${pet.name}’s Owner,\n\nWe wanted to let you know that your pet’s listing has been removed from the PeTopia platform after careful review by our admin team.\n\nWe understand this may be disappointing, but please rest assured that we’re here to help you. If you would like more details on the reason behind this or need assistance with next steps, feel free to reach out to us. Our team is always available to support you.\n\nThank you for your understanding, and we’re grateful for your continued trust in PeTopia.\n\nBest regards,\nThe PeTopia Team`
  };
  
  // Attempt to send the removal email, log error if failed
  try {
      await transporter.sendMail(mailOptions);
  } catch (error) {
      console.error('Error sending removal email:', error);
  }

    // Respond after successful deletion
    res.status(200).json({ message: 'Pet deleted successfully' });
  } catch (err) {
    // Respond with error if something goes wrong
    res.status(500).json({ error: err.message });
  }
};

// Exporting the handlers to make them accessible in other parts of the application
export{
  postPetRequest, // Exporting postPetRequest handler
  approveRequest, // Exporting approveRequest handler
  deletePost,     // Exporting deletePost handler
  allPets         // Exporting allPets handler
};
