import React, { useRef, useEffect } from 'react';

function YouTubePlayer ({
    videoId 
}) {
  
    const playerRef = useRef(null);

  useEffect(() => {
    // Load the YouTube API script
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // Initialize the YouTube Player when the API is ready
    window.onYouTubeIframeAPIReady = initializePlayer;

    // Cleanup the API when the component is unmounted
    return () => {
      window.onYouTubeIframeAPIReady = null;
    };
  }, []);

  const initializePlayer = () => {
    if (window.YT && window.YT.Player) {
      playerRef.current = new window.YT.Player('youtube-player', {
        videoId,
        playerVars: {
          autoplay: 1,      // Auto-play the video
          controls: 0,      // Hide video controls
          loop: 1,          // Enable looping
          enablejsapi: 1,   // Disable the JavaScript API
          mute: 1,
          playsinline: 1,   // Play inline on mobile devices
          disablekb: 1,
          showinfo: 0,
          playlist: videoId,
        },
      });
    }
  };

  return (
    <div id="youtube-player"></div>
  );
};

export default YouTubePlayer;
