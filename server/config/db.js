import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected');
  } catch (err) {
    throw new Error(`MongoDB connection failed: ${err.message}`);
  }
};

export default connectDB;
