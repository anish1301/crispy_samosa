import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { CloudDownload, Home } from '@mui/icons-material';

const Header = () => {
    return (
        <AppBar position="static" color="transparent" elevation={0}>
            <Container maxWidth="lg">
                <Toolbar>
                    <Typography
                        variant="h6"
                        component={RouterLink}
                        to="/"
                        sx={{
                            flexGrow: 1,
                            textDecoration: 'none',
                            color: 'inherit',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                        }}
                    >
                        <CloudDownload /> Spotify Downloader
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            component={RouterLink}
                            to="/"
                            startIcon={<Home />}
                            color="inherit"
                        >
                            Home
                        </Button>
                        <Button
                            component={RouterLink}
                            to="/downloads"
                            startIcon={<CloudDownload />}
                            color="inherit"
                        >
                            Downloads
                        </Button>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Header;