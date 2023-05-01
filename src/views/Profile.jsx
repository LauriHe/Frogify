import {
  Box,
  Button,
  IconButton,
  Typography,
  Grid,
  Paper,
  Divider,
} from '@mui/material';
import userIcon from '../assets/person.svg';
import settingIcon from '../assets/setting.svg';
import dotsVerIcon from '../assets/dotsVertical.svg';
/* Testing */
import {useContext, useEffect, useState} from 'react';
import {MediaContext} from '../contexts/MediaContext';
import {useTag} from '../hooks/ApiHooks';
import {mediaUrl} from '../utils/variables';
import MediaTableSearch from '../components/MediaTableSearch';
import {useMedia} from '../hooks/ApiHooks';
import {useNavigate} from 'react-router-dom';

const Profile = () => {
  /* Profile picture and avatar */
  const {user} = useContext(MediaContext);
  const [avatar, setAvatar] = useState({
    filename: 'https://placekitten.com/320',
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
  const {mediaArray} = useMedia(true);
  const audioArray = mediaArray.filter((item) => item.media_type === 'audio');
  audioArray.reverse();

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

  /* Picture settings */
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
          <Button sx={{p: 1, color: 'white'}}>Posts</Button>
          <Button sx={{p: 1, color: 'white'}}>History</Button>
          <Button sx={{p: 1, color: 'white'}}>Liked</Button>
          {/* Change to divider */}
          <Box borderLeft={1}></Box>

          <IconButton color="primary" onClick={toggleSetting}>
            <img src={settingIcon} alt="setting icon" width={30} />
          </IconButton>
        </Box>

        {/* Posts */}
        {/* <Box sx={{borderBottom: 1, pb: 1, pt: 1}}>
          <Grid
            container
            justifyContent="flex-start"
            gap={3}
            alignItems="center"
          >
            <img
              src="https://placekitten.com/200/300"
              width={100}
              height={100}
            />
            <Box>
              <Typography variant="h5" component="h2" sx={{mb: '.5rem'}}>
                SongName
              </Typography>
              <Grid container alignItems="center" gap={1}>
                <img src={userIcon} alt="user icon" width={30} />
                <Typography variant="h6" component="h3" color="grey">
                  UserName
                </Typography>
              </Grid>
            </Box>
            <Box>
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="label"
                sx={{p: 1, pr: 1}}
                onClick={toggleSettingImg}
              >
                <img src={dotsVerIcon} alt="dots icon" width={30} />
              </IconButton>
            </Box>
          </Grid>
        </Box> */}

        {mediaArray.length > 0 && (
          <MediaTableSearch
            /* Toinen array */
            searchArray={audioArray}
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

        {/* Picture settings */}

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
              <Button fullWidth>Delete picture</Button>
              <Divider flexItem></Divider>
              <Button fullWidth onClick={toggleSettingImg}>
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
