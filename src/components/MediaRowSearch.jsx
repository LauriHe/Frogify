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
import {useFavourite, useUser} from '../hooks/ApiHooks';
import {useContext, useEffect, useState} from 'react';
import {MediaContext} from '../contexts/MediaContext';
import userIcon from '../assets/person.svg';
import dotsVerIcon from '../assets/dotsVertical.svg';
import likeIcon from '../assets/like.svg';
import playIcon from '../assets/play.svg';
import commentIcon from '../assets/comment.svg';
import {SongContext} from '../contexts/SongContext';

const MediaRowSearch = ({file, mediaArray, toggleComments}) => {
  const {setCurrentSong, setCurrentSongImage} = useContext(SongContext);
  const {user, setUser, userStorage} = useContext(MediaContext);
  const {getUserByToken} = useUser();
  const [likes, setLikes] = useState(0);
  const [userLike, setUserLike] = useState(false);
  const [userFollow, setUserFollow] = useState(false);
  const {putUser} = useUser();
  const {getFavourites, postFavourite, deleteFavourite} = useFavourite();
  const [postMaker, setPostMaker] = useState();
  const [update, setUpdate] = useState(false);
  const {getUser} = useUser();

  const fetchPostMaker = async () => {
    const token = localStorage.getItem('userToken');
    const postMaker = await getUser(file.user_id, token);
    setPostMaker(postMaker);
  };

  const image = mediaArray.find(
    (item) => item.file_id === JSON.parse(file.description).imageId
  );

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

  const addToHistory = async (file) => {
    try {
      if (user) {
        console.log(JSON.parse(user.full_name));
        if (JSON.parse(user.full_name).history) {
          const storage = JSON.parse(user.full_name);

          const following = JSON.parse(user.full_name).following;
          const history = JSON.parse(user.full_name).history;
          history.push(file.file_id);
          if (history.length > 10) {
            history.shift();
          }
          storage.history = history;
          const token = localStorage.getItem('userToken');
          const data = {full_name: JSON.stringify({following, history})};
          await putUser(data, token);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const playAudio = () => {
    addToHistory(file);
    setCurrentSong(file);
    setCurrentSongImage(image);
  };

  const fetchLikes = async () => {
    try {
      const likeInfo = await getFavourites(file.file_id);
      setLikes(likeInfo.length);
      likeInfo.forEach((like) => {
        like.user_id === user.user_id && setUserLike(true);
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const doLike = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const data = {file_id: file.file_id};
      await postFavourite(data, token);
      setUserLike(true);
    } catch (error) {
      console.log(error.message);
    }
  };

  const deleteLike = async () => {
    try {
      const token = localStorage.getItem('userToken');
      await deleteFavourite(file.file_id, token);
      setUserLike(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  const toggleLike = () => {
    setUpdate(!update);
    if (userLike) {
      deleteLike();
    } else {
      doLike();
    }
  };

  const comment = () => {
    toggleComments(file.file_id);
  };

  const fetchFollow = async () => {
    const token = localStorage.getItem('userToken');
    const user = await getUserByToken(token);
    setUser(user);
    if (JSON.parse(user.full_name).storage.following) {
      const following = JSON.parse(user.full_name).storage.following;
      if (following.includes(file.user_id)) {
        setUserFollow(true);
      }
    }
  };

  const doFollow = async () => {
    try {
      if (user) {
        if (JSON.parse(user.full_name).following) {
          const storage = JSON.parse(user.full_name);
          const following = JSON.parse(user.full_name).following;
          const history = JSON.parse(user.full_name).history;
          if (!following.includes(file.user_id)) {
            following.push(file.user_id);
            storage.following = following;
            const token = localStorage.getItem('userToken');
            const data = {full_name: JSON.stringify({following, history})};
            await putUser(data, token);
            setUpdate(!update);
            setUserFollow(true);
          }
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const deleteFollow = async () => {
    try {
      if (JSON.parse(user.full_name).following) {
        const storage = JSON.parse(user.full_name);
        let following = JSON.parse(user.full_name).following;
        const history = JSON.parse(user.full_name).history;
        if (following.includes(file.user_id)) {
          following = following.filter((id) => id !== file.user_id);
          storage.following = following;
          const token = localStorage.getItem('userToken');
          const data = {full_name: JSON.stringify({following, history})};
          await putUser(data, token);
          setUserFollow(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const toggleFollow = () => {
    if (userFollow) {
      deleteFollow();
    } else {
      doFollow();
    }
  };

  useEffect(() => {
    fetchFollow();
  }, [userFollow, userStorage.following, update]);

  useEffect(() => {
    fetchLikes();
  }, [userLike]);

  useEffect(() => {
    fetchPostMaker();
  }, []);

  return (
    <Box padding="1rem 1rem 0 1rem">
      <Grid container gap={1} alignItems="center">
        <Grid container justifyContent="space-between">
          <Grid container gap={1} width="fit-content">
            <img
              src={mediaUrl + image.thumbnails.w640}
              alt={file.title}
              width={100}
            />
            <Box>
              <Typography variant="h5" component="h2" sx={{mb: '.5rem'}}>
                {file.title}
              </Typography>
              <Grid container alignItems="center" gap={1}>
                <img src={userIcon} alt="user icon" width={30} />
                <Typography variant="h6" component="h3" color="grey">
                  {postMaker?.username}
                </Typography>
              </Grid>
            </Box>
          </Grid>
          <IconButton
            color="primary"
            aria-label="upload picture"
            component="label"
            sx={{p: 1, pr: 1}}
            onClick={playAudio}
          >
            PLAY
          </IconButton>
        </Grid>
        <Grid container gap={1}>
          <Grid container width="fit-content">
            <IconButton
              color="primary"
              aria-label="upload picture"
              component="label"
              sx={{p: 1, pr: 1}}
              onClick={toggleLike}
            >
              <img src={likeIcon} alt="like icon" width={30} />
            </IconButton>
            <p>{likes}</p>
          </Grid>
          <IconButton
            color="primary"
            aria-label="upload picture"
            component="label"
            sx={{p: 1, pr: 1}}
            onClick={comment}
          >
            <img src={commentIcon} alt="comment icon" width={30} />
          </IconButton>
          {!(file.user_id === user.user_id) && (
            <IconButton
              color="primary"
              aria-label="upload picture"
              component="label"
              sx={{p: 1, pr: 1}}
              onClick={toggleFollow}
            >
              Follow
            </IconButton>
          )}
        </Grid>

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
            <Button onClick={modifySong} fullWidth>
              Modify song
            </Button>
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
  toggleComments: PropTypes.func.isRequired,
};

export default MediaRowSearch;
