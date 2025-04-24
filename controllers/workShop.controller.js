const WorkShop = require("../models/WorkShop");
const {
  uploadImageTocloudinary,
  deleteFromCloudinary,
} = require("../utils/imageUpload");
const fs = require("fs");

exports.createWorkShop = async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      type,
      price,
      address,
      city,
      state,
      pincode,
      country,
      lat,
      lng,
    } = req.body;

    const { thumbnail } = req.files;
    const { id } = req.user;

    if (
      !title ||
      !description ||
      !date ||
      !type ||
      !price ||
      !address ||
      !city ||
      !state ||
      !pincode ||
      !country ||
      !lat ||
      !lng ||
      !thumbnail
    ) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const uploadResult = await uploadImageTocloudinary(thumbnail, "thumbnails");
    fs.unlinkSync(thumbnail.tempFilePath);

    const workshop = new WorkShop({
      title,
      description,
      date,
      type,
      artist: id,
      image: {
        secure_url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
      },
      price,
      location: {
        address,
        city,
        state,
        pincode,
        country,
        coordinates: {
          lat,
          lng,
        },
      },
    });

    await workshop.save();

    return res.status(201).json({
      success: true,
      message: "Workshop created successfully",
      workshop,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateWorkShop = async (req, res) => {
  try {
    const { id } = req.params;
    const { id: artistId } = req.user;
    const {
      title,
      description,
      date,
      type,
      price,
      address,
      city,
      state,
      pincode,
      country,
      lat,
      lng,
    } = req.body;

    const thumbnail = req.files.thumbnail;

    const workShop = await WorkShop.findById(id);
    if (!workShop) {
      return res
        .status(404)
        .json({ success: false, message: "Workshop not found" });
    }
    // console.log("WorkShop : ", workShop.artist.toString())
    // console.log("artistId : ", artistId)

    if (workShop?.artist.toString() !== artistId) {
      return res.status(401).json({
        success: false,
        message: "You are not authorized to update this workshop",
      });
    }

    let uploadResult;
    if (thumbnail) {
      await deleteFromCloudinary(workShop.image.public_id);

      uploadResult = await uploadImageTocloudinary(thumbnail, "thumbnails");
      fs.unlinkSync(thumbnail.tempFilePath);
      workShop.image = {
        secure_url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
      };
    }

    workShop.title = title || workShop.title;
    workShop.description = description || workShop.description;
    workShop.date = date || workShop.date;
    workShop.type = type || workShop.type;
    workShop.artist = artistId;
    workShop.price = price || workShop.price;
    workShop.location.address = address || workShop.location.address;
    workShop.location.city = city || workShop.location.city;
    workShop.location.state = state || workShop.location.state;
    workShop.location.pincode = pincode || workShop.location.pincode;
    workShop.location.country = country || workShop.location.country;
    workShop.location.coordinates.lat =
      lat || workShop.location.coordinates.lat;
    workShop.location.coordinates.lng =
      lng || workShop.location.coordinates.lng;
    await workShop.save();

    return res.status(201).json({
      success: true,
      message: "Workshop updated successfully",
      workShop,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteWorkShop = async (req, res) => {
  try {
    const { id } = req.params;
    const { id: artistId } = req.user;
    const workShop = await WorkShop.findById(id);
    if (!workShop) {
      return res
        .status(404)
        .json({ success: false, message: "Workshop not found" });
    }

    if (workShop.artist.toString() !== artistId) {
      return res.status(401).json({
        success: false,
        message: "You are not authorized to delete this workshop",
      });
    }

    if (workShop?.participents?.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete workshop with participants",
      });
    }

    await deleteFromCloudinary(workShop.image.public_id);

    await WorkShop.findByIdAndDelete(id);

    return res.status(201).json({
      success: true,
      message: "Workshop deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllWorkShops = async (req, res) => {
  try {
    const workShops = await WorkShop.find().populate("artist");

    return res.status(201).json({
      success: true,
      message: "Workshops fetched successfully",
      workShops,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getWorkShopById = async (req, res) => {
  try {
    const { id } = req.params;

    const workShop = await WorkShop.findById(id).populate("artist");

    if (!workShop) {
      return res
        .status(404)
        .json({ success: false, message: "Workshop not found" });
    }

    workShop.participents = workShop.participents.length;

    return res.status(201).json({
      success: true,
      message: "Workshop fetched successfully",
      workShop,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
