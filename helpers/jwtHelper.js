const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (token) => {
  if (!token) {
    return "A token is required for authentication";
  }
  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    if(decoded.username) return true;
  } catch (err) {

    return {error : "Invalid Token"};
  }
}

const generateToken = (username) => {
    const token = jwt.sign(
    { username: username },
    process.env.TOKEN_KEY,
    {
      expiresIn: "2h",
    }
  );
  return token;
}

module.exports = {generateToken, verifyToken}