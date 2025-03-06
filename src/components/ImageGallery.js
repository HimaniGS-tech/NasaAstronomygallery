
// src/components/ImageGallery.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ImageGallery.css'; // Import the CSS file

const ImageGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem('favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [mediaType, setMediaType] = useState('all');

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(`https://api.nasa.gov/planetary/apod?api_key=${process.env.REACT_APP_NASA_API_KEY}&count=10`);
        setImages(response.data);
      } catch (error) {
        console.error("Error fetching data from NASA API", error);
        setError("Failed to fetch images.");
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  const handleFavoriteToggle = (date) => {
    if (favorites.includes(date)) {
      const updatedFavorites = favorites.filter(fav => fav !== date);
      setFavorites(updatedFavorites);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites)); // Update local storage
    } else {
      const updatedFavorites = [...favorites, date];
      setFavorites(updatedFavorites);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites)); // Update local storage
    }
  };

  const filteredImages = images.filter(image => {
    const matchesSearch = image.title.toLowerCase().includes(searchTerm.toLowerCase()) || image.date.includes(searchTerm);
    const matchesMediaType = mediaType === 'all' || image.media_type === mediaType;
    return matchesSearch && matchesMediaType;
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1 className="centered-heading">NASA Astronomy Gallery</h1>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '10px' }}>
        <input 
          type="text" 
          className="centered-input" 
          placeholder="Search by title or date (YYYY-MM-DD)" 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          style={{ marginRight: '8px', width: '500px', padding: '10px', fontSize: '16px' }}
        />
        <select 
          value={mediaType} 
          onChange={(e) => setMediaType(e.target.value)} 
          className="centered-input" 
          style={{ marginLeft: '10px', width: '400px', padding: '10px', fontSize: '16px' }}
        >
          <option value="all">All</option>
          <option value="image">Images</option>
          <option value="video">Videos</option>
        </select>
      </div>
      <div className="grid">
        {filteredImages.map((image) => (
          <div key={image.date} className="card">
            {image.media_type === 'image' ? (
              <img src={image.url} alt={image.title} loading="lazy" className="image" />
            ) : (
              <iframe title={image.title} src={image.url} width="100%" height="200" />
            )}
            <h2>{image.title}</h2>
            <p>Date: {image.date}</p>
            <Link to={`/image/${image.date}`} className="view-details">View Details</Link>
            <button onClick={() => handleFavoriteToggle(image.date)} className="favorite-button">
              {favorites.includes(image.date) ? '❤️ Unfavorite' : '❤️ Favorite'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;