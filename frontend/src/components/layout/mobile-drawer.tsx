// src/components/MobileNavigation/MobileNavigation.tsx
import React from 'react';

import Menu from '@mui/icons-material/Menu';
import Box from '@mui/joy/Box';
import Drawer from '@mui/joy/Drawer';
import IconButton from '@mui/joy/IconButton';
import List from '@mui/joy/List';
import ListItemButton from '@mui/joy/ListItemButton';
import ModalClose from '@mui/joy/ModalClose';
import { CssVarsProvider, extendTheme } from '@mui/joy/styles';

// Create a basic Joy UI theme
const theme = extendTheme({
  components: {
    JoyDrawer: {
      styleOverrides: {
        root: {
          zIndex: 1300,
        },
      },
    },
  },
});

interface NavigationItem {
  name: string;
  link: string;
  highlight?: boolean;
}

interface MobileNavigationProps {
  navigationItems: NavigationItem[];
  resourcesItems: NavigationItem[];
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  navigationItems,
  resourcesItems,
}) => {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <CssVarsProvider theme={theme}>
      <Box sx={{ display: { xs: "flex", md: "none" }, ml: "auto" }}>
        <IconButton
          variant="outlined"
          onClick={handleOpen}
          sx={{
            color: "white",
            borderColor: "primary.100",
            "&:hover": {
              borderColor: "#E0E0E0",
              color: "#E0E0E0",
            },
          }}
        >
          <Menu sx={{ color: "primary.100" }} />
        </IconButton>
      </Box>

      <Drawer
        open={open}
        onClose={handleClose}
        anchor="right"
        sx={{
          "--Drawer-width": "300px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            backgroundColor: "white",
          }}
        >
          <Box
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <IconButton onClick={handleClose} variant="plain" size="sm">
              <ModalClose />
            </IconButton>
          </Box>

          <List
            sx={{
              "--List-gap": "8px",
              "--ListItem-minHeight": "48px",
              "--ListItemDecorator-size": "32px",
              overflow: "auto",
              px: 2,
              py: 2,
            }}
          >
            {navigationItems.map(({ name, link, highlight }) => (
              <ListItemButton
                key={name}
                component="a"
                href={link}
                onClick={handleClose}
                sx={{
                  fontWeight: highlight ? 600 : 400,
                  color: highlight ? "#4B5FCC" : "inherit",
                  borderRadius: "8px",
                  "&:hover": {
                    backgroundColor: "rgba(75, 95, 204, 0.04)",
                  },
                }}
              >
                {name}
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>
    </CssVarsProvider>
  );
};
