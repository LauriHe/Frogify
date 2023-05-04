import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Paper,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import {useContext} from 'react';
import {SongContext} from '../contexts/SongContext';
import {mediaUrl} from '../utils/variables';
import userIcon from '../assets/person.svg';
import dotsVerIcon from '../assets/dotsVertical.svg';
import playIcon from '../assets/play.svg';
import {useMedia, useUser} from '../hooks/ApiHooks';
import {useEffect, useState} from 'react';
import {MediaContext} from '../contexts/MediaContext';
import {Link} from 'react-router-dom';

const MediaRowProfile = ({file, mediaArray}) => {
  const {getUser} = useUser();
  const [postMaker, setPostMaker] = useState('');
  const {user} = useContext(MediaContext);
  const {deleteMedia} = useMedia();

  const [title, setTitle] = useState('');

  const formatTitle = () => {
    setTitle(file.title);
    if (file.title.length > 15) {
      setTitle(file.title.slice(0, 15) + '...');
    }
  };

  const image = mediaArray.find(
    (item) => item.file_id === JSON.parse(file.description).imageId
  );

  const fetchUser = async () => {
    const token = localStorage.getItem('userToken');
    const postMaker = await getUser(file.user_id, token);
    setPostMaker(postMaker);
  };

  useEffect(() => {
    fetchUser();
    formatTitle();
  }, []);

  const {setCurrentSong, setCurrentSongImage, setImageFilters} =
    useContext(SongContext);
  const playAudio = () => {
    setCurrentSong(file);
    setCurrentSongImage(image);
    if (image.description) {
      setImageFilters(JSON.parse(image.description));
    }
  };

  const [settingImg, setSettingImg] = useState(false);

  const toggleSettingImg = () => {
    if (settingImg) {
      setSettingImg(!settingImg);
      document.querySelector('body').style.overflow = 'visible';
    } else {
      setSettingImg(!settingImg);
      document.querySelector('body').style.overflow = 'hidden';
    }
  };

  const deleteSong = () => {
    const userToken = localStorage.getItem('userToken');
    deleteMedia(file.file_id, userToken);
    deleteMedia(image.file_id, userToken);
    window.location.reload();
  };

  return (
    <Box>
      <Grid container direction="row" gap={1} alignItems="center" spacing={1}>
        <Grid container item alignItems="center" gap={1} direction="row" xs>
          {/* Image */}
          <Grid item>
            <img
              src={mediaUrl + image.thumbnails.w640}
              alt={file.title}
              width={100}
              style={
                image.description
                  ? {
                      filter: `
            brightness(${JSON.parse(image.description).brightness}%)
            contrast(${JSON.parse(image.description).contrast}%)
            saturate(${JSON.parse(image.description).saturation}%)
            sepia(${JSON.parse(image.description).sepia}%)
            `,
                    }
                  : {}
              }
            />
          </Grid>
          {/* Username, song title */}
          <Grid item>
            <Typography variant="h5" component="h2" sx={{mb: '.5rem'}}>
              {title}
            </Typography>
            <Grid container alignItems="center" gap={1}>
              <img src={userIcon} alt="user icon" width={30} />
              <Typography variant="h6" component="h3" color="grey">
                {postMaker.username}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        {/* Buttons */}
        <Grid
          container
          alignItems="center"
          direction="row"
          item
          width="fit-content"
        >
          <IconButton
            color="primary"
            aria-label="upload picture"
            component="label"
            sx={{p: 1, pr: 1}}
            onClick={playAudio}
          >
            <img src={playIcon} alt="play icon" width={40} />
          </IconButton>
          {location.pathname === '/profile' &&
            user.user_id === postMaker.user_id && (
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="label"
                sx={{p: 1, pr: 1}}
                onClick={toggleSettingImg}
              >
                <img src={dotsVerIcon} alt="dots icon" width={30} />
              </IconButton>
            )}
        </Grid>
      </Grid>

      {settingImg && (
        <Box
          sx={{
            height: '100%',
            width: '100%',
            position: 'absolute',
            top: '0',
            zIndex: '5',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
          }}
        ></Box>
      )}
      {settingImg && (
        <Paper
          variant="outlined"
          sx={{
            width: '50%',
            height: 'fit-content',
            position: 'absolute',
            top: '8rem',
            left: '50%',
            transform: 'translate(-50%, 50%)',
            zIndex: '10',
          }}
        >
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            width="100%"
          >
            <Button component={Link} to="/update" state={{file}} fullWidth>
              Modify song
            </Button>
            <Divider flexItem></Divider>
            <Button fullWidth onClick={deleteSong}>
              Delete song
            </Button>
            <Divider flexItem></Divider>
            <Button fullWidth onClick={toggleSettingImg}>
              Cancel
            </Button>
          </Grid>
        </Paper>
      )}
    </Box>
  );
};

MediaRowProfile.propTypes = {
  file: PropTypes.object.isRequired,
  mediaArray: PropTypes.array.isRequired,
};

export default MediaRowProfile;
