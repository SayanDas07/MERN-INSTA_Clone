import { Router } from 'express';
import {editUser, followOrUnfollow, getSuggestedUser, getUser, loginUser, logoutUser, registerUser } from '../controllers/user.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').get(verifyJWT,logoutUser);
router.route('/:id/profile').get(verifyJWT, getUser);

router.route('/profile/edit').post(verifyJWT, upload.single('profilePicture'), editUser);

router.route('/suggested').get(verifyJWT, getSuggestedUser);
router.route('/followorunfollow/:id').post(verifyJWT, followOrUnfollow);

export default router;