import {Box, Button, Grid, ImageList, Paper, TextField} from '@mui/material';
import PropTypes from 'prop-types';
import {useComment, useMedia} from '../hooks/ApiHooks';
import MediaRow from './MediaRow';
import useForm from '../hooks/FormHooks';
import {useContext, useEffect, useState} from 'react';
import Comment from './Comment';
import {MediaContext} from '../contexts/MediaContext';

const MediaTable = ({myFilesOnly = false}) => {
  const {mediaArray} = useMedia(myFilesOnly);
  const {user} = useContext(MediaContext);
  const [audioArray, setAudioArray] = useState();
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
    setAudioArray(
      mediaArray.filter((item) => item.media_type === 'audio').reverse()
    );
  }, [mediaArray]);

  useEffect(() => {
    fetchComments();
  }, [viewComments]);

  return (
    <Grid container direction="column" alignItems="center">
      {audioArray && user && (
        <ImageList cols={1} gap={8} sx={{marginBottom: '7rem'}}>
          {audioArray.map((item, index) => {
            return (
              <MediaRow
                key={index}
                file={item}
                mediaArray={mediaArray}
                toggleComments={toggleViewComments}
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
          }}
        >
          <Grid>
            <Button onClick={toggleViewComments}>Close</Button>
            {comments.map((comment, index) => {
              return (
                <Comment
                  deleteUserComment={deleteUserComment}
                  comment={comment}
                  key={index}
                ></Comment>
              );
            })}
            <Grid container component="form" onSubmit={handleSubmit}>
              <TextField
                id="outlined-multiline-flexible"
                multiline
                name="comment"
                label="Enter Comment"
                onChange={handleInputChange}
                value={inputs.comment}
                maxRows={4}
                sx={{width: '75%'}}
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
  myFilesOnly: PropTypes.bool,
};

export default MediaTable;
