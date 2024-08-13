import { Router } from 'express';

import { verifyJWT } from '../middlewares/auth.middleware.js';
import { getMessages, sendMessage } from '../controllers/message.controller.js';

const router = Router();

router.route("/send/:id").post(verifyJWT, sendMessage)
router.route("/get/:id").get(verifyJWT, getMessages)
export default router;