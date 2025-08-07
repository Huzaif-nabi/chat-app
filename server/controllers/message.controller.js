// Get all users except the logged in user

import Message from "../models/message.js";
import User from "../models/user.model.js"
import cloudinary from '../lib/cloudinary.js'

export const getUsersForSidebar = async (req,res) => { // Fetch all users except the currently logged-in user. Also return the count of unseen (not yet read) messages from each user.
    try {
        const userId = req.user._id; // from auth middleware
        const filteredUsers = await User.find({_id: {$ne: userId}}).select("-password"); // ne = not equal to. we use _id cuz its used in mongoose

        // Count no of msgs not seen
        const unseenMessages = {}
        const promises = filteredUsers.map(async (user)=>{
            const messages = await Message.find({senderId: user._id, recieverId: userId, seen: false})

            if(messages.length > 0){ // Keep count of unread msg per user
                unseenMessages[user._id] = messages.length;
            }
        })
        await Promise.all(promises); // Promise.all waits for all async database queries to finish before proceeding.
        res.json({
            success: true,
            users: filteredUsers,
            unseenMessages
        })
    } catch (error) {
        console.log(error.messages);
        res.json({
            success: false,
            message: error.message
        })   
    }
}

// Get all messages for selected user
export const getMessages = async (req,res) => {  // retrieves all chat messages exchanged between the logged-in user and another selected user. 
    try {
        const { id: selectedUserId } = req.params; // selectedUserId is extracted from the URL parameter (e.g., /messages/:id).
        const myId = req.user._id;

        const messages = await Message.find({ // fetches all messages between the two users: Sent from you to the selected user. Or from the selected user to you.
            $or: [
                {senderId: myId, recieverId: selectedUserId},
                {senderId: selectedUserId, recieverId: myId},
            ]
        })
        await Message.updateMany({senderId: selectedUserId, recieverId: myId}, {seen: true}); //  it updates all messages that were: Sent by the selected user To you

        res.json({
            success: true,
            messages
        })


    } catch (error) {
        console.log(error.messages);
        res.json({
            success: false,
            message: error.message
        }) 
    }
}

//  API to mark message as seen using message id

export const markMessageAsSeen = async (req,res) => {
    try {
        const {id} = req.param;
        await Message.findByIdAndUpdate(id, {seen: true})
        res.json({success: true})
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        })
    }
}

// Send message to selected user
export const sendMessage = async (req, res) => {
    try {
        const {text, image} = req.body;
        const recieverId = req.param.id;
        const senderId = req.user._id;

        let imageUrl;

        if(image){
            const uploadResponse = cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

            const newMessage = await Message.create()

    } catch (error) {
        
    }
}