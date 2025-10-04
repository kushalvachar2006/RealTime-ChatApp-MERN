import express from "express";
import {
  checkAuth,
  login,
  Signup,
  updateprofile,
} from "../controllers/userController.js";
import { protectRoute } from "../middleware/auth.js";
const userrouter = express.Router();

userrouter.post("/signup", Signup);
userrouter.post("/login", login);
userrouter.put("/updateprofile", protectRoute, updateprofile);
userrouter.get("/check", protectRoute, checkAuth);

export default userrouter;
