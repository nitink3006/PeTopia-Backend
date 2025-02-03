import jwt from "jsonwebtoken"
import User from "../Model/UserSchema.js"

const Auth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    console.log("Auth", authorization);

    // Check if the authorization header is present
    if (!authorization) {
      return res.status(401).json({ error: "Authorization token missing" });
    }

    // Extract the token from the Bearer token
    const token = authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Invalid authorization format" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.SECRET);
    const { _id } = decoded;

    // Check if the user exists in the database
    const user = await User.findById(_id).select("_id");
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // Attach the user to the request object
    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error.message);
    res.status(401).json({ error: "Request is not authorized" });
  }
};

export default Auth;
