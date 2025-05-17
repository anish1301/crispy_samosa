import React, { useState, useCallback } from 'react';
import {
    Box,
    TextField,
    Button,
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Alert,
    Tooltip,
} from '@mui/material';
import { CloudDownload, Info } from '@mui/icons-material';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ENDPOINTS } from '../config/api';
import { useSocket } from '../context/SocketContext';
import { useDownload } from '../context/DownloadContext';

const SPOTIFY_URL_REGEX = /^(https?:\/\/)?(open\.spotify\.com|spotify)\/(track|playlist|album)\/[a-zA-Z0-9]+(\?.*)?$/;

const DownloadForm = () => {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { socketId, isConnected } = useSocket();
    const { addDownload } = useDownload();

    const validateUrl = useCallback((inputUrl) => {
        if (!inputUrl) {
            return 'Please enter a Spotify URL';
        }
        if (!SPOTIFY_URL_REGEX.test(inputUrl)) {
            return 'Please enter a valid Spotify track or playlist URL';
        }
        return '';
    }, []);

    const handleUrlChange = (e) => {
        const inputUrl = e.target.value;
        setUrl(inputUrl);
        setError(validateUrl(inputUrl));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate connection
        if (!isConnected) {
            toast.error('Not connected to server. Please wait or refresh the page.');
            return;
        }

        // Validate URL
        const validationError = validateUrl(url);
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Validate URL
            const validateRes = await axios.post(ENDPOINTS.validateSpotifyUrl, { url });
            
            if (!validateRes.data.success) {
                throw new Error(validateRes.data.message || 'Invalid Spotify URL');
            }

            // Get info about the track/playlist
            const infoRes = await axios.post(ENDPOINTS.getSpotifyInfo, { url });
            
            if (!infoRes.data.success) {
                throw new Error(infoRes.data.message || 'Failed to fetch track information');
            }

            // Start download
            const downloadRes = await axios.post(ENDPOINTS.startDownload, {
                downloadId: infoRes.data.downloadId,
                socketId
            });

            if (!downloadRes.data.success) {
                throw new Error(downloadRes.data.message || 'Failed to start download');
            }

            addDownload({
                ...downloadRes.data,
                type: infoRes.data.type,
                title: infoRes.data.data.name || infoRes.data.data.title,
                artist: infoRes.data.data.artist,
                albumArt: infoRes.data.data.albumArt
            });

            toast.success('Download started successfully');
            setUrl('');

        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Something went wrong';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
            <CardContent>
                <Typography variant="h5" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    Download from Spotify
                    <Tooltip title="Enter a Spotify track or playlist URL to download" arrow>
                        <Info fontSize="small" sx={{ cursor: 'help' }} />
                    </Tooltip>
                </Typography>

                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        fullWidth
                        label="Spotify URL"
                        variant="outlined"
                        value={url}
                        onChange={handleUrlChange}
                        placeholder="https://open.spotify.com/track/..."
                        required
                        disabled={loading}
                        error={!!error}
                        helperText={error}
                        InputProps={{
                            sx: { borderRadius: 2 }
                        }}
                    />

                    {!isConnected && (
                        <Alert severity="warning">
                            Not connected to server. Please wait or refresh the page.
                        </Alert>
                    )}

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                        disabled={loading || !isConnected || !!error}
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CloudDownload />}
                        fullWidth
                        sx={{
                            height: 48,
                            borderRadius: 2,
                            textTransform: 'none',
                            fontSize: '1rem'
                        }}
                    >
                        {loading ? 'Processing...' : 'Download'}
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default DownloadForm;