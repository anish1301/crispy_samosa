import React from 'react';
import { Box, Typography, Container, Link } from '@mui/material';
import { GitHub } from '@mui/icons-material';

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                py: 3,
                px: 2,
                mt: 'auto',
                backgroundColor: (theme) =>
                    theme.palette.mode === 'light'
                        ? theme.palette.grey[200]
                        : theme.palette.grey[800],
            }}
        >
            <Container maxWidth="sm">
                <Typography variant="body1" align="center">
                    &copy; {new Date().getFullYear()} Spotify Downloader
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                    {'Made with ❤️ | '}
                    <Link
                        color="inherit"
                        href="https://github.com/yourusername/spotify-downloader"
                        target="_blank"
                        rel="noopener"
                        sx={{ display: 'inline-flex', alignItems: 'center' }}
                    >
                        <GitHub sx={{ ml: 0.5, fontSize: '1rem' }} />
                    </Link>
                </Typography>
            </Container>
        </Box>
    );
};

export default Footer;