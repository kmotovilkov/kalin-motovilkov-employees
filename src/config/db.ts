import mongoose from "mongoose";
import { Container } from "typedi";

const dbConnect = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI!);
    Container.set('mongodb', connection);

    console.log('Database connected!');

  } catch (error) {
    console.error('Error database connection!');
    throw error;
  }
};

export default dbConnect;