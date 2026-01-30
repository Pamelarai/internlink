import { prisma } from '../libs/prisma.js';

// Send a message
export const sendMessage = async (req, res) => {
    try {
        const { receiverId, content, applicationId } = req.body;
        const senderId = req.user.id;

        if (!receiverId || !content) {
            return res.status(400).json({ error: 'Receiver and content are required' });
        }

        const message = await prisma.message.create({
            data: {
                senderId,
                receiverId: parseInt(receiverId),
                content,
                applicationId: applicationId ? parseInt(applicationId) : null,
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                    }
                },
                receiver: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                    }
                }
            }
        });

        res.status(201).json(message);
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
};

// Get conversation with a specific user
export const getConversation = async (req, res) => {
    try {
        const { otherUserId } = req.params;
        const userId = req.user.id;

        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: userId, receiverId: parseInt(otherUserId) },
                    { senderId: parseInt(otherUserId), receiverId: userId },
                ],
            },
            orderBy: { createdAt: 'asc' },
            include: {
                sender: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                        internProfile: { select: { fullName: true } },
                        providerProfile: { select: { companyName: true } }
                    }
                }
            }
        });

        res.json(messages);
    } catch (error) {
        console.error('Error fetching conversation:', error);
        res.status(500).json({ error: 'Failed to fetch conversation' });
    }
};

// Get all conversations for current user
export const getConversations = async (req, res) => {
    try {
        const userId = req.user.id;

        // This is a bit more complex. We want the latest message from each unique conversation partner.
        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: userId },
                    { receiverId: userId },
                ],
            },
            orderBy: { createdAt: 'desc' },
            include: {
                sender: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                        internProfile: { select: { fullName: true } },
                        providerProfile: { select: { companyName: true } }
                    }
                },
                receiver: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                        internProfile: { select: { fullName: true } },
                        providerProfile: { select: { companyName: true } }
                    }
                },
            },
        });

        // Group by unique contact
        const conversationsMap = new Map();
        messages.forEach(msg => {
            const otherUser = msg.senderId === userId ? msg.receiver : msg.sender;
            if (!conversationsMap.has(otherUser.id)) {
                conversationsMap.set(otherUser.id, {
                    lastMessage: msg,
                    contact: otherUser
                });
            }
        });

        res.json(Array.from(conversationsMap.values()));
    } catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({ error: 'Failed to fetch conversations' });
    }
};

// Mark messages as read
export const markAsRead = async (req, res) => {
    try {
        const { otherUserId } = req.params;
        const userId = req.user.id;

        await prisma.message.updateMany({
            where: {
                senderId: parseInt(otherUserId),
                receiverId: userId,
                isRead: false,
            },
            data: { isRead: true },
        });

        res.json({ message: 'Messages marked as read' });
    } catch (error) {
        console.error('Error marking messages as read:', error);
        res.status(500).json({ error: 'Failed to mark messages as read' });
    }
};
