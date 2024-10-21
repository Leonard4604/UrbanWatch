import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import MapIcon from '@mui/icons-material/Map';
import { Link } from 'react-router-dom';
import { Context } from '../store/appContext';
import { useContext } from 'react';

export const MainListItems = () => {
  const { store } = useContext(Context);

  const getUserRole = () => {
    const role = store.role;
    return role ? parseInt(role, 10) : null;
  };

  const userRole = getUserRole();

  return (
    <React.Fragment>
      {userRole === 1 && (
        <ListItemButton component={Link} to="/">
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>
      )}
      <ListItemButton component={Link} to="/reports">
        <ListItemIcon>
          <BarChartIcon />
        </ListItemIcon>
        <ListItemText primary="Reports" />
      </ListItemButton>
      <ListItemButton component={Link} to="/map">
        <ListItemIcon>
          <MapIcon />
        </ListItemIcon>
        <ListItemText primary="Map" />
      </ListItemButton>
    </React.Fragment>
  );
};