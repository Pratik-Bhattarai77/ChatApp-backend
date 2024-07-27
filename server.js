//packages import
import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

//routes import
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";
//database import
import connectToMongo from "./Data/connecttoMongos.js";
import { app, server } from "./socket/socket.js";

dotenv.config();

const __dirname = path.resolve();

const PORT = process.env.PORT || 5000;

app.use(express.json()); // for parsing application/json (from req.body)
app.use(cookieParser());


app.use("/api/auth",authRoutes)
app.use("/api/messages",messageRoutes)
app.use("/api/users",userRoutes)

app.use(express.static(path.join(__dirname,"/frontend/dist")));

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});


server.listen(PORT,()=> {
    connectToMongo();
    console.log(`server running on port ${PORT}`)    
});