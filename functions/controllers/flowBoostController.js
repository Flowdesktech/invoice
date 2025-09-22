const admin = require('firebase-admin');
const db = admin.firestore();
const { authenticateUser } = require('../middleware/auth');
const axios = require('axios');

// Task provider API configuration from environment variables
const TASK_PROVIDERS = {
  SWAGBUCKS: {
    baseUrl: 'https://api.swagbucks.com/v1',
    apiKey: process.env.SWAGBUCKS_API_KEY,
    apiSecret: process.env.SWAGBUCKS_API_SECRET,
  },
  TOLUNA: {
    baseUrl: 'https://api.toluna.com/v1',
    apiKey: process.env.TOLUNA_API_KEY,
    clientId: process.env.TOLUNA_CLIENT_ID,
  },
  USERTESTING: {
    baseUrl: 'https://api.usertesting.com/v1',
    apiKey: process.env.USERTESTING_API_KEY,
    apiSecret: process.env.USERTESTING_API_SECRET,
  },
  CLICKWORKER: {
    baseUrl: 'https://api.clickworker.com/v1',
    apiKey: process.env.CLICKWORKER_API_KEY,
    accessToken: process.env.CLICKWORKER_ACCESS_TOKEN,
  },
};

// Mock task providers data (replace with real API calls in production)
const MOCK_TASKS = {
  surveys: [
    {
      id: 'srv_001',
      provider: 'Swagbucks',
      title: 'Business Tools Survey',
      description: 'Share your experience with business management tools',
      amount: 3.50,
      duration: 10,
      category: 'survey',
      difficulty: 'easy',
      tags: ['Business', 'Quick', 'Opinion'],
      requirements: ['Business owner', '18+'],
      expiresAt: new Date(Date.now() + 3600000), // 1 hour
    },
    {
      id: 'srv_002',
      provider: 'Toluna',
      title: 'Freelancer Work Habits Study',
      description: 'Help researchers understand freelancer productivity patterns',
      amount: 5.00,
      duration: 15,
      category: 'survey',
      difficulty: 'easy',
      tags: ['Research', 'Freelance', 'Productivity'],
      requirements: ['Freelancer', '1+ years experience'],
      spotsLeft: 45,
    },
  ],
  microtasks: [
    {
      id: 'task_001',
      provider: 'Clickworker',
      title: 'Categorize Business Expenses',
      description: 'Help train AI by categorizing 50 business expense items',
      amount: 8.00,
      duration: 20,
      category: 'categorization',
      difficulty: 'intermediate',
      tags: ['AI Training', 'Finance', 'Categorization'],
      requirements: ['Basic accounting knowledge'],
      bonus: 'Complete accurately for $2 bonus',
    },
    {
      id: 'task_002',
      provider: 'Amazon MTurk',
      title: 'Review Website Copy',
      description: 'Proofread and suggest improvements for business website copy',
      amount: 12.00,
      duration: 25,
      category: 'writing',
      difficulty: 'intermediate',
      tags: ['Writing', 'Proofreading', 'Marketing'],
      requirements: ['Native English speaker', 'Marketing experience'],
    },
  ],
  usertesting: [
    {
      id: 'test_001',
      provider: 'UserTesting',
      title: 'Test New Invoice Software',
      description: 'Provide feedback on a new invoicing tool for freelancers',
      amount: 20.00,
      duration: 30,
      category: 'usability',
      difficulty: 'easy',
      tags: ['UX Testing', 'Software', 'Video Required'],
      requirements: ['Webcam', 'Microphone', 'Freelancer'],
      requiresVideo: true,
    },
  ],
  consulting: [
    {
      id: 'consult_001',
      provider: 'FlowDesk Network',
      title: 'Pricing Strategy Consultation',
      description: 'Help a new freelancer set competitive rates',
      amount: 35.00,
      duration: 30,
      category: 'consulting',
      difficulty: 'intermediate',
      tags: ['Mentoring', 'Business Strategy', 'Video Call'],
      requirements: ['3+ years experience', 'Similar industry'],
      requiresVideo: true,
    },
  ],
};

