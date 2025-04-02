import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/App.scss';
import { Container, Row, Col } from 'react-bootstrap';
import Sidebar from './components/SideBar';
import MusicList from './components/MusicList';
import Player from './components/Player';
import  dummyData  from './Assets/dummyData';

function App() {
  const [songs, setSongs] = useState(dummyData);
  const [currentSong, setCurrentSong] = useState(songs[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('For You');
  const [showSidebar, setShowSidebar] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const audioRef = useRef(null);
  const [dominantColor, setDominantColor] = useState('rgb(83, 83, 83)');

  // Initialize from localStorage/sessionStorage
  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(storedFavorites);
    
    const storedRecent = JSON.parse(sessionStorage.getItem('recentlyPlayed')) || [];
    setRecentlyPlayed(storedRecent);
  }, []);

  // Update recently played in session storage
  useEffect(() => {
    sessionStorage.setItem('recentlyPlayed', JSON.stringify(recentlyPlayed));
  }, [recentlyPlayed]);

  // Update favorites in local storage
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Filter songs based on search query
  const filteredSongs = songs.filter(song => 
    song.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle song selection
  const handleSongSelect = (song) => {
    setCurrentSong(song);
    setIsPlaying(true);
    
    // Update recently played
    const newRecentlyPlayed = [song, ...recentlyPlayed.filter(s => s.id !== song.id)].slice(0, 10);
    setRecentlyPlayed(newRecentlyPlayed);
    
    // Simulate color extraction from album art
    extractDominantColor(song.thumbnail);
  };

  // Play next song
  const playNextSong = () => {
    const currentIndex = songs.findIndex(song => song.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % songs.length;
    handleSongSelect(songs[nextIndex]);
  };

  // Play previous song
  const playPreviousSong = () => {
    const currentIndex = songs.findIndex(song => song.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    handleSongSelect(songs[prevIndex]);
  };

  // Toggle favorite status
  const toggleFavorite = (songId) => {
    const isFavorite = favorites.some(fav => fav.id === songId);
    
    if (isFavorite) {
      setFavorites(favorites.filter(fav => fav.id !== songId));
    } else {
      const songToAdd = songs.find(song => song.id === songId);
      setFavorites([...favorites, songToAdd]);
    }
  };

  // Simulate extracting dominant color from album art
  const extractDominantColor = (thumbnail) => {
    const colors = [
      'rgb(83, 83, 83)',
      'rgb(37, 65, 81)',
      'rgb(60, 30, 70)',
      'rgb(120, 50, 30)',
      'rgb(30, 70, 50)',
      'rgb(70, 40, 90)'
    ];
    
    // Use the song's ID to select a color pseudo-randomly
    const colorIndex = currentSong.id % colors.length;
    setDominantColor(colors[colorIndex]);
  };

  // Handle responsive sidebar toggle
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };



  // Get the current display data based on active tab
  const getDisplayData = () => {
    switch(activeTab) {
      case 'Favourites':
        return favorites;
      case 'Recently Played':
        return recentlyPlayed;
      case 'Top Tracks':
        return songs.slice(0, 5);
      default:
        return filteredSongs;
    }
  };

  return (
    <div className="app" style={{
      background: `linear-gradient(to bottom, ${dominantColor}, #121212)`
    }}>
      <Container fluid>
        <Row>
          {(showSidebar || window.innerWidth > 768) && (
            <Col md={3} className="sidebar-container">
              <Sidebar 
                activeTab={activeTab} 
                setActiveTab={setActiveTab}
                toggleSidebar={toggleSidebar}
              />
            </Col>
          )}
          
          <Col md={showSidebar ? 9 : 12} className="main-content">
            <Row>
              <Col md={12} lg={7}>
                <div className="content-section">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    {!showSidebar && (
                      <button className="menu-button" onClick={toggleSidebar}>
                        ☰
                      </button>
                    )}
                    <h2>{activeTab}</h2>
                    <div className="search-container">
                      <input
                        type="text"
                        placeholder="Search Song, Artist"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                      />
                    </div>
                  </div>
                  <MusicList 
                    songs={getDisplayData()}
                    currentSong={currentSong}
                    onSongSelect={handleSongSelect}
                    toggleFavorite={toggleFavorite}
                    favorites={favorites}
                  />
                </div>
              </Col>
              
              <Col md={12} lg={5}>
                <Player 
                  currentSong={currentSong}
                  isPlaying={isPlaying}
                  setIsPlaying={setIsPlaying}
                  audioRef={audioRef}
                  onNextSong={playNextSong}
                  onPreviousSong={playPreviousSong}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
      
      <audio 
        ref={audioRef}
        src={currentSong.musicUrl}
        onEnded={playNextSong}
      />
    </div>
  );
}

export default App;