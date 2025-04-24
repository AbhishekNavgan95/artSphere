const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ success: false, message: "No token found" });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        try {
          const oldDecoded = jwt.decode(token); // decode without verifying
          if (!oldDecoded) {
            return res
              .status(401)
              .json({ success: false, message: "Invalid token" });
          }

          // Optional: Validate user from DB again if needed
          const newToken = jwt.sign(
            { id: oldDecoded.id, role: oldDecoded.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
          );

          res.cookie("token", newToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Lax",
            maxAge: 24 * 60 * 60 * 1000,
          });

          req.user = oldDecoded;
          next();
        } catch (err) {
          return res
            .status(500)
            .json({ success: false, message: "Re-authentication failed" });
        }
      } else {
        return res
          .status(403)
          .json({ success: false, message: "Token invalid! login again" });
      }
    } else {
      // Token is valid
      req.user = decoded;
      next();
    }
  });
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
