import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { toast } from 'react-toastify';

const AuthCallback = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const token = searchParams.get('token');
        const error = searchParams.get('error');

        if (error) {
            toast.error(decodeURIComponent(error));
            navigate('/', { replace: true });
            return;
        }

        if (token) {
            // Store the token
            localStorage.setItem('spotify_access_token', token);
            toast.success('Successfully authenticated with Spotify');
            navigate('/', { replace: true });
        } else {
            toast.error('Authentication failed');
            navigate('/', { replace: true });
        }
    }, [navigate, searchParams]);

    return (
        <Box 
            sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center', 
                justifyContent: 'center',
                minHeight: '80vh',
                gap: 2
            }}
        >
            <CircularProgress size={60} />
            <Typography variant="h6">
                Processing authentication...
            </Typography>
        </Box>
    );
};

export default AuthCallback;
