import {
  AppBar,
  Avatar,
  BottomNavigation,
  BottomNavigationAction,
  Container,
  CssBaseline,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme,
} from '@mui/material';
import {themeOptions} from '../theme/themeOptions';
import {Link, Outlet} from 'react-router-dom';
import logo from '../assets/frogify.svg';
import homeIcon from '../assets/home.svg';
import searchIcon from '../assets/search.svg';
import uploadIcon from '../assets/plus.svg';
import profileIcon from '../assets/person.svg';

const Layout = () => {
  const theme = createTheme(themeOptions);
  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container sx={{width: '100%', padding: '0%'}}>
          <AppBar position="static">
            <Toolbar disableGutters>
              <Avatar alt="Frogify logo" src={logo} sx={{mx: 1}} />
              <Typography variant="h4">Frogify</Typography>
            </Toolbar>
          </AppBar>
          <main>
            <Outlet />
          </main>
          <BottomNavigation sx={{width: '100%'}}>
            <BottomNavigationAction
              component={Link}
              to="/"
              label="Recents"
              value="recents"
              icon={<img src={homeIcon} alt="home icon" />}
            />
            <BottomNavigationAction
              component={Link}
              to="/search"
              label="Favorites"
              value="favorites"
              icon={<img src={searchIcon} alt="search icon" />}
            />
            <BottomNavigationAction
              component={Link}
              to="upload"
              label="Nearby"
              value="nearby"
              icon={<img src={uploadIcon} alt="upload icon" />}
            />
            <BottomNavigationAction
              component={Link}
              to="profile"
              label="Folder"
              value="folder"
              icon={<img src={profileIcon} alt="profile icon" />}
            />
          </BottomNavigation>
        </Container>
      </ThemeProvider>
    </>
  );
};

export default Layout;
