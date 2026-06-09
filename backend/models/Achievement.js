import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    category: {
      type: String,
      enum: ['Award', 'Certificate', 'Competition', 'Recognition'],
      default: 'Certificate',
    },
    date: { type: Date },
    documentUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

const Achievement = mongoose.model('Achievement', achievementSchema);
export default Achievement;
