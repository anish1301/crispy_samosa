const { YtDlpWrap } = require('yt-dlp-wrap');
const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const NodeID3 = require('node-id3');
const axios = require('axios');

// Initialize yt-dlp
const ytDlp = new YtDlpWrap();

// Make sure the download directories exist
const TEMP_DIR = path.join(__dirname, '../downloads/temp');
const OUTPUT_DIR = path.join(__dirname, '../downloads/output');

if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Search for a track on YouTube
 * @param {object} trackInfo - Track information from Spotify
 * @returns {Promise<string>} - YouTube video URL
 */
const findYouTubeVideo = async (trackInfo) => {
  try {
    const searchQuery = `${trackInfo.artist} - ${trackInfo.title} audio`;
    
    // Use yt-dlp to search YouTube
    const searchResults = await ytDlp.execPromise([
      'ytsearch5:', // Limit to 5 results
      searchQuery,
      '--dump-json'
    ]);

    // Parse the JSON output
    const videos = searchResults.split('\n')
      .filter(line => line.trim())
      .map(line => JSON.parse(line));

    // Find best match based on title similarity and duration
    const bestMatch = videos.reduce((best, current) => {
      const titleLower = current.title.toLowerCase();
      const titleMatch = titleLower.includes(trackInfo.title.toLowerCase());
      const artistMatch = titleLower.includes(trackInfo.primaryArtist.toLowerCase());
      const isAudioKeyword = titleLower.includes('audio') || titleLower.includes('official');
      
      // Calculate duration difference
      const spotifyDuration = trackInfo.duration / 1000;
      const durationDiff = Math.abs(current.duration - spotifyDuration);
      
      // Score the match (lower is better)
      const currentScore = (titleMatch ? 0 : 10) + 
                         (artistMatch ? 0 : 8) + 
                         (isAudioKeyword ? 0 : 5) + 
                         (durationDiff / 10);
      
      return currentScore < (best.score ?? Infinity) 
        ? { ...current, score: currentScore }
        : best;
    }, {});

    if (!bestMatch.id) {
      throw new Error('No suitable YouTube video found');
    }

    return `https://www.youtube.com/watch?v=${bestMatch.id}`;
  } catch (error) {
    console.error(`Error finding YouTube video for ${trackInfo.title}:`, error);
    throw new Error(`Failed to find YouTube video: ${error.message}`);
  }
};

/**
 * Download and process a track from YouTube
 * @param {object} trackInfo - Track information from Spotify
 * @param {object} options - Additional options
 * @returns {Promise<string>} - Path to the processed MP3 file
 */
const downloadAndProcessTrack = async (trackInfo, options = {}) => {
  const io = options.io;
  const socketId = options.socketId;
  const downloadId = options.downloadId;

  try {
    // Find the YouTube video
    const videoUrl = await findYouTubeVideo(trackInfo);

    // Generate safe filenames
    const sanitizedTitle = trackInfo.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const sanitizedArtist = trackInfo.primaryArtist.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const filename = `${sanitizedArtist}-${sanitizedTitle}`;

    const tempFilePath = path.join(TEMP_DIR, `${filename}.webm`);
    const outputFilePath = path.join(OUTPUT_DIR, `${filename}.mp3`);

    // Skip if the file already exists
    if (fs.existsSync(outputFilePath)) {
      return outputFilePath;
    }

    // Download with yt-dlp
    if (io && socketId) {
      io.to(socketId).emit('download-progress', {
        id: downloadId,
        trackId: trackInfo.id,
        status: 'downloading',
        message: `Downloading ${trackInfo.title}`,
        progress: 0
      });
    }

    await ytDlp.execPromise([
      videoUrl,
      '-f', 'bestaudio',
      '-o', tempFilePath,
      '--no-playlist',
      '--extract-audio',
      '--audio-format', 'mp3',
      '--audio-quality', '0', // Best quality
      '--progress'
    ]);

    // Convert using ffmpeg and add metadata
    if (io && socketId) {
      io.to(socketId).emit('download-progress', {
        id: downloadId,
        trackId: trackInfo.id,
        status: 'processing',
        message: `Processing ${trackInfo.title}`,
        progress: 50
      });
    }

    await new Promise((resolve, reject) => {
      ffmpeg(tempFilePath)
        .audioBitrate(320)
        .format('mp3')
        .on('progress', (progress) => {
          if (progress.percent && io && socketId) {
            const totalPercent = 50 + Math.round(progress.percent / 2);
            io.to(socketId).emit('download-progress', {
              id: downloadId,
              trackId: trackInfo.id,
              status: 'processing',
              message: `Converting ${trackInfo.title}`,
              progress: totalPercent
            });
          }
        })
        .on('end', resolve)
        .on('error', reject)
        .save(outputFilePath);
    });

    // Add metadata to the file
    if (trackInfo.albumArt) {
      const coverPath = path.join(TEMP_DIR, `${filename}_cover.jpg`);
      const response = await axios({
        url: trackInfo.albumArt,
        responseType: 'arraybuffer'
      });
      fs.writeFileSync(coverPath, response.data);

      const tags = {
        title: trackInfo.title,
        artist: trackInfo.artist,
        album: trackInfo.album,
        APIC: coverPath,
        trackNumber: trackInfo.trackNumber,
        year: trackInfo.releaseDate?.substring(0, 4)
      };

      NodeID3.write(tags, outputFilePath);
      fs.unlinkSync(coverPath);
    }

    // Clean up temporary file
    fs.unlinkSync(tempFilePath);

    if (io && socketId) {
      io.to(socketId).emit('download-progress', {
        id: downloadId,
        trackId: trackInfo.id,
        status: 'completed',
        message: `Downloaded ${trackInfo.title}`,
        progress: 100
      });
    }

    return outputFilePath;
  } catch (error) {
    console.error(`Error downloading track ${trackInfo.title}:`, error);
    if (io && socketId) {
      io.to(socketId).emit('download-progress', {
        id: downloadId,
        trackId: trackInfo.id,
        status: 'error',
        message: `Error downloading ${trackInfo.title}: ${error.message}`,
        progress: 0
      });
    }
    throw new Error(`Failed to download track: ${error.message}`);
  }
};

module.exports = {
  findYouTubeVideo,
  downloadAndProcessTrack
};