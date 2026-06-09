import mongoose from 'mongoose';

const familySchema = new mongoose.Schema(
  {
    fatherDetails: {
      name: { type: String, default: '' },
      occupation: { type: String, default: '' },
      contact: { type: String, default: '' },
    },
    motherDetails: {
      name: { type: String, default: '' },
      occupation: { type: String, default: '' },
      contact: { type: String, default: '' },
    },
    brothers: [
      {
        name: { type: String, default: '' },
        occupation: { type: String, default: '' },
        maritalStatus: { type: String, default: '' },
      },
    ],
    sisters: [
      {
        name: { type: String, default: '' },
        occupation: { type: String, default: '' },
        maritalStatus: { type: String, default: '' },
      },
    ],
    familyType: { type: String, default: 'Nuclear' }, // e.g. "Joint", "Nuclear"
    familyBackground: { type: String, default: '' },
  },
  { timestamps: true }
);

const Family = mongoose.model('Family', familySchema);
export default Family;
