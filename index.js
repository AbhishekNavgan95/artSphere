const express = require("express");
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const { connectToDB } = require("./config/dbConnect");
const { cloudinaryConnect } = require("./config/cloudinaryConnect");
const expressFileUpload = require("express-fileupload");

const app = express();
const PORT = process.env.PORT || 5000;

connectToDB();
cloudinaryConnect();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(
  expressFileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/profile", require("./routes/profileRoutes"));
app.use("/api/category", require("./routes/categoryRoutes"));
app.use("/api/product", require("./routes/productRoutes"));
app.use('/api/workshop', require("./routes/WorkShopRoutes"));
app.use('/api/cart', require("./routes/cartRoutes"))

app.use("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT || 5000, (req, res) => {
  console.log(`Server is running on port ${PORT}`);
});
