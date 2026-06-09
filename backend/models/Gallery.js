import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema(
  {
    title: { type: String, default: '' },
    mediaUrl: { type: String, required: true },
    mediaType: { type: String, enum: ['image', 'video'], default: 'image' },
    albumName: { type: String, default: 'General' },
  },
  { timestamps: true }
);

const Gallery = mongoose.model('Gallery', gallerySchema);
export default Gallery;
