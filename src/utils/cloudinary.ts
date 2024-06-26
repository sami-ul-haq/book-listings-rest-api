import { v2 as cloudinary } from "cloudinary";
import { config } from "../config/config";
// import fs from "fs";

cloudinary.config({
  cloud_name: config.cloudinaryCloudName,
  api_key: config.cloudinaryApiKey,
  api_secret: config.cloudinaryApiSecret,
});

export default cloudinary;

// const uploadOnCloudinary = async (localFilePath: string) => {
//   try {
//     if (!localFilePath) return null;

//     const response = await cloudinary.uploader.upload(localFilePath, {
//       resource_type: "auto",
//     });

//     fs.unlinkSync(localFilePath);

//     return response;
//   } catch (error) {
//     fs.unlinkSync(localFilePath);

//     return null;
//   }
// };

// export { uploadOnCloudinary };

// Its better to use this function.
