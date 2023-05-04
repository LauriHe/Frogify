import {
  Box,
  Button,
  IconButton,
  Typography,
  Grid,
  Paper,
  Divider,
  Slider,
} from '@mui/material';
import settingIcon from '../assets/setting.svg';
import uploadIcon from '../assets/plus.svg';
import defaultProfile from '../assets/defaultProfile.jpg';
import {useContext, useEffect, useState} from 'react';
import {MediaContext} from '../contexts/MediaContext';
import {useFavourite, useTag} from '../hooks/ApiHooks';
import {mediaUrl} from '../utils/variables';
import MediaTableProfile from '../components/MediaTableProfile';
import {useMedia} from '../hooks/ApiHooks';
import {useNavigate} from 'react-router-dom';
import {ColorContext} from '../contexts/ColorContext';
import {ValidatorForm} from 'react-material-ui-form-validator';

const Profile = () => {
  /* Profile picture */
  const {user} = useContext(MediaContext);
  const {getFavourites} = useFavourite();

  const [avatar, setAvatar] = useState({
    filename: defaultProfile,
  });
  const {getTag, postTag} = useTag();

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
  const {mediaArray, deleteMedia, postMedia} = useMedia(false);
  const [myPostList, setMyPostList] = useState([]);

  const [active, setActive] = useState('posts');
  const [listArray, setListArray] = useState(
    mediaArray.filter((item) => item.media_type === 'audio').reverse()
  );

  const listPosts = () => {
    setActive('posts');
    const myPosts = mediaArray
      .filter((item) => item.media_type === 'audio')
      .reverse();
    setListArray(myPosts.filter((file) => file.user_id === user.user_id));
  };

  const listHistory = () => {
    setActive('history');
    if (JSON.parse(user.full_name).history) {
      const history = JSON.parse(user.full_name).history;
      const myHistory = mediaArray.filter((file) =>
        history.includes(file.file_id)
      );
      setListArray(myHistory);
    }
  };

  const listLiked = async () => {
    setActive('liked');
    const myLikes = [];
    for (let i = 0; i < mediaArray.length; i++) {
      const file = mediaArray[i];
      const likeInfo = await getFavourites(file.file_id);
      likeInfo.forEach((like) => {
        if (like.user_id === user.user_id) {
          myLikes.push(file);
          console.log('85');
        }
      });
    }
    setListArray(myLikes);
  };

  useEffect(() => {
    const myPosts = mediaArray
      .filter((item) => item.media_type === 'audio')
      .reverse();
    setListArray(myPosts.filter((file) => file.user_id === user.user_id));
    setMyPostList(myPosts.filter((file) => file.user_id === user.user_id));
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

  /* Adding Profile Picture */
  const [picture, setPicture] = useState(false);
  const [image, setImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(defaultProfile);

  const togglePicture = () => {
    setPicture(!picture);
  };

  const handleFileChange = (event) => {
    event.persist();
    setImage(event.target.files[0]);
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setSelectedImage(reader.result);
    });
    reader.readAsDataURL(event.target.files[0]);
  };

  const doUpload = async () => {
    const userToken = localStorage.getItem('userToken');
    try {
      const avatars = await getTag('avatar_' + user.user_id);
      const ava = avatars.pop();
      deleteMedia(ava.file_id, userToken);
    } catch (error) {
      console.log('No profile picture');
    }

    try {
      const dataImage = new FormData();
      dataImage.append('title', user.username);
      dataImage.append('file', image);

      const uploadResultImage = await postMedia(dataImage, userToken);
      const tagResultImage = await postTag(
        {
          file_id: uploadResultImage.file_id,
          tag: 'avatar_' + user.user_id,
        },
        userToken
      );
      window.location.reload(false);
      console.log(tagResultImage);
      console.log(uploadResultImage);
    } catch (error) {
      alert(error.message);
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

  /* color */

  const {
    colorHue,
    colorSaturation,
    colorLuminance,
    setColorHue,
    setColorSaturation,
    setColorLuminance,
  } = useContext(ColorContext);
  const [showColors, setShowColors] = useState(false);

  const toggleColors = () => {
    setShowColors(!showColors);
  };

  const handleSlider = (event, newValue) => {
    if (event.target.name === 'hue') {
      setColorHue(newValue);
    }
    if (event.target.name === 'saturation') {
      setColorSaturation(newValue);
    }
    if (event.target.name === 'luminance') {
      setColorLuminance(newValue);
    }
    const colors = {
      hue: colorHue,
      saturation: colorSaturation,
      luminance: colorLuminance,
    };
    localStorage.setItem('color', JSON.stringify(colors));
  };

  return (
    <>
      {user && (
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
                  xs={12}
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
                  <Typography variant="h6">{myPostList.length}</Typography>
                  <Typography variant="caption" color="grey">
                    Posts
                  </Typography>
                </Grid>
                {/* <Grid
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
                </Grid> */}
                <Grid
                  item
                  container
                  alignItems="center"
                  direction="column"
                  xs={4}
                >
                  <Typography variant="h6">
                    {JSON.parse(user.full_name).following.length}
                  </Typography>
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
            <MediaTableProfile
              postList={listArray}
              mediaArray={mediaArray}
            ></MediaTableProfile>
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
                width: '75%',
                position: 'fixed',
                top: '10rem',
                left: '50%',
                transform: 'translate(-50%, 0)',
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
                <Button fullWidth>Change Info</Button>
                <Divider flexItem />
                <Button fullWidth onClick={togglePicture}>
                  Profile picture
                </Button>
                {picture && (
                  <ValidatorForm
                    onSubmit={(event) => {
                      doUpload();
                      event.preventDefault();
                    }}
                  >
                    <Grid container justifyContent="center">
                      <img src={selectedImage} alt="preview" width={150}></img>
                    </Grid>
                    <Button variant="text" component="label" fullWidth>
                      <img src={uploadIcon} alt="upload icon" height={50} />
                      Upload Image
                      <input
                        hidden
                        accept="image/*"
                        multiple
                        type="file"
                        name="image"
                        onChange={handleFileChange}
                      />
                    </Button>
                    <Button
                      color="secondary"
                      fullWidth
                      sx={{mt: 1, borderRadius: '10rem'}}
                      variant="contained"
                      type="submit"
                    >
                      Submit
                    </Button>
                  </ValidatorForm>
                )}
                <Divider flexItem />
                <Button fullWidth onClick={toggleColors}>
                  Theme color
                </Button>
                {showColors && (
                  <Grid
                    container
                    direction="column"
                    gap={1}
                    alignItems="center"
                    padding="1rem 0"
                  >
                    <Box
                      sx={{
                        width: '5rem',
                        height: '2rem',
                        backgroundColor: `hsl(${colorHue}, ${colorSaturation}%, ${colorLuminance}%)`,
                        borderRadius: '0.2rem',
                      }}
                    ></Box>
                    <Typography variant="body1">Hue</Typography>
                    <Slider
                      width="100%"
                      name="hue"
                      min={0}
                      max={360}
                      step={1}
                      valueLabelDisplay="auto"
                      onChange={handleSlider}
                      value={colorHue}
                    ></Slider>
                    <Typography variant="body1">saturation</Typography>
                    <Slider
                      name="saturation"
                      min={0}
                      max={100}
                      step={1}
                      valueLabelDisplay="auto"
                      onChange={handleSlider}
                      value={colorSaturation}
                    ></Slider>
                    <Typography variant="body1">luminance</Typography>
                    <Slider
                      name="luminance"
                      min={0}
                      max={100}
                      step={1}
                      valueLabelDisplay="auto"
                      onChange={handleSlider}
                      value={colorLuminance}
                    ></Slider>
                  </Grid>
                )}
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
      )}
    </>
  );
};

export default Profile;
