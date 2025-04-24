const cloudinary = require("cloudinary").v2;
const fs = require("fs");

exports.uploadImageTocloudinary = async (file, folder, height, quality) => {
  try {
    const options = { folder };
    if (height) {
      options.height = height;
    }
    if (quality) {
      options.quality = quality;
    }

    options.resource_type = "auto";

    const response = await cloudinary.uploader.upload(
      file.tempFilePath,
      options
    );

    return response;
  } catch (e) {
    console.log(
      "something went wrong while uplaoding the file to cloud",
      e?.message
    );
    fs.unlink(file);
  }
};

exports.deleteFromCloudinary = async (publicIds) => {
  try {
    const ids = Array.isArray(publicIds) ? publicIds : [publicIds];

    for (const id of ids) {
      await cloudinary.uploader.destroy(id);
    }
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error.message);
  }
};
