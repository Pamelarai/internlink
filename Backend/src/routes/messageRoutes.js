import express from 'express';
import {
    sendMessage,
    getConversation,
    getConversations,
    markAsRead
} from '../controllers/messageController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);

router.post('/send', sendMessage);
router.get('/conversations', getConversations);
router.get('/conversation/:otherUserId', getConversation);
router.put('/read/:otherUserId', markAsRead);

export default router;
