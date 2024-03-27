import React from 'react';
import { Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';


const NotFound = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate('/'); // Navigating back to '/' path
      };

    const rootStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '90vh',
        textAlign: 'center',
        color: '#000',
    };

    const headingStyle = {
        marginBottom: '24px', // Increased spacing between heading and body text
        color: '#000', // Setting text color to black
    };

    const bodyTextStyle = {
        marginBottom: '24px', // Increased spacing between body text and button
    };

    const buttonStyle = {
        marginTop: '24px', // Increased spacing above the button
    };

    return (
        <div style={rootStyle}>
        <Typography variant="h1" style={headingStyle}>
            404 - Page Not Found
        </Typography>
        <Typography variant="body1" style={bodyTextStyle}>
            Sorry, the page you are looking for does not exist.
        </Typography>
        <Button
            variant="contained"
            color="primary"
            style={buttonStyle}
            onClick={handleGoBack}
        >
            Go Back
        </Button>
        </div>
    );
};

export default NotFound;
