const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const ENDPOINTS = {
    validateSpotifyUrl: `${API_BASE_URL}/spotify/validate`,
    getSpotifyInfo: `${API_BASE_URL}/spotify/info`,
    startDownload: `${API_BASE_URL}/download/start`,
    getDownloadFile: `${API_BASE_URL}/download/file`,
    downloadHistory: `${API_BASE_URL}/download/history`,
};

export const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';
