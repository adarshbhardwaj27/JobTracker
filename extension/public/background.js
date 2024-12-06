// Placeholder background script for handling persistent events if necessary
chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension Installed");
});

// chrome.storage.onChanged.addListener((changes, namespace) => {
//     if (namespace === "sync" && changes.authState) {
//         const newState = changes.authState.newValue;
//         if (newState === "loggedIn") {
//             console.log("User logged in via sync.");
//             // Send a message to update the UI in popup or content scripts
//             chrome.runtime.sendMessage({ authState: 'loggedIn' });
//         } else if (newState === "loggedOut") {
//             console.log("User logged out via sync.");
//             chrome.runtime.sendMessage({ authState: 'loggedOut' });
//         }
//     }
// });

chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
    if (message.type === 'SET_AUTH_STATE') {
        // Update authState in chrome.storage
        chrome.storage.sync.set({ authState: message.authState }, () => {
            console.log(`Auth state updated: ${message.authState}`);
            sendResponse({ success: true });
        });
        return true; // Keep the message channel open for async response
    } else {
        sendResponse({ success: false, error: 'Unknown message type' });
    }
});