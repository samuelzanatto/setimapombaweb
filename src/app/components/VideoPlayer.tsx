'use client'

import React, { useEffect, useRef } from 'react'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
import '@videojs/http-streaming'
import 'videojs-youtube'

interface VideoPlayerProps {
  videoId: string
  isLive?: boolean
  onError?: () => void
}

interface YouTubeOptions {
  controls: number
  modestbranding: number
  playsinline: number
  rel: number
  showinfo: number
  iv_load_policy: number
  autoplay: number
  disablekb: number
  enablejsapi: number
}

const youtubeConfig: YouTubeOptions = {
  controls: 0,
  modestbranding: 1,
  playsinline: 1,
  rel: 0,
  showinfo: 0,
  iv_load_policy: 3,
  autoplay: 1,
  disablekb: 0,
  enablejsapi: 1
}

export const VideoPlayer = ({ videoId, isLive = false }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLDivElement | null>(null)
  const playerRef = useRef<any>(null)

  useEffect(() => {
    if (!videoRef.current || !videoId) return

    if (playerRef.current) {
      playerRef.current.dispose()
      playerRef.current = null
    }

    const videoElement = document.createElement('video')
    videoElement.className = 'video-js vjs-big-play-centered'
    videoRef.current.appendChild(videoElement)

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
      controls: true,
      fluid: true,
      autoplay: true,
      muted: true,
      bigPlayButton: !isLive,
      liveui: isLive,
      techOrder: ['youtube'],
      sources: [{
        type: 'video/youtube',
        src: `https://www.youtube.com/watch?v=${videoId}`
      }],
      controlBar: isLive ? getLiveControlBar() : getVodControlBar(),
      youtube: {
        customVars: {
        ...youtubeConfig,
        autoplay: 1
        },
        playerVars: {
        ...youtubeConfig,
        autoplay: 1
        }
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
        videoRef.current.innerHTML = ''
      }
      if (playerRef.current) {
        playerRef.current.dispose()
        playerRef.current = null
      }
    }
  }, [videoId, isLive])

  return (
    <div ref={videoRef} className="w-full aspect-video" />
  )
}