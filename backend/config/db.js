const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      console.error("❌ Fatal: MONGO_URI is not defined in environment variables");
      process.exit(1);
    }

    const options = {
      serverSelectionTimeoutMS: 10000,
    };

    // Ensure connection routes to the correct database
    if (process.env.DB_NAME) {
      options.dbName = process.env.DB_NAME;
    } else if (!mongoUri.includes(".mongodb.net/") || mongoUri.includes(".mongodb.net/?")) {
      options.dbName = "skillbasedteam";
    }

    await mongoose.connect(mongoUri, options);

    console.log(`✅ MongoDB Connected Successfully to database: [${mongoose.connection.name}]`);
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;