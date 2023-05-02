import {Box, Button, Grid, LinearProgress, Typography} from '@mui/material';
import Paper from '@mui/material/Paper';
import {useContext, useEffect} from 'react';
import {SongContext} from '../contexts/SongContext';
import {mediaUrl} from '../utils/variables';
import {useNavigate} from 'react-router-dom';
import '../style.scss';
import ColorThief from '/node_modules/colorthief/dist/color-thief.mjs';

const AudioPlayer = () => {
  const {
    currentSong,
    currentSongImage,
    setCurrentSong,
    setCurrentSongImage,
    audioRef,
    bgColor,
    setBgColor,
    textColor,
    setTextColor,
  } = useContext(SongContext);
  const navigate = useNavigate();
  const colorThief = new ColorThief();
  const imageUrl = mediaUrl + currentSongImage.thumbnails.w160;
  const googleProxyURL =
    'https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&refresh=2592000&url=';
  const crossOriginImageUrl = googleProxyURL + encodeURIComponent(imageUrl);

  const toggleAudio = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  };

  const closePlayer = () => {
    setCurrentSong(null);
    setCurrentSongImage(null);
  };

  const openPlayerPage = () => {
    navigate('/player');
  };

  useEffect(() => {
    if (currentSongImage) {
      const img = document.getElementById('cover-art');
      img.addEventListener('load', function () {
        const color = colorThief.getColor(img);
        const brightness = Math.round(
          (parseInt(color[0]) * 299 +
            parseInt(color[1]) * 587 +
            parseInt(color[2]) * 114) /
            1000
        );
        setBgColor(`rgb(${color[0]}, ${color[1]}, ${color[2]})`);
        setTextColor(brightness > 125 ? 'black' : 'white');
      });
    }
  }, [currentSongImage]);

  return (
    <Grid
      container
      justifyContent="center"
      sx={{width: '100%', height: '4rem', position: 'fixed', bottom: '4rem'}}
    >
      <img
        id="cover-art"
        src={crossOriginImageUrl}
        alt="cover art"
        height="40rem"
        crossOrigin="Anonymous"
        style={{display: 'none'}}
      />
      {bgColor && (
        <Paper
          onClick={openPlayerPage}
          sx={{
            width: '95%',
            borderRadius: '.5rem',
            display: 'flex',
            flexDirection: 'column-reverse',
            gap: '.5rem',
            padding: '0 .5rem',
            backgroundColor: bgColor,
          }}
        >
          <Box width="100%">
            <LinearProgress
              variant="determinate"
              value={
                (audioRef.current?.currentTime / audioRef.current?.duration) *
                100
              }
            />
          </Box>
          <Grid container justifyContent="space-between" alignContent="center">
            <Grid width="50%" container alignItems="center" gap={2}>
              <img
                id="cover-art"
                src={imageUrl}
                alt="cover art"
                height="40rem"
                crossOrigin="Anonymous"
              />
              <Typography variant="body1" sx={{color: textColor}}>
                {currentSong.title}
              </Typography>
            </Grid>
            <Grid width="50%" container direction="row-reverse">
              <Button
                sx={{color: textColor}}
                onClick={(e) => {
                  e.stopPropagation();
                  closePlayer();
                }}
              >
                Close
              </Button>
              <Button
                sx={{color: textColor}}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleAudio();
                }}
              >
                {audioRef.current?.paused ? 'Play' : 'Pause'}
              </Button>
            </Grid>
          </Grid>
        </Paper>
      )}
    </Grid>
  );
};

export default AudioPlayer;
