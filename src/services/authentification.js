import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const JWT_SECRET = process.env.JWT_SECRET || '90jkhhjkghgjgu67';
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/auth_app';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'Password is required']

  },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);



async function register(username, password) {
  try {

    const existingUser = await User.findOne({ username: username.toLowerCase().trim() });
    if (existingUser) {
      throw new Error("Username is already taken.");
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username: username,
      password: hashedPassword
    });

    await newUser.save();
    console.log(`[Success] User "${username}" registered successfully!`);
    return newUser;
  } catch (error) {
    console.error("[Registration Error]:", error.message);
    throw error;
  }
}

async function login(username, password) {
  try {

    const user = await User.findOne({ username: username.toLowerCase().trim() });
    if (!user) {
      console.log("[Login Failed]: User not found!");
      return null;
    }


    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("[Login Failed]: Wrong password!");
      return null;
    }


    const token = jwt.sign(
      { userId: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log(`[Success] Login successful! Token generated.`);
    return token;
  } catch (error) {
    console.error("[Login Error]:", error.message);
    throw error;
  }
}

async function main() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB...");


    await register("john", "john123");

    const token = await login("john", "john123");
    if (token) {
      console.log(`Your JWT Token: ${token}`);
    }

  } catch (error) {
    console.error("[Main Process Error]:", error.message);
  } finally {

    await mongoose.connection.close();
    console.log("Database connection closed cleanly.");
  }
}

main();