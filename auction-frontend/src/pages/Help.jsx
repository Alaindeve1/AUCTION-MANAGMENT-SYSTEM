import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  TextField,
  Paper,
  Divider,
  Container,
  useTheme,
  useMediaQuery,
  Fade
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  QuestionAnswer as QuestionAnswerIcon,
  Support as SupportIcon,
  Security as SecurityIcon,
  Payment as PaymentIcon,
  Gavel as GavelIcon,
  AccountCircle as AccountIcon,
  Send as SendIcon
} from '@mui/icons-material';

const Help = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [expanded, setExpanded] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your message. We will get back to you soon!');
    setContactForm({ name: '', email: '', subject: '', message: '' });
  };

  const handleContactChange = (e) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value
    });
  };

  const supportTopics = [
    {
      icon: <AccountIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Account & Profile',
      description: 'Learn how to manage your account settings and profile information.'
    },
    {
      icon: <GavelIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Bidding Guide',
      description: 'Everything you need to know about placing bids and winning auctions.'
    },
    {
      icon: <PaymentIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Payment & Pricing',
      description: 'Information about payment methods, fees, and pricing policies.'
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Security & Privacy',
      description: 'How we protect your data and ensure secure transactions.'
    }
  ];

  const faqs = [
    {
      question: 'How do I place a bid?',
      answer: 'To place a bid, navigate to the item you\'re interested in, enter your bid amount in the bidding box, and click "Place Bid". Make sure you have sufficient funds in your account.'
    },
    {
      question: 'What happens if I win an auction?',
      answer: 'When you win an auction, you\'ll receive a notification. You\'ll need to complete the payment within 24 hours. After payment confirmation, the seller will be notified to ship your item.'
    },
    {
      question: 'How do I track my orders?',
      answer: 'You can track your orders in the "My Wins" section of your profile. Each order will have a tracking number once the seller ships the item.'
    },
    {
      question: 'What payment methods are accepted?',
      answer: 'We accept major credit cards, PayPal, and bank transfers. All payments are processed securely through our payment gateway.'
    },
    {
      question: 'How do I report a problem?',
      answer: 'You can report any issues through the "Contact Support" form on this page, or by emailing our support team directly at support@auctionhub.com'
    }
  ];

  return (
    <Fade in timeout={800}>
      <Box sx={{ 
        ml: { xs: 0, sm: '240px' },
        width: { xs: '100%', sm: `calc(100% - 240px)` },
        minHeight: '100vh',
        backgroundColor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        <Container 
          maxWidth="lg" 
          sx={{ 
            py: { xs: 1, sm: 2, md: 3 },
            px: { xs: 1, sm: 2 },
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: 1.5, sm: 2, md: 3 },
            overflow: 'auto'
          }}
        >
          {/* Header Section */}
          <Box textAlign="center" sx={{ mb: { xs: 1, sm: 2 } }}>
            <Typography 
              variant="h3" 
              fontWeight={700} 
              color="primary.main" 
              gutterBottom
              sx={{
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.25rem' },
                lineHeight: 1.2
              }}
            >
              Help & Support
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary"
              sx={{
                fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem' },
                lineHeight: 1.4
              }}
            >
              We're here to help you with any questions or concerns
            </Typography>
          </Box>

          {/* Support Topics Grid */}
          <Box>
            <Typography 
              variant="h4" 
              fontWeight={600} 
              mb={{ xs: 2, sm: 3, md: 4 }} 
              color="primary.main"
              sx={{
                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }
              }}
            >
              How can we help you?
            </Typography>
            <Grid container spacing={{ xs: 2, sm: 3 }}>
              {supportTopics.map((topic, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: { xs: 'none', sm: 'translateY(-8px)' },
                        boxShadow: { xs: 1, sm: 6 },
                        '& .MuiSvgIcon-root': {
                          transform: { xs: 'none', sm: 'scale(1.1)' },
                        }
                      }
                    }}
                  >
                    <CardContent sx={{ 
                      textAlign: 'center', 
                      p: { xs: 2, sm: 3, md: 4 } 
                    }}>
                      <Box sx={{ 
                        mb: { xs: 1, sm: 2 },
                        '& .MuiSvgIcon-root': {
                          fontSize: { xs: 32, sm: 40 },
                          transition: 'transform 0.3s ease'
                        }
                      }}>
                        {topic.icon}
                      </Box>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          mb: { xs: 0.5, sm: 1 }, 
                          fontWeight: 600,
                          fontSize: { xs: '1rem', sm: '1.25rem' }
                        }}
                      >
                        {topic.title}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{
                          fontSize: { xs: '0.875rem', sm: '1rem' }
                        }}
                      >
                        {topic.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* FAQs Section */}
          <Box>
            <Typography 
              variant="h4" 
              fontWeight={600} 
              mb={{ xs: 2, sm: 3, md: 4 }} 
              color="primary.main"
              sx={{
                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }
              }}
            >
              Frequently Asked Questions
            </Typography>
            <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden' }}>
              {faqs.map((faq, index) => (
                <Accordion
                  key={index}
                  expanded={expanded === `panel${index}`}
                  onChange={handleAccordionChange(`panel${index}`)}
                  sx={{
                    '&:not(:last-child)': {
                      borderBottom: '1px solid',
                      borderColor: 'divider'
                    },
                    '&:before': {
                      display: 'none'
                    }
                  }}
                >
                  <AccordionSummary 
                    expandIcon={<ExpandMoreIcon />}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'action.hover'
                      },
                      px: { xs: 1, sm: 2 }
                    }}
                  >
                    <Typography 
                      fontWeight={500}
                      sx={{
                        fontSize: { xs: '0.875rem', sm: '1rem' }
                      }}
                    >
                      {faq.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ px: { xs: 1, sm: 2 } }}>
                    <Typography 
                      color="text.secondary"
                      sx={{
                        fontSize: { xs: '0.875rem', sm: '1rem' }
                      }}
                    >
                      {faq.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Paper>
          </Box>

          {/* Contact Section */}
          <Box mb={{ xs: 2, sm: 3, md: 4 }}>
            <Typography 
              variant="h4" 
              fontWeight={600} 
              mb={{ xs: 2, sm: 3, md: 4 }} 
              color="primary.main"
              sx={{
                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }
              }}
            >
              Contact Us
            </Typography>
            <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
              <Grid item xs={12} md={5}>
                <Paper 
                  elevation={3} 
                  sx={{ 
                    p: { xs: 2, sm: 3, md: 4 }, 
                    height: '100%',
                    borderRadius: 2,
                    backgroundColor: 'primary.light',
                    color: 'primary.contrastText'
                  }}
                >
                  <Typography 
                    variant="h5" 
                    fontWeight={600} 
                    mb={{ xs: 2, sm: 3 }}
                    sx={{
                      fontSize: { xs: '1.25rem', sm: '1.5rem' }
                    }}
                  >
                    Get in Touch
                  </Typography>
                  <Box sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
                    <Box display="flex" alignItems="center" mb={{ xs: 2, sm: 3 }}>
                      <EmailIcon sx={{ mr: 2, fontSize: { xs: 24, sm: 28 } }} />
                      <Typography 
                        variant="body1"
                        sx={{
                          fontSize: { xs: '0.875rem', sm: '1rem' }
                        }}
                      >
                        support@auctionhub.com
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" mb={{ xs: 2, sm: 3 }}>
                      <PhoneIcon sx={{ mr: 2, fontSize: { xs: 24, sm: 28 } }} />
                      <Typography 
                        variant="body1"
                        sx={{
                          fontSize: { xs: '0.875rem', sm: '1rem' }
                        }}
                      >
                        +1 (555) 123-4567
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                      <LocationIcon sx={{ mr: 2, fontSize: { xs: 24, sm: 28 } }} />
                      <Typography 
                        variant="body1"
                        sx={{
                          fontSize: { xs: '0.875rem', sm: '1rem' }
                        }}
                      >
                        123 Auction Street, City, Country
                      </Typography>
                    </Box>
                  </Box>
                  <Divider sx={{ my: { xs: 2, sm: 3 }, borderColor: 'rgba(255, 255, 255, 0.2)' }} />
                  <Typography 
                    variant="body2"
                    sx={{
                      fontSize: { xs: '0.75rem', sm: '0.875rem' }
                    }}
                  >
                    Our support team is available Monday through Friday, 9:00 AM to 6:00 PM EST.
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={7}>
                <Paper 
                  elevation={3} 
                  sx={{ 
                    p: { xs: 2, sm: 3, md: 4 },
                    borderRadius: 2,
                    height: '100%'
                  }}
                >
                  <Typography 
                    variant="h5" 
                    fontWeight={600} 
                    mb={{ xs: 2, sm: 3 }} 
                    color="primary.main"
                    sx={{
                      fontSize: { xs: '1.25rem', sm: '1.5rem' }
                    }}
                  >
                    Send us a Message
                  </Typography>
                  <form 
                    action="https://formspree.io/f/xeogdzry" 
                    method="POST"
                    onSubmit={(e) => {
                      handleContactSubmit(e);
                    }}
                  >
                    <Grid container spacing={{ xs: 2, sm: 3 }}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Name"
                          name="name"
                          value={contactForm.name}
                          onChange={handleContactChange}
                          required
                          variant="outlined"
                          size={isMobile ? "small" : "medium"}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Email"
                          name="email"
                          type="email"
                          value={contactForm.email}
                          onChange={handleContactChange}
                          required
                          variant="outlined"
                          size={isMobile ? "small" : "medium"}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Subject"
                          name="subject"
                          value={contactForm.subject}
                          onChange={handleContactChange}
                          required
                          variant="outlined"
                          size={isMobile ? "small" : "medium"}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Message"
                          name="message"
                          multiline
                          rows={isMobile ? 3 : 4}
                          value={contactForm.message}
                          onChange={handleContactChange}
                          required
                          variant="outlined"
                          size={isMobile ? "small" : "medium"}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                          size={isMobile ? "medium" : "large"}
                          startIcon={<SendIcon />}
                          fullWidth
                          sx={{ 
                            py: { xs: 1, sm: 1.5 },
                            textTransform: 'none',
                            fontSize: { xs: '1rem', sm: '1.1rem' }
                          }}
                        >
                          Send Message
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
    </Fade>
  );
};

export default Help; 