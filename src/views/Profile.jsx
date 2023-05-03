import {
  Box,
  Button,
  IconButton,
  Typography,
  Grid,
  Paper,
  Divider,
} from '@mui/material';
import settingIcon from '../assets/setting.svg';
import defaultProfile from '../assets/defaultProfile.jpg';
import {useContext, useEffect, useState} from 'react';
import {MediaContext} from '../contexts/MediaContext';
import {useFavourite, useTag} from '../hooks/ApiHooks';
import {mediaUrl} from '../utils/variables';
import MediaTableSearch from '../components/MediaTableSearch';
import {useMedia} from '../hooks/ApiHooks';
import {useNavigate} from 'react-router-dom';

const Profile = () => {
  /* Profile picture and avatar */
  const {user} = useContext(MediaContext);

  const [avatar, setAvatar] = useState({
    filename: defaultProfile,
  });
  const {getTag} = useTag();

  const fetchAvatar = async () => {
    try {
      if (user) {
        const avatars = await getTag('avatar_' + user.user_id);
        const ava = avatars.pop();
        ava.filename = mediaUrl + ava.filename;
        setAvatar(ava);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchAvatar();
  }, [user]);

  /* Posts */
  const {mediaArray} = useMedia(false);

  const [active, setActive] = useState('posts');
  const [listArray, setListArray] = useState(
    mediaArray.filter((item) => item.media_type === 'audio').reverse()
  );

  const listPosts = () => {
    setActive('posts');
    setListArray(
      mediaArray.filter((item) => item.media_type === 'audio').reverse()
    );
  };

  const listHistory = () => {
    setActive('history');
    setListArray(mediaArray.filter((item) => item.media_type === 'audio'));
  };

  const listLiked = () => {
    setActive('liked');
    setListArray(mediaArray.filter((item) => item.media_type === 'audio'));
  };

  useEffect(() => {
    setListArray(
      mediaArray.filter((item) => item.media_type === 'audio').reverse()
    );
  }, [mediaArray]);

  /* Settings */
  const [setting, setSetting] = useState(false);

  const toggleSetting = () => {
    if (setting) {
      setSetting(!setting);
      document.querySelector('body').style.overflow = 'visible';
    } else {
      setSetting(!setting);
      document.querySelector('body').style.overflow = 'hidden';
    }
  };

  /* logout */
  const navigate = useNavigate();
  const {setUser} = useContext(MediaContext);
  const logout = () => {
    setUser(null);
    localStorage.removeItem('userToken');
    document.querySelector('body').style.overflow = 'visible';
    navigate('/');
  };

  return (
    <>
      <Box sx={{position: 'relative'}}>
        {/* Profile header */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
          }}
        >
          <Grid container justifyContent="center" sx={{p: 2, width: '40%'}}>
            <img
              src={avatar.filename}
              width={150}
              style={{borderRadius: '50%'}}
            />
          </Grid>

          <Grid container alignItems="center" sx={{width: '60%'}}>
            <Grid
              container
              spacing={1}
              direction="row"
              alignItems="center"
              justifyContent="center"
              rowSpacing={2}
              item
            >
              <Grid
                item
                container
                direction="row"
                justifyContent="center"
                xs="12"
              >
                <Typography variant="h4">{user.username}</Typography>
              </Grid>
              {/* second row */}
              <Grid
                item
                container
                alignItems="center"
                direction="column"
                xs={4}
              >
                <Typography variant="h6">000</Typography>
                <Typography variant="caption" color="grey">
                  Posts
                </Typography>
              </Grid>
              <Grid
                item
                container
                alignItems="center"
                direction="column"
                xs={4}
              >
                <Typography variant="h6">10000</Typography>
                <Typography variant="caption" color="grey">
                  Followers
                </Typography>
              </Grid>
              <Grid
                item
                container
                alignItems="center"
                direction="column"
                xs={4}
              >
                <Typography variant="h6">000</Typography>
                <Typography variant="caption" color="grey">
                  Following
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Box>

        {/* NavBar */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'noWrap',
            justifyContent: 'space-around',
            borderTop: 1,
            borderBottom: 1,
          }}
        >
          <Button
            onClick={listPosts}
            color={active === 'posts' ? 'secondary' : 'primary'}
            sx={{p: 1}}
          >
            Posts
          </Button>
          <Button
            onClick={listHistory}
            color={active === 'history' ? 'secondary' : 'primary'}
            sx={{p: 1}}
          >
            History
          </Button>
          <Button
            onClick={listLiked}
            color={active === 'liked' ? 'secondary' : 'primary'}
            sx={{p: 1}}
          >
            Liked
          </Button>
          <Divider orientation="vertical" flexItem color="white" />
          <IconButton color="primary" onClick={toggleSetting}>
            <img src={settingIcon} alt="setting icon" width={30} />
          </IconButton>
        </Box>

        {mediaArray.length > 0 && (
          <MediaTableSearch
            searchArray={listArray}
            mediaArray={mediaArray}
          ></MediaTableSearch>
        )}

        {/* Settings*/}
        {setting && (
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
        {setting && (
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
              <Button fullWidth>Change profile info</Button>
              <Divider flexItem />
              <Button fullWidth>Change colors</Button>
              <Divider flexItem />
              <Button fullWidth onClick={logout}>
                Log out
              </Button>
              <Divider flexItem />
              <Button fullWidth onClick={toggleSetting}>
                Cancel
              </Button>
            </Grid>
          </Paper>
        )}
      </Box>
    </>
  );
};

export default Profile;
