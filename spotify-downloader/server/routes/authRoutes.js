const express = require('express');
const router = express.Router();
const spotifyService = require('../services/spotifyService');

/**
 * @route   GET /api/auth/spotify/callback
 * @desc    Handle Spotify OAuth callback
 * @access  Public
 */
router.get('/spotify/callback', async (req, res) => {
    try {
        const { code } = req.query;
        
        if (!code) {
            return res.status(400).json({ 
                success: false, 
                message: 'Authorization code is required' 
            });
        }

        // Exchange code for access token
        const result = await spotifyService.handleAuthCallback(code);
        
        // Redirect to client with the token
        res.redirect(`${process.env.CLIENT_URL}/auth-callback?token=${result.accessToken}`);
    } catch (error) {
        console.error('Spotify auth callback error:', error);
        res.redirect(`${process.env.CLIENT_URL}/auth-callback?error=${encodeURIComponent(error.message)}`);
    }
});

module.exports = router;
