import React, { useState, useEffect, useContext } from 'react';
import { Container, Typography, Avatar, TextField, Button, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Context } from '../store/appContext';

const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(8),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  margin: theme.spacing(1),
  backgroundColor: theme.palette.secondary.main,
  width: theme.spacing(7),
  height: theme.spacing(7),
}));

export default function Profile() {
  const { store } = useContext(Context);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  useEffect(() => {
    const email = sessionStorage.getItem('email');
    const firstName = sessionStorage.getItem('firstName');
    const lastName = sessionStorage.getItem('lastName');

    setFormData({
      email: email || '',
      firstName: firstName || '',
      lastName: lastName || '',
      password: '',
      newPassword: '',
      confirmNewPassword: ''
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('Profile updated:', formData);
  };

  return (
    <StyledContainer component="main" maxWidth="xs">
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        '& .MuiTextField-root': { m: 1, width: '40ch' },
        '& .MuiButton-root': { margin: (theme) => theme.spacing(3, 0, 2) },
      }}>
        <StyledAvatar>
          {/* Icona dell'utente */}
        </StyledAvatar>
        <Typography component="h1" variant="h5">
          Profile
        </Typography>
        <Box sx={{ textAlign: 'left', width: '100%', mt: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => window.history.back()}
          >
            Back
          </Button>
        </Box>
        <form onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="firstName"
            label="First Name"
            name="firstName"
            autoComplete="fname"
            value={formData.firstName}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="lastName"
            label="Last Name"
            name="lastName"
            autoComplete="lname"
            value={formData.lastName}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="newPassword"
            label="New Password"
            type="password"
            id="newPassword"
            autoComplete="new-password"
            value={formData.newPassword}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="confirmNewPassword"
            label="Confirm New Password"
            type="password"
            id="confirmNewPassword"
            autoComplete="confirm-new-password"
            value={formData.confirmNewPassword}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
          >
            Update Profile
          </Button>
        </form>
      </Box>
    </StyledContainer>
  );
}