import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['client', 'freelancer'], required: true },
  profile_picture_url: String,
  bio: String,
  skills: [String],
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
