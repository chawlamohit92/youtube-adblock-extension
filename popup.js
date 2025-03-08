/* popup.js */
document.addEventListener("DOMContentLoaded", () => {
    // Load saved settings when the popup opens
    chrome.storage.sync.get(["disableComments", "disableLiveChat", "autoQuality"], (data) => {
      document.getElementById("disable-comments").checked = data.disableComments || false;
      document.getElementById("disable-live-chat").checked = data.disableLiveChat || false;
      document.getElementById("auto-quality").checked = data.autoQuality || false;
    });
  
    // Save settings when the button is clicked
    document.getElementById("save-settings").addEventListener("click", () => {
      const settings = {
        disableComments: document.getElementById("disable-comments").checked,
        disableLiveChat: document.getElementById("disable-live-chat").checked,
        autoQuality: document.getElementById("auto-quality").checked,
      };
  
      chrome.storage.sync.set(settings, () => {
        document.getElementById("save-settings").innerText = "Saved! ✅";
        setTimeout(() => document.getElementById("save-settings").innerText = "Save", 1500);
  
        // Send message to content script to apply settings immediately
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs.length > 0) {
            chrome.scripting.executeScript({
              target: { tabId: tabs[0].id },
              function: applySettings,
              args: [settings]
            });
          }
        });
      });
    });
  });
  
  // Function to apply settings dynamically
  function applySettings(settings) {
    if (settings.disableComments) {
      document.querySelector("#comments")?.remove();
    }
    if (settings.disableLiveChat) {
      document.querySelector("ytd-live-chat-frame")?.remove();
    }
    if (settings.autoQuality) {
      function setPreferredQuality() {
        const video = document.querySelector("video");
        if (!video) return;
  
        const settingsButton = document.querySelector(".ytp-settings-button");
        if (!settingsButton) return;
        settingsButton.click();
        
        setTimeout(() => {
          const qualityMenuButton = [...document.querySelectorAll(".ytp-menuitem")].find(el => el.innerText.includes("Quality"));
          if (!qualityMenuButton) return;
          qualityMenuButton.click();
          
          setTimeout(() => {
            const qualityOptions = [...document.querySelectorAll(".ytp-quality-menu .ytp-menuitem")];
            let preferredQuality = qualityOptions.find(option => option.innerText.includes("1440p")) || 
                                  qualityOptions.find(option => option.innerText.includes("1080p")) || 
                                  qualityOptions.reverse().find(option => !option.innerText.includes("Auto"));
            
            if (preferredQuality) {
              preferredQuality.click();
              
              // Check for playback jerks after switching
              setTimeout(() => {
                if (video.readyState < 3 || video.networkState === 3) { // Buffering or stalled
                  console.log("1440p causing lag, switching to 1080p");
                  const fallbackQuality = qualityOptions.find(option => option.innerText.includes("1080p"));
                  fallbackQuality?.click();
                }
              }, 5000); // Wait 5 seconds to detect issues
            }
          }, 500);
        }, 500);
      }
      
      setTimeout(setPreferredQuality, 3000); // Delay to ensure video is loaded
    }
  }
  