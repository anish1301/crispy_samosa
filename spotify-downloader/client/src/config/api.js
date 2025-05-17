import config from './config';

// API endpoints configuration
export const ENDPOINTS = {
    // Spotify authentication
    spotifyAuth: `${config.api.baseUrl}/auth/spotify`,
    spotifyCallback: `${config.api.baseUrl}/auth/spotify/callback`,
    
    // Spotify operations
    validateSpotifyUrl: `${config.api.baseUrl}/spotify/validate`,
    getSpotifyInfo: `${config.api.baseUrl}/spotify/info`,
    
    // Download operations
    startDownload: `${config.api.baseUrl}/download/start`,
    getDownloadFile: `${config.api.baseUrl}/download/file`,
    downloadHistory: `${config.api.baseUrl}/download/history`,
};

// Socket configuration
export const SOCKET_CONFIG = {
    url: config.api.socketUrl,
    options: {
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
    },
};

// Spotify configuration
export const SPOTIFY_CONFIG = {
    authEndpoint: 'https://accounts.spotify.com/authorize',
    clientId: config.spotify.clientId,
    redirectUri: config.spotify.redirectUri,
    scopes: [
        'user-read-private',
        'user-read-email',
        'playlist-read-private',
        'playlist-read-collaborative'
    ],
};
