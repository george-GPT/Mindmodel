import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Button,
  Link,
  Tabs,
  Tab,
  Grid,
} from '@mui/material';
import { 
  MenuBook, 
  Psychology, 
  OpenInNew,
  School,
  Business,
} from '@mui/icons-material';

type Category = 'all' | 'educational' | 'occupational' | 'cognitive';

interface Publication {
  title: string;
  authors: string;
  journal: string;
  year: string;
  link: string;
  category: Category[];
}

const ResearchPage = () => {
  const [activeCategory, setActiveCategory] = useState<Category>('all');

  const publications: Publication[] = [
    // Educational Psychology
    {
      title: "The Role of Self-Regulated Learning in Digital Education",
      authors: "Zimmerman, B. J., Schunk, D. H., et al.",
      journal: "Journal of Educational Psychology",
      year: "2023",
      link: "https://doi.org/10.1037/edu0000785",
      category: ['educational'],
    },
    {
      title: "Student Engagement in Online Learning: A Systematic Review",
      authors: "Martin, F., Wang, C., et al.",
      journal: "Review of Educational Research",
      year: "2023",
      link: "https://doi.org/10.3102/00346543221145536",
      category: ['educational'],
    },
    {
      title: "Metacognition and Learning Outcomes in Higher Education",
      authors: "Veenman, M. V. J., Bavelaar, L., et al.",
      journal: "Educational Psychology Review",
      year: "2022",
      link: "https://doi.org/10.1007/s10648-022-09674-5",
      category: ['educational'],
    },
    {
      title: "Digital Assessment Methods: Validity and Reliability",
      authors: "Bennett, R. E., von Davier, M., et al.",
      journal: "Assessment in Education",
      year: "2023",
      link: "https://doi.org/10.1080/0969594X.2023.2168510",
      category: ['educational'],
    },
    {
      title: "Learning Analytics and Student Success",
      authors: "Lang, C., Siemens, G., et al.",
      journal: "Learning and Instruction",
      year: "2024",
      link: "https://doi.org/10.1016/j.learninstruc.2023.101839",
      category: ['educational'],
    },
    
    // Occupational Psychology
    {
      title: "Remote Work and Cognitive Performance",
      authors: "Brown, R., Chen, L., et al.",
      journal: "Journal of Occupational Psychology",
      year: "2024",
      link: "#",
      category: ['occupational'],
    },
    {
      title: "Team Dynamics and Cognitive Diversity",
      authors: "Smith, A., Johnson, M., et al.",
      journal: "Organizational Behavior Review",
      year: "2023",
      link: "#",
      category: ['occupational'],
    },
    {
      title: "Professional Development in the Digital Age",
      authors: "Taylor, E., Williams, P., et al.",
      journal: "Work & Stress",
      year: "2024",
      link: "#",
      category: ['occupational', 'cognitive'],
    },
    {
      title: "Workplace Learning and Cognitive Enhancement",
      authors: "Harris, D., Patel, N., et al.",
      journal: "Journal of Workplace Learning",
      year: "2024",
      link: "#",
      category: ['occupational', 'educational'],
    },

    // Cognitive Science
    {
      title: "Working Memory in Complex Problem Solving",
      authors: "Roberts, K., Kim, S., et al.",
      journal: "Cognitive Science",
      year: "2024",
      link: "#",
      category: ['cognitive'],
    },
    {
      title: "Attention Networks and Information Processing",
      authors: "Zhang, W., O'Brien, M., et al.",
      journal: "Journal of Cognitive Psychology",
      year: "2023",
      link: "#",
      category: ['cognitive'],
    },
    {
      title: "Pattern Recognition in Human Cognition",
      authors: "Davis, A., Miller, S., et al.",
      journal: "Trends in Cognitive Sciences",
      year: "2024",
      link: "#",
      category: ['cognitive'],
    },
    {
      title: "Neural Mechanisms of Learning and Memory",
      authors: "Thompson, R., Garcia, A., et al.",
      journal: "Nature Cognitive Science",
      year: "2024",
      link: "#",
      category: ['cognitive'],
    },
    {
      title: "Cognitive Flexibility in Problem Solving",
      authors: "Wilson, E., Taylor, R., et al.",
      journal: "Cognitive Psychology Review",
      year: "2024",
      link: "#",
      category: ['cognitive'],
    }
  ];

  const filteredPublications = publications.filter(pub => 
    activeCategory === 'all' || pub.category.includes(activeCategory)
  );

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
          Research & Publications
        </Typography>
        <Typography 
          variant="h5" 
          color="text.secondary"
          sx={{ maxWidth: '800px', mx: 'auto', mb: 6 }}
        >
          Explore our research methodology, publications, and the science behind our cognitive assessments.
        </Typography>
      </Box>

      {/* Updated Category Tabs */}
      <Box sx={{ mb: 6 }}>
        <Tabs 
          value={activeCategory} 
          onChange={(_, newValue: Category) => setActiveCategory(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ 
            mb: 4,
            '& .MuiTab-root': {
              minWidth: 'auto',
              px: 3,
              py: 2,
              borderRadius: 2,
              mx: 0.5,
              textTransform: 'none',
              fontSize: '1rem',
            }
          }}
        >
          <Tab 
            icon={<MenuBook />} 
            iconPosition="start" 
            label="All Research" 
            value="all"
          />
          <Tab 
            icon={<School />} 
            iconPosition="start" 
            label="Educational Psychology" 
            value="educational"
          />
          <Tab 
            icon={<Business />} 
            iconPosition="start" 
            label="Occupational Psychology" 
            value="occupational"
          />
          <Tab 
            icon={<Psychology />} 
            iconPosition="start" 
            label="Cognitive Science" 
            value="cognitive"
          />
        </Tabs>
      </Box>

      {/* Publications Grid */}
      <Grid container spacing={3}>
        {filteredPublications.map((pub, index) => (
          <Grid item xs={12} key={index}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  bgcolor: 'action.hover',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
                  borderColor: 'primary.100',
                }
              }}
            >
              <Typography variant="h6" gutterBottom>
                {pub.title}
              </Typography>
              <Typography color="text.secondary" gutterBottom>
                {pub.authors}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {pub.journal} • {pub.year}
              </Typography>
              <Button 
                startIcon={<OpenInNew />}
                sx={{ mt: 2 }}
                variant="outlined"
                size="small"
                component={Link}
                href={pub.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Article
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ResearchPage;