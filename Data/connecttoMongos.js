import mongoose from "mongoose";


const connectToMongo = async () => {
    try {
        await mongoose.connect(process.env.MONGO,)
        console.log("connected to mongodb")
        
    } catch (error) {
        console.log("error connecting to mongo", error.message)
    }
};

export default connectToMongo;