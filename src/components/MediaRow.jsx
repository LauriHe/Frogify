import {Box, Button, ImageListItem, ImageListItemBar} from '@mui/material';
import PropTypes from 'prop-types';
import {mediaUrl} from '../utils/variables';
import commentIcon from '../assets/comment.svg';
import likeIcon from '../assets/like.svg';
import likeIconGreen from '../assets/likeGreen.svg';
import {useContext, useEffect, useState, useEffect, useState} from 'react';
import {SongContext} from '../contexts/SongContext';
import {MediaContext} from '../contexts/MediaContext';
import {useNavigate} from 'react-router-dom';
import {useFavourite} from '../hooks/ApiHooks';
import {useUser} from '../hooks/ApiHooks';
import {MediaContext} from '../contexts/MediaContext';

const MediaRow = ({file, mediaArray, toggleComments}) => {
  const {setCurrentSong, setCurrentSongImage} = useContext(SongContext);
  const {user} = useContext(MediaContext);
  const [likes, setLikes] = useState(0);
  const [userLike, setUserLike] = useState(false);
  const {getFavourites, postFavourite, deleteFavourite} = useFavourite();
  const navigate = useNavigate();

  const image = mediaArray.find(
    (item) => item.file_id === JSON.parse(file.description).imageId
  );

  const fetchUser = async () => {
    const token = localStorage.getItem('userToken');
    const user = await getUser(file.user_id, token);
    setPostMaker(user);
  };

  const playAudio = () => {
    setCurrentSong(file);
    setCurrentSongImage(image);
  };

  const fetchLikes = async () => {
    try {
      const likeInfo = await getFavourites(file.file_id);
      setLikes(likeInfo.length);
      likeInfo.forEach((like) => {
        like.user_id === user.user_id && setUserLike(true);
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const doLike = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const data = {file_id: file.file_id};
      await postFavourite(data, token);
      setUserLike(true);
    } catch (error) {
      console.log(error.message);
    }
  };

  const deleteLike = async () => {
    try {
      const token = localStorage.getItem('userToken');
      await deleteFavourite(file.file_id, token);
      setUserLike(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  const toggleLike = () => {
    if (userLike) {
      deleteLike();
    } else {
      doLike();
    }
  };

  const comment = () => {
    toggleComments(file.file_id);
  };

  useEffect(() => {
    fetchLikes();
  }, [userLike]);

  const fetchLikes = async () => {
    try {
      const likeInfo = await getFavourites(file.file_id);
      setLikes(likeInfo.length);
      likeInfo.forEach((like) => {
        like.user_id === user.user_id && setUserLike(true);
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const doLike = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const data = {file_id: file.file_id};
      await postFavourite(data, token);
      setUserLike(true);
    } catch (error) {
      console.log(error.message);
    }
  };

  const deleteLike = async () => {
    try {
      const token = localStorage.getItem('userToken');
      await deleteFavourite(file.file_id, token);
      setUserLike(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  const toggleLike = () => {
    if (userLike) {
      deleteLike();
    } else {
      doLike();
    }
  };

  const comment = () => {
    toggleComments(file.file_id);
  };

  useEffect(() => {
    fetchLikes();
  }, [userLike]);

  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <>
      <Box sx={{mb: '1rem'}}>
        <ImageListItem>
          <img
            src={mediaUrl + image.thumbnails.w640}
            alt={`cover art for ${file.title}`}
          />
          <ImageListItemBar
            title={file.title}
            subtitle={user ? postMaker.username : ''}
            actionIcon={<Button onClick={playAudio}>play</Button>}
          />
        </ImageListItem>
        <Box sx={{display: 'flex', margin: '.5rem', gap: '.5rem'}}>
          <img
            src={userLike ? likeIconGreen : likeIcon}
            onClick={user ? toggleLike : navigate('/login')}
            alt="home icon"
            width="30rem"
          />
          <p>{likes}</p>
          <img
            src={commentIcon}
            onClick={user ? comment : navigate('/login')}
            alt="home icon"
            width="30rem"
          />
          <Button onClick={playAudio}>play</Button>
        </Box>
      </Box>
    </>
  );
};

MediaRow.propTypes = {
  file: PropTypes.object.isRequired,
  mediaArray: PropTypes.array.isRequired,
  toggleComments: PropTypes.func.isRequired,
};

export default MediaRow;
