import {Box, Button, ImageListItem, ImageListItemBar} from '@mui/material';
import PropTypes from 'prop-types';
import {mediaUrl} from '../utils/variables';
import commentIcon from '../assets/comment.svg';
import likeIcon from '../assets/like.svg';
import {useRef, useState} from 'react';

const MediaRow = ({file, mediaArray}) => {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef();

  const image = mediaArray.find(
    (item) => item.file_id === JSON.parse(file.description).imageId
  );

  const toggleAudio = () => {
    if (playing === true) {
      audioRef.current.load();
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
    }
  };

  audioRef.current.onended = () => {
    setPlaying(false);
  };

  return (
    <>
      <audio ref={audioRef} src={mediaUrl + file.filename} />
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
