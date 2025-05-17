import React from 'react';
import { Alert as MuiAlert, Snackbar } from '@mui/material';

const Alert = ({ message, type, open, onClose }) => {
    return (
        <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={onClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
            <MuiAlert
                onClose={onClose}
                severity={type}
                variant="filled"
                elevation={6}
                sx={{ width: '100%' }}
            >
                {message}
            </MuiAlert>
        </Snackbar>
    );
};

export default Alert;