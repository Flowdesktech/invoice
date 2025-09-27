import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Description as DocumentIcon,
  AccountBalance as InvoiceIcon,
  People as CustomerIcon,
  Schedule as RecurringIcon,
  Assessment as ReportsIcon,
  Settings as SettingsIcon,
  Security as SecurityIcon,
  ContactSupport as SupportIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  Code as CodeIcon,
  Api as ApiIcon,
  Speed as SpeedIcon,
  ContentCopy as ContentCopyIcon,
  Palette as PaletteIcon,
  CloudSync as CloudSyncIcon,
  RocketLaunch as RocketIcon,
  AutoAwesome as AutoAwesomeIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from "../components/Header.jsx";

const Documentation = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState(0);
  const [expandedSection, setExpandedSection] = useState(false);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedSection(isExpanded ? panel : false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <>
      {/* React 19 SEO Meta Tags */}
      <title>Documentation - FlowDesk Invoice Management & FlowBoost Guide</title>
      <meta name="description" content="Complete FlowDesk documentation. Learn how to create invoices, manage customers, integrate FlowBoost AI features, and use all features of our invoice management platform." />
      <meta name="keywords" content="FlowDesk documentation, FlowBoost integration, invoice software guide, AI invoice automation, billing software help" />
      <link rel="canonical" href="https://flowdesk.tech/docs" />
      <meta name="robots" content="index, follow" />
      
      {/* Documentation Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "TechArticle",
          "headline": "FlowDesk & FlowBoost Documentation",
          "description": "Complete guide to using FlowDesk invoice management software with FlowBoost AI integration",
          "url": "https://flowdesk.tech/docs",
          "datePublished": "2025-09-01",
          "dateModified": new Date().toISOString(),
          "author": {
            "@type": "Organization",
            "name": "FlowDesk"
          }
        })}
      </script>
      
      <Header />
      <Container maxWidth="lg" sx={{ mt: 12, mb: 12 }}>

        <Paper sx={{ p: { xs: 3, sm: 5 }, mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }} color="white">
            FlowDesk Documentation
          </Typography>
          <Typography variant="h6" paragraph  color="white">
            Complete guide to invoice management with FlowDesk and AI-powered automation with FlowBoost
          </Typography>
          <Box sx={{ mt: 3 }}>
            <Chip label="Version 2.0" sx={{ mr: 1, backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }} />
            <Chip label="FlowBoost Enabled" icon={<AutoAwesomeIcon />} sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }} />
          </Box>
        </Paper>

        {/* Navigation Tabs */}
        <Paper sx={{ mb: 4 }}>
          <Tabs value={selectedTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
            <Tab label="Getting Started" />
            <Tab label="Invoice Management" />
            <Tab label="Customer Management" />
            <Tab label="FlowBoost AI Features" icon={<AutoAwesomeIcon />} iconPosition="start" />
            <Tab label="API Documentation" />
            <Tab label="Templates & Customization" />
          </Tabs>
        </Paper>

        {/* Tab Content - Getting Started */}
        {selectedTab === 0 && (
          <Box>
            <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: '600' }}>
              Getting Started with FlowDesk
            </Typography>
            
            <Alert severity="info" sx={{ mb: 3 }}>
              FlowDesk is a comprehensive invoice management platform designed for freelancers, small businesses, and enterprises. 
              Get started in minutes with our intuitive interface.
            </Alert>

            <Accordion expanded={expandedSection === 'account-setup'} onChange={handleAccordionChange('account-setup')}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">Account Setup</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  <ListItem>
                    <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                    <ListItemText 
                      primary="1. Register Your Account"
                      secondary="Sign up at flowdesk.tech with your email or Google account. No credit card required."
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                    <ListItemText 
                      primary="2. Complete Your Profile"
                      secondary="Add your business information, logo, and contact details. This will appear on all your invoices."
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                    <ListItemText 
                      primary="3. Configure Invoice Settings"
                      secondary="Set your default currency, tax rates, payment terms, and invoice numbering format."
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                    <ListItemText 
                      primary="4. Add Your First Customer"
                      secondary="Import customers from CSV or add them manually with all their billing information."
                    />
                  </ListItem>
                </List>
              </AccordionDetails>
            </Accordion>

            <Accordion expanded={expandedSection === 'dashboard'} onChange={handleAccordionChange('dashboard')}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">Dashboard Overview</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography paragraph>
                  The FlowDesk dashboard provides a comprehensive view of your business finances:
                </Typography>
                <Grid container spacing={2}>
                  <Grid item size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
                      <Typography variant="subtitle1" fontWeight="bold">Key Metrics</Typography>
                      <List dense>
                        <ListItem>• Total Revenue (Monthly/Yearly)</ListItem>
                        <ListItem>• Outstanding Invoices</ListItem>
                        <ListItem>• Overdue Payments</ListItem>
                        <ListItem>• Customer Growth Rate</ListItem>
                      </List>
                    </Paper>
                  </Grid>
                  <Grid item size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
                      <Typography variant="subtitle1" fontWeight="bold">Quick Actions</Typography>
                      <List dense>
                        <ListItem>• Create New Invoice</ListItem>
                        <ListItem>• Add Customer</ListItem>
                        <ListItem>• View Recent Transactions</ListItem>
                        <ListItem>• Generate Reports</ListItem>
                      </List>
                    </Paper>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            <Accordion expanded={expandedSection === 'first-invoice'} onChange={handleAccordionChange('first-invoice')}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">Creating Your First Invoice</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Step-by-Step Guide:
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText 
                      primary="1. Navigate to Invoices → Create New"
                      secondary="Click the 'Create Invoice' button in your dashboard or navigation menu."
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="2. Select a Customer"
                      secondary="Choose from your existing customers or add a new one on the fly."
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="3. Add Line Items"
                      secondary="Add products or services with descriptions, quantities, and rates. FlowBoost can suggest items based on previous invoices."
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="4. Set Payment Terms"
                      secondary="Choose due date, payment terms (Net 30, Due on Receipt, etc.), and accepted payment methods."
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="5. Choose a Template"
                      secondary="Select from 15+ professional templates including Modern Blue, Corporate Dark, Creative Orange, and more."
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="6. Preview and Send"
                      secondary="Preview your invoice, make any final adjustments, and send via email or download as PDF."
                    />
                  </ListItem>
                </List>
              </AccordionDetails>
            </Accordion>
          </Box>
        )}

        {/* Tab Content - Invoice Management */}
        {selectedTab === 1 && (
          <Box>
            <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: '600' }}>
              Invoice Management
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item size={{ xs: 12, md: 6 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Invoice Features</Typography>
                    <List>
                      <ListItem>
                        <ListItemIcon><InvoiceIcon color="primary" /></ListItemIcon>
                        <ListItemText 
                          primary="Professional Templates"
                          secondary="15+ customizable templates optimized for different industries"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><RecurringIcon color="primary" /></ListItemIcon>
                        <ListItemText 
                          primary="Recurring Invoices"
                          secondary="Set up automated billing for subscription-based services"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><CloudSyncIcon color="primary" /></ListItemIcon>
                        <ListItemText 
                          primary="Real-time Sync"
                          secondary="All data synced across devices with Firebase integration"
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item size={{ xs: 12, md: 6 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Invoice States</Typography>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Status</TableCell>
                            <TableCell>Description</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow>
                            <TableCell><Chip label="Draft" size="small" /></TableCell>
                            <TableCell>Invoice saved but not sent</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell><Chip label="Sent" size="small" color="primary" /></TableCell>
                            <TableCell>Invoice sent to customer</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell><Chip label="Paid" size="small" color="success" /></TableCell>
                            <TableCell>Payment received in full</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell><Chip label="Overdue" size="small" color="error" /></TableCell>
                            <TableCell>Payment past due date</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Paper sx={{ p: 3, mt: 3 }}>
              <Typography variant="h6" gutterBottom>Bulk Operations</Typography>
              <Typography paragraph>
                Manage multiple invoices efficiently with bulk actions:
              </Typography>
              <List>
                <ListItem>• Send multiple invoices at once</ListItem>
                <ListItem>• Mark invoices as paid in bulk</ListItem>
                <ListItem>• Export invoices to CSV/Excel</ListItem>
                <ListItem>• Archive old invoices</ListItem>
                <ListItem>• Generate batch reports</ListItem>
              </List>
            </Paper>
          </Box>
        )}

        {/* Tab Content - Customer Management */}
        {selectedTab === 2 && (
          <Box>
            <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: '600' }}>
              Customer Management
            </Typography>
            
            <Alert severity="success" sx={{ mb: 3 }}>
              FlowDesk's CRM features help you maintain strong customer relationships and track billing history.
            </Alert>

            <Grid container spacing={3}>
              <Grid item size={{ xs: 12, lg: 8 }}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>Customer Information</Typography>
                  <Typography paragraph>
                    Store comprehensive customer details:
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item size={{ xs: 12, md: 6 }}>
                      <List dense>
                        <ListItem>• Company/Personal Name</ListItem>
                        <ListItem>• Email & Phone</ListItem>
                        <ListItem>• Billing Address</ListItem>
                        <ListItem>• Shipping Address</ListItem>
                        <ListItem>• Tax ID/VAT Number</ListItem>
                      </List>
                    </Grid>
                    <Grid item size={{ xs: 12, md: 6 }}>
                      <List dense>
                        <ListItem>• Payment Terms</ListItem>
                        <ListItem>• Preferred Currency</ListItem>
                        <ListItem>• Credit Limit</ListItem>
                        <ListItem>• Custom Notes</ListItem>
                        <ListItem>• Tags for Organization</ListItem>
                      </List>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              <Grid item size={{ xs: 12, lg: 4 }}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>Import Options</Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon><CloudSyncIcon /></ListItemIcon>
                      <ListItemText primary="CSV Import" secondary="Bulk import from spreadsheets" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><ApiIcon /></ListItemIcon>
                      <ListItemText primary="API Integration" secondary="Sync with other tools" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><SupportIcon /></ListItemIcon>
                      <ListItemText primary="Manual Entry" secondary="Add customers individually" />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Tab Content - FlowBoost AI Features */}
        {selectedTab === 3 && (
          <Box>
            <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: '600' }}>
              FlowBoost AI Features <Chip label="Premium" color="secondary" size="small" sx={{ ml: 2 }} />
            </Typography>
            
            <Alert severity="info" icon={<AutoAwesomeIcon />} sx={{ mb: 3 }}>
              FlowBoost uses advanced AI to automate and enhance your invoicing workflow. Join the waitlist for early access!
            </Alert>

            <Grid container spacing={3}>
              <Grid item size={{ xs: 12, md: 6 }}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      <RocketIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6">Smart Invoice Generation</Typography>
                    </Box>
                    <List>
                      <ListItem>
                        <ListItemText 
                          primary="Auto-fill line items"
                          secondary="AI predicts items based on customer history"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Description suggestions"
                          secondary="Generate professional descriptions automatically"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Pricing recommendations"
                          secondary="Suggest optimal pricing based on market data"
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item size={{ xs: 12, md: 6 }}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      <SpeedIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6">Workflow Automation</Typography>
                    </Box>
                    <List>
                      <ListItem>
                        <ListItemText 
                          primary="Payment reminders"
                          secondary="Automated follow-ups for overdue invoices"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Receipt scanning"
                          secondary="Extract data from receipts using OCR"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Expense categorization"
                          secondary="Auto-categorize transactions"
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item size={12}>
                <Paper sx={{ p: 3, backgroundColor: '#f5f5f5' }}>
                  <Typography variant="h6" gutterBottom>Coming Soon: FlowBoost Analytics</Typography>
                  <Grid container spacing={2}>
                    <Grid item size={{ xs: 12, md: 4 }}>
                      <Typography variant="subtitle2" color="primary">Cash Flow Predictions</Typography>
                      <Typography variant="body2">AI-powered forecasting for better financial planning</Typography>
                    </Grid>
                    <Grid item size={{ xs: 12, md: 4 }}>
                      <Typography variant="subtitle2" color="primary">Customer Insights</Typography>
                      <Typography variant="body2">Payment behavior analysis and risk assessment</Typography>
                    </Grid>
                    <Grid item size={{ xs: 12, md: 4 }}>
                      <Typography variant="subtitle2" color="primary">Revenue Optimization</Typography>
                      <Typography variant="body2">Identify growth opportunities and pricing strategies</Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Tab Content - API Documentation */}
        {selectedTab === 4 && (
          <Box>
            <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: '600' }}>
              API Documentation
            </Typography>
            
            <Alert severity="warning" sx={{ mb: 3 }}>
              API access is currently in beta. Request access through your dashboard settings.
            </Alert>

            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>Authentication</Typography>
              <Typography paragraph>
                All API requests require authentication using Firebase Auth tokens:
              </Typography>
              <Paper sx={{ p: 2, backgroundColor: '#1e1e1e', color: '#fff', fontFamily: 'monospace' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2">
                    Authorization: Bearer YOUR_FIREBASE_TOKEN
                  </Typography>
                  <Tooltip title="Copy to clipboard">
                    <IconButton size="small" onClick={() => copyToClipboard('Authorization: Bearer YOUR_FIREBASE_TOKEN')}>
                      <ContentCopyIcon fontSize="small" sx={{ color: '#fff' }} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Paper>
            </Paper>

            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Available Endpoints</Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Method</TableCell>
                      <TableCell>Endpoint</TableCell>
                      <TableCell>Description</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell><Chip label="GET" size="small" color="success" /></TableCell>
                      <TableCell><code>/api/invoices</code></TableCell>
                      <TableCell>List all invoices</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><Chip label="POST" size="small" color="primary" /></TableCell>
                      <TableCell><code>/api/invoices</code></TableCell>
                      <TableCell>Create new invoice</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><Chip label="GET" size="small" color="success" /></TableCell>
                      <TableCell><code>/api/invoices/:id</code></TableCell>
                      <TableCell>Get invoice by ID</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><Chip label="PUT" size="small" color="warning" /></TableCell>
                      <TableCell><code>/api/invoices/:id</code></TableCell>
                      <TableCell>Update invoice</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><Chip label="GET" size="small" color="success" /></TableCell>
                      <TableCell><code>/api/customers</code></TableCell>
                      <TableCell>List all customers</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><Chip label="POST" size="small" color="primary" /></TableCell>
                      <TableCell><code>/api/customers</code></TableCell>
                      <TableCell>Create new customer</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Box>
        )}

        {/* Tab Content - Templates & Customization */}
        {selectedTab === 5 && (
          <Box>
            <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: '600' }}>
              Templates & Customization
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item size={12}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>Available Templates</Typography>
                  <Typography paragraph>
                    Choose from our professionally designed templates, each optimized for different business types:
                  </Typography>
                  <Grid container spacing={2}>
                    {[
                      { name: 'Modern Blue', desc: 'Clean and professional', icon: <PaletteIcon /> },
                      { name: 'Corporate Dark', desc: 'Executive style', icon: <PaletteIcon /> },
                      { name: 'Creative Orange', desc: 'Bold and creative', icon: <PaletteIcon /> },
                      { name: 'Minimalist Gray', desc: 'Simple and elegant', icon: <PaletteIcon /> },
                      { name: 'Tech Gradient', desc: 'Modern tech companies', icon: <PaletteIcon /> },
                      { name: 'Startup Pink', desc: 'Fresh and innovative', icon: <PaletteIcon /> },
                    ].map((template) => (
                      <Grid item size={{ xs: 12, sm: 6, md: 4 }} key={template.name}>
                        <Card variant="outlined">
                          <CardContent>
                            <Box display="flex" alignItems="center" mb={1}>
                              {template.icon}
                              <Typography variant="subtitle1" sx={{ ml: 1, fontWeight: '500' }}>
                                {template.name}
                              </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                              {template.desc}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </Grid>

              <Grid item size={12}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>Customization Options</Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                      <ListItemText 
                        primary="Logo & Branding"
                        secondary="Upload your company logo and set brand colors"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                      <ListItemText 
                        primary="Custom Fields"
                        secondary="Add custom fields to invoices for specific business needs"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                      <ListItemText 
                        primary="Email Templates"
                        secondary="Customize email messages when sending invoices"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                      <ListItemText 
                        primary="Terms & Conditions"
                        secondary="Add custom terms, notes, and payment instructions"
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Help Section */}
        <Paper sx={{ p: 4, mt: 6, backgroundColor: 'primary.main', color: 'white' }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: '600' }} color="white">
            Need More Help?
          </Typography>
          <Typography variant="body1" paragraph color="white">
            Can't find what you're looking for? Our support team is here to help.
          </Typography>
          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => navigate('/contact')}
              sx={{ mr: 2 }}
            >
              Contact Support
            </Button>
            <Button
              variant="outlined"
              sx={{
                color: 'white',
                borderColor: 'white',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
              onClick={() => window.open('mailto:support@flowdesk.tech')}
            >
              Email Us
            </Button>
          </Box>
        </Paper>

        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Documentation Version 2.0 • Last Updated: {new Date().toLocaleDateString()}
          </Typography>
        </Box>
      </Container>
      
      <Footer />
    </>
  );
};

export default Documentation;
