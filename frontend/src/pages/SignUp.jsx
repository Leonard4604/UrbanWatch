import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState } from 'react';
import BasicModal from '../components/BasicModal';
import { useNavigate } from 'react-router-dom';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © UrbanWatch '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function SignUp() {
    const navigate = useNavigate;
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        confirmPassword: '',
    });

    const [smShow, setSmShow] = useState(false)
    const [textModal, setTextModal] = useState(null)
    const [showLoginButton, setShowLoginButton] = useState(true)
    const url = 'http://localhost:5175/users/signup';

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    
        // Clear the error message for the field being changed
        setErrors({
          ...errors,
          [name]: '',
        });
    };

    const isFormValid = () => {
        // Check if all fields are provided
        if (
          formData.email.trim() === '' ||
          formData.firstName.trim() === '' ||
          formData.lastName.trim() === '' ||
          formData.password.trim() === '' ||
          formData.confirmPassword.trim() === ''
        ) {
          setErrors({
            email: !formData.email ? 'Email is required' : '',
            firstName: !formData.firstName ? 'firstName is required' : '',
            lastName: !formData.lastName ? 'lastName is required' : '',
            password: !formData.password ? 'Password is required' : '',
            confirmPassword: !formData.confirmPassword ? 'Repeat Password is required' : '',
          });
          return false;
        }
    
        // Check if password and confirmPassword match
        if (formData.password !== formData.confirmPassword) {
          setErrors({
            ...errors,
            confirmPassword: 'Not match with password',
          });
          return false;
        }
    
        // Check password complexity
        const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*)(:;._'-]).{8,}$/;
        if (!passwordRegex.test(formData.password)) {
          setErrors({
            ...errors,
            password:
              'Password must be at least 8 and maximum 30 characters, at least one uppercase letter, one lowercase letter, one number and one special character',
          });
          return false;
        }
    
        // Reset any previous errors
        setErrors({});
        return true;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!isFormValid()) return;

        console.log({
            email: formData.email,
            password: formData.password,
        });

        try {
            const response = await fetch(url, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(formData),
            });
      
            if (response.status === 200) {
              // Reset the form fields
              setFormData({
                email: '',
                firstName: '',
                lastName: '',
                password: '',
                confirmPassword: '',
              });
              setShowLoginButton(true)
              setTextModal('Signup successful!')
              setSmShow(true)
            } else if (response.status === 400) {
              // Reset the form fields
              setFormData({
                ...formData,
                email: '',
                password: '',
                confirmPassword: '',
              });
              setShowLoginButton(false)
              setTextModal('Email already used, use another one!');
              setSmShow(true)
            }
          } catch (error) {
            // Handle errors (e.g., network issues, server errors)
            console.error('Signup error:', error.message);
      
            // Set error messages based on the specific error received
            setErrors({
              serverError: error.message,
            });
            setTextModal('Something went wrong. Please try again.');
            setShowLoginButton(false)
            setSmShow(true)
        }
    };

    return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                  autoComplete="new-password"
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox value="allowExtraEmails" color="primary" />}
                  label="I want to receive inspiration, marketing promotions and updates via email."
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/signin" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
        {smShow ? showLoginButton ? <BasicModal setShowModal={setSmShow} text={textModal} title={"Sign Up"} flagCloseFunction={true} closeFunction={showLoginButton ? () => navigate('/login') : undefined}></BasicModal>
      : <BasicModal setShowModal={setSmShow} text={textModal} title={"Sign Up"}></BasicModal> : <></>}
      </Container>
    </ThemeProvider>
  );
}