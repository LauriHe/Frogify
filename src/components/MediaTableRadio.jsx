import {ImageList} from '@mui/material';
import PropTypes from 'prop-types';
import MediaRowRadio from './MediaRowRadio';

const MediaTableRadio = ({radioList}) => {
  return (
    <ImageList cols={1} gap={8} sx={{marginBottom: '7rem'}}>
      {radioList.map((item, index) => {
        return <MediaRowRadio station={item} key={index}></MediaRowRadio>;
      })}
    </ImageList>
  );
};

MediaTableRadio.propTypes = {
  radioList: PropTypes.array.isRequired,
};

export default MediaTableRadio;
