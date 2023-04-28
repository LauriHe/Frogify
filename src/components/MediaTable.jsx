import {ImageList} from '@mui/material';
import PropTypes from 'prop-types';
import {useMedia} from '../hooks/ApiHooks';
import MediaRow from './MediaRow';

const MediaTable = ({myFilesOnly = false}) => {
  const {mediaArray} = useMedia(myFilesOnly);
  const audioArray = mediaArray.filter((item) => item.media_type === 'audio');
  audioArray.reverse();

  return (
    <ImageList cols={1} gap={8} sx={{marginBottom: '7rem'}}>
      {audioArray.map((item, index) => {
        return <MediaRow key={index} file={item} mediaArray={mediaArray} />;
      })}
    </ImageList>
  );
};

MediaTable.propTypes = {
  myFilesOnly: PropTypes.bool,
};

export default MediaTable;
