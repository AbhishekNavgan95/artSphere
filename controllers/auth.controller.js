const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const Artist = require("../models/Artist");
const Customer = require("../models/Customer");
const generateUniqueOtp = require("../utils/generateUniqueOtp");
const sendMail = require("../utils/sendMail");
const bcrypt = require("bcryptjs");

exports.signUp = async (req, res) => {
  try {
    const {
      username,
      password,
      mobile,
      email,
      role,
      bio,
      socialLinks,
      adminSecret,
    } = req.body;

    // artist registration
    if (role === "artist") {
      console.log("registering artist 🎸🎸🎸🎸🎸");

      if (!username || !password || !mobile || !email || !role || !bio) {
        return res
          .status(400)
          .json({ success: false, message: "Please fill all the fields" });
      }

      const otp = await generateUniqueOtp(role);
      const hashedPassword = await bcrypt.hashSync(password, 10);

      const artist = new Artist({
        username,
        password: hashedPassword,
        mobile,
        email,
        role,
        bio,
        socialLinks,
        otp,
      });

      const mailResponse = await sendMail({
        to: email,
        subject: "OTP for Artist Registration",
        html: `Your OTP is ${otp}`,
      });

      if (mailResponse.success === false) {
        return res
          .status(500)
          .json({ success: false, message: "Error sending mail" });
      }

      await artist.save();
      res
        .status(201)
        .json({ success: true, message: "Artist registered successfully" });
    }

    // customer registration
    else if (role === "customer") {
      console.log("registering customer 💸💸💸💸");

      if (!username || !password || !mobile || !email || !role) {
        return res
          .status(400)
          .json({ success: false, message: "Please fill all the fields" });
      }

      const otp = await generateUniqueOtp(role);
      const hashedPassword = await bcrypt.hashSync(password, 10);

      const customer = new Customer({
        username,
        password: hashedPassword,
        mobile,
        email,
        role,
        otp,
      });

      const mailResponse = await sendMail({
        to: email,
        subject: "OTP for Artist Registration",
        html: `Your OTP is ${otp}`,
      });

      if (mailResponse.success === false) {
        return res
          .status(500)
          .json({ success: false, message: "Error sending mail" });
      }

      await customer.save();
      res
        .status(201)
        .json({ success: true, message: "Customer registered successfully" });
    }

    // admin registration
    else if (role === "admin") {
      console.log("registering admin 👮👮👮👮👮");

      if (
        !username ||
        !password ||
        !mobile ||
        !email ||
        !role ||
        !adminSecret
      ) {
        return res
          .status(400)
          .json({ success: false, message: "Please fill all the fields" });
      }

      if (adminSecret !== process.env.ADMIN_SECRET) {
        return res
          .status(403)
          .json({ success: false, message: "Invalid admin secret" });
      }

      const otp = await generateUniqueOtp(role);
      const hashedPassword = await bcrypt.hashSync(password, 10);

      const admin = new Admin({
        username,
        password: hashedPassword,
        mobile,
        email,
        role,
        otp,
      });

      const mailResponse = await sendMail({
        to: email,
        subject: "OTP for Artist Registration",
        html: `Your OTP is ${otp}`,
      });

      if (mailResponse.success === false) {
        return res
          .status(500)
          .json({ success: false, message: "Error sending mail" });
      }

      await admin.save();
      res
        .status(201)
        .json({ success: true, message: "Admin registered successfully" });
    } else {
      res.status(400).json({ success: false, message: "Invalid role" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.verifyMail = async (req, res) => {
  try {
    const { otp, email } = req.body;

    if (!otp || !email) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all the fields" });
    }

    const user =
      (await Artist.findOne({ email })) ||
      (await Customer.findOne({ email })) ||
      (await Admin.findOne({ email }));

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (otp !== user?.otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    user.otp = undefined;
    user.isVerified = true;
    await user.save();
    res
      .status(200)
      .json({ success: true, message: "Account verified successfully" });
  } catch (error) {
    console.log("error verifying account : ", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all the fields" });
    }

    const user =
      (await Artist.findOne({ email })) ||
      (await Customer.findOne({ email })) ||
      (await Admin.findOne({ email }));

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user?.isVerified === false) {
      return res
        .status(400)
        .json({ success: false, message: "Account not verified" });
    }

    const isMatch = await bcrypt.compareSync(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1m" }
    );

    // res.cookie("token", token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "Strict",
    //   maxAge: 24 * 60 * 60 * 1000, // 1 day
    // });

    res.status(200).json({
      success: true,
      data: {
        token: token,
        user: user,
      },
      message: "Login successful",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all the fields" });
    }

    const user =
      (await Artist.findOne({ email })) ||
      (await Customer.findOne({ email })) ||
      (await Admin.findOne({ email }));

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const otp = await generateUniqueOtp(user.role);
    user.otp = otp;
    await user.save();

    const mailResponse = await sendMail({
      to: email,
      subject: "OTP for Password Reset",
      html: `Your OTP is ${otp}`,
    });

    if (mailResponse.success === false) {
      return res
        .status(500)
        .json({ success: false, message: "Error sending mail" });
    }

    res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