// Get available tasks for a user
exports.getAvailableTasks = async (req, res) => {
  try {
    const { userId } = req.user;
    
    // Get user profile for matching
    const userDoc = await db.collection('users').doc(userId).get();
    const userProfile = userDoc.exists ? userDoc.data() : {};
    
    // Get all mock tasks
    const allTasks = [
      ...MOCK_TASKS.surveys,
      ...MOCK_TASKS.microtasks,
      ...MOCK_TASKS.usertesting,
      ...MOCK_TASKS.consulting,
    ];
    
    // Filter and enhance tasks
    const enhancedTasks = allTasks.map(task => ({
      ...task,
      icon: getTaskIcon(task.category),
      matchScore: Math.floor(Math.random() * 30) + 70, // 70-100 match score
      estimatedEarnings: task.amount,
      expiresAt: task.expiresAt || new Date(Date.now() + 7200000), // Default 2 hours
    }));
    
    // Sort by match score and amount
    const sortedTasks = enhancedTasks.sort((a, b) => {
      const scoreA = a.matchScore * 0.5 + a.amount * 0.5;
      const scoreB = b.matchScore * 0.5 + b.amount * 0.5;
      return scoreB - scoreA;
    });
    
    res.json({
      success: true,
      tasks: sortedTasks,
      totalAvailable: sortedTasks.reduce((sum, task) => sum + task.amount, 0),
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

// Get user earnings
exports.getUserEarnings = async (req, res) => {
  try {
    const { userId } = req.user;
    
    const earningsDoc = await db.collection('flowboost_earnings').doc(userId).get();
    
    if (earningsDoc.exists) {
      const earnings = earningsDoc.data();
      
      // Calculate time-based earnings
      const completedTasks = await db.collection('flowboost_user_tasks')
        .where('userId', '==', userId)
        .where('status', '==', 'completed')
        .get();
      
      const tasks = completedTasks.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      const now = new Date();
      const today = new Date(now.setHours(0, 0, 0, 0));
      const weekAgo = new Date(now.setDate(now.getDate() - 7));
      const monthAgo = new Date(now.setDate(now.getDate() - 30));
      
      const todayEarnings = tasks
        .filter(task => task.completedAt?.toDate() >= today)
        .reduce((sum, task) => sum + (task.earnings || 0), 0);
      
      const weekEarnings = tasks
        .filter(task => task.completedAt?.toDate() >= weekAgo)
        .reduce((sum, task) => sum + (task.earnings || 0), 0);
      
      const monthEarnings = tasks
        .filter(task => task.completedAt?.toDate() >= monthAgo)
        .reduce((sum, task) => sum + (task.earnings || 0), 0);
      
      res.json({
        success: true,
        earnings: {
          total: earnings.total || 0,
          available: earnings.available || 0,
          today: todayEarnings,
          week: weekEarnings,
          month: monthEarnings,
          lifetime: earnings.total || 0,
        },
      });
    } else {
      res.json({
        success: true,
        earnings: {
          total: 0,
          available: 0,
          today: 0,
          week: 0,
          month: 0,
          lifetime: 0,
        },
      });
    }
  } catch (error) {
    console.error('Error fetching earnings:', error);
    res.status(500).json({ error: 'Failed to fetch earnings' });
  }
};

// Get FlowScore
exports.getFlowScore = async (req, res) => {
  try {
    const { userId } = req.user;
    
    const completedTasks = await db.collection('flowboost_user_tasks')
      .where('userId', '==', userId)
      .where('status', '==', 'completed')
      .get();
    
    const totalTasks = completedTasks.size;
    
    // Simple scoring algorithm
    let score = 50; // Base score
    score += Math.min(totalTasks * 2, 30); // Up to 30 points for task completion
    
    // Add points for quality (mock for now)
    const highQualityTasks = Math.floor(totalTasks * 0.8); // Assume 80% are high quality
    score += Math.min(highQualityTasks * 3, 20); // Up to 20 points for quality
    
    res.json({
      success: true,
      flowScore: Math.min(score, 100),
      tasksCompleted: totalTasks,
      level: score >= 90 ? 'Expert' : score >= 70 ? 'Advanced' : score >= 50 ? 'Intermediate' : 'Beginner',
    });
  } catch (error) {
    console.error('Error calculating FlowScore:', error);
    res.status(500).json({ error: 'Failed to calculate FlowScore' });
  }
};

// Start a task
exports.startTask = async (req, res) => {
  try {
    const { userId } = req.user;
    const { taskId } = req.body;
    
    if (!taskId) {
      return res.status(400).json({ error: 'Task ID is required' });
    }
    
    // Find the task
    const task = findTaskById(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    // Record task start
    const taskRef = db.collection('flowboost_user_tasks').doc(`${userId}_${taskId}`);
    await taskRef.set({
      userId,
      taskId,
      status: 'in_progress',
      startedAt: admin.firestore.FieldValue.serverTimestamp(),
      provider: task.provider,
      amount: task.amount,
      title: task.title,
      category: task.category,
    });
    
    // In production, this would redirect to the actual task provider
    res.json({
      success: true,
      taskUrl: `https://flowdesk.app/flowboost/task/${taskId}`,
      message: 'Task started successfully',
      task: {
        id: taskId,
        title: task.title,
        amount: task.amount,
        estimatedDuration: task.duration,
      },
    });
  } catch (error) {
    console.error('Error starting task:', error);
    res.status(500).json({ error: 'Failed to start task' });
  }
};

// Complete a task
exports.completeTask = async (req, res) => {
  try {
    const { userId } = req.user;
    const { taskId, completionData } = req.body;
    
    if (!taskId) {
      return res.status(400).json({ error: 'Task ID is required' });
    }
    
    const taskRef = db.collection('flowboost_user_tasks').doc(`${userId}_${taskId}`);
    const taskDoc = await taskRef.get();
    
    if (!taskDoc.exists) {
      return res.status(404).json({ error: 'Task not found or not started' });
    }
    
    const taskData = taskDoc.data();
    
    // Update task status
    await taskRef.update({
      status: 'completed',
      completedAt: admin.firestore.FieldValue.serverTimestamp(),
      completionData,
      earnings: taskData.amount,
    });
    
    // Update user earnings
    const earningsRef = db.collection('flowboost_earnings').doc(userId);
    const earningsDoc = await earningsRef.get();
    
    if (earningsDoc.exists) {
      const currentEarnings = earningsDoc.data();
      await earningsRef.update({
        total: (currentEarnings.total || 0) + taskData.amount,
        available: (currentEarnings.available || 0) + taskData.amount,
        lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
      });
    } else {
      await earningsRef.set({
        userId,
        total: taskData.amount,
        available: taskData.amount,
        withdrawn: 0,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
    
    res.json({
      success: true,
      earnings: taskData.amount,
      message: `Task completed! You earned $${taskData.amount.toFixed(2)}`,
    });
  } catch (error) {
    console.error('Error completing task:', error);
    res.status(500).json({ error: 'Failed to complete task' });
  }
};

// Join waitlist
exports.joinWaitlist = async (req, res) => {
  try {
    const { name, email, businessType, expectedUsage } = req.body;
    
    // Basic validation
    if (!name || !email || !businessType) {
      return res.status(400).json({ 
        error: 'Name, email, and business type are required' 
      });
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Invalid email address' 
      });
    }
    
    // Check if email already exists in waitlist
    const waitlistRef = db.collection('flowboost_waitlist');
    const existingDoc = await waitlistRef.where('email', '==', email.toLowerCase()).get();
    
    if (!existingDoc.empty) {
      return res.status(400).json({ 
        error: 'Email already registered for waitlist' 
      });
    }
    
    // Add to waitlist
    const waitlistData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      businessType: businessType.trim(),
      expectedUsage: expectedUsage?.trim() || '',
      signupDate: admin.firestore.FieldValue.serverTimestamp(),
      source: req.headers.referer || 'direct',
      notified: false,
    };
    
    await waitlistRef.add(waitlistData);
    
    // TODO: Send welcome email using Mailgun
    // This would be implemented when email service is configured
    
    res.json({
      success: true,
      message: 'Successfully joined FlowBoost waitlist',
    });
  } catch (error) {
    console.error('Error joining waitlist:', error);
    res.status(500).json({ error: 'Failed to join waitlist' });
  }
};

// Helper functions
function getTaskIcon(category) {
  const icons = {
    survey: '📊',
    categorization: '🏷️',
    writing: '📝',
    usability: '🔍',
    consulting: '🤝',
    review: '⭐',
    transcription: '🎧',
    research: '🔬',
  };
  return icons[category] || '📋';
}

function findTaskById(taskId) {
  const allTasks = [
    ...MOCK_TASKS.surveys,
    ...MOCK_TASKS.microtasks,
    ...MOCK_TASKS.usertesting,
    ...MOCK_TASKS.consulting,
  ];
  return allTasks.find(task => task.id === taskId);
}

module.exports = exports;
