import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Downloads from './pages/Downloads';
import { SocketProvider } from './context/SocketContext';
import { DownloadProvider } from './context/DownloadContext';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#1DB954', // Spotify green
        },
        background: {
            default: '#121212',
            paper: '#282828',
        },
    },
    typography: {
        fontFamily: "'Circular Std', 'Roboto', 'Arial', sans-serif",
        h1: {
            fontSize: '2.5rem',
            fontWeight: 700,
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 600,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 500,
                    textTransform: 'none',
                    fontWeight: 600,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                },
            },
        },
    },
});

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <SocketProvider>
                <DownloadProvider>
                    <Router>
                        <div className="App">
                            <Header />
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/downloads" element={<Downloads />} />
                            </Routes>
                            <Footer />
                            <ToastContainer
                                position="bottom-right"
                                autoClose={5000}
                                hideProgressBar={false}
                                newestOnTop
                                closeOnClick
                                rtl={false}
                                pauseOnFocusLoss
                                draggable
                                pauseOnHover
                                theme="dark"
                            />
                        </div>
                    </Router>
                </DownloadProvider>
            </SocketProvider>
        </ThemeProvider>
    );
};

export default App;