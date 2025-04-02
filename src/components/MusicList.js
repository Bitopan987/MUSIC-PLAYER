import React from 'react';
import { FaEllipsisH, FaHeart } from 'react-icons/fa';
import { Dropdown } from 'react-bootstrap';

const MusicList = ({ songs, currentSong, onSongSelect, toggleFavorite, favorites }) => {
  if (songs.length === 0) {
    return <div className="no-songs">No songs found</div>;
  }

  return (
    <div className="music-list">
      {songs.map((song) => (
        <div 
          key={song.id} 
          className={`song-item ${currentSong.id === song.id ? 'active' : ''}`}
          onClick={() => onSongSelect(song)}
        >
          <div className="song-thumbnail">
            <img src={song.thumbnail} alt={song.title} />
          </div>
          
          <div className="song-info">
            <div className="song-title">{song.title}</div>
            <div className="song-artist">{song.artistName}</div>
          </div>
          
          <div className="song-duration">{song.duration}</div>
          
          <div className="song-options" onClick={(e) => e.stopPropagation()}>
            <Dropdown>
              <Dropdown.Toggle variant="dark" id={`dropdown-${song.id}`}>
                <FaEllipsisH />
              </Dropdown.Toggle>
              
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => toggleFavorite(song.id)}>
                  <FaHeart color={favorites.some(fav => fav.id === song.id) ? 'red' : 'white'} />
                  {favorites.some(fav => fav.id === song.id) ? ' Remove from Favorites' : ' Add to Favorites'}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MusicList;