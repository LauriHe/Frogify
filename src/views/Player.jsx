import {Box, Button, Grid, Slider, Typography} from '@mui/material';
import {useContext, useEffect, useState} from 'react';
import {SongContext} from '../contexts/SongContext';
import {mediaUrl} from '../utils/variables';
import {Navigate, useNavigate} from 'react-router-dom';
import {useUser} from '../hooks/ApiHooks';

const Player = () => {
  const {getUser} = useUser();
  const {audioRef, currentSong, currentSongImage, bgColor, textColor} =
    useContext(SongContext);
  const [pausedByButton, setPausedByButton] = useState(false);
  const [postMaker, setPostMaker] = useState('');
  const navigate = useNavigate();

  const goToPreviousPage = () => {
    navigate(-1);
  };

  const fetchUser = async () => {
    const token = localStorage.getItem('userToken');
    const user = await getUser(currentSong.user_id, token);
    setPostMaker(user);
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
    fetchUser();
    return () => {
      document.querySelector('body').style.backgroundColor = null;
    };
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
          <Button
            sx={{
              color: textColor,
              position: 'absolute',
              marginTop: '1rem',
              paddingTop: '0rem',
              left: '1.5rem',
            }}
            onClick={goToPreviousPage}
          >
            Close
          </Button>
          <Grid
            mt="1rem"
            width="100%"
            container
            justifyContent="center"
            gap={5}
          >
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
            <Grid>
              <Typography variant="h5">{currentSong.title}</Typography>
              <Typography variant="body1" m={0} color>
                {postMaker.username}
              </Typography>
            </Grid>
            <Button sx={{color: textColor}}>Like</Button>
          </Grid>
          <Box width="100%" mt={2}>
            <Slider
              sx={{color: textColor, padding: '.5rem 0 !important'}}
              value={parseInt(audioRef.current.currentTime)}
              onChange={handleChange}
              onChangeCommitted={commitChange}
              width="100%"
              min={0}
              max={audioRef.current.duration}
              step={0.1}
            />
            <Grid container width="100%" justifyContent="space-between">
              <Typography variant="body1">
                {parseInt(audioRef.current.currentTime / 60)}:
                {parseInt(audioRef.current.currentTime % 60)}
              </Typography>
              <Typography variant="body1">
                {parseInt(audioRef.current.duration / 60)}:
                {parseInt(audioRef.current.duration % 60)}
              </Typography>
            </Grid>
          </Box>
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
