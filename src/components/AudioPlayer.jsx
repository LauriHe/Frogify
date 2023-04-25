import {Button, Grid} from '@mui/material';
import Paper from '@mui/material/Paper';
import {useState} from 'react';

const AudioPlayer = () => {
  const [playing, setPlaying] = useState(false);
  // eslint-disable-next-line new-cap

  const togglePlaying = () => {
    if (playing === true) {
      setPlaying(false);
    } else {
      setPlaying(true);
    }
  };

  return (
    <Grid
      container
      justifyContent="center"
      sx={{width: '100%', height: '4rem', position: 'fixed', bottom: '4rem'}}
    >
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
        <img src="/frog1.png" alt="cover art" height="40rem" />
        <Button onClick={togglePlaying}>{playing ? 'Pause' : 'Play'}</Button>
      </Paper>
    </Grid>
  );
};

export default AudioPlayer;
