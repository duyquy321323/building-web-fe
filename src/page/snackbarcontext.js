// SnackbarContext.js
import React, { createContext, useContext, useState } from 'react';
import { Snackbar } from '@mui/material';

const SnackbarContext = createContext();

export const useSnackbar = () => useContext(SnackbarContext);

export const SnackbarProvider = ({ children }) => {
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: ''
    });

    const showSnackbar = (message) => {
        setSnackbar({
            open: true,
            message
        });
    };

    const closeSnackbar = () => {
        setSnackbar({
            ...snackbar,
            open: false
        });
    };

    return (
        <SnackbarContext.Provider value={{ snackbar, showSnackbar, closeSnackbar }}>
            {children}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={5000}
                onClose={closeSnackbar}
                message={snackbar.message}
            />
        </SnackbarContext.Provider>
    );
};
