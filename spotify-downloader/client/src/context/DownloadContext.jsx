import React, { createContext, useContext, useReducer } from 'react';

export const DownloadContext = createContext();

const initialState = {
    downloads: [],
};

const downloadReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_DOWNLOAD':
            return {
                ...state,
                downloads: [
                    ...state.downloads,
                    {
                        ...action.payload,
                        id: action.payload.downloadId,
                        progress: 0,
                        status: 'pending',
                        createdAt: new Date().toISOString(),
                    }
                ],
            };

        case 'UPDATE_DOWNLOAD':
            return {
                ...state,
                downloads: state.downloads.map(download => 
                    download.id === action.payload.downloadId
                        ? { ...download, ...action.payload.data, updatedAt: new Date().toISOString() }
                        : download
                ),
            };

        case 'REMOVE_DOWNLOAD':
            return {
                ...state,
                downloads: state.downloads.filter(download => download.id !== action.payload),
            };

        case 'CLEAR_COMPLETED':
            return {
                ...state,
                downloads: state.downloads.filter(download => download.status !== 'completed'),
            };

        case 'CLEAR_FAILED':
            return {
                ...state,
                downloads: state.downloads.filter(download => download.status !== 'error'),
            };

        case 'CLEAR_ALL':
            return initialState;

        default:
            return state;
    }
};

export const DownloadProvider = ({ children }) => {
    const [state, dispatch] = useReducer(downloadReducer, initialState);

    const addDownload = (downloadData) => {
        dispatch({
            type: 'ADD_DOWNLOAD',
            payload: downloadData,
        });
    };

    const updateDownload = (downloadId, data) => {
        dispatch({
            type: 'UPDATE_DOWNLOAD',
            payload: { downloadId, data },
        });
    };

    const removeDownload = (downloadId) => {
        dispatch({
            type: 'REMOVE_DOWNLOAD',
            payload: downloadId,
        });
    };

    const clearCompleted = () => {
        dispatch({ type: 'CLEAR_COMPLETED' });
    };

    const clearFailed = () => {
        dispatch({ type: 'CLEAR_FAILED' });
    };

    const clearAll = () => {
        dispatch({ type: 'CLEAR_ALL' });
    };

    // Utility functions for filtering downloads
    const getDownloadsByStatus = (status) => {
        return state.downloads.filter(
            (download) => download.status === status
        );
    };

    const getActiveDownloads = () => {
        return state.downloads.filter(
            (download) => ['pending', 'downloading', 'queued'].includes(download.status)
        );
    };

    return (
        <DownloadContext.Provider
            value={{
                downloads: state.downloads,
                addDownload,
                updateDownload,
                removeDownload,
                clearCompleted,
                clearFailed,
                clearAll,
                getDownloadsByStatus,
                getActiveDownloads,
            }}
        >
            {children}
        </DownloadContext.Provider>
    );
};

export const useDownload = () => {
    const context = useContext(DownloadContext);
    if (!context) {
        throw new Error('useDownload must be used within a DownloadProvider');
    }
    return context;
};