import {Box, Button, ImageListItem, ImageListItemBar} from '@mui/material';
import PropTypes from 'prop-types';
import {mediaUrl} from '../utils/variables';
import commentIcon from '../assets/comment.svg';
import likeIcon from '../assets/like.svg';
import {useContext, useEffect, useState} from 'react';
import {SongContext} from '../contexts/SongContext';
import {useUser} from '../hooks/ApiHooks';
import {MediaContext} from '../contexts/MediaContext';

const MediaRow = ({file, mediaArray}) => {
  const {setCurrentSong, setCurrentSongImage} = useContext(SongContext);
  const {user} = useContext(MediaContext);
  const [postMaker, setPostMaker] = useState('');
  const {getUser} = useUser();

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
          <img src={likeIcon} alt="home icon" width="30rem" />
          <img src={commentIcon} alt="home icon" width="30rem" />
        </Box>
      </Box>
    </>
  );
};

MediaRow.propTypes = {
  file: PropTypes.object.isRequired,
  mediaArray: PropTypes.array.isRequired,
};

export default MediaRow;
