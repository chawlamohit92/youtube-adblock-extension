/* background.js */
chrome.declarativeNetRequest.updateDynamicRules({
    addRules: [
      { "id": 1, "priority": 1, "action": { "type": "block" }, "condition": { "urlFilter": "*://www.youtube.com/api/stats/ads*", "resourceTypes": ["xmlhttprequest"] } },
      { "id": 2, "priority": 1, "action": { "type": "block" }, "condition": { "urlFilter": "*://www.youtube.com/get_video_info?*", "resourceTypes": ["xmlhttprequest"] } },
      { "id": 3, "priority": 1, "action": { "type": "block" }, "condition": { "urlFilter": "*://www.youtube.com/youtubei/v1/ad*", "resourceTypes": ["xmlhttprequest"] } }
    ],
    removeRuleIds: [1, 2, 3]
  });
  