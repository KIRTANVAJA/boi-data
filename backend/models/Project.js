import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    tags: [{ type: String }],
    githubLink: { type: String, default: '' },
    demoLink: { type: String, default: '' },
    image: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Project = mongoose.model('Project', projectSchema);
export default Project;
