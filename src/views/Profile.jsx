import {
  Apps,
  FormatListBulleted,
  Person,
  PlayArrow,
  Settings,
} from '@mui/icons-material';
import {
  Box,
  Button,
  IconButton,
  Typography,
  Card,
  CardMedia,
} from '@mui/material';

const Profile = () => {
  return (
    <>
      {/* Profile header */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'nowrap',
          justifyContent: 'space-around',
          pt: 2,
          pb: 2,
          textAlign: 'center',
        }}
      >
        <Box sx={{width: '40%'}}>
          <img src="http://placekitten.com/g/200/200"></img>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 1,
            gridTemplateRows: 'auto',
            gridTemplateAreas: `
            "name name icon"
            "post followers following"`,
          }}
        >
          <Typography component="h2" variant="h2" sx={{gridArea: 'name'}}>
            UserName
          </Typography>
          <IconButton
            color="primary"
            aria-label="upload picture"
            component="label"
            sx={{p: 1, gridArea: 'icon'}}
          >
            <Settings fontSize="large" />
          </IconButton>
          <box sx={{gridArea: 'post'}}>
            <Typography>000</Typography>
            <Typography>POST</Typography>
          </box>
          <box sx={{gridArea: 'followers'}}>
            <Typography>000</Typography>
            <Typography>FOLLOWERS</Typography>
          </box>
          <box sx={{gridArea: 'following'}}>
            <Typography>000</Typography>
            <Typography>FOLLOWING</Typography>
          </box>
        </Box>
      </Box>

      {/* NavBar */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-around',
          borderTop: 1,
          borderBottom: 1,
        }}
      >
        <Button sx={{p: 1}}>POSTS</Button>
        <Button sx={{p: 1}}>HISTORY</Button>
        <Button sx={{p: 1}}>LIKED</Button>
        <Box borderLeft={1}></Box>
        <IconButton
          color="primary"
          aria-label="upload picture"
          component="label"
          sx={{p: 1}}
        >
          <FormatListBulleted />
        </IconButton>

        <IconButton
          color="primary"
          aria-label="upload picture"
          component="label"
          sx={{p: 1}}
        >
          <Apps />
        </IconButton>
      </Box>

      {/* Posts */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Card */}
        <Card
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            borderBottom: 1,
            p: 1,
            m: 2,
          }}
        >
          {/* Img */}
          <CardMedia
            component="img"
            sx={{width: 151}}
            image="http://placekitten.com/g/100/100"
            alt="Live from space album cover"
          />
          {/* name and maker */}
          <Box
            sx={{
              display: 'grid',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography component="div"> Name Of The Song</Typography>
            <Typography component="div">
              <Person />
              Froggy Frog
            </Typography>
          </Box>
          {/* PlayButton */}
          <IconButton
            color="primary"
            aria-label="upload picture"
            component="label"
            sx={{p: '1.5rem'}}
          >
            <PlayArrow fontSize="large" />
          </IconButton>
        </Card>
      </Box>
    </>
  );
};

export default Profile;
