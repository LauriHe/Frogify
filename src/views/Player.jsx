import {Box, Button, Grid, Slider, Typography} from '@mui/material';
import {useContext, useEffect, useState} from 'react';
import {SongContext} from '../contexts/SongContext';
import {mediaUrl} from '../utils/variables';
import {Navigate, useNavigate} from 'react-router-dom';

const Player = () => {
  const {audioRef, currentSong, currentSongImage, bgColor, textColor} =
    useContext(SongContext);
  const [pausedByButton, setPausedByButton] = useState(false);

  const navigate = useNavigate();

  const goToPreviousPage = () => {
    document.querySelector('body').style.backgroundColor = null;
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

  useEffect(() => {
    document.querySelector('body').style.backgroundColor = bgColor;
  }, []);

  return (
    <Grid
      container
      justifyContent="center"
      width="100%"
      sx={{color: textColor}}
    >
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
            <Button sx={{color: textColor}} onClick={goToPreviousPage}>
              Close
            </Button>
            <Typography variant="body1">{currentSong.title}</Typography>
          </Grid>
          <Box margin="2rem 0">
            <img
              src={
                currentSong.type
                  ? currentSongImage
                  : mediaUrl + currentSongImage.thumbnails.w640
              }
              alt="Song cover art"
              width="100%"
            />
          </Box>
          <Grid container justifyContent="space-between">
            <Typography variant="h5">{currentSong.title}</Typography>
            {!currentSong.type && <Button sx={{color: textColor}}>Like</Button>}
          </Grid>
          {!currentSong.type && (
            <Slider
              sx={{color: textColor}}
              value={parseInt(audioRef.current.currentTime)}
              onChange={handleChange}
              onChangeCommitted={commitChange}
              width="100%"
              min={0}
              max={audioRef.current.duration}
              step={0.1}
            />
          )}
          <Button sx={{color: textColor}} onClick={toggleAudio}>
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
