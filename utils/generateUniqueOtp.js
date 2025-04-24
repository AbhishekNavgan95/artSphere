const Admin = require("../models/Admin");
const Artist = require("../models/Artist");
const Customer = require("../models/Customer");

const generateRawOtp = () => Math.floor(100000 + Math.random() * 900000);

const generateUniqueOtp = async (role) => {
  let otp, exists;

  do {
    otp = generateRawOtp();
    if (role === "artist") {
      exists = await Artist.findOne({ otp });
    } else if (role === "admin") {
      exists = await Admin.findOne({ otp });
    } else {
      exists = await Customer.findOne({ otp });
    }
  } while (exists);

  return otp;
};

module.exports = generateUniqueOtp;
