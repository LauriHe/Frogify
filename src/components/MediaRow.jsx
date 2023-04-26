import {Box, Button, ImageListItem, ImageListItemBar} from '@mui/material';
import PropTypes from 'prop-types';
import {mediaUrl} from '../utils/variables';
import commentIcon from '../assets/comment.svg';
import likeIcon from '../assets/like.svg';
import {useContext, useState} from 'react';
import {SongContext} from '../contexts/SongContext';

const MediaRow = ({file, mediaArray}) => {
  const {
    currentSongEnded,
    setCurrentSongEnded,
    setCurrentSong,
    setCurrentSongImage,
  } = useContext(SongContext);
  const [playing, setPlaying] = useState(false);

  const image = mediaArray.find(
    (item) => item.file_id === JSON.parse(file.description).imageId
  );

  if (currentSongEnded && playing) {
    setPlaying(false);
  }

  const toggleAudio = () => {
    if (playing === true) {
      setCurrentSong(null);
      setCurrentSongImage(null);
      setPlaying(false);
      setCurrentSongEnded(true);
    } else {
      setCurrentSong(file);
      setCurrentSongImage(image);
      setPlaying(true);
      setCurrentSongEnded(false);
    }
  };

  return (
    <>
      <Box sx={{mb: '1rem'}}>
        <ImageListItem>
          <img
            src={mediaUrl + image.thumbnails.w640}
            alt={`cover art for ${file.title}`}
          />
          <ImageListItemBar title={file.title} />
        </ImageListItem>
        <Box sx={{display: 'flex', margin: '.5rem', gap: '.5rem'}}>
          <img src={likeIcon} alt="home icon" width="30rem" />
          <img src={commentIcon} alt="home icon" width="30rem" />
          <Button onClick={toggleAudio}>{playing ? 'stop' : 'play'}</Button>
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
