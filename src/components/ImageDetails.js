
// src/components/ImageDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ImageDetails = () => {
  const { date } = useParams(); 
  const [imageDetails, setImageDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem('favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  useEffect(() => {
    const fetchImageDetails = async () => {
      try {
        const response = await axios.get(`https://api.nasa.gov/planetary/apod?api_key=${process.env.REACT_APP_NASA_API_KEY}&date=${date}`);
        setImageDetails(response.data);
      } catch (error) {
        console.error("Error fetching image details", error);
        setError("Failed to fetch image details.");
      } finally {
        setLoading(false);
      }
    };

    fetchImageDetails(); 
  }, [date]); 

  const handleFavoriteToggle = () => {
    if (favorites.includes(imageDetails.date)) {
      const updatedFavorites = favorites.filter(fav => fav !== imageDetails.date);
      setFavorites(updatedFavorites);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites)); // Update local storage
    } else {
      const updatedFavorites = [...favorites, imageDetails.date];
      setFavorites(updatedFavorites);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites)); // Update local storage
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>{imageDetails.title}</h1>
      {imageDetails.media_type === 'image' ? (
        <img src={imageDetails.url} alt={imageDetails.title} style={{ width: '100%', maxWidth: '600px' }} />
      ) : (
        <iframe title={imageDetails.title} src={imageDetails.url} width="100%" height="400" />
      )}
      <p>{imageDetails.explanation}</p>
      <p>Date: {imageDetails.date}</p>
      <p>Copyright: {imageDetails.copyright || 'N/A'}</p>
      <button onClick={handleFavoriteToggle} style={{ marginTop: '10px', padding: '8px 12px', borderRadius: '4px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
        {favorites.includes(imageDetails.date) ? '❤️ Unfavorite' : '❤️ Favorite'}
      </button>
    </div>
  );
};

export default ImageDetails;