import {Box, ImageListItem, ImageListItemBar} from '@mui/material';
import PropTypes from 'prop-types';
import {mediaUrl} from '../utils/variables';
import commentIcon from '../assets/comment.svg';
import likeIcon from '../assets/like.svg';

const MediaRow = ({file}) => {
  return (
    <>
      <Box sx={{mb: '1rem'}}>
        <ImageListItem>
          <img
            src={
              file.media_type !== 'audio'
                ? mediaUrl + file.thumbnails.w640
                : './vite.svg'
            }
            alt={file.title}
          />
          <ImageListItemBar title={file.title} />
        </ImageListItem>
        <Box sx={{display: 'flex', margin: '.5rem', gap: '.5rem'}}>
          <img src={likeIcon} alt="home icon" width="30rem" />
          <img src={commentIcon} alt="home icon" width="30rem" />
        </Box>
      </Box>
    </>
  );
};

MediaRow.propTypes = {
  file: PropTypes.object.isRequired,
};

export default MediaRow;
