import React, { useEffect, useState } from 'react';
import { FaPlay, FaPause, FaStepBackward, FaStepForward, FaVolumeUp } from 'react-icons/fa';

const Player = ({ currentSong, isPlaying, setIsPlaying, audioRef, onNextSong, onPreviousSong }) => {
  const [songProgress, setSongProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    // Update audio element when song changes
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error("Playback failed:", error);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSong, audioRef]);

  useEffect(() => {
    // Set up progress tracking
    const audio = audioRef.current;
    
    const updateProgress = () => {
      if (audio) {
        setSongProgress(audio.currentTime);
        setDuration(audio.duration || 0);
      }
    };
    
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', updateProgress);
    
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', updateProgress);
    };
  }, [audioRef]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleProgressChange = (e) => {
    const newTime = e.target.value;
    setSongProgress(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="player">
      <div className="now-playing">
        <h2>{currentSong.title}</h2>
        <p>{currentSong.artistName}</p>
      </div>
      
      <div className="album-art">
        <img src={currentSong.thumbnail} alt={currentSong.title} className="cover-art" />
      </div>
      
      <div className="progress-container">
        <input
          type="range"
          min="0"
          max={duration || 100}
          value={songProgress || 0}
          onChange={handleProgressChange}
          className="progress-bar"
        />
        <div className="time-display">
          <span>{formatTime(songProgress)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
      
      <div className="controls">
        <button className="control-button" onClick={onPreviousSong}>
          <FaStepBackward />
        </button>
        
        <button className="control-button play-pause" onClick={togglePlay}>
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
        
        <button className="control-button" onClick={onNextSong}>
          <FaStepForward />
        </button>
        
        <div className="volume-control">
          <FaVolumeUp />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            defaultValue="0.7"
            onChange={(e) => {
              if (audioRef.current) {
                audioRef.current.volume = e.target.value;
              }
            }}
            className="volume-slider"
          />
        </div>
      </div>
    </div>
  );
};

export default Player;
