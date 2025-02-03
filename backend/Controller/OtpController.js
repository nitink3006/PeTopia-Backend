// Importing the Otp model to interact with the OTP data in the database
import Otp from "../Model/OtpSchema.js";

// Handler to generate OTP for a user during registration or login
const genOtp = async (req, res) => {
    // Extracting user details (name, email, and password) from the request body
    const { name, email, password } = req.body;

    try {
        // Generating OTP using the Otp model's genOtp function
        const userOtp = await Otp.genOtp(name, email, password);

        // Responding with the user's email upon successful OTP generation
        res.status(200).json({ email: userOtp.email });
    } catch (error) {
        // Responding with an error message if OTP generation fails
        res.status(400).json({ error: error.message });
    }
}

// Handler to verify the OTP entered by the user
const verifyOtp = async (req, res) => {
    // Extracting email and OTP from the request body
    const { email, otp } = req.body;

    try {
        // Verifying the OTP using the Otp model's verifyOtp function
        const result = await Otp.verifyOtp(email, otp);

        // Responding with the verification result
        res.status(200).json(result);
    } catch (error) {
        // Responding with an error message if OTP verification fails
        res.status(400).json({ error: error.message });
    }
};

// Handler for requesting a new OTP in case of forgotten password
const forgotOtp = async (req, res) => {
    // Extracting the user's email from the request body
    const { email } = req.body;

    try {
        // Generating a new OTP for the forgotten password request
        const userOtp = await Otp.forgotOtp(email);

        // Responding with the user's email after successfully generating the OTP
        res.status(200).json({ email: userOtp.email });
    } catch (error) {
        // Responding with an error message if OTP generation fails
        res.status(400).json({ error: error.message });
    }
}

// Exporting the OTP handlers for use in other parts of the application
export { genOtp, verifyOtp, forgotOtp }; // Use named export for the handlers
