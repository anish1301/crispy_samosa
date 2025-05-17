const config = {
    api: {
        baseUrl: import.meta.env.VITE_API_URL,
        socketUrl: import.meta.env.VITE_SOCKET_URL,
    },
    spotify: {
        clientId: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
        redirectUri: import.meta.env.VITE_SPOTIFY_REDIRECT_URI,
    },
    features: {
        enableAuth: import.meta.env.VITE_ENABLE_AUTH === 'true',
        enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    },
    limits: {
        maxPlaylistSize: parseInt(import.meta.env.VITE_MAX_PLAYLIST_SIZE || '100', 10),
    },
    version: import.meta.env.VITE_VERSION,
};

// Validate required configuration
const validateConfig = () => {
    const required = [
        ['api.baseUrl', config.api.baseUrl],
        ['api.socketUrl', config.api.socketUrl],
        ['spotify.clientId', config.spotify.clientId],
        ['spotify.redirectUri', config.spotify.redirectUri],
    ];

    required.forEach(([key, value]) => {
        if (!value) {
            console.error(`Missing required configuration: ${key}`);
        }
    });
};

validateConfig();

export default config;
