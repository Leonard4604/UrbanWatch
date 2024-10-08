import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { mainListItems } from '../components/listItems';
import Menu from '@mui/material/Menu';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import MoreIcon from '@mui/icons-material/MoreVert';
import { Context } from '../store/appContext';
import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MapComponent from '../components/Map';
import { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, Popover } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Map() {
  const { actions } = useContext(Context);
  const navigate = useNavigate();

  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const [anchorNotificationsEl, setNotificationsAnchorEl] = React.useState(null);
  const [mobileNotificationsMoreAnchorEl, setNotificationsMobileMoreAnchorEl] = React.useState(null);
  
  const isNotificationsMenuOpen = Boolean(anchorNotificationsEl);
  const isNotificationsMobileMenuOpen = Boolean(mobileNotificationsMoreAnchorEl);

  const [notificationsCount, setNotificationsCount] = useState(0);
  const handleNotificationClose = async (index) => {
    setNotifications(prevNotifications => 
      prevNotifications.filter(notification => notification.key != index)
    );
    await fetch(`http://${process.env.IP_ADDRESS}:5177/notifications/${index}`, {
        method: 'DELETE',
        credentials: 'include'
      }
    );
    setNotificationsCount(function (prevCount) {
      if (prevCount > 0) {
        return (prevCount -= 1);
      } else {
        return (prevCount = 0);
      }
    });
  };

  const getNotifications = async () => {
    const response = await fetch(`http://${process.env.IP_ADDRESS}:5177/notifications/get_by_email/${email}`);
    const data = await response.json();
    const notificationsList = await data.notifications.map(notification => (
      <ListItem key={notification.id} secondaryAction={
        <IconButton edge="end" aria-label="delete" onClick={() => handleNotificationClose(notification.id)}>
          <CloseIcon />
        </IconButton>
      }>
        <ListItemText primary={
          <>
            <Typography variant="body1" component="span" style={{ fontWeight: 'bold' }}>
              New notification:
            </Typography>
            {` ${notification.title}`}
          </>
        } />
      </ListItem>
    ));
    setNotifications(notificationsList);
    setNotificationsCount(data.notifications.length);
    console.log(notifications)
  };

  const handleNotificationsMenuOpen = async (event) => {
    setNotificationsAnchorEl(event.currentTarget);
    await getNotifications();
  };

  const handleNotificationsMobileMenuClose = () => {
    setNotificationsMobileMoreAnchorEl(null);
  };

  const handleNotificationsMenuClose = () => {
    setNotificationsAnchorEl(null);
    handleNotificationsMobileMenuClose();
  };

  const handleNotificationsMobileMenuOpen = (event) => {
    setNotificationsMobileMoreAnchorEl(event.currentTarget);
  };

  const handleLogout = () => {
    actions.logout();
    navigate('/signin');
  }

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose} component={Link} to="/profile">Profile</MenuItem>
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </Menu>
  );

  const [notifications, setNotifications] = useState([]);

  const email = localStorage.getItem("email");

  useEffect(() => {
    const getNotifications = async () => {
      const response = await fetch(`http://${process.env.IP_ADDRESS}:5177/notifications/get_by_email/${email}`);
      const data = await response.json();
      const notificationsList = await data.notifications.map(notification => (
        <ListItem key={notification.id} secondaryAction={
          <IconButton edge="end" aria-label="delete" onClick={() => handleNotificationClose(notification.id)}>
            <CloseIcon />
          </IconButton>
        }>
          <ListItemText primary={
            <>
              <Typography variant="body1" component="span" style={{ fontWeight: 'bold' }}>
                New notification:
              </Typography>
              {` ${notification.title}`}
            </>
          } />
        </ListItem>
      ));
      setNotifications(notificationsList);
      setNotificationsCount(data.notifications.length);
      console.log(notifications)
    };
    getNotifications();
  }, []);

  const notificationsMenuId = 'primary-search-notifications-menu';
  const renderNotificationsMenu = (
    <Popover
      id={notificationsMenuId}
      open={isNotificationsMenuOpen}
      anchorEl={anchorNotificationsEl}
      onClose={handleNotificationsMenuClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <List>
        {notifications}
      </List>
    </Popover>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleNotificationsMenuOpen}>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          aria-controls="primary-search-notifications-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <Badge badgeContent={notificationsCount} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: '24px', // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Map
            </Typography>
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <IconButton
                size="large"
                aria-label="show 17 new notifications"
                aria-controls={notificationsMenuId}
                aria-haspopup="true"
                onClick={handleNotificationsMenuOpen}
                color="inherit"
              >
                <Badge badgeContent={notificationsCount} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </Box>
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </Box>
          </Toolbar>
          {renderMobileMenu}
          {renderMenu}
          {renderNotificationsMenu}
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            {mainListItems}
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <MapComponent />
        </Box>
      </Box>
    </ThemeProvider>
  );
}