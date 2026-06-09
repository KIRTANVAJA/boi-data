import mongoose from 'mongoose';

const lifestyleSchema = new mongoose.Schema(
  {
    hobbies: [{ type: String }],
    interests: [{ type: String }],
    fitness: { type: String, default: '' },
    travel: [{ type: String }],
    languages: [{ type: String }],
  },
  { timestamps: true }
);

const Lifestyle = mongoose.model('Lifestyle', lifestyleSchema);
export default Lifestyle;
