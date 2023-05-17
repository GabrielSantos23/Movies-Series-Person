import React, { useState } from 'react';
import axios from 'axios';

interface FavoriteMovieButtonProps {
  movieId: string;
}

function FavoriteMovieButton({ id }) {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteMovie = async () => {
    try {
      const response = await axios.post('/api/movies', {
        movieId: id,
      });
      const { data } = response.data;
      setIsFavorite(true);
      console.log(`Movie with ID ${data.id} is now favorited!`);
    } catch (error) {
      console.error('Error favoriting the movie:', error);
    }
  };

  return (
    <button onClick={handleFavoriteMovie} disabled={isFavorite}>
      {isFavorite ? 'Favorited' : 'Favorite'}
    </button>
  );
}

export default FavoriteMovieButton;
