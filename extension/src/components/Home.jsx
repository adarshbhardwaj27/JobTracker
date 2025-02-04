// import React, { useEffect, useState } from "react";

// const Home = () => {
//   const [siteData, setSiteData] = useState(null);

//   useEffect(() => {
//     // Get active tab
//     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//       if (tabs[0]?.id) {
//         // Inject script to get site data along with button text (if available)
//         chrome.scripting.executeScript({
//           target: { tabId: tabs[0].id },
//           function: () => {
//             console.log("Injected script executing in the tab");
//             // Build the data object
//             const siteData = {
//               title: document.title,
//               url: window.location.href,
//               text: document.body.innerText,
//             };

//             // Check if there's a button on the page and get its text
//             const button = document.querySelector("button");
//             if (button) {
//               siteData.buttonText = button.innerText;
//             }

//             // Send the data back to the background script
//             chrome.runtime.sendMessage({
//               type: "SITE_DATA",
//               data: siteData,
//             });
//           },
//         });
//       }
//     });

//     // Retrieve the stored site data from chrome.storage
//     chrome.storage.local.get("siteData", (result) => {
//       if (result.siteData) {
//         console.log("Site data retrieved:", result.siteData);
//         setSiteData(result.siteData);
//       } else {
//         console.log("No site data found");
//       }
//     });
//   }, []);

//   return siteData ? (
//     <div>
//       <h2>Site Data:</h2>
//       <pre>{JSON.stringify(siteData)}</pre>
//     </div>
//   ) : (
//     <h1>Nothing</h1>
//   );
// };

// export default Home;

// import React, { useEffect, useState } from "react";

// const Home = () => {
//   const [siteData, setSiteData] = useState(null);

//   // Function to load data from storage
//   const loadSiteData = () => {
//     chrome.storage.local.get("siteData", (result) => {
//       if (result.siteData) {
//         console.log("Site data retrieved:", result.siteData);
//         setSiteData(result.siteData);
//       } else {
//         console.log("No site data found");
//       }
//     });
//   };

//   useEffect(() => {
//     // Initially load the current site data
//     loadSiteData();

//     // Listen for changes in chrome.storage (when background updates siteData)
//     const handleStorageChange = (changes, area) => {
//       if (area === "local" && changes.siteData) {
//         setSiteData(changes.siteData.newValue);
//         console.log("Site data updated:", changes.siteData.newValue);
//       }
//     };

//     chrome.storage.onChanged.addListener(handleStorageChange);

//     // Cleanup the listener on unmount
//     return () => {
//       chrome.storage.onChanged.removeListener(handleStorageChange);
//     };
//   }, []);

//   return siteData ? (
//     <div>
//       <h2>Site Data:</h2>
//       <p>{JSON.stringify(siteData, null, 2)}</p>
//     </div>
//   ) : (
//     <h1>No data available</h1>
//   );
// };

// export default Home;

import React, { useEffect, useState } from "react";

const Home = () => {
  const [siteData, setSiteData] = useState(null);
  const [apiResponse, setApiResponse] = useState(null);

  useEffect(() => {
    // Function to fetch site data from the active tab
    const fetchSiteData = () => {
      chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        if (tabs && tabs[0]?.id) {
          try {
            // Use chrome.scripting.executeScript to run a function in the active tab
            const results = await chrome.scripting.executeScript({
              target: { tabId: tabs[0].id },
              func: () => {
                // Extract data from the current page
                const button = document.querySelector("button");
                return {
                  title: document.title,
                  url: window.location.href,
                  text: document.body.innerHTML,
                  buttonText: button ? button.innerText : null,
                };
              },
            });

            // The result of the executed script is returned in results[0].result
            if (results && results[0]?.result) {
              const data = results[0].result;
              setSiteData(data);

              // Now, call the backend API using fetch
              fetch("http://localhost:8080/ai", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ data }),
              })
                .then((response) => response.json())
                .then((resData) => {
                  console.log("API call successful:", resData);
                  setApiResponse(resData);
                })
                .catch((error) => {
                  console.error("API call error:", error);
                });
            }
          } catch (error) {
            console.error("Error executing script:", error);
          }
        }
      });
    };

    // Fetch site data when the component mounts
    fetchSiteData();

    // Optionally, if you want to update the data when the active tab changes,
    // you could add event listeners for chrome.tabs.onActivated or chrome.windows.onFocusChanged.
    // For example:
    // const handleTabChange = () => fetchSiteData();
    // chrome.tabs.onActivated.addListener(handleTabChange);
    // chrome.windows.onFocusChanged.addListener(handleTabChange);
    // return () => {
    //   chrome.tabs.onActivated.removeListener(handleTabChange);
    //   chrome.windows.onFocusChanged.removeListener(handleTabChange);
    // };
  }, []);

  return (
    <div>
      <h1>Site Data</h1>
      {siteData ? (
        <pre>{JSON.stringify(siteData, null, 2)}</pre>
      ) : (
        <p>No site data available.</p>
      )}

      <h1>API Response</h1>
      {apiResponse ? (
        <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
      ) : (
        <p>No API response received yet.</p>
      )}
    </div>
  );
};

export default Home;

// import React, { useEffect, useState } from "react";

// const Home = () => {
//   const [siteData, setSiteData] = useState(null);
//   const [apiResponse, setApiResponse] = useState(null);

//   useEffect(() => {
//     // Function to fetch site data from the active tab for display purposes.
//     const fetchSiteData = () => {
//       chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
//         if (tabs && tabs[0]?.id) {
//           try {
//             const results = await chrome.scripting.executeScript({
//               target: { tabId: tabs[0].id },
//               func: () => {
//                 const button = document.querySelector("button");
//                 return {
//                   title: document.title,
//                   url: window.location.href,
//                   text: document.body.innerHTML,
//                   buttonText: button ? button.innerText : null,
//                 };
//               },
//             });

//             if (results && results[0]?.result) {
//               const data = results[0].result;
//               setSiteData(data);
//             }
//           } catch (error) {
//             console.error("Error executing script:", error);
//           }
//         }
//       });
//     };

//     // Fetch site data when the component mounts.
//     fetchSiteData();

//     // Optionally, listen for messages from background.js (for API responses, if needed)
//     chrome.runtime.onMessage.addListener((message) => {
//       if (message.type === "API_RESPONSE") {
//         setApiResponse(message.data);
//       }
//     });
//   }, []);

//   return (
//     <div>
//       <h1>Site Data</h1>
//       {siteData ? (
//         <pre>{JSON.stringify(siteData, null, 2)}</pre>
//       ) : (
//         <p>No site data available.</p>
//       )}

//       <h1>API Response</h1>
//       {apiResponse ? (
//         <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
//       ) : (
//         <p>No API response received yet.</p>
//       )}
//     </div>
//   );
// };

// export default Home;
