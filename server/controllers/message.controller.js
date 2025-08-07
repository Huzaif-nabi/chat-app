// Get all users except the logged in user

import Message from "../models/message.js";
import User from "../models/user.model.js"

export const getUsersForSidebar = async (req,res) => {
    try {
        const userId = req.user._id;
        const filteredUsers = await User.find({_id: {$ne: userId}}).select("-password");

        // Count no of msgs not seen
        const unseenMessages = {}
        const promises = filteredUsers.map(async (user)=>{
            const messages = await Message.find({senderId: user._id, recieverId: userId, seen: false})

            if(messages.length > 0){
                unseenMessages[user._id] = messages.length;
            }
        })
        await Promise.all(promises);
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
export const getMessages = async (req,res) => {
    try {
        const { id: selectedUserId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                {senderId: myId, recieverId: selectedUserId},
                {senderId: selectedUserId, recieverId: myId},
            ]
        })
        await Message.updateMany({senderId: selectedUserId, recieverId: myId}, {seen: true});

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