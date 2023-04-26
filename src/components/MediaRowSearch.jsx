import {Box, Grid, Typography} from '@mui/material';
import PropTypes from 'prop-types';
import {mediaUrl} from '../utils/variables';
import {useUser} from '../hooks/ApiHooks';
import {useEffect, useState} from 'react';
import userIcon from '../assets/person.svg';

const MediaRowSearch = ({file, mediaArray}) => {
  const {getUser} = useUser();
  const [user, setUser] = useState('');

  const fetchUser = async () => {
    const token = localStorage.getItem('userToken');
    const user = await getUser(file.user_id, token);
    setUser(user);
  };

  const image = mediaArray.find(
    (item) => item.file_id === JSON.parse(file.description).imageId
  );

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <Box sx={{}}>
      <Grid container gap={1} alignItems="center">
        <img
          src={mediaUrl + image.thumbnails.w640}
          alt={file.title}
          width={200}
        />
        <Box>
          <Typography variant="h5" component="h2" sx={{mb: '.5rem'}}>
            {file.title}
          </Typography>
          <Grid container alignItems="center" gap={1}>
            <img src={userIcon} alt="user icon" width={30} />
            <Typography variant="h6" component="h3" color="grey">
              {user.username}
            </Typography>
          </Grid>
        </Box>
      </Grid>
    </Box>
  );
};

MediaRowSearch.propTypes = {
  file: PropTypes.object.isRequired,
  mediaArray: PropTypes.array.isRequired,
};

export default MediaRowSearch;
