import jwt from "jsonwebtoken";

//Fucntion to generate a token for a user
export const generatetoken = (_id) => {
  const token = jwt.sign({ _id }, process.env.JWT_SECRET);
  return token;
};
