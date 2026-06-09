import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    nickname: { type: String, default: '' },
    professionalTitle: { type: String, default: '' },
    shortIntro: { type: String, default: '' },
    statusBadge: { type: String, default: 'Open to Work' }, // e.g. "Open to Work", "Actively hiring"
    profileImage: { type: String, default: '' },
    age: { type: Number },
    dob: { type: Date },
    gender: { type: String, default: '' },
    height: { type: String, default: '' },
    weight: { type: String, default: '' },
    bloodGroup: { type: String, default: '' },
    maritalStatus: { type: String, default: '' },
    motherTongue: { type: String, default: '' },
    religion: { type: String, default: '' },
    location: { type: String, default: '' },
    socialLinks: {
      github: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      twitter: { type: String, default: '' },
      instagram: { type: String, default: '' },
      facebook: { type: String, default: '' },
      youtube: { type: String, default: '' },
    },
    contactInfo: {
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      whatsapp: { type: String, default: '' },
      address: { type: String, default: '' },
      mapEmbedUrl: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

const Profile = mongoose.model('Profile', profileSchema);
export default Profile;
