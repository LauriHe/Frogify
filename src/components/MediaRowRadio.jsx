import {Box, Button, ImageListItem, ImageListItemBar} from '@mui/material';
import PropTypes from 'prop-types';
import {useContext} from 'react';
import {SongContext} from '../contexts/SongContext';

const MediaRowRadio = ({station}) => {
  const {setCurrentSong, setCurrentSongImage} = useContext(SongContext);
  const playAudio = () => {
    setCurrentSong(station);
    setCurrentSongImage(station.logo);
  };

  return (
    <>
      <Box sx={{mb: '1rem'}}>
        <ImageListItem>
          <img src={station.logo} alt={`Logo of ${station.title}`} />
          <ImageListItemBar title={station.title} />
        </ImageListItem>
        <Box sx={{display: 'flex', margin: '.5rem', gap: '.5rem'}}>
          <Button onClick={playAudio}>play</Button>
        </Box>
      </Box>
    </>
  );
};

MediaRowRadio.propTypes = {
  station: PropTypes.object.isRequired,
};

export default MediaRowRadio;
