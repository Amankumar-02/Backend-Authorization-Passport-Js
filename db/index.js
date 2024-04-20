import mongoose from "mongoose";

const dbConnection = async()=>{
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URL);
        console.log("MongoDb is connected successfully", connectionInstance.connection.host);
    } catch (error) {
        console.log("MongoDB Connection Failed!", error)
    }
};

export default dbConnection;