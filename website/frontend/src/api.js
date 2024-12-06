import axios from 'axios';

const api = axios.create({
    baseURL: "http://localhost:8080/auth/",
    // withCredentials: true,
});

export const googleAuth = (code) => api.get(`/google?code=${code}`);

// Set authentication state in Chrome storage
export const setAuthStateInChromeStorage = (state) => {
    // Extension ID from chrome://extensions (or set dynamically)
    const extensionId = 'bbihmfaogiakboejkceadepcpbfhcpci';

    window.chrome.runtime.sendMessage(
        extensionId,
        { type: 'SET_AUTH_STATE', authState: state },
        (response) => {
            if (response && response.success) {
                console.log(`Auth state successfully updated: ${state}`);
            } else {
                console.error('Failed to update auth state:', response?.error);
            }
        }
    );
};