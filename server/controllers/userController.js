import { generatetoken } from "../lib/utils.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";
import bcrypt from "bcryptjs";

//Signup new user
export const Signup = async (req, res) => {
  const { fullname, email, password, bio } = req.body;

  try {
    if (!fullname || !email || !password || !bio) {
      return res.json({ success: false, message: "Missing Details" });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.json({ success: false, message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10); // for hashing of password
    const hashedpassword = await bcrypt.hash(password, salt);

    const newuser = await User.create({
      fullname,
      email,
      password: hashedpassword,
      bio,
    });

    const token = generatetoken(newuser._id);

    res.json({
      success: true,
      userData: newuser,
      token,
      message: "Account created successfully",
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
    console.log(error.message);
  }
};

//Controller for login of user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userData = await User.findOne({ email });

    const isPasswordCorrect = await bcrypt.compare(password, userData.password);
    if (!isPasswordCorrect) {
      return res.json({ success: false, message: "Invalid credentials" });
    }
    const token = generatetoken(userData._id);
    res.json({
      success: true,
      userData: userData,
      token,
      message: "Login Successful",
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
    console.log(error.message);
  }
};

//Controller to check if user is authenticated
export const checkAuth = (req, res) => {
  res.json({ success: true, user: req.user });
};

//Controller to update user profile
export const updateprofile = async (req, res) => {
  try {
    const { profilepic, bio, fullname } = req.body;
    const userid = req.user._id;
    let updatedUser;
    if (!profilepic) {
      updatedUser = await User.findByIdAndUpdate(
        userid,
        { bio, fullname },
        { new: true }
      );
    } else {
      const upload = await cloudinary.uploader.upload(profilepic);

      updatedUser = await User.findByIdAndUpdate(
        userid,
        {
          profilepic: upload.secure_url,
          bio,
          fullname,
        },
        { new: true }
      );
    }
    res.json({ success: true, user: updatedUser, message: "Profile Updated" });
  } catch (error) {
    res.json({ success: false, message: `Error in updating:${error.message}` });
    console.log(error.message);
  }
};
