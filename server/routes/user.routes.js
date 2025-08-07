import express from 'express'
import { checkAuth, signIn, signUp, updateProfile } from '../controllers/user.controller';
import { protectRoute } from '../middleware/auth.middleware';

const userRouter = express.Router();

userRouter.post('/signup', signUp);
userRouter.post('/login', signIn);
userRouter.put('/update-profile',protectRoute, updateProfile);
userRouter.get('/check',protectRoute, checkAuth);

export default userRouter;