import express from 'express'
import { checkAuth, signIn, signUp, updateProfile } from '../controllers/user.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const userRouter = express.Router();

userRouter.post('/signUp', signUp);
userRouter.post('/login', signIn);
userRouter.put('/update-profile',protectRoute, updateProfile); // the middleware protectRoute only on the routes that require a user to be logged in (authenticated)
userRouter.get('/check',protectRoute, checkAuth);

export default userRouter;