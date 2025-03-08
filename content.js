/* content.js */
const adSelectors = [
  ".ytp-ad-module", "#player-ads", "#masthead-ad", ".ytp-ad-overlay-container"
];

const removeAds = () => {
  adSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(ad => ad.remove());
  });
};

const skipVideoAds = (video) => {
  if (video && document.querySelector(".ad-showing")) {
      const adDuration = video.duration;
      if (!isNaN(adDuration) && isFinite(adDuration) && adDuration > 0) {
          video.currentTime = adDuration;
      } else {
          console.warn("Skipping video ad failed: Invalid duration", adDuration);
      }
  }
};

const expandVideoDescription = () => {
  const expandButton = document.querySelector("ytd-text-inline-expander[collapsed] button");
  if (expandButton) {
      expandButton.click();
  }
};

const observer = new MutationObserver((mutations) => {
  mutations.forEach(mutation => {
      if (mutation.addedNodes.length > 0) {
          removeAds();
          const video = document.querySelector("video");
          if (video) {
              skipVideoAds(video);
          }
          expandVideoDescription();
      }
  });
});

const waitForBody = setInterval(() => {
  if (document.body) {
      observer.observe(document.body, { childList: true, subtree: true, attributes: true });
      clearInterval(waitForBody);
  }
}, 100);

removeAds();
expandVideoDescription();
