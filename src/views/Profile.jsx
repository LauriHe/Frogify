import {Box, Button, IconButton, Typography, Grid} from '@mui/material';
import userIcon from '../assets/person.svg';
import appIcon from '../assets/app.svg';
import settingIcon from '../assets/setting.svg';
import listIcon from '../assets/list.svg';
import dotsVerIcon from '../assets/dotsVertical.svg';

const Profile = () => {
  return (
    <>
      {/* Profile header */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}
      >
        <Grid container justifyContent="center" sx={{p: 2, width: '40%'}}>
          <img
            src="http://placekitten.com/g/200/200"
            width={150}
            style={{borderRadius: '50%'}}
          />
        </Grid>

        <Grid container alignItems="center" sx={{width: '60%'}}>
          <Grid
            container
            spacing={1}
            direction="row"
            alignItems="center"
            justifyContent="center"
            rowSpacing={2}
            item
          >
            <Grid
              item
              container
              direction="row"
              justifyContent="center"
              xs="12"
            >
              <Typography variant="h4">UserName</Typography>
              <IconButton color="primary">
                <img src={settingIcon} alt="setting icon" width={30} />
              </IconButton>
            </Grid>
            {/* second row */}
            <Grid item container alignItems="center" direction="column" xs={4}>
              <Typography variant="h6">000</Typography>
              <Typography variant="caption" color="grey">
                Posts
              </Typography>
            </Grid>
            <Grid item container alignItems="center" direction="column" xs={4}>
              <Typography variant="h6">000</Typography>
              <Typography variant="caption" color="grey">
                Followers
              </Typography>
            </Grid>
            <Grid item container alignItems="center" direction="column" xs={4}>
              <Typography variant="h6">000</Typography>
              <Typography variant="caption" color="grey">
                Following
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Box>

      {/* NavBar */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'noWrap',
          justifyContent: 'space-around',
          borderTop: 1,
          borderBottom: 1,
        }}
      >
        <Button sx={{p: 1, color: 'white'}}>Posts</Button>
        <Button sx={{p: 1, color: 'white'}}>History</Button>
        <Button sx={{p: 1, color: 'white'}}>Liked</Button>
        <Box borderLeft={1}></Box>
        <IconButton
          color="primary"
          aria-label="upload picture"
          component="label"
          sx={{p: 1}}
        >
          <img src={listIcon} alt="list icon" width={30} />
        </IconButton>

        <IconButton
          color="primary"
          aria-label="upload picture"
          component="label"
          sx={{p: 1}}
        >
          <img src={appIcon} alt="app icon" width={30} />
        </IconButton>
      </Box>

      {/* Posts */}
      <Box sx={{borderBottom: 1, pb: 1, pt: 1}}>
        <Grid
          container
          justifyContent="space-between"
          gap={3}
          alignItems="center"
          sx={{pr: 2}}
        >
          <img src="https://placekitten.com/200/300" width={100} height={100} />
          <Box>
            <Typography variant="h5" component="h2" sx={{mb: '.5rem'}}>
              SongName
            </Typography>
            <Grid container alignItems="center" gap={1}>
              <img src={userIcon} alt="user icon" width={30} />
              <Typography variant="h6" component="h3" color="grey">
                UserName
              </Typography>
            </Grid>
          </Box>
          <Box>
            <IconButton
              color="primary"
              aria-label="upload picture"
              component="label"
              sx={{p: 1}}
            >
              <img src={dotsVerIcon} alt="dots icon" width={30} />
            </IconButton>
          </Box>
        </Grid>
      </Box>
    </>
  );
};

export default Profile;
