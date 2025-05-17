import React, { useEffect, useState } from 'react';
import { 
    Container, 
    Typography, 
    Box, 
    Tabs, 
    Tab, 
    CircularProgress,
    Alert 
} from '@mui/material';
import axios from 'axios';
import { ENDPOINTS } from '../config/api';
import TrackList from '../components/TrackList';
import { useDownload } from '../context/DownloadContext';

const Downloads = () => {
    const [tab, setTab] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { downloads, setDownloads } = useDownload();

    const activeDownloads = downloads.filter(d => d.status !== 'completed' && d.status !== 'failed');
    const completedDownloads = downloads.filter(d => d.status === 'completed');
    const failedDownloads = downloads.filter(d => d.status === 'failed');

    useEffect(() => {
        const fetchDownloads = async () => {
            try {
                const response = await axios.get(ENDPOINTS.downloadHistory);
                if (response.data.success) {
                    setDownloads(response.data.data);
                }
            } catch (err) {
                setError('Failed to load download history');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDownloads();
    }, [setDownloads]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg">
            <Box sx={{ pt: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Downloads
                </Typography>

                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                    <Tabs 
                        value={tab} 
                        onChange={(_, newValue) => setTab(newValue)}
                        aria-label="download tabs"
                    >
                        <Tab 
                            label={`Active (${activeDownloads.length})`} 
                            id="downloads-tab-0" 
                        />
                        <Tab 
                            label={`Completed (${completedDownloads.length})`} 
                            id="downloads-tab-1" 
                        />
                        <Tab 
                            label={`Failed (${failedDownloads.length})`} 
                            id="downloads-tab-2" 
                        />
                    </Tabs>
                </Box>

                {tab === 0 && (
                    <TrackList 
                        tracks={activeDownloads} 
                        title="Active Downloads" 
                    />
                )}
                {tab === 1 && (
                    <TrackList 
                        tracks={completedDownloads} 
                        title="Completed Downloads" 
                    />
                )}
                {tab === 2 && (
                    <TrackList 
                        tracks={failedDownloads} 
                        title="Failed Downloads" 
                    />
                )}
            </Box>
        </Container>
    );
};

export default Downloads;