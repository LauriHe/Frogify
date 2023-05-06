import {ImageList} from '@mui/material';
import PropTypes from 'prop-types';
import MediaRowProfile from './MediaRowProfile';

const MediaTableProfile = ({postList, mediaArray}) => {
  return (
    <ImageList cols={1} gap={8} sx={{marginBottom: '7rem'}}>
      {postList.map((item) => {
        return (
          <MediaRowProfile
            file={item}
            key={item.file_id}
            mediaArray={mediaArray}
          ></MediaRowProfile>
        );
      })}
    </ImageList>
  );
};

MediaTableProfile.propTypes = {
  postList: PropTypes.array.isRequired,
  mediaArray: PropTypes.array.isRequired,
};

export default MediaTableProfile;
