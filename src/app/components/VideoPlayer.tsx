'use client'

import React, { useEffect, useRef } from 'react'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
import '@videojs/http-streaming'
import 'videojs-youtube'

interface VideoPlayerProps {
  videoId: string;
  isLive?: boolean;
  userEmail: string;
}

const youtubeConfig = {
  techOrder: ['youtube'],
  sources: [],
  youtube: {
    iv_load_policy: 1,
    playsinline: 1,
    customVars: {
      control: 0,
      fs: 1,
      modestbranding: 1,
      playsinline: 1,
      rel: 0,
      showinfo: 0,
      autoplay: 1
    }
  }
};

export const VideoPlayer = ({ videoId, isLive = false, userEmail }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLDivElement | null>(null)
  const playerRef = useRef(null)

  useEffect(() => {
    if (!videoRef.current || !videoId || !userEmail) return;

    if (playerRef.current) {
      playerRef.current.dispose()
      playerRef.current = null
    }

    const videoElement = document.createElement('video')
    videoElement.className = 'video-js vjs-big-play-centered'
    videoRef.current.appendChild(videoElement)

    const embedUrl = `https://www.youtube.com/watch?v=${videoId}`;

    const getLiveControlBar = () => ({
      playToggle: false,
      currentTimeDisplay: false,
      timeDivider: false,
      durationDisplay: false,
      progressControl: false,
      liveDisplay: true,
      volumePanel: true,
      fullscreenToggle: true
    })
    
    const getVodControlBar = () => ({
      playToggle: true,
      currentTimeDisplay: true,
      timeDivider: true,
      durationDisplay: true,
      progressControl: true,
      liveDisplay: false,
      volumePanel: true,
      fullscreenToggle: true
    })

    const player = playerRef.current = videojs(videoElement, {
      ...youtubeConfig,
      sources: [{
        type: 'video/youtube',
        src: embedUrl
      }],
      controlBar: isLive ? getLiveControlBar() : getVodControlBar(),
      youtube: {
        ...youtubeConfig.youtube,
        ytControls: 2,
        origin: window.location.origin,
        enablePrivacyEnhancedMode: false,
        authToken: userEmail
      }
    })

    // Atualizar controles quando o tipo mudar
    if (isLive) {
      player.controlBar.progressControl?.hide()
      player.controlBar.liveDisplay?.show()
    } else {
      player.controlBar.progressControl?.show()
      player.controlBar.liveDisplay?.hide()
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.innerHTML = '';
      }
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [videoId, isLive, userEmail]);

  return (
    <div 
    ref={videoRef} 
    className="w-full aspect-video relative bg-black"
    style={{ minHeight: '200px' }}
  />
  )
}