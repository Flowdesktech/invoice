import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Chip,
  LinearProgress,
  IconButton,
  Tooltip,
  Alert,
  Skeleton,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Timer as TimerIcon,
  Star as StarIcon,
  AccountBalanceWallet as WalletIcon,
  Refresh as RefreshIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  LocalOffer as TagIcon,
  VideoCall as VideoCallIcon,
  Assignment as TaskIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { flowBoostAPI } from '../utils/api';
import toast from 'react-hot-toast';


const FlowBoost = () => {
  const { currentUser, userData } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [flowScore, setFlowScore] = useState(87);
  const [earnings, setEarnings] = useState({
    today: 45.50,
    week: 127.50,
    month: 523.75,
    lifetime: 2341.25,
  });

  useEffect(() => {
    if (currentUser) {
      fetchTasksAndEarnings();
    }
  }, [currentUser]);

  const fetchTasksAndEarnings = async () => {
    try {
      setLoading(true);
      
      // Fetch tasks and earnings in parallel
      const [tasksResponse, earningsResponse, scoreResponse] = await Promise.all([
        flowBoostAPI.getTasks(),
        flowBoostAPI.getEarnings(),
        flowBoostAPI.getScore(),
      ]);
      
      setTasks(tasksResponse.data.tasks || []);
      setEarnings(earningsResponse.data.earnings || {
        today: 0,
        week: 0,
        month: 0,
        lifetime: 0,
      });
      setFlowScore(scoreResponse.data.flowScore || 50);
    } catch (error) {
      console.error('Error fetching FlowBoost data:', error);
      toast.error('Failed to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchTasksAndEarnings();
    setRefreshing(false);
  };

  const handleStartTask = async (taskId) => {
    try {
      const response = await flowBoostAPI.startTask(taskId);
      
      if (response.data.success) {
        toast.success('Task started! Opening task window...');
        
        // Open task in new window/tab
        window.open(response.data.taskUrl, '_blank', 'width=1200,height=800');
        
        // Refresh tasks list
        await fetchTasksAndEarnings();
      }
    } catch (error) {
      console.error('Error starting task:', error);
      toast.error('Failed to start task. Please try again.');
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'success';
      case 'intermediate': return 'warning';
      case 'hard': return 'error';
      default: return 'default';
    }
  };

  if (!currentUser) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="info">
          Please log in to access FlowBoost and start earning.
        </Alert>
      </Container>
    );
  }

  return (
    <>
      {/* Page Meta */}
      <title>FlowBoost - Earn Money During Downtime | FlowDesk</title>
      <meta name="description" content="Monetize your business downtime with FlowBoost. Complete tasks matched to your skills and earn $5-50 per task." />

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Header Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={8}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
              <TrendingUpIcon sx={{ mr: 1, verticalAlign: 'bottom' }} />
              FlowBoost
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Intelligent task matching that boosts your cash flow during downtime
            </Typography>
          </Grid>
          <Grid item xs={12} md={4} sx={{ textAlign: { md: 'right' } }}>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
              <Tooltip title="Refresh tasks">
                <IconButton onClick={handleRefresh} disabled={refreshing}>
                  <RefreshIcon className={refreshing ? 'spinning' : ''} />
                </IconButton>
              </Tooltip>
              <Button variant="contained" startIcon={<WalletIcon />}>
                Withdraw: ${earnings.week.toFixed(2)}
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6" color="primary">
                ${earnings.today.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Today's Earnings
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                <StarIcon sx={{ color: 'gold' }} />
                <Typography variant="h6">{flowScore}/100</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                FlowScore
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6" color="success.main">
                ${(tasks.reduce((sum, task) => sum + task.amount, 0)).toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Available Now
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">
                ${earnings.lifetime.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Lifetime Earnings
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Flow Status Alert */}
        <Alert severity="info" sx={{ mb: 3 }} icon={<InfoIcon />}>
          <Typography variant="subtitle2">
            <strong>Smart Tip:</strong> Your main business is slow next Tuesday afternoon. 
            Premium tasks worth $75+ will be available during that time.
          </Typography>
        </Alert>

        {/* Tasks Section */}
        <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 500 }}>
          🎯 Matched Tasks (For You)
        </Typography>

        <Grid container spacing={3}>
          {loading ? (
            // Loading skeletons
            [1, 2, 3].map((i) => (
              <Grid item xs={12} md={6} key={i}>
                <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
              </Grid>
            ))
          ) : (
            tasks.map((task) => (
              <Grid item xs={12} md={6} key={task.id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 3,
                    },
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span style={{ fontSize: '1.5rem' }}>{task.icon}</span>
                        {task.title}
                      </Typography>
                      <Chip 
                        label={`$${task.amount}`} 
                        color="primary" 
                        size="small" 
                        sx={{ fontWeight: 'bold' }}
                      />
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {task.matchReason}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                      <Chip 
                        icon={<TimerIcon />} 
                        label={`${task.duration} min`} 
                        size="small" 
                        variant="outlined" 
                      />
                      <Chip 
                        label={task.difficulty} 
                        size="small" 
                        color={getDifficultyColor(task.difficulty)}
                      />
                      {task.requiresVideo && (
                        <Chip 
                          icon={<VideoCallIcon />} 
                          label="Video" 
                          size="small" 
                          variant="outlined" 
                        />
                      )}
                    </Box>

                    <Box sx={{ display: 'flex', gap: 0.5, mb: 2, flexWrap: 'wrap' }}>
                      {task.tags.map((tag, index) => (
                        <Chip 
                          key={index}
                          label={tag} 
                          size="small" 
                          sx={{ 
                            backgroundColor: 'rgba(25, 118, 210, 0.08)',
                            fontSize: '0.75rem',
                          }} 
                        />
                      ))}
                    </Box>

                    {task.bonus && (
                      <Typography variant="caption" color="success.main" sx={{ display: 'block', mb: 1 }}>
                        💰 {task.bonus}
                      </Typography>
                    )}

                    {task.expiresIn && (
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                        ⏰ Expires in {task.expiresIn}
                      </Typography>
                    )}

                    {task.spotsLeft && (
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                        {task.spotsLeft} spots left
                      </Typography>
                    )}

                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => handleStartTask(task.id)}
                      startIcon={<TaskIcon />}
                    >
                      Start Earning
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>

        {/* Why FlowBoost Section */}
        <Box sx={{ mt: 6, p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Why FlowBoost?
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <CheckCircleIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="subtitle2">Smart Matching</Typography>
                <Typography variant="caption" color="text.secondary">
                  Only see tasks that match your skills
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <CheckCircleIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="subtitle2">Business Integration</Typography>
                <Typography variant="caption" color="text.secondary">
                  Auto-tracked for taxes & invoicing
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <CheckCircleIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="subtitle2">Build Reputation</Typography>
                <Typography variant="caption" color="text.secondary">
                  Higher FlowScore = Better opportunities
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <CheckCircleIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="subtitle2">Instant Payment</Typography>
                <Typography variant="caption" color="text.secondary">
                  Withdraw anytime to your bank
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spinning {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </>
  );
};

export default FlowBoost;
