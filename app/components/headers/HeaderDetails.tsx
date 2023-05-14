import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Rating, useMediaQuery } from '@mui/material';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import { BsFillPlayFill } from 'react-icons/bs';
import { motion } from 'framer-motion';
import HeaderMobile from './HeaderMobile';
import Image from 'next/image';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useSearchParams, useParams, usePathname } from 'next/navigation';
interface HeaderDetailsProps {
  type: 'movie' | 'tv';
  link: string;
}

const HeaderDetails: React.FC<HeaderDetailsProps> = ({ type, link }) => {
  const params = useParams();
  const objectid = params;

  const id = objectid.movieid;
  const [showImage, setShowImage] = useState(false);
  const [movie, setMovie] = useState([]);
  const [numReviews, setNumReviews] = useState(null);
  const [usRating, setUsRating] = useState(null);
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;
  const [showContent, setShowContent] = useState(false);
  const matches = useMediaQuery('(min-width:1100px)');
  const [showModal, setShowModal] = useState(false);
  const [SocialMedia, setSocialMedia] = useState([]);

  const handleEpisodeClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    setShowImage(true);
    setTimeout(() => {
      setShowContent(true);
    }, 500);
  }, []);

  const watchTrailer = async () => {
    try {
      const apiKey = '281d112a5f3e634a22a7bbe6657f040d';
      const response = await axios.get(
        `https://api.themoviedb.org/3/${type}/${id}/videos?api_key=${apiKey}&language=en-US`
      );
      const trailers = response.data.results.filter(
        (trailer) => trailer.type === 'Trailer'
      );
      if (trailers.length > 0) {
        const trailerKey = trailers[0].key;
        window.open(`https://www.youtube.com/watch?v=${trailerKey}`, '_blank');
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (movie && id) {
      axios
        .get(
          `https://api.themoviedb.org/3/${type}/${id}?api_key=${apiKey}&language=en-US`
        )
        .then((response) => {
          const results = response.data;
          setMovie(results);
        });
      axios
        .get(
          `https://api.themoviedb.org/3/${type}/${id}?api_key=${apiKey}&append_to_response=credits,production_companies,external_ids`
        )
        .then((response) => {
          const socialMedia = response.data.external_ids;

          setSocialMedia(socialMedia);
        });
    }
  }, []);

  useEffect(() => {
    if (movie && id) {
      const mediaType = movie.media_type === 'tv' ? 'tv' : 'movie';
      axios
        .get(
          `https://api.themoviedb.org/3/${mediaType}/${id}/release_dates?api_key=${apiKey}`
        )
        .then((response) => {
          const usRelease = response.data.results.find(
            (release) => release.iso_3166_1 === 'US'
          );
          if (usRelease) {
            setUsRating(usRelease.release_dates[0].certification);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [movie]);

  useEffect(() => {
    if (movie && id) {
      axios
        .get(
          `https://api.themoviedb.org/3/${type}/${id}/reviews?api_key=${apiKey}&language=en-US`
        )
        .then((response) => {
          const numReviews = response.data.total_results;
          setNumReviews(numReviews);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [movie]);

  console.log(movie);

  const imdbid = movie?.imdb_id ? movie?.imdb_id : SocialMedia?.imdb_id;
  return <></>;
};

export default HeaderDetails;
