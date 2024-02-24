import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return; // If already connected, return immediately

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      //useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: "Parking-System",
    });

    console.log(`Connected to MongoDB at ${conn.connection.host}`);
    isConnected = true; // Set isConnected to true after successful connection
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

export default connectDB;
