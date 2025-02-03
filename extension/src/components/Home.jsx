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

import React, { useEffect, useState } from "react";

const Home = () => {
  const [siteData, setSiteData] = useState(null);

  // Function to load data from storage
  const loadSiteData = () => {
    chrome.storage.local.get("siteData", (result) => {
      if (result.siteData) {
        console.log("Site data retrieved:", result.siteData);
        setSiteData(result.siteData);
      } else {
        console.log("No site data found");
      }
    });
  };

  useEffect(() => {
    // Initially load the current site data
    loadSiteData();

    // Listen for changes in chrome.storage (when background updates siteData)
    const handleStorageChange = (changes, area) => {
      if (area === "local" && changes.siteData) {
        setSiteData(changes.siteData.newValue);
        console.log("Site data updated:", changes.siteData.newValue);
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);

    // Cleanup the listener on unmount
    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange);
    };
  }, []);

  return siteData ? (
    <div>
      <h2>Site Data:</h2>
      <p>{JSON.stringify(siteData, null, 2)}</p>
    </div>
  ) : (
    <h1>No data available</h1>
  );
};

export default Home;
