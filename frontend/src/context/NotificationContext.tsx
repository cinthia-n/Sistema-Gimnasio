import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import type { AlertColor } from '@mui/material/Alert';

interface NotificationState {
    open: boolean;
    message: string;
    severity: AlertColor;
}

interface NotificationContextValue {
    showSuccess: (message: string) => void;
    showError: (message: string) => void;
    showWarning: (message: string) => void;
    showInfo: (message: string) => void;
}

const NotificationContext =
    createContext<NotificationContextValue | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {

    const [state, setState] = useState<NotificationState>({
        open: false,
        message: '',
        severity: 'info',
    });

    const show = useCallback(
        (message: string, severity: AlertColor) => {
            setState({ open: true, message, severity });
        },
        [],
    );

    const handleClose = (
        _event?: React.SyntheticEvent | Event,
        reason?: string,
    ) => {
        if (reason === 'clickaway') {
            return;
        }
        setState((prev) => ({ ...prev, open: false }));
    };

    const value: NotificationContextValue = {
        showSuccess: (message) => show(message, 'success'),
        showError: (message) => show(message, 'error'),
        showWarning: (message) => show(message, 'warning'),
        showInfo: (message) => show(message, 'info'),
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}

            <Snackbar
                open={state.open}
                autoHideDuration={4000}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleClose}
                    severity={state.severity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {state.message}
                </Alert>
            </Snackbar>
        </NotificationContext.Provider>
    );
}

export function useNotification() {
    const context = useContext(NotificationContext);

    if (!context) {
        throw new Error(
            'useNotification debe usarse dentro de un NotificationProvider',
        );
    }

    return context;
}