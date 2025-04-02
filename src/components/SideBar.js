import React from 'react';
import { Nav } from 'react-bootstrap';
import { FaMusic } from 'react-icons/fa';

const SideBar = ({ activeTab, setActiveTab, toggleSidebar }) => {
  const menuItems = [
    'For You',
    'Top Tracks',
    'Favourites',
    'Recently Played'
  ];

  return (
    <div className="sidebar">
      <div className="app-logo">
        <FaMusic size={30} />
        <span>Music Player</span>
        <button className="close-sidebar d-md-none" onClick={toggleSidebar}>×</button>
      </div>
      
      <Nav className="flex-column">
        {menuItems.map((item, index) => (
          <Nav.Link
            key={index}
            className={activeTab === item ? 'active' : ''}
            onClick={() => setActiveTab(item)}
          >
            {item}
          </Nav.Link>
        ))}
      </Nav>
    </div>
  );
};

export default SideBar;
