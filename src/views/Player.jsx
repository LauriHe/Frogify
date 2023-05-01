import {Box, Button, Grid, Slider, Typography} from '@mui/material';
import {useContext, useState} from 'react';
import {SongContext} from '../contexts/SongContext';
import {mediaUrl} from '../utils/variables';
import {Navigate, useNavigate} from 'react-router-dom';

const Player = () => {
  const {audioRef, currentSong, currentSongImage} = useContext(SongContext);
  const [pausedByButton, setPausedByButton] = useState(false);

  const navigate = useNavigate();

  const goToPreviousPage = () => {
    navigate(-1);
  };

  const toggleAudio = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
      setPausedByButton(false);
    } else {
      audioRef.current.pause();
      setPausedByButton(true);
    }
  };

  const handleChange = (event, newValue) => {
    audioRef.current.currentTime = newValue;
    audioRef.current.pause();
  };

  const commitChange = (event, newValue) => {
    if (!pausedByButton) {
      audioRef.current.play();
    }
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
            value={parseInt(audioRef.current.currentTime)}
            onChange={handleChange}
            onChangeCommitted={commitChange}
            width="100%"
            min={0}
            max={audioRef.current.duration}
            step={0.5}
          />
          <Button onClick={toggleAudio}>
            {audioRef.current.paused ? 'Play' : 'Pause'}
          </Button>
        </Grid>
      ) : (
        <Navigate to="/" />
      )}
    </Grid>
  );
};

export default Player;
