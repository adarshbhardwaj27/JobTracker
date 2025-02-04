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

        // fetch("http://localhost:8080/api", {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify({ data: message.data }),
        // })
        //     .then((response) => response.json())
        //     .then((data) => {
        //         console.log("API call successful:", data);
        //         sendResponse({ status: "API call successful", data });
        //     })
        //     .catch((error) => {
        //         console.error("API call error:", error);
        //         sendResponse({ status: "API call error", error: error.toString() });
        //     });

        return true;
    }
});


// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//     if (changeInfo.status === "complete" && tab.active) {
//         // Check for restricted URLs (e.g., chrome://, edge://, about:)
//         if (
//             tab.url &&
//             (tab.url.startsWith("chrome://") ||
//                 tab.url.startsWith("edge://") ||
//                 tab.url.startsWith("about:"))
//         ) {
//             console.warn("Skipping script injection on restricted URL:", tab.url);
//             return;
//         }

//         // Inject script to extract site data
//         chrome.scripting.executeScript({
//             target: { tabId: tab.id },
//             function: extractSiteData,
//         }).catch((err) => console.error("Script injection error:", err));
//     }
// });

// function extractSiteData() {
//     const siteData = {
//         title: document.title,
//         url: window.location.href,
//         text: document.body.innerText,
//         buttonText: [...document.querySelectorAll("button")]
//             .map((btn) => btn.innerText)
//             .join(", "),
//     };

//     chrome.runtime.sendMessage({ type: "SITE_DATA", data: siteData });
// }

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     if (message.type === "SITE_DATA") {
//         console.log("Extracted site data:", message.data);

//         // Send POST request to backend
//         fetch("http://localhost:8080/ai", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(message.data),
//         })
//             .then((response) => response.json())
//             .then((data) => {
//                 console.log("Backend response:", data);

//                 // If response is true, show notification
//                 if (data.success) {
//                     chrome.notifications.create({
//                         type: "basic",
//                         iconUrl: "icon.png",
//                         title: "JobTracker",
//                         message: "Got it! The response is positive.",
//                     });
//                 }
//             })
//             .catch((error) => console.error("Error:", error));
//     }
// });
