import {Box, Button, Grid, ImageList, Paper, TextField} from '@mui/material';
import PropTypes from 'prop-types';
import {useComment, useMedia} from '../hooks/ApiHooks';
import MediaRow from './MediaRow';
import useForm from '../hooks/FormHooks';
import {useEffect, useState} from 'react';
import Comment from './Comment';
import {useWindowSize} from '../hooks/WindowHooks';

const MediaTable = (showedPosts) => {
  const {mediaArray} = useMedia();
  const [audioArray, setAudioArray] = useState();
  const [fileId, setFileId] = useState(0);
  const [viewComments, setViewComments] = useState(false);
  const [comments, setComments] = useState([]);
  const {getFileComments, postComment, deleteComment} = useComment();
  const windowSize = useWindowSize();
  const [cols, setCols] = useState(1);

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
    setAudioArray(
      mediaArray.filter((item) => item.media_type === 'audio').reverse()
    );
  }, [mediaArray]);

  useEffect(() => {
    fetchComments();
  }, [viewComments]);

  useEffect(() => {
    if (windowSize.width > 1300) {
      setCols(3);
    } else if (windowSize.width > 768) {
      setCols(2);
    } else {
      setCols(1);
    }
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
          {audioArray.map((item, index) => {
            return (
              <MediaRow
                key={index}
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

MediaTable.propTypes = {
  showedPosts: PropTypes.string,
};

export default MediaTable;
