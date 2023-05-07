import {Box, Button, Grid, ImageList, Paper, TextField} from '@mui/material';
import PropTypes from 'prop-types';
import {useComment, useMedia} from '../hooks/ApiHooks';
import MediaRow from './MediaRow';
import useForm from '../hooks/FormHooks';
import {useEffect, useState} from 'react';
import Comment from './Comment';
import {useWindowSize} from '../hooks/WindowHooks';
import closeIcon from '../assets/close.svg';

const MediaTable = (showedPosts) => {
  const {mediaArray} = useMedia();
  const [audioArray, setAudioArray] = useState();
  const [fileId, setFileId] = useState(0);
  const [viewComments, setViewComments] = useState(false);
  const [comments, setComments] = useState([]);
  const {getFileComments, postComment, deleteComment} = useComment();
  const windowSize = useWindowSize();
  const [cols, setCols] = useState(1);
  const [commentWidth, setCommentWidth] = useState(0);

  // Fetch the comments of the post
  const fetchComments = async () => {
    try {
      const commentInfo = await getFileComments(fileId);
      setComments(commentInfo);
    } catch (error) {
      console.log(error.message);
    }
  };

  // Add a comment to the post
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

  // Delete a comment from the post
  const deleteUserComment = async (commentId) => {
    try {
      const token = localStorage.getItem('userToken');
      await deleteComment(commentId, token);
      fetchComments();
    } catch (error) {
      console.log(error.message);
    }
  };

  // Show or hide the comments
  const toggleViewComments = (fileId) => {
    setFileId(fileId);
    setViewComments(!viewComments);
    inputs.comment = '';
    if (viewComments) {
      document.body.style.overflow = 'unset'; // Enable scrolling
    } else {
      document.body.style.overflow = 'hidden'; // Disable scrolling
    }
  };

  // Adjust the width of the comment section based on the screen size
  const adjustCommentWidth = () => {
    if (windowSize.width > 1300) {
      setCols(3);
      setCommentWidth('30%');
    } else if (windowSize.width > 768) {
      setCols(2);
      setCommentWidth('50%');
    } else {
      setCols(1);
      setCommentWidth('90%');
    }
  };

  const initValues = {
    comment: '',
  };

  const {inputs, handleSubmit, handleInputChange} = useForm(
    doComment,
    initValues
  );

  useEffect(() => {
    setAudioArray(
      mediaArray.filter((item) => item.media_type === 'audio').reverse()
    );
  }, [mediaArray]);

  useEffect(() => {
    fetchComments();
  }, [viewComments]);

  useEffect(() => {
    adjustCommentWidth();
  }, [windowSize]);

  return (
    <Grid container direction="column" alignItems="center">
      {audioArray && (
        <ImageList
          direction="row"
          cols={cols}
          gap={8}
          sx={{marginBottom: '7rem'}}
        >
          {audioArray.map((item) => {
            return (
              <MediaRow
                key={item.file_id}
                file={item}
                mediaArray={mediaArray}
                toggleComments={toggleViewComments}
                showedPosts={showedPosts}
              />
            );
          })}
        </ImageList>
      )}
      {viewComments && (
        <Paper
          sx={{
            position: 'fixed',
            top: '20rem',
            zIndex: 10,
            width: commentWidth,
            minHeight: '10rem',
            padding: '1rem 0',
          }}
        >
          <Grid>
            <Button
              sx={{padding: '0 1rem', marginBottom: '1rem'}}
              onClick={toggleViewComments}
            >
              <img src={closeIcon} style={{width: '2rem'}} alt="close icon" />
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
              alignItems="center"
              gap={1}
            >
              <TextField
                id="outlined-multiline-flexible"
                multiline
                name="comment"
                label="Enter Comment"
                onChange={handleInputChange}
                value={inputs.comment}
                maxRows={4}
                sx={{width: '70%', marginTop: '1rem'}}
              />
              <Button type="submit" sx={{marginTop: '1rem'}}>
                Submit
              </Button>
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

MediaTable.propTypes = {
  showedPosts: PropTypes.string,
};

export default MediaTable;
