import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import io from 'socket.io-client';
import { SOCKET_URL } from '../config/api';
import { toast } from 'react-toastify';
import { useDownload } from './DownloadContext';

const SocketContext = createContext();

const RECONNECTION_ATTEMPTS = 3;
const RECONNECTION_DELAY = 5000;

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [socketId, setSocketId] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [reconnectionAttempts, setReconnectionAttempts] = useState(0);
    const { updateDownload } = useDownload();

    const handleConnectionError = useCallback((error) => {
        console.error('Socket connection error:', error);
        setIsConnected(false);
        
        if (reconnectionAttempts < RECONNECTION_ATTEMPTS) {
            toast.error(`Connection lost. Attempting to reconnect... (${reconnectionAttempts + 1}/${RECONNECTION_ATTEMPTS})`);
            setTimeout(() => {
                setReconnectionAttempts(prev => prev + 1);
                initializeSocket();
            }, RECONNECTION_DELAY);
        } else {
            toast.error('Could not establish connection to server. Please refresh the page.');
        }
    }, [reconnectionAttempts]);

    const initializeSocket = useCallback(() => {
        if (socket?.connected) return;

        const socketInstance = io(SOCKET_URL, {
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: RECONNECTION_ATTEMPTS,
            reconnectionDelay: RECONNECTION_DELAY,
        });

        socketInstance.on('connect', () => {
            setSocketId(socketInstance.id);
            setIsConnected(true);
            setIsLoading(false);
            setReconnectionAttempts(0);
            toast.success('Connected to server');
        });

        socketInstance.on('connect_error', handleConnectionError);
        socketInstance.on('disconnect', () => {
            setIsConnected(false);
            toast.error('Disconnected from server');
        });

        // Download progress updates
        socketInstance.on('download_progress', (data) => {
            updateDownload(data.downloadId, {
                progress: data.progress,
                status: data.status,
                message: data.message,
            });
        });

        // Download completion
        socketInstance.on('download_complete', (data) => {
            updateDownload(data.downloadId, {
                progress: 100,
                status: 'completed',
                downloadUrl: data.downloadUrl,
            });
            toast.success(`Download completed: ${data.title}`);
        });

        // Download errors
        socketInstance.on('download_error', (data) => {
            updateDownload(data.downloadId, {
                status: 'error',
                error: data.error,
            });
            toast.error(`Download failed: ${data.error}`);
        });

        // Queue updates
        socketInstance.on('download_queue', (data) => {
            updateDownload(data.downloadId, {
                status: 'queued',
                queuePosition: data.position,
            });
            toast.info(`Download queued at position ${data.position}`);
        });

        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        };
    }, [handleConnectionError, updateDownload]);

    useEffect(() => {
        initializeSocket();
    }, [initializeSocket]);

    const value = {
        socket,
        socketId,
        isConnected,
        isLoading,
        reconnect: () => {
            setReconnectionAttempts(0);
            initializeSocket();
        }
    };

    if (isLoading) {
        return <div>Connecting to server...</div>;
    }

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};
