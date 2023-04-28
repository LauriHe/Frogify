import {Box, Button, Grid, LinearProgress, Typography} from '@mui/material';
import Paper from '@mui/material/Paper';
import {useContext} from 'react';
import {SongContext} from '../contexts/SongContext';
import {mediaUrl} from '../utils/variables';
import {useNavigate} from 'react-router-dom';
import '../style.scss';

const AudioPlayer = () => {
  const {
    currentSongPlaying,
    setCurrentSongPlaying,
    currentSong,
    currentSongImage,
    setCurrentSong,
    setCurrentSongImage,
    currentSongTime,
    currentSongLength,
    audioRef,
  } = useContext(SongContext);

  const navigate = useNavigate();

  const toggleAudio = () => {
    if (currentSongPlaying) {
      setCurrentSongPlaying(false);
    } else {
      setCurrentSongPlaying(true);
    }
  };

  const closePlayer = () => {
    setCurrentSong(null);
    setCurrentSongImage(null);
  };

  const openPlayerPage = () => {
    navigate('/player');
  };

  return (
    <Grid
      container
      justifyContent="center"
      sx={{width: '100%', height: '4rem', position: 'fixed', bottom: '4rem'}}
    >
      <Paper
        onClick={openPlayerPage}
        sx={{
          width: '95%',
          borderRadius: '.5rem',
          display: 'flex',
          flexDirection: 'column-reverse',
          gap: '.5rem',
          padding: '0 .5rem',
        }}
      >
        <Box width="100%">
          <LinearProgress
            variant="determinate"
            value={
              (audioRef.current?.currentTime / audioRef.current?.duration) * 100
            }
          />
        </Box>
        <Grid container justifyContent="space-between" alignContent="center">
          <Grid width="50%" container alignItems="center" gap={2}>
            <img
              src={mediaUrl + currentSongImage.thumbnails.w640}
              alt="cover art"
              height="40rem"
            />
            <Typography variant="body1">{currentSong.title}</Typography>
          </Grid>
          <Grid width="50%" container direction="row-reverse">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                closePlayer();
              }}
            >
              Close
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                toggleAudio();
              }}
            >
              {currentSongPlaying ? 'Pause' : 'Play'}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
};

export default AudioPlayer;
