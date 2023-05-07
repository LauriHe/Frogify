import {Box, Button, Grid, LinearProgress, Typography} from '@mui/material';
import Paper from '@mui/material/Paper';
import {useContext, useEffect, useState} from 'react';
import {SongContext} from '../contexts/SongContext';
import {mediaUrl} from '../utils/variables';
import {useNavigate} from 'react-router-dom';
import '../style.scss';
import ColorThief from '/node_modules/colorthief/dist/color-thief.mjs';
import playIcon from '../assets/play.svg';
import playIconDark from '../assets/playDark.svg';
import pauseIcon from '../assets/pause.svg';
import pauseIconDark from '../assets/pauseDark.svg';
import closeIcon from '../assets/close.svg';
import closeIconDark from '../assets/closeDark.svg';
import {useWindowSize} from '../hooks/WindowHooks';

const AudioPlayer = () => {
  const {
    currentSong,
    currentSongImage,
    setCurrentSong,
    setCurrentSongImage,
    imageFilters,
    audioRef,
    bgColor,
    setBgColor,
    textColor,
    setTextColor,
  } = useContext(SongContext);
  const navigate = useNavigate();
  const colorThief = new ColorThief();
  const imageUrl = currentSong.type
    ? null
    : mediaUrl + currentSongImage.thumbnails.w160;
  const googleProxyURL =
    'https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&refresh=2592000&url=';
  const crossOriginImageUrl = googleProxyURL + encodeURIComponent(imageUrl);
  const windowSize = useWindowSize();
  const [playerWidth, setPlayerWidth] = useState('100%');
  const [title, setTitle] = useState('');

  // Shorten title if too long
  const formatTitle = () => {
    setTitle(currentSong.title);
    if (currentSong.title.length > 20) {
      setTitle(currentSong.title.slice(0, 20) + '...');
    }
  };

  // Toggle play/pause
  const toggleAudio = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  };

  // Close player
  const closePlayer = () => {
    setCurrentSong(null);
    setCurrentSongImage(null);
  };

  // Go to player page
  const openPlayerPage = () => {
    navigate('/player');
  };

  // Convert RGB to HSL
  const rgbToHsl = (color) => {
    const r = color[0];
    const g = color[1];
    const b = color[2];
    let h;
    let s;

    const min = Math.min(r, g, b);
    const max = Math.max(r, g, b);

    const l = max;
    const delta = max - min;
    if (max != 0) s = delta / max; // s
    else {
      // r = g = b = 0        // s = 0, l is undefined
      s = 0;
      h = -1;
      return [h, s, undefined];
    }
    if (r === max) h = (g - b) / delta; // between yellow & magenta
    else if (g === max) h = 2 + (b - r) / delta; // between cyan & yellow
    else h = 4 + (r - g) / delta; // between magenta & cyan
    h *= 60; // degrees
    if (h < 0) h += 360;
    if (isNaN(h)) h = 0;
    return [h, s, l];
  };

  // Convert HSL to RGB
  const hslToRgb = (color) => {
    let r;
    let g;
    let b;
    let h = color[0];
    const s = color[1];
    const l = color[2];
    if (s === 0) {
      // achromatic (grey)
      r = g = b = l;
      return [r, g, b];
    }
    h /= 60; // sector 0 to 5
    const i = Math.floor(h);
    const f = h - i; // factorial part of h
    const p = l * (1 - s);
    const q = l * (1 - s * f);
    const t = l * (1 - s * (1 - f));
    switch (i) {
      case 0:
        r = l;
        g = t;
        b = p;
        break;
      case 1:
        r = q;
        g = l;
        b = p;
        break;
      case 2:
        r = p;
        g = l;
        b = t;
        break;
      case 3:
        r = p;
        g = q;
        b = l;
        break;
      case 4:
        r = t;
        g = p;
        b = l;
        break;
      default: // case 5:
        r = l;
        g = p;
        b = q;
        break;
    }
    return [r, g, b];
  };

  // Set background color of the player based on the album cover
  const setBackGroundColor = () => {
    const img = document.getElementById('cover-art');
    img.addEventListener('load', function () {
      const initialColor = colorThief.getColor(img);
      const hslColor = rgbToHsl(initialColor); // Convert rgb to hsl to adjust saturation
      if (hslColor[1] > 0.6) {
        hslColor[1] = 0.6;
      }
      const rgbColor = hslToRgb(hslColor); // Convert back to rgb
      const brightness = Math.round(
        (parseInt(rgbColor[0]) * 299 +
          parseInt(rgbColor[1]) * 587 +
          parseInt(rgbColor[2]) * 114) /
          1000
      ); // Calculate brightness
      setBgColor(`rgb(${rgbColor[0]}, ${rgbColor[1]}, ${rgbColor[2]})`); // Set background color
      setTextColor(brightness > 125 ? 'black' : 'white'); // Set text color based on contrast
    });
  };

  // Adjust player width based on screen size
  const adjustPlayerWidth = () => {
    if (windowSize.width > 1300) {
      setPlayerWidth('40%');
    } else if (windowSize.width > 1000) {
      setPlayerWidth('50%');
    } else if (windowSize.width > 800) {
      setPlayerWidth('60%');
    } else if (windowSize.width > 500) {
      setPlayerWidth('90%');
    } else {
      setPlayerWidth('100%');
    }
  };

  useEffect(() => {
    if (currentSongImage) {
      setBackGroundColor();
    }
  }, [currentSongImage]);

  useEffect(() => {
    formatTitle();
  }, [currentSong]);

  useEffect(() => {
    adjustPlayerWidth();
  }, [windowSize]);

  return (
    <Grid container justifyContent="center">
      <Grid
        container
        justifyContent="center"
        sx={{height: '4rem', position: 'fixed', bottom: '4rem'}}
        width={playerWidth}
      >
        <img
          id="cover-art"
          src={currentSong.type ? currentSongImage : crossOriginImageUrl}
          alt="cover art"
          height="40rem"
          crossOrigin="Anonymous"
          style={{display: 'none'}}
        />
        {bgColor && (
          <Paper
            onClick={openPlayerPage}
            sx={
              currentSong.type
                ? {
                    width: '95%',
                    borderRadius: '.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    gap: '.5rem',
                    padding: '0 .5rem',
                    backgroundColor: bgColor,
                    cursor: 'pointer',
                  }
                : {
                    width: '95%',
                    borderRadius: '.5rem',
                    display: 'flex',
                    flexDirection: 'column-reverse',
                    gap: '.5rem',
                    padding: '0 .5rem',
                    backgroundColor: bgColor,
                    cursor: 'pointer',
                  }
            }
          >
            {!currentSong.type && (
              <Box width="100%">
                <LinearProgress
                  variant="determinate"
                  value={
                    (audioRef.current?.currentTime /
                      audioRef.current?.duration) *
                    100
                  }
                />
              </Box>
            )}
            <Grid
              container
              justifyContent="space-between"
              alignContent="center"
            >
              <Grid width="auto" container alignItems="center" gap={2}>
                <img
                  id="cover-art"
                  src={currentSong.type ? currentSongImage : imageUrl}
                  alt="cover art"
                  height="40rem"
                  crossOrigin="Anonymous"
                  style={
                    imageFilters
                      ? {
                          filter: `
                brightness(${imageFilters.brightness}%)
                contrast(${imageFilters.contrast}%)
                saturate(${imageFilters.saturation}%)
                sepia(${imageFilters.sepia}%)
                `,
                        }
                      : {}
                  }
                />
                <Typography variant="body1" sx={{color: textColor}}>
                  {title}
                </Typography>
              </Grid>
              <Grid width="auto" container direction="row-reverse">
                <Button
                  sx={{color: textColor, width: '1rem', padding: '0'}}
                  onClick={(e) => {
                    e.stopPropagation();
                    closePlayer();
                  }}
                >
                  <img
                    src={textColor === 'white' ? closeIcon : closeIconDark}
                    alt="close icon"
                    style={{width: '2rem'}}
                  />
                </Button>
                <Button
                  sx={{color: textColor, width: '1rem', padding: '0'}}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleAudio();
                  }}
                >
                  {textColor === 'white' && (
                    <img
                      src={audioRef.current?.paused ? playIcon : pauseIcon}
                      alt="play / pause icon"
                      style={{width: '2rem'}}
                    />
                  )}
                  {textColor === 'black' && (
                    <img
                      src={
                        audioRef.current?.paused ? playIconDark : pauseIconDark
                      }
                      alt="play / pause icon"
                      style={{width: '2rem'}}
                    />
                  )}
                </Button>
              </Grid>
            </Grid>
          </Paper>
        )}
      </Grid>
    </Grid>
  );
};

export default AudioPlayer;
