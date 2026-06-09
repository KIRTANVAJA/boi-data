import mongoose from 'mongoose';

const contactRequestSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'] },
    email: {
      type: String,
      required: [true, 'Email is required'],
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
    subject: { type: String, default: 'No Subject' },
    message: { type: String, required: [true, 'Message content is required'] },
    status: {
      type: String,
      enum: ['Pending', 'Read', 'Replied'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

const ContactRequest = mongoose.model('ContactRequest', contactRequestSchema);
export default ContactRequest;
