import {Button, Grid} from '@mui/material';
import PropTypes from 'prop-types';
import {useContext, useEffect, useState} from 'react';
import {MediaContext} from '../contexts/MediaContext';
import {useUser} from '../hooks/ApiHooks';

const Comment = ({comment, deleteUserComment}) => {
  const {user} = useContext(MediaContext);
  const {getUser} = useUser();

  const [commentUser, setCommentUser] = useState({});

  const handleDelete = () => {
    deleteUserComment(comment.comment_id);
  };

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const user = await getUser(comment.user_id, token);
      setCommentUser(user);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <Grid
      container
      gap={1}
      padding=".5rem 1rem"
      justifyContent="space-between"
      alignItems="center"
    >
      <Grid container gap={0.5} width="fit-content">
        <p style={{margin: 0}}>{commentUser.username + ': '}</p>
        <p style={{margin: 0}}>{comment.comment}</p>
      </Grid>
      {user.user_id === comment.user_id && (
        <Button sx={{height: '2rem'}} onClick={handleDelete}>
          Delete
        </Button>
      )}
    </Grid>
  );
};

Comment.propTypes = {
  comment: PropTypes.object,
  deleteUserComment: PropTypes.func,
};

export default Comment;
