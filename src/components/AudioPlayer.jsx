import {Box, Button, Grid} from '@mui/material';
import Paper from '@mui/material/Paper';
import {useContext, useEffect, useRef, useState} from 'react';
import {SongContext} from '../contexts/SongContext';
import {mediaUrl} from '../utils/variables';

const AudioPlayer = () => {
  const {
    currentSong,
    currentSongImage,
    setCurrentSongImage,
    setCurrentSongEnded,
    setCurrentSong,
  } = useContext(SongContext);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef();

  const audioUrl = currentSong ? mediaUrl + currentSong.filename : mediaUrl;

  const toggleAudio = () => {
    if (playing === true) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
      setCurrentSongEnded(false);
    }
  };

  const closePlayer = () => {
    setCurrentSong(null);
    setCurrentSongImage(null);
    setCurrentSongEnded(true);
  };

  useEffect(() => {
    audioRef.current.onended = () => {
      setPlaying(false);
      setCurrentSongEnded(true);
    };
    toggleAudio();
  }, []);

  return (
    <Grid
      container
      justifyContent="center"
      sx={{width: '100%', height: '4rem', position: 'fixed', bottom: '4rem'}}
    >
      <audio ref={audioRef} src={audioUrl} />
      <Paper
        sx={{
          width: '95%',
          borderRadius: '.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 .5rem',
        }}
      >
        <img
          src={mediaUrl + currentSongImage.thumbnails.w640}
          alt="cover art"
          height="40rem"
        />
        <Box>
          <Button onClick={toggleAudio}>{playing ? 'Pause' : 'Play'}</Button>
          <Button onClick={closePlayer}>Close</Button>
        </Box>
      </Paper>
    </Grid>
  );
};

export default AudioPlayer;
