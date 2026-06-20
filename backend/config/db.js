const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("MONGO_URI =", process.env.MONGO_URI);

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("MongoDB Connection Error:");
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDB;