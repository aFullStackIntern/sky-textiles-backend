import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Careers } from "../models/careers.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { validateMongoDbId } from "../utils/validateMongodbId.js";


 const createCareersData = asyncHandler(async(req,res)=>{
     const { title, description, location, type } = req.body;
     if (!title || !description || !location || !type) {
       throw new ApiError(400, "Plese fill all the required fileds!!!");
     }
     const existing = await Careers.findOne({ title });
     if (existing) {
       throw new ApiError(400, "This data has already been exist.");
     }
     const careers = await Careers.create({
       title,
       description,
       location,
       type,
     });
     if (!careers) {
       throw new ApiError(
         500,
         "Something went wrong while uploading the careers!!!"
       );
     }
     res.status(200).json(new ApiResponse(200, "MetaData created!!!", careers));
 })

 const getCareersData = asyncHandler(async (req, res) => {
   const careers = await Careers.find();
   res.status(200).json(new ApiResponse(200, "careers found!!!", careers));
 });
const deletecareersbyId = asyncHandler(async (req, res) => {
  const { id } = req.query; // You can also use req.body.id if you prefer sending it in the request body.

  // Validate MongoDB ObjectId
  validateMongoDbId(id);

  const careers = await Careers.findByIdAndDelete(id);

  if (!careers) {
    throw new ApiError(404, "Career not found for the specified ID!");
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Career deleted successfully!", careers));
});

const updateCareersById = asyncHandler(async (req, res) => {
  const { id } = req.query; // You can also use req.body.id if you prefer sending it in the request body.
  const { title, description, location, type } = req.body;

  // Validate MongoDB ObjectId
  validateMongoDbId(id);

  if (!title && !description && !keywords && !pagename) {
    throw new ApiError(400, "Please provide at least one field to update!");
  }

  // Find and update the metadata by ID
  const updatedCareersdata = await Careers.findByIdAndUpdate(
    id,
    { title, description, location, type },
    { new: true, runValidators: true }
  );

  if (!updatedCareersdata) {
    throw new ApiError(404, "careers data not found for the specified ID!");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, "Metadata updated successfully!", updatedCareersdata)
    );
});
 export {
   createCareersData,
   getCareersData,
   deletecareersbyId,
   updateCareersById,
 };