import mongoose from 'mongoose';

const educationSchema = new mongoose.Schema({
  school: { type: String, default: '' },
  degree: { type: String, default: '' },
  stream: { type: String, default: '' },
  startYear: { type: String, default: '' },
  endYear: { type: String, default: '' },
  percentageOrCgpa: { type: String, default: '' },
  achievements: { type: String, default: '' },
});

const experienceSchema = new mongoose.Schema({
  company: { type: String, default: '' },
  role: { type: String, default: '' },
  type: { type: String, enum: ['Full-Time', 'Part-Time', 'Internship', 'Freelance'], default: 'Full-Time' },
  duration: { type: String, default: '' }, // e.g. "Jan 2024 - Present"
  description: { type: String, default: '' },
});

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Expert'], default: 'Intermediate' },
  category: { type: String, default: 'Technical' }, // e.g. "Frontend", "Backend", "Languages"
});

const certificationSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  issuer: { type: String, default: '' },
  date: { type: Date },
  link: { type: String, default: '' },
  credentialId: { type: String, default: '' },
});

const educationCareerSchema = new mongoose.Schema(
  {
    education: [educationSchema],
    experience: [experienceSchema],
    skills: [skillSchema],
    certifications: [certificationSchema],
    futureGoals: [{ type: String }],
  },
  { timestamps: true }
);

const EducationCareer = mongoose.model('EducationCareer', educationCareerSchema);
export default EducationCareer;
