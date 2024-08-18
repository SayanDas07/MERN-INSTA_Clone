import { Router } from 'express';

import { verifyJWT } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';
import { addComment, addNewPost, bookmarkPost, deletePost, dislikePost, getAllCommnets, getAllposts, getUserposts, likePost } from '../controllers/post.controller.js';


const router = Router();

router.route("/addpost").post(verifyJWT, upload.single('image'),addNewPost)
router.route("/getpost").get(verifyJWT, getAllposts)
router.route("/userpost/all").get(verifyJWT, getUserposts)
router.route("/:id/like").get(verifyJWT, likePost)
router.route("/:id/dislike").get(verifyJWT, dislikePost)
router.route("/:id/comment").post(verifyJWT, addComment)
router.route("/:id/comment/all").post(verifyJWT, getAllCommnets)
router.route("/delete/:id").delete(verifyJWT, deletePost)
router.route("/:id/bookmark").get(verifyJWT, bookmarkPost)


export default router