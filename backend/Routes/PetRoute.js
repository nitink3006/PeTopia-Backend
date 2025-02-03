// Importing required modules and controllers
import express from "express"; // For creating and managing routes
import multer from "multer"; // For handling file uploads
import path from "path"; // For handling and transforming file paths
import { fileURLToPath } from "url"; // Required to define __dirname in ES modules
import { postPetRequest, approveRequest, deletePost, allPets } from "../Controller/PetController.js"; // Importing pet-related controller functions

// Defining __dirname for ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initializing the router object to define routes
const router = express.Router();

// Configuring multer storage for handling file uploads
const storage = multer.diskStorage({
  // Setting the destination folder for uploaded files
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../images')); // Files will be saved in the 'images' folder
  },
  // Setting a unique filename for uploaded files
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

// Creating the multer instance with the defined storage configuration
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only JPEG, JPG, and PNG files are allowed"), false);
    }
    cb(null, true);
  }
});

// Route to fetch all pets with different statuses
router.get('/request', (req, res) => allPets('Pending', req, res));
router.get('/approvedPets', (req, res) => allPets('Approved', req, res));
router.get('/adoptedPets', (req, res) => allPets('Adopted', req, res));

// Route to handle pet service requests, including file uploads
router.post('/services', upload.single('picture'), (req, res, next) => {
    // Debugging logs
    console.log("Received request:", req.body);
    console.log("Uploaded file:", req.file);
    
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded or incorrect field name" });
    }
    
    next();
}, postPetRequest);

// Route to approve a pet request using its ID
router.put('/approving/:id', approveRequest);

// Route to delete a pet entry using its ID
router.delete('/delete/:id', deletePost);

// Exporting the router object to use in other parts of the application
export default router;
