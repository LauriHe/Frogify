import {Box, Button, Grid, Slider, Typography} from '@mui/material';
import {useContext} from 'react';
import {SongContext} from '../contexts/SongContext';
import {mediaUrl} from '../utils/variables';
import {Navigate, useNavigate} from 'react-router-dom';

const Player = () => {
  const {
    currentSongPlaying,
    setCurrentSongPlaying,
    currentSong,
    currentSongImage,
    currentSongTime,
    setCurrentSongTime,
    currentSongLength,
    audioRef,
  } = useContext(SongContext);

  const navigate = useNavigate();

  const goToPreviousPage = () => {
    navigate(-1);
  };

  const toggleAudio = () => {
    if (currentSongPlaying) {
      setCurrentSongPlaying(false);
    } else {
      setCurrentSongPlaying(true);
    }
  };

  const handleChange = (event, newValue) => {
    setCurrentSongTime(newValue);
    setCurrentSongPlaying(false);
  };

  const commitChange = (event, newValue) => {
    setCurrentSongPlaying(true);
  };

  return (
    <Grid container justifyContent="center" width="100%">
      {currentSong ? (
        <Grid
          container
          direction="column"
          alignItems="center"
          width="100%"
          padding="0 2rem"
          gap={1}
        >
          <Grid width="100%" container alignItems="center" gap={5}>
            <Button onClick={goToPreviousPage}>Close</Button>
            <Typography variant="body1">{currentSong.title}</Typography>
          </Grid>
          <Box margin="2rem 0">
            <img
              src={mediaUrl + currentSongImage.thumbnails.w640}
              alt="Song cover art"
              width="100%"
            />
          </Box>
          <Grid container justifyContent="space-between">
            <Typography variant="h5">{currentSong.title}</Typography>
            <Button>Like</Button>
          </Grid>
          <Slider
            value={parseInt(currentSongTime)}
            onChange={handleChange}
            onChangeCommitted={commitChange}
            width="100%"
            min={0}
            max={currentSongLength}
            step={0.5}
          />
          <Button onClick={toggleAudio}>
            {currentSongPlaying ? 'Pause' : 'Play'}
          </Button>
        </Grid>
      ) : (
        <Navigate to="/" />
      )}
    </Grid>
  );
};

export default Player;
