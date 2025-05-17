import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import TrackItem from './TrackItem';

const TrackList = ({ tracks, title }) => {
    if (!tracks?.length) {
        return (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Typography variant="body1" color="text.secondary">
                    No tracks available
                </Typography>
            </Box>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            {title && (
                <Typography variant="h5" component="h2" gutterBottom>
                    {title}
                </Typography>
            )}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {tracks.map(track => (
                    <TrackItem key={track.id} track={track} />
                ))}
            </Box>
        </Container>
    );
};

export default TrackList;