import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['client', 'freelancer'], required: true },
  profilePictureUrl: { type: String, default: '' },
  bio: { type: String, default: '' },
  skills: { type: [String], default: [] }
}, { timestamps: true });

UserSchema.methods.toSafeJSON = function () {
  const { _id, name, email, role, profilePictureUrl, bio, skills, createdAt, updatedAt } = this.toObject();
  return { _id, name, email, role, profilePictureUrl, bio, skills, createdAt, updatedAt };
};

export default mongoose.model('User', UserSchema);
