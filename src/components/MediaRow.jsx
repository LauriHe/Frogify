import {Box, Button, ImageListItem, ImageListItemBar} from '@mui/material';
import PropTypes from 'prop-types';
import {mediaUrl} from '../utils/variables';
import commentIcon from '../assets/comment.svg';
import likeIcon from '../assets/like.svg';
import likeIconGreen from '../assets/likeGreen.svg';
import {useContext, useEffect, useState} from 'react';
import {SongContext} from '../contexts/SongContext';
import {useNavigate} from 'react-router-dom';
import {useFavourite} from '../hooks/ApiHooks';
import {useUser} from '../hooks/ApiHooks';
import {MediaContext} from '../contexts/MediaContext';
import playIcon from '../assets/play.svg';

const MediaRow = ({file, mediaArray, toggleComments}) => {
  const {setCurrentSong, setCurrentSongImage, setImageFilters} =
    useContext(SongContext);
  const {user, setUser, userStorage} = useContext(MediaContext);
  const {getUserByToken} = useUser();
  const [likes, setLikes] = useState(0);
  const [userLike, setUserLike] = useState(false);
  const [userFollow, setUserFollow] = useState(false);
  const {putUser} = useUser();
  const {getFavourites, postFavourite, deleteFavourite} = useFavourite();
  const navigate = useNavigate();
  const [postMaker, setPostMaker] = useState();
  const [update, setUpdate] = useState(false);
  const {getUser} = useUser();

  const goToLogin = () => {
    navigate('/login');
  };

  const image = mediaArray.find(
    (item) => item.file_id === JSON.parse(file.description).imageId
  );

  const fetchPostMaker = async () => {
    const token = localStorage.getItem('userToken');
    const maker = await getUser(file.user_id, token);
    setPostMaker(maker);
  };

  const addToHistory = async (file) => {
    try {
      if (user) {
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
    if (image.description) {
      setImageFilters(JSON.parse(image.description));
    }
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
    if (JSON.parse(user.full_name).following) {
      const following = JSON.parse(user.full_name).following;
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
    if (user) {
      fetchFollow();
    }
  }, [userFollow, userStorage.following, update]);

  useEffect(() => {
    if (user) {
      fetchLikes();
    }
  }, [userLike]);

  useEffect(() => {
    if (user) {
      fetchPostMaker();
    }
  }, []);

  return (
    <>
      {!userStorage?.following ||
      userStorage?.following.includes(file.user_id) ||
      userStorage?.following.length < 1 ? (
        <Box sx={{mb: '1rem'}}>
          <ImageListItem>
            <img
              src={mediaUrl + image.thumbnails.w640}
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
              alt={`cover art for ${file.title}`}
            />
            <ImageListItemBar
              title={file.title}
              subtitle={user ? postMaker?.username : ''}
              actionIcon={
                <Button onClick={playAudio}>
                  <img src={playIcon} alt="play icon" />
                </Button>
              }
            />
          </ImageListItem>
          <Box sx={{display: 'flex', margin: '.5rem', gap: '.5rem'}}>
            <img
              src={userLike ? likeIconGreen : likeIcon}
              onClick={user ? toggleLike : goToLogin}
              alt="Like icon"
              width="30rem"
            />
            <p>{likes}</p>
            <img
              src={commentIcon}
              onClick={user ? comment : goToLogin}
              alt="Comment icon"
              width="30rem"
            />
            {!(file.user_id === user?.user_id) && (
              <Button onClick={user ? toggleFollow : goToLogin}>
                {userFollow ? 'unfollow' : 'follow'}
              </Button>
            )}
          </Box>
        </Box>
      ) : null}
    </>
  );
};

MediaRow.propTypes = {
  file: PropTypes.object.isRequired,
  mediaArray: PropTypes.array.isRequired,
  toggleComments: PropTypes.func.isRequired,
};

export default MediaRow;
