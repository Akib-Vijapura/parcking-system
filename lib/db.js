import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
     //useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: "Parking-System",
    });

    console.log(`Connect MongoDB to ${conn.connection.host}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

export default connectDB;
