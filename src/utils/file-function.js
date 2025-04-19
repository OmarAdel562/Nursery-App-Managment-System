import cloudinary from './cloud.js'


export const deleteCloud = async (public_id) => {
    await cloudinary.uploader.destroy(public_id);
  }