import React from 'react';
import { Container, Typography, Box, Paper, Grid } from '@mui/material';
import { 
  Security, 
  Visibility, 
  AccountBox,
  DeleteForever,
  VerifiedUser,
  Lock,
  Shield
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const Section = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginBottom: theme.spacing(1),
  borderRadius: theme.spacing(2),
  border: '2px solid',
  borderColor: theme.palette.divider,
  display: 'flex',
  gap: theme.spacing(3),
  alignItems: 'flex-start',
  boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    boxShadow: '0 3px 6px rgba(0,0,0,0.12)',
    borderColor: theme.palette.primary[100],
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.spacing(2),
  backgroundColor: theme.palette.primary.main,
  width: 56,
  height: 56,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& .MuiSvgIcon-root': {
    color: 'white',
    fontSize: 28,
  }
}));

const PrivacyPolicyPage = () => {
  const sections = [
    {
      title: "Your Privacy is Our Priority",
      content: "We believe in complete transparency about how we collect and use your data. Your trust is our foundation, and we're committed to protecting your privacy with industry-leading security measures.",
      icon: <Shield />
    },
    {
      title: "Secure Data Collection",
      content: "We only collect information that's essential for providing you with personalized cognitive insights. All data is encrypted using bank-grade security protocols, ensuring your information remains private and protected.",
      icon: <Security />
    },
    {
      title: "Transparent Data Usage",
      content: "Your data is used exclusively to generate personalized insights and improve our services. We never sell your personal information to third parties or use it for advertising purposes.",
      icon: <Visibility />
    },
    {
      title: "Advanced Data Protection",
      content: "We employ state-of-the-art security measures, including end-to-end encryption, secure data centers, and regular security audits to protect your information from unauthorized access.",
      icon: <Lock />
    },
    {
      title: "Your Data Rights",
      content: "You have complete control over your data. Access, download, or delete your information at any time. We provide easy-to-use tools to help you manage your privacy preferences.",
      icon: <AccountBox />
    },
    {
      title: "Data Deletion Promise",
      content: "Request complete deletion of your data at any time. When you delete your account, we ensure all your personal information is permanently removed from our systems.",
      icon: <DeleteForever />
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography 
          variant="h2" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 700,
            color: 'primary.dark',
            mb: 3
          }}
        >
          Privacy & Security
        </Typography>

        <Typography 
          variant="h5" 
          color="text.secondary"
          sx={{ 
            maxWidth: '800px', 
            mx: 'auto', 
            mb: 2,
            lineHeight: 1.6
          }}
        >
          Your privacy and security are fundamental to everything we do.
        </Typography>
        
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{ 
            maxWidth: '700px', 
            mx: 'auto',
            mb: 6 
          }}
        >
          We understand the sensitive nature of cognitive data and maintain the highest standards 
          of privacy and security to protect your information.
        </Typography>
      </Box>

      <Grid container spacing={1}>
        {sections.map((section, index) => (
          <Grid item xs={12} key={index}>
            <Section>
              <IconWrapper>
                {section.icon}
              </IconWrapper>
              <Box>
                <Typography 
                  variant="h5" 
                  component="h2" 
                  gutterBottom
                  sx={{ 
                    fontWeight: 600,
                    color: 'text.primary'
                  }}
                >
                  {section.title}
                </Typography>
                <Typography 
                  color="text.secondary"
                  sx={{ 
                    lineHeight: 1.7,
                    fontSize: '1.05rem'
                  }}
                >
                  {section.content}
                </Typography>
              </Box>
            </Section>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ 
        textAlign: 'center', 
        mt: 8,
        p: 4,
        bgcolor: 'primary.100',
        borderRadius: 4,
        maxWidth: '1000px',
        mx: 'auto',
        border: '2px solid',
        borderColor: 'divider',
        boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          bgcolor: 'action.hover',
          boxShadow: '0 3px 6px rgba(0,0,0,0.12)',
          borderColor: 'primary.100',
        }
      }}>
        <VerifiedUser sx={{ fontSize: 40, color: 'primary.dark', mb: 2 }} />
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.dark' }}>
          Our Commitment to You
        </Typography>
        <Typography color="text.secondary">
          We're committed to maintaining the trust you place in us. If you have any questions about our 
          privacy practices, please don't hesitate to contact our dedicated privacy team.
        </Typography>
      </Box>
    </Container>
  );
};

export default PrivacyPolicyPage; 