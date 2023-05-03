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
import {mediaUrl} from '../utils/variables';
import {useUser} from '../hooks/ApiHooks';
import {useContext, useEffect, useState} from 'react';
import {MediaContext} from '../contexts/MediaContext';
import userIcon from '../assets/person.svg';
import dotsVerIcon from '../assets/dotsVertical.svg';
import likeIcon from '../assets/like.svg';
import playIcon from '../assets/play.svg';
import commentIcon from '../assets/comment.svg';

const MediaRowSearch = ({file, mediaArray}) => {
  const {getUser} = useUser();
  const [postMaker, setPostMaker] = useState('');
  const {user} = useContext(MediaContext);

  const fetchUser = async () => {
    const token = localStorage.getItem('userToken');
    const postMaker = await getUser(file.user_id, token);
    setPostMaker(postMaker);
  };

  const image = mediaArray.find(
    (item) => item.file_id === JSON.parse(file.description).imageId
  );

  useEffect(() => {
    fetchUser();
  }, []);

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

  return (
    <Box>
      <Grid
        container
        gap={1}
        alignItems="center"
        justifyContent="space-between"
        spacing={1}
      >
        {/* Image */}
        <Grid item xs="auto">
          <img
            src={mediaUrl + image.thumbnails.w640}
            alt={file.title}
            width={100}
          />
        </Grid>
        {/* Username, song title */}
        <Grid item xs="auto">
          <Typography variant="h5" component="h2" sx={{mb: '.5rem'}}>
            {file.title}
          </Typography>
          <Grid container alignItems="center" gap={1}>
            <img src={userIcon} alt="user icon" width={30} />
            <Typography variant="h6" component="h3" color="grey">
              {postMaker.username}
            </Typography>
          </Grid>
        </Grid>
        {/* Buttons */}
        <Grid container alignItems="center" direction="row" item xs="4">
          <IconButton
            color="primary"
            aria-label="upload picture"
            component="label"
            sx={{p: 1, pr: 1}}
          >
            <img src={likeIcon} alt="like icon" width={30} />
          </IconButton>
          <IconButton
            color="primary"
            aria-label="upload picture"
            component="label"
            sx={{p: 1, pr: 1}}
          >
            <img src={commentIcon} alt="comment icon" width={30} />
          </IconButton>
          <IconButton
            color="primary"
            aria-label="upload picture"
            component="label"
            sx={{p: 1, pr: 1}}
          >
            <img src={playIcon} alt="play icon" width={30} />
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
            <Button fullWidth>Modify song</Button>
            <Divider flexItem></Divider>
            <Button fullWidth>Delete song</Button>
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

MediaRowSearch.propTypes = {
  file: PropTypes.object.isRequired,
  mediaArray: PropTypes.array.isRequired,
};

export default MediaRowSearch;
