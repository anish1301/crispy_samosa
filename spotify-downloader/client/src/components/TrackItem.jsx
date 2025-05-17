import React, { useState } from 'react';
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Box,
    IconButton,
    LinearProgress,
    Tooltip,
    Menu,
    MenuItem,
    Button,
} from '@mui/material';
import {
    CloudDownload,
    CheckCircle,
    Error,
    MoreVert,
    Refresh,
    Delete,
    MusicNote,
} from '@mui/icons-material';
import { useDownload } from '../context/DownloadContext';

const StatusColors = {
    completed: '#2e7d32',
    error: '#d32f2f',
    downloading: '#1976d2',
    processing: '#ed6c02',
    queued: '#9c27b0',
    pending: '#757575',
};

const getStatusText = (status, progress) => {
    switch (status) {
        case 'completed':
            return 'Download complete';
        case 'error':
            return 'Download failed';
        case 'downloading':
            return `Downloading... ${progress}%`;
        case 'processing':
            return `Processing... ${progress}%`;
        case 'queued':
            return 'In queue';
        default:
            return 'Pending';
    }
};

const TrackItem = ({ track }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const { removeDownload } = useDownload();
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleRetry = () => {
        // TODO: Implement retry logic
        handleClose();
    };

    const handleDelete = () => {
        removeDownload(track.id);
        handleClose();
    };

    const handleDownload = () => {
        if (track.downloadUrl) {
            window.open(track.downloadUrl, '_blank');
        }
    };

    const getStatusIcon = () => {
        switch (track.status) {
            case 'completed':
                return <CheckCircle sx={{ color: StatusColors.completed }} />;
            case 'error':
                return <Error sx={{ color: StatusColors.error }} />;
            case 'queued':
                return <MusicNote sx={{ color: StatusColors.queued }} />;
            default:
                return null;
        }
    };

    return (
        <Card 
            sx={{ 
                display: 'flex', 
                mb: 2, 
                position: 'relative',
                transition: 'all 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 3,
                }
            }}
        >
            <CardMedia
                component="img"
                sx={{ 
                    width: 151,
                    height: 151,
                    objectFit: 'cover',
                }}
                image={track.albumArt || '/default-album-art.png'}
                alt={track.album}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <CardContent sx={{ flex: '1 0 auto', pb: 1 }}>
                    <Typography component="div" variant="h6" noWrap>
                        {track.title}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" component="div" noWrap>
                        {track.artist}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                        {track.album}
                    </Typography>
                </CardContent>
                
                <Box sx={{ display: 'flex', alignItems: 'center', pl: 2, pr: 2, pb: 1 }}>
                    {(track.status === 'downloading' || track.status === 'processing') ? (
                        <Box sx={{ width: '100%', mr: 1 }}>
                            <LinearProgress 
                                variant="determinate" 
                                value={track.progress || 0} 
                                sx={{
                                    height: 8,
                                    borderRadius: 4,
                                    bgcolor: 'rgba(0,0,0,0.1)',
                                    '& .MuiLinearProgress-bar': {
                                        bgcolor: StatusColors[track.status],
                                    }
                                }}
                            />
                            <Typography 
                                variant="body2" 
                                color="text.secondary" 
                                align="center"
                                sx={{ mt: 0.5 }}
                            >
                                {getStatusText(track.status, track.progress)}
                            </Typography>
                        </Box>
                    ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                            <Typography 
                                variant="body2" 
                                color="text.secondary"
                                sx={{ flexGrow: 1 }}
                            >
                                {getStatusText(track.status, track.progress)}
                            </Typography>
                            
                            {track.status === 'completed' && (
                                <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={<CloudDownload />}
                                    onClick={handleDownload}
                                    sx={{ borderRadius: 2 }}
                                >
                                    Download
                                </Button>
                            )}
                            
                            <Tooltip title="More options">
                                <IconButton 
                                    onClick={handleClick}
                                    size="small"
                                >
                                    <MoreVert />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    )}
                </Box>
            </Box>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                {track.status === 'error' && (
                    <MenuItem onClick={handleRetry}>
                        <ListItemIcon>
                            <Refresh fontSize="small" />
                        </ListItemIcon>
                        Retry download
                    </MenuItem>
                )}
                <MenuItem onClick={handleDelete}>
                    <ListItemIcon>
                        <Delete fontSize="small" />
                    </ListItemIcon>
                    Remove from list
                </MenuItem>
            </Menu>

            {getStatusIcon() && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        bgcolor: 'background.paper',
                        borderRadius: '50%',
                        padding: 0.5,
                        boxShadow: 1,
                    }}
                >
                    {getStatusIcon()}
                </Box>
            )}
        </Card>
    );
};

export default TrackItem;