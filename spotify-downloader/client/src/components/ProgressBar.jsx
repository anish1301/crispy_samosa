import React from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';

const ProgressBar = ({ progress, status }) => {
    const getStatusColor = () => {
        switch (status) {
            case 'completed':
                return 'success';
            case 'error':
                return 'error';
            default:
                return 'primary';
        }
    };

    return (
        <Box sx={{ width: '100%', position: 'relative' }}>
            <LinearProgress 
                variant="determinate" 
                value={progress} 
                color={getStatusColor()}
                sx={{ height: 8, borderRadius: 4 }}
            />
            <Box sx={{ 
                position: 'absolute', 
                top: '50%', 
                left: '50%', 
                transform: 'translate(-50%, -50%)'
            }}>
                <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                        textShadow: '0 0 4px rgba(0,0,0,0.5)',
                        fontWeight: 'bold'
                    }}
                >
                    {Math.round(progress)}%
                </Typography>
            </Box>
        </Box>
    );
};

export default ProgressBar;