import Conversation from "../models/conversation.modle.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
export const sendMessage = async (req, res) => {
    //try catch
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
            });
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            message,
        });

        if (newMessage) {
            conversation.messages.push(newMessage._id);
        }

        // Save the conversation and new message
        await Promise.all([conversation.save(), newMessage.save()]);

        // If the receiver is connected via socket, emit the new message
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);

    } catch (error) {
        console.log("Error in sendMessage controller", error.message);
        res.status(500).json({ error: "Internal server issue" });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const senderId = req.user._id;

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, userToChatId] }
        }).populate("messages");

        if (!conversation) {
            return res.status(200).json([]);
        }

        res.status(200).json(conversation.messages);

    } catch (error) {
        console.log("Error in getMessages controller", error.message);
        res.status(500).json({ error: "Internal server issue" });
    }
};
