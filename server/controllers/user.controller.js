import { generateToken } from '../lib/utils';
import User from '../models/user.model';
import bcrypt from 'bcryptjs'
import cloudinary from '../lib/cloudinary.js'

// Sign-Up

export const signUp = async (req,res) => {
    const {fullName, email, password, bio} = req.body;

    try{
        if(!fullName || !email || !password || !bio){
        return res.json({
            success: false,
            message: "Missing details"
        })
    }

    const user = await User.findOne({email});

    if(user){
        return res.json({
            success: false,
            message: "Acount already exists"
        })
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
        fullName, email, password: hashedPassword, bio
    });

    const token = generateToken(newUser._id)
    res.json({
    success: true,
    message: "Account created successfully",
    data: {
        newUser, 
        token
    }
    });


    }catch(error){
        console.log(error.message);
        res.json({
            success: false,
            message: error.message
        })
    }

}

// Sign In 

export const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if email or password is missing
        if (!email || !password) {
            return res.json({
                success: false,
                message: "Missing details"
            });
        }

        // Find the user
        const user = await User.findOne({ email });

        if (!user) {
            return res.json({
                success: false,
                message: "User does not exist"
            });
        }

        // Compare password
        const isPassword = await bcrypt.compare(password, user.password); // fixed this line

        if (!isPassword) {
            return res.json({
                success: false,
                message: "Login failed, incorrect password"
            });
        }

        // Generate token
        const token = generateToken(user._id);

        // Send success response
        return res.json({
            success: true,
            message: "Sign in successful",
            data: {
                user,
                token
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Controller to check if user is authneticated
export const checkAuth = (req,res) =>{
    res.json({
        success: true,
        user: req.user
    });
}

// Controller to update user profile details
export const updateProfile = async (req,res) => {
    try {
        const {profilePic, bio, fullName} = req.body;

        const userId = req.user._id;
        let updatedUser;

        if(!profilePic){
            updatedUser = await User.findByIdAndUpdate(userId, {bio, fullName}, {new: true});
        }
        else{
            const upload = await cloudinary.uploader.upload(profilePic);

            updatedUser = await User.findByIdAndUpdate(userId, {profilePic: upload.secure_url, bio, fullName}, {new: true});
        }

        res.json({
            success: true,
            user: updatedUser
        })

    } catch (error) {
        console.log(error.message);
        res.json({
            success: false,
            message: error.message
        })
    }
}