import {Box, Button, Grid, Slider, Typography} from '@mui/material';
import {useContext, useEffect, useState} from 'react';
import {SongContext} from '../contexts/SongContext';
import {mediaUrl} from '../utils/variables';
import {Navigate, useNavigate} from 'react-router-dom';
import {useUser} from '../hooks/ApiHooks';
import playIcon from '../assets/play.svg';
import playIconDark from '../assets/playDark.svg';
import pauseIcon from '../assets/pause.svg';
import pauseIconDark from '../assets/pauseDark.svg';
import closeIcon from '../assets/close.svg';
import closeIconDark from '../assets/closeDark.svg';
import expandIcon from '../assets/expand.svg';
import expandIconDark from '../assets/expandDark.svg';
import collapseIcon from '../assets/collapse.svg';
import collapseIconDark from '../assets/collapseDark.svg';

const Player = () => {
  const {getUser} = useUser();
  const {
    audioRef,
    currentSong,
    currentSongImage,
    imageFilters,
    bgColor,
    textColor,
  } = useContext(SongContext);
  const [pausedByButton, setPausedByButton] = useState(false);
  const [postMaker, setPostMaker] = useState('');
  const navigate = useNavigate();
  const [showSongInfo, setShowSongInfo] = useState(false);

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

  const toggleSongInfo = () => {
    setShowSongInfo(!showSongInfo);
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
            <img
              src={textColor === 'white' ? closeIcon : closeIconDark}
              alt="close icon"
              style={{width: '2rem'}}
            />
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
              src={
                currentSong.type
                  ? currentSongImage
                  : mediaUrl + currentSongImage.thumbnails.w640
              }
              style={
                imageFilters
                  ? {
                      maxHeight: '30vh',
                      width: '100%',
                      filter: `
              brightness(${imageFilters.brightness}%)
              contrast(${imageFilters.contrast}%)
              saturate(${imageFilters.saturation}%)
              sepia(${imageFilters.sepia}%)
              `,
                    }
                  : {maxHeight: '30vh', width: '100%'}
              }
              alt="Song cover art"
            />
          </Box>
          <Grid
            container
            justifyContent={!currentSong.type ? 'space-between' : 'center'}
          >
            <Grid width="fit-content">
              <Typography variant="h5">{currentSong.title}</Typography>
              {!currentSong.type && (
                <Typography variant="body1" m={0} color>
                  {postMaker.username}
                </Typography>
              )}
            </Grid>
            {!currentSong.type && (
              <Grid
                container
                alignItems="center"
                width="fit-content"
                onClick={toggleSongInfo}
              >
                <Typography variant="body1" sx={{color: textColor}}>
                  Song info
                </Typography>
                {textColor === 'white' && (
                  <img
                    src={showSongInfo ? collapseIcon : expandIcon}
                    alt="collapse / expand icon"
                    style={{width: '2rem'}}
                  />
                )}
                {textColor === 'black' && (
                  <img
                    src={showSongInfo ? collapseIconDark : expandIconDark}
                    alt="collapse / expand icon"
                    style={{width: '2rem'}}
                  />
                )}
              </Grid>
            )}
          </Grid>
          {showSongInfo && (
            <Grid>
              <Grid container gap={2}>
                <Typography variant="body1">Genres:</Typography>
                <Typography variant="body1">
                  {JSON.parse(currentSong.description).genres}
                </Typography>
              </Grid>
              <Grid container gap={2}>
                <Typography variant="body1">Keywords:</Typography>
                <Typography variant="body1">
                  {JSON.parse(currentSong.description).keywords}
                </Typography>
              </Grid>
              <Grid container gap={2}>
                <Typography variant="body1">Artist tags:</Typography>
                <Typography variant="body1">
                  {JSON.parse(currentSong.description).artistTags}
                </Typography>
              </Grid>
            </Grid>
          )}
          {!currentSong.type && (
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
                {
                  <Typography variant="body1">
                    {parseInt(audioRef.current.duration / 60)}:
                    {parseInt(audioRef.current.duration % 60)}
                  </Typography>
                }
              </Grid>
            </Box>
          )}
          <Button sx={{color: textColor}} onClick={toggleAudio}>
            {textColor === 'white' && (
              <img
                src={audioRef.current?.paused ? playIcon : pauseIcon}
                alt="play / pause icon"
                style={{width: '4rem'}}
              />
            )}
            {textColor === 'black' && (
              <img
                src={audioRef.current?.paused ? playIconDark : pauseIconDark}
                alt="play / pause icon"
                style={{width: '4rem'}}
              />
            )}
          </Button>
        </Grid>
      ) : (
        <Navigate to="/" />
      )}
    </Grid>
  );
};

export default Player;
