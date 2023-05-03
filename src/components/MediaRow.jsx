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

const MediaRow = ({file, mediaArray, toggleComments}) => {
  const {setCurrentSong, setCurrentSongImage} = useContext(SongContext);
  const {user, setUser, follows} = useContext(MediaContext);
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

  const playAudio = () => {
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
    if (user.full_name) {
      const following = JSON.parse(user.full_name).following;
      if (following.includes(file.user_id)) {
        setUserFollow(true);
      }
    }
  };

  const doFollow = async () => {
    try {
      if (user) {
        let following = [];
        if (user.full_name) {
          following = JSON.parse(user.full_name).following;
        }
        if (!following.includes(file.user_id)) {
          following.push(file.user_id);
          const token = localStorage.getItem('userToken');
          const data = {full_name: JSON.stringify({following: following})};
          await putUser(data, token);
          setUpdate(!update);
          setUserFollow(true);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const deleteFollow = async () => {
    try {
      if (user.full_name) {
        let following = JSON.parse(user.full_name).following;
        if (following.includes(file.user_id)) {
          following = following.filter((id) => id !== file.user_id);
          const token = localStorage.getItem('userToken');
          const data = {full_name: JSON.stringify({following: following})};
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
  }, [userFollow, follows.following, update]);

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
      {follows.following.includes(file.user_id) ||
      follows.following.length < 1 ? (
        <Box sx={{mb: '1rem'}}>
          <ImageListItem>
            <img
              src={mediaUrl + image.thumbnails.w640}
              alt={`cover art for ${file.title}`}
            />
            <ImageListItemBar
              title={file.title}
              subtitle={user ? postMaker?.username : ''}
              actionIcon={<Button onClick={playAudio}>play</Button>}
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
            <Button onClick={toggleFollow}>
              {userFollow ? 'unfollow' : 'follow'}
            </Button>
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
