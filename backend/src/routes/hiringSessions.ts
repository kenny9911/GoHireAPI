import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';
// Import auth types to extend Express
import '../types/auth.js';

const router = Router();

// All hiring session routes require authentication
router.use(requireAuth);

/**
 * POST /api/v1/hiring-sessions
 * Create a new hiring session
 */
router.post('/', async (req, res) => {
  try {
    const { title, messages } = req.body;
    const userId = req.user!.id;

    const session = await prisma.hiringSession.create({
      data: {
        userId,
        title: title || null,
        messages: messages || [],
        status: 'active',
      },
    });

    res.status(201).json({
      success: true,
      data: session,
    });
  } catch (error) {
    console.error('Create hiring session error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create hiring session',
    });
  }
});

/**
 * GET /api/v1/hiring-sessions
 * List all hiring sessions for the current user
 */
router.get('/', async (req, res) => {
  try {
    const userId = req.user!.id;
    const { status, limit = 20, offset = 0 } = req.query;

    const where: any = { userId };
    if (status) {
      where.status = status;
    }

    const [sessions, total] = await Promise.all([
      prisma.hiringSession.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        take: Number(limit),
        skip: Number(offset),
        select: {
          id: true,
          title: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          // Don't include full messages in list view
        },
      }),
      prisma.hiringSession.count({ where }),
    ]);

    res.json({
      success: true,
      data: sessions,
      pagination: {
        total,
        limit: Number(limit),
        offset: Number(offset),
      },
    });
  } catch (error) {
    console.error('List hiring sessions error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to list hiring sessions',
    });
  }
});

/**
 * GET /api/v1/hiring-sessions/:id
 * Get a single hiring session with all messages
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const session = await prisma.hiringSession.findFirst({
      where: { id, userId },
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Hiring session not found',
      });
    }

    res.json({
      success: true,
      data: session,
    });
  } catch (error) {
    console.error('Get hiring session error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get hiring session',
    });
  }
});

/**
 * PATCH /api/v1/hiring-sessions/:id
 * Update a hiring session (title, messages, status)
 */
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const { title, messages, status } = req.body;

    // Verify ownership
    const existing = await prisma.hiringSession.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Hiring session not found',
      });
    }

    // Validate status if provided
    if (status && !['active', 'completed', 'archived'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be one of: active, completed, archived',
      });
    }

    const session = await prisma.hiringSession.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(messages !== undefined && { messages }),
        ...(status !== undefined && { status }),
      },
    });

    res.json({
      success: true,
      data: session,
    });
  } catch (error) {
    console.error('Update hiring session error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update hiring session',
    });
  }
});

/**
 * POST /api/v1/hiring-sessions/:id/messages
 * Add a message to a hiring session
 */
router.post('/:id/messages', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const { role, content } = req.body;

    if (!role || !content) {
      return res.status(400).json({
        success: false,
        error: 'Role and content are required',
      });
    }

    if (!['user', 'assistant'].includes(role)) {
      return res.status(400).json({
        success: false,
        error: 'Role must be either "user" or "assistant"',
      });
    }

    // Verify ownership and get current messages
    const existing = await prisma.hiringSession.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Hiring session not found',
      });
    }

    // Add new message to existing messages
    const currentMessages = (existing.messages as any[]) || [];
    const newMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      role,
      content,
      timestamp: new Date().toISOString(),
    };
    const updatedMessages = [...currentMessages, newMessage];

    // Update title from first user message if not set
    let newTitle = existing.title;
    if (!newTitle && role === 'user') {
      newTitle = content.substring(0, 50) + (content.length > 50 ? '...' : '');
    }

    const session = await prisma.hiringSession.update({
      where: { id },
      data: {
        messages: updatedMessages,
        title: newTitle,
      },
    });

    res.json({
      success: true,
      data: {
        session,
        message: newMessage,
      },
    });
  } catch (error) {
    console.error('Add message error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add message',
    });
  }
});

/**
 * DELETE /api/v1/hiring-sessions/:id
 * Delete a hiring session
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    // Verify ownership
    const existing = await prisma.hiringSession.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Hiring session not found',
      });
    }

    await prisma.hiringSession.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Hiring session deleted successfully',
    });
  } catch (error) {
    console.error('Delete hiring session error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete hiring session',
    });
  }
});

export default router;
