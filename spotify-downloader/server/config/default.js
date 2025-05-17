const path = require('path');

// Validate required environment variables
const requiredEnvVars = [
  'SPOTIFY_CLIENT_ID',
  'SPOTIFY_CLIENT_SECRET',
  'SPOTIFY_REDIRECT_URI',
  'CLIENT_URL',
  'MONGODB_URI',
  'JWT_SECRET'
];

requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    console.error(`Missing required environment variable: ${varName}`);
    process.exit(1);
  }
});

module.exports = {
  // Server configuration
  port: process.env.PORT || 5000,
  clientUrl: process.env.CLIENT_URL,
  
  // MongoDB configuration
  mongoURI: process.env.MONGODB_URI,
  
  // Spotify API configuration
  spotify: {
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.SPOTIFY_REDIRECT_URI,
    scopes: [
      'user-read-private',
      'user-read-email',
      'playlist-read-private',
      'playlist-read-collaborative'
    ]
  },
  
  // File paths
  paths: {
    temp: path.join(__dirname, '../downloads/temp'),
    output: path.join(__dirname, '../downloads/output'),
    zip: path.join(__dirname, '../downloads/zip')
  },
  
  // Download settings
  download: {
    zipExpiry: 24, // Hours before zip files are deleted
    audioBitrate: 320 // MP3 bitrate in kbps
  },
  
  // Socket.io settings
  socket: {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ['GET', 'POST']
    }
  },

  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: '7d'
  }
};