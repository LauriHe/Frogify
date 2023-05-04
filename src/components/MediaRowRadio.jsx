import {Box, Button, ImageListItem, ImageListItemBar} from '@mui/material';
import PropTypes from 'prop-types';
import {useContext} from 'react';
import {SongContext} from '../contexts/SongContext';
import playIcon from '../assets/play.svg';

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
          <ImageListItemBar
            title={station.title}
            actionIcon={
              <Button onClick={playAudio}>
                <img src={playIcon} alt="play icon" />
              </Button>
            }
          />
        </ImageListItem>
        <Box sx={{display: 'flex', margin: '.5rem', gap: '.5rem'}}></Box>
      </Box>
    </>
  );
};

MediaRowRadio.propTypes = {
  station: PropTypes.object.isRequired,
};

export default MediaRowRadio;
