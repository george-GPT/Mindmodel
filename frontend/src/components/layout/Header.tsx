import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
    AppBar, 
    Link, 
    Stack, 
    Toolbar, 
    IconButton, 
    Menu, 
    MenuItem, 
    Avatar, 
    Button,
    Box,
    useTheme,
    useMediaQuery,
    Drawer,
    List,
    ListItemButton,
    ListItemText,
    Collapse
} from '@mui/material';
import { 
    AccountCircle,
    Dashboard as DashboardIcon,
    Menu as MenuIcon,
    KeyboardArrowDown,
    KeyboardArrowUp,
    ExpandMore
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';

import BrainLottie from '../assets/animations/brain-lottie';
import { RootState } from '../../store/store';
import { User } from '../../types/auth';

const Header: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [resourcesAnchorEl, setResourcesAnchorEl] = React.useState<null | HTMLElement>(null);
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [mobileResourcesOpen, setMobileResourcesOpen] = React.useState(false);

    const navigationItems = [
        { name: "Home", link: "/" },
        { name: "About Us", link: "/about-us" },
        { name: "Our Approach", link: "/our-approach" },
        { name: "Privacy", link: "/privacy-policy" },
    ];

    const resourcesItems = [
        { name: "Research", link: "/research" },
        { name: "Methodology", link: "/methodology" },
        { name: "Contact", link: "/contact" }
    ];

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleResourcesClick = (event: React.MouseEvent<HTMLElement>) => {
        setResourcesAnchorEl(event.currentTarget);
    };

    const handleResourcesClose = () => {
        setResourcesAnchorEl(null);
    };

    const handleMobileMenuToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const renderDesktopNav = () => (
        <Stack
            direction="row"
            justifyContent="center"
            spacing={3}
            sx={{
                display: { xs: "none", md: "flex" },
                ml: 4,
                flex: 1,
            }}
        >
            {navigationItems.map(({ name, link }) => (
                <Link
                    key={name}
                    component={RouterLink}
                    to={link}
                    sx={{
                        color: "white",
                        textDecoration: "none",
                        fontSize: "0.95rem",
                        fontWeight: 500,
                        py: 1,
                        "&:hover": {
                            color: "primary.200",
                            textDecoration: "none",
                        },
                    }}
                >
                    {name}
                </Link>
            ))}

            <Box
                onMouseEnter={(e) => setResourcesAnchorEl(e.currentTarget)}
                onMouseLeave={() => setResourcesAnchorEl(null)}
                sx={{ 
                    display: { xs: 'none', md: 'flex' },
                    alignItems: 'center'
                }}
            >
                <Link
                    sx={{
                        color: "white",
                        textDecoration: "none",
                        fontSize: "0.95rem",
                        fontWeight: 500,
                        py: 1,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        "&:hover": {
                            color: "primary.200",
                        },
                    }}
                >
                    Resources
                    <ExpandMore 
                        sx={{ 
                            fontSize: 20,
                            opacity: 0.8,
                            transition: 'transform 0.2s ease-in-out',
                            transform: resourcesAnchorEl ? 'rotate(180deg)' : 'rotate(0deg)',
                        }} 
                    />
                </Link>

                <Menu
                    anchorEl={resourcesAnchorEl}
                    open={Boolean(resourcesAnchorEl)}
                    onClose={() => setResourcesAnchorEl(null)}
                    elevation={3}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    MenuListProps={{ 
                        onMouseLeave: () => setResourcesAnchorEl(null),
                        disablePadding: true,
                    }}
                    PaperProps={{
                        sx: {
                            mt: 1,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            borderRadius: '8px',
                        }
                    }}
                    disableAutoFocusItem
                >
                    {resourcesItems.map(({ name, link }) => (
                        <MenuItem
                            key={name}
                            component={RouterLink}
                            to={link}
                            onClick={() => setResourcesAnchorEl(null)}
                            sx={{
                                fontSize: "0.95rem",
                                fontWeight: 500,
                                py: 1.5,
                                px: 3,
                                '&:hover': {
                                    bgcolor: 'action.hover',
                                },
                                '&.Mui-focusVisible': {
                                    bgcolor: 'transparent',
                                }
                            }}
                        >
                            {name}
                        </MenuItem>
                    ))}
                </Menu>
            </Box>
        </Stack>
    );

    const renderMobileNav = () => (
        <Drawer
            variant="temporary"
            anchor="right"
            open={mobileOpen}
            onClose={handleMobileMenuToggle}
            ModalProps={{ keepMounted: true }}
        >
            <Box sx={{ width: 250 }}>
                <List>
                    {navigationItems.map(({ name, link }) => (
                        <ListItemButton
                            key={name}
                            component={RouterLink}
                            to={link}
                            onClick={handleMobileMenuToggle}
                        >
                            <ListItemText primary={name} />
                        </ListItemButton>
                    ))}

                    <ListItemButton onClick={() => setMobileResourcesOpen(!mobileResourcesOpen)}>
                        <ListItemText primary="Resources" />
                        {mobileResourcesOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </ListItemButton>

                    <Collapse in={mobileResourcesOpen} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {resourcesItems.map(({ name, link }) => (
                                <ListItemButton
                                    key={name}
                                    component={RouterLink}
                                    to={link}
                                    onClick={handleMobileMenuToggle}
                                    sx={{ pl: 4 }}
                                >
                                    <ListItemText primary={name} />
                                </ListItemButton>
                            ))}
                        </List>
                    </Collapse>

                    {isAuthenticated && user?.is_member && (
                        <ListItemButton
                            component={RouterLink}
                            to="/assessments/dashboard"
                            onClick={handleMobileMenuToggle}
                        >
                            <DashboardIcon sx={{ mr: 1 }} />
                            <ListItemText primary="Dashboard" />
                        </ListItemButton>
                    )}
                </List>
            </Box>
        </Drawer>
    );

    return (
        <AppBar
            position="static"
            elevation={0}
            sx={{
                backgroundColor: theme.palette.primary.dark,
                borderBottom: "1px solid",
                borderColor: alpha('#fff', 0.1),
            }}
        >
            <Toolbar
                sx={{
                    height: "106px",
                    px: { xs: 2, md: 4 },
                    gap: 2,
                }}
            >
                <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    component={RouterLink}
                    to="/"
                    sx={{
                        textDecoration: "none",
                        color: "white",
                        "&:hover": {
                            textDecoration: "none",
                        },
                    }}
                >
                    <BrainLottie size={44} />
                </Stack>

                {!isMobile ? renderDesktopNav() : null}

                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    sx={{ ml: "auto" }}
                >
                    {isAuthenticated ? (
                        <>
                            {user?.is_member && (
                                <Button
                                    component={RouterLink}
                                    to="/assessments/dashboard"
                                    sx={{
                                        color: 'white',
                                        textDecoration: 'none',
                                        fontSize: '0.95rem',
                                        fontWeight: 500,
                                        py: 1,
                                        px: 2,
                                        borderRadius: '8px',
                                        backgroundColor: 'primary.400',
                                        boxShadow: '0px 4.8px 4.8px 0px #00000014',
                                        border: '1px solid #7389ff',
                                        '&:hover': {
                                            backgroundColor: 'primary.500',
                                        },
                                    }}
                                >
                                    Dashboard
                                </Button>
                            )}
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleMenu}
                                color="inherit"
                            >
                                {user?.avatar_url ? (
                                    <Avatar 
                                        src={user.avatar_url}
                                        alt={user.username}
                                        sx={{ width: 40, height: 40 }}
                                    />
                                ) : (
                                    <AccountCircle sx={{ width: 40, height: 40 }} />
                                )}
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >
                                <MenuItem 
                                    component={RouterLink} 
                                    to="/account"
                                    onClick={handleClose}
                                >
                                    My Account
                                </MenuItem>
                                <MenuItem 
                                    component={RouterLink} 
                                    to="/dashboard"
                                    onClick={handleClose}
                                >
                                    Dashboard
                                </MenuItem>
                                <MenuItem 
                                    onClick={handleClose}
                                    component={RouterLink}
                                    to="/settings"
                                >
                                    Settings
                                </MenuItem>
                                <MenuItem 
                                    onClick={handleClose}
                                    sx={{ color: 'error.main' }}
                                >
                                    Logout
                                </MenuItem>
                            </Menu>
                        </>
                    ) : (
                        <>
                            <Button
                                component={RouterLink}
                                to="/login"
                                sx={{
                                    color: 'white',
                                    fontSize: '0.95rem',
                                    px: 2,
                                    py: 1,
                                    textTransform: 'none',
                                    fontWeight: 500,
                                    borderRadius: 1,
                                    backgroundColor: 'transparent',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    },
                                }}
                            >
                                Log In
                            </Button>
                            <Button
                                component={RouterLink}
                                to="/sign-up"
                                variant="outlined"
                                sx={{
                                    color: 'white',
                                    fontSize: '0.95rem',
                                    px: 2,
                                    py: 1,
                                    textTransform: 'none',
                                    fontWeight: 500,
                                    borderRadius: 1,
                                    borderColor: 'rgba(255, 255, 255, 0.5)',
                                    '&:hover': {
                                        borderColor: 'white',
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    },
                                }}
                            >
                                Sign Up
                            </Button>
                        </>
                    )}
                    {isMobile && (
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleMobileMenuToggle}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
                </Stack>
                {isMobile && renderMobileNav()}
            </Toolbar>
        </AppBar>
    );
};

export default Header;