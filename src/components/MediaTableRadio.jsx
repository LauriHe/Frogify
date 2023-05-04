import {ImageList} from '@mui/material';
import PropTypes from 'prop-types';
import MediaRowRadio from './MediaRowRadio';
import {useEffect, useState} from 'react';
import {useWindowSize} from '../hooks/WindowHooks';

const MediaTableRadio = ({radioList}) => {
  const windowSize = useWindowSize();
  const [cols, setCols] = useState(1);

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
    <ImageList cols={cols} gap={8} sx={{marginBottom: '7rem'}}>
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
