import {Divider, Grid, ImageList} from '@mui/material';
import PropTypes from 'prop-types';
import MediaRowSearch from './MediaRowSearch';

const MediaTableSearch = ({searchArray, mediaArray}) => {
  return (
    <ImageList cols={1} gap={8} sx={{marginBottom: '3rem'}}>
      {searchArray.map((item, index) => {
        return (
          <Grid container direction="column" gap={1} key={index}>
            <MediaRowSearch file={item} mediaArray={mediaArray} />
            {!(index === searchArray.length - 1) && <Divider />}
          </Grid>
        );
      })}
    </ImageList>
  );
};

MediaTableSearch.propTypes = {
  searchArray: PropTypes.array.isRequired,
  mediaArray: PropTypes.array.isRequired,
};

export default MediaTableSearch;
