const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  
  const token = authHeader.split(" ")[1];
  console.log("token : ", token);
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    console.log("decoded user : ", req.user);

    next();
  } catch (err) {
    console.log("error : ", err)

    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

const isCustomer = (req, res, next) => {
  try {
    if (req.user.role !== "customer") {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }
    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const isArtist = (req, res, next) => {
  try {
    if (req.user.role !== "artist") {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }
    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const isAdmin = (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }
    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { authenticateUser, isAdmin, isCustomer, isArtist };
