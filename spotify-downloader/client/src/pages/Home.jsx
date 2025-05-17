import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import DownloadForm from '../components/DownloadForm';
import TrackList from '../components/TrackList';
import { useDownload } from '../context/DownloadContext';

const Home = () => {
    const { downloads } = useDownload();
    const activeTracks = downloads.filter(d => d.status !== 'completed');

    return (
        <Container maxWidth="lg">
            <Box sx={{ 
                textAlign: 'center',
                pt: 8,
                pb: 6,
            }}>
                <Typography
                    component="h1"
                    variant="h2"
                    color="text.primary"
                    gutterBottom
                >
                    Spotify Downloader
                </Typography>
                <Typography
                    variant="h5"
                    align="center"
                    color="text.secondary"
                    paragraph
                >
                    Download your favorite music from Spotify with high-quality audio.
                    Just paste the Spotify track or playlist URL below to get started.
                </Typography>
            </Box>
            
            <DownloadForm />
            
            {activeTracks.length > 0 && (
                <TrackList 
                    tracks={activeTracks} 
                    title="Current Downloads" 
                />
            )}
        </Container>
    );
};

export default Home;