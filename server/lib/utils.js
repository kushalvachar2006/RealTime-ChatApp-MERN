import jwt from "jsonwebtoken";

//Fucntion to generate a token for a user
export const generatetoken = (userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  return token;
};
