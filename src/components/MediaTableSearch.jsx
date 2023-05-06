import {
  Button,
  Divider,
  Grid,
  ImageList,
  TextField,
  Paper,
  Box,
} from '@mui/material';
import PropTypes from 'prop-types';
import MediaRowSearch from './MediaRowSearch';
import {useEffect, useState} from 'react';
import {useComment} from '../hooks/ApiHooks';
import Comment from './Comment';
import useForm from '../hooks/FormHooks';

const MediaTableSearch = ({searchArray, mediaArray}) => {
  const [fileId, setFileId] = useState(0);
  const [viewComments, setViewComments] = useState(false);
  const [comments, setComments] = useState([]);
  const {getFileComments, postComment, deleteComment} = useComment();

  const fetchComments = async () => {
    try {
      const commentInfo = await getFileComments(fileId);
      setComments(commentInfo);
    } catch (error) {
      console.log(error.message);
    }
  };

  const doComment = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const data = {file_id: fileId, comment: inputs.comment};
      await postComment(data, token);
      fetchComments();
      inputs.comment = '';
    } catch (error) {
      console.log(error.message);
    }
  };

  const deleteUserComment = async (commentId) => {
    try {
      const token = localStorage.getItem('userToken');
      await deleteComment(commentId, token);
      fetchComments();
    } catch (error) {
      console.log(error.message);
    }
  };

  const initValues = {
    comment: '',
  };

  const {inputs, handleSubmit, handleInputChange} = useForm(
    doComment,
    initValues
  );

  const toggleViewComments = (fileId) => {
    setFileId(fileId);
    setViewComments(!viewComments);
    inputs.comment = '';
    if (viewComments) {
      document.body.style.overflow = 'unset';
    } else {
      document.body.style.overflow = 'hidden';
    }
  };

  useEffect(() => {
    fetchComments();
  }, [viewComments]);

  return (
    <Grid container direction="column" alignItems="center">
      <ImageList cols={1} gap={8} sx={{marginBottom: '3rem'}}>
        {searchArray.map((item, index) => {
          return (
            <Grid
              container
              direction="column"
              gap={1}
              key={item.file_id}
              index={index}
            >
              <MediaRowSearch
                file={item}
                mediaArray={mediaArray}
                toggleComments={toggleViewComments}
              />
              {!(index === searchArray.length - 1) && <Divider />}
            </Grid>
          );
        })}
      </ImageList>
      {viewComments && (
        <Paper
          sx={{
            position: 'fixed',
            top: '10rem',
            zIndex: 10,
            width: '90%',
            minHeight: '10rem',
            padding: '1rem 0',
          }}
        >
          <Grid>
            <Button
              sx={{padding: '0 1rem', marginBottom: '1rem'}}
              onClick={toggleViewComments}
            >
              Close
            </Button>
            {comments.map((comment, index) => {
              return (
                <Comment
                  deleteUserComment={deleteUserComment}
                  comment={comment}
                  key={index}
                ></Comment>
              );
            })}
            <Grid
              container
              justifyContent="center"
              component="form"
              onSubmit={handleSubmit}
            >
              <TextField
                id="outlined-multiline-flexible"
                multiline
                name="comment"
                label="Enter Comment"
                onChange={handleInputChange}
                value={inputs.comment}
                maxRows={4}
                sx={{width: '70%'}}
              />
              <Button type="submit">Submit</Button>
            </Grid>
          </Grid>
        </Paper>
      )}
      {viewComments && (
        <Box
          sx={{
            position: 'fixed',
            width: '100%',
            height: '100%',
            top: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
          }}
        ></Box>
      )}
    </Grid>
  );
};

MediaTableSearch.propTypes = {
  searchArray: PropTypes.array.isRequired,
  mediaArray: PropTypes.array.isRequired,
};

export default MediaTableSearch;
