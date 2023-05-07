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

const MediaRow = ({file, mediaArray, toggleComments, showedPosts}) => {
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

  // Go to login page
  const goToLogin = () => {
    navigate('/login');
  };

  // Get the id of the image that belongs to the post
  const image = mediaArray.find(
    (item) => item.file_id === JSON.parse(file.description).imageId
  );

  // Fetch the user who made the post
  const fetchPostMaker = async () => {
    const token = localStorage.getItem('userToken');
    const maker = await getUser(file.user_id, token);
    setPostMaker(maker);
  };

  // Add the song to the user's play history
  const addToHistory = async (file) => {
    try {
      if (user) {
        if (JSON.parse(user.full_name).history) {
          const storage = JSON.parse(user.full_name); // Get the user's storage from "full_name" field
          const following = JSON.parse(user.full_name).following; // Save the user's following array to a variable
          const history = JSON.parse(user.full_name).history; // Save the user's history array to a variable
          history.push(file.file_id);
          if (history.length > 10) {
            history.shift();
          } // Keep the history array at max 10 items
          storage.history = history;
          const token = localStorage.getItem('userToken');
          const data = {full_name: JSON.stringify({following, history})}; // Rebuild the user's storage object
          await putUser(data, token); // Upload the new storage object to the api
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Play the song
  const playAudio = () => {
    addToHistory(file);
    setCurrentSong(file);
    setCurrentSongImage(image);
    if (image.description) {
      setImageFilters(JSON.parse(image.description));
    }
  };

  // Fetch the likes for the post
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

  // Add a like to the post
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

  // Delete a like from the post
  const deleteLike = async () => {
    try {
      const token = localStorage.getItem('userToken');
      await deleteFavourite(file.file_id, token);
      setUserLike(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  // Add or delete a like from the post depending on if the user has already liked it
  const toggleLike = () => {
    setUpdate(!update);
    if (userLike) {
      deleteLike();
    } else {
      doLike();
    }
  };

  // Call toggleComments() from the parent component to show/hide comments
  const comment = () => {
    toggleComments(file.file_id);
  };

  // Find out weather the user follows the post maker
  const fetchFollow = async () => {
    const token = localStorage.getItem('userToken');
    const user = await getUserByToken(token);
    setUser(user);
    if (JSON.parse(user.full_name).following) {
      const following = JSON.parse(user.full_name).following; // Get the user's following array from "full_name" field
      if (following.includes(file.user_id)) {
        setUserFollow(true);
      }
    }
  };

  // Add the post maker to the user's following list
  const doFollow = async () => {
    try {
      if (user) {
        if (JSON.parse(user.full_name).following) {
          const storage = JSON.parse(user.full_name);
          const following = JSON.parse(user.full_name).following; // Save the user's following array to a variable
          const history = JSON.parse(user.full_name).history; // Save the user's history array to a variable
          if (!following.includes(file.user_id)) {
            following.push(file.user_id); // Add the post maker to the user's following array if it's not already there
            storage.following = following;
            const token = localStorage.getItem('userToken');
            const data = {full_name: JSON.stringify({following, history})}; // Rebuild the user's storage object
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

  // Delete the post maker from the user's following list
  const deleteFollow = async () => {
    try {
      if (JSON.parse(user.full_name).following) {
        const storage = JSON.parse(user.full_name);
        let following = JSON.parse(user.full_name).following; // Save the user's following array to a variable
        const history = JSON.parse(user.full_name).history; // Save the user's history array to a variable
        if (following.includes(file.user_id)) {
          following = following.filter((id) => id !== file.user_id); // Remove the post maker from the user's following array
          storage.following = following;
          const token = localStorage.getItem('userToken');
          const data = {full_name: JSON.stringify({following, history})}; // Rebuild the user's storage object
          await putUser(data, token);
          setUserFollow(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // Follow or unfollow the post maker depending on if the user already follows them
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
      {showedPosts.showedPosts === 'all' ||
      (user && userStorage?.following.includes(file.user_id)) ? (
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
            {!(file.user_id === user?.user_id) && (
              <Button onClick={user ? toggleFollow : goToLogin}>
                {userFollow ? 'unfollow' : 'follow'}
              </Button>
            )}
            <Button onClick={user ? toggleLike : goToLogin}>
              <img
                src={userLike ? likeIconGreen : likeIcon}
                alt="Like icon"
                width="30rem"
              />
              <p>{likes}</p>
            </Button>
            <Button onClick={user ? comment : goToLogin}>
              <img src={commentIcon} alt="Comment icon" width="30rem" />
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
  showedPosts: PropTypes.object,
};

export default MediaRow;
