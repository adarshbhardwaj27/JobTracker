// // Placeholder background script for handling persistent events if necessary
// chrome.runtime.onInstalled.addListener(() => {
//     console.log("Extension Installed");
// });

// // chrome.storage.onChanged.addListener((changes, namespace) => {
// //     if (namespace === "sync" && changes.authState) {
// //         const newState = changes.authState.newValue;
// //         if (newState === "loggedIn") {
// //             console.log("User logged in via sync.");
// //             // Send a message to update the UI in popup or content scripts
// //             chrome.runtime.sendMessage({ authState: 'loggedIn' });
// //         } else if (newState === "loggedOut") {
// //             console.log("User logged out via sync.");
// //             chrome.runtime.sendMessage({ authState: 'loggedOut' });
// //         }
// //     }
// // });

// chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
//     if (message.type === 'SET_AUTH_STATE') {
//         // Update authState in chrome.storage
//         chrome.storage.sync.set({ authState: message.authState }, () => {
//             console.log(`Auth state updated: ${message.authState}`);
//             sendResponse({ success: true });
//         });
//         return true; // Keep the message channel open for async response
//     } else {
//         sendResponse({ success: false, error: 'Unknown message type' });
//     }


// });

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     if (message.type === "SITE_DATA") {
//         console.log("Received site data:", message.data);

//         // Store data in Chrome Storage (optional)
//         chrome.storage.local.set({ siteData: message.data });

//         sendResponse({ status: "Data received" });
//     }
// });


// background.js

// chrome.runtime.onInstalled.addListener(() => {
//     console.log("Extension Installed");
// });

// // Existing external message listener (if needed)
// chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
//     if (message.type === "SET_AUTH_STATE") {
//         chrome.storage.sync.set({ authState: message.authState }, () => {
//             console.log(`Auth state updated: ${message.authState}`);
//             sendResponse({ success: true });
//         });
//         return true; // Keep the message channel open for async response
//     } else {
//         sendResponse({ success: false, error: "Unknown message type" });
//     }
// });

// // Internal message listener for site data
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     if (message.type === "SITE_DATA") {
//         console.log("Received site data:", message.data);

//         // Store data in Chrome Storage
//         chrome.storage.local.set({ siteData: message.data }, () => {
//             console.log("Site data saved in storage");
//             sendResponse({ status: "Data received" });
//         });
//         return true; // Keep the message channel open for async response
//     }
// });

// // Function to inject script into the active tab
// function updateActiveTabData() {
//     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//         if (tabs && tabs[0] && tabs[0].id) {
//             chrome.scripting.executeScript({
//                 target: { tabId: tabs[0].id },
//                 function: () => {
//                     // Build the data object
//                     const siteData = {
//                         title: document.title,
//                         url: window.location.href,
//                         text: document.body.innerText,
//                     };

//                     // If a button exists, include its text
//                     const buttons = document.getElementsByTagName("button");
//                     console.log("Buttons:", buttons);
//                     if (buttons) {

//                         let allButtonTexts = Array.from(buttons).map(button => button.innerText).join(" ");
//                         siteData.buttonText = allButtonTexts;
//                     }

//                     // Send the data to the background script
//                     chrome.runtime.sendMessage({
//                         type: "SITE_DATA",
//                         data: siteData,
//                     });
//                 },
//             });
//         }
//     });
// }

// // Listen for tab activation changes
// chrome.tabs.onActivated.addListener(() => {
//     updateActiveTabData();
// });

// // Listen for window focus changes (for example, when switching windows)
// chrome.windows.onFocusChanged.addListener((windowId) => {
//     if (windowId !== chrome.windows.WINDOW_ID_NONE) {
//         updateActiveTabData();
//     }
// });

// // Optionally, call it once at startup
// updateActiveTabData();


// Import axios (ensure you're bundling your background script using a tool like Webpack)
import axios from "axios";

chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension Installed");
});

// Existing external message listener (if needed)
chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
    if (message.type === "SET_AUTH_STATE") {
        chrome.storage.sync.set({ authState: message.authState }, () => {
            console.log(`Auth state updated: ${message.authState}`);
            sendResponse({ success: true });
        });
        return true; // Keep the message channel open for async response
    } else {
        sendResponse({ success: false, error: "Unknown message type" });
    }
});

// Internal message listener for site data
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "SITE_DATA") {
        console.log("Received site data:", message.data);

        // Directly call your backend API with Axios, no local saving needed.
        axios
            .post("http://localhost:8080/ai", { data: message.data })
            .then((response) => {
                console.log("API call successful:", response.data);
                // Respond back if necessary
                sendResponse({ status: "API call successful", data: response.data });
            })
            .catch((error) => {
                console.error("API call error:", error);
                sendResponse({ status: "API call error", error: error.toString() });
            });

        // Indicate that the response will be sent asynchronously.
        return true;
    }
});
