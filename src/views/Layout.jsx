import {
  AppBar,
  Avatar,
  BottomNavigation,
  BottomNavigationAction,
  Container,
  CssBaseline,
  ThemeProvider,
  Toolbar,
  createTheme,
} from '@mui/material';
import {themeOptions} from '../theme/themeOptions';
import {Link, Outlet} from 'react-router-dom';
import logo from '../assets/frogify.svg';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

const Layout = () => {
  const theme = createTheme(themeOptions);
  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container sx={{width: '100%'}}>
          <AppBar position="static">
            <Toolbar disableGutters>
              <Avatar alt="Frogify logo" src={logo} />
            </Toolbar>
          </AppBar>
          <main>
            <Outlet />
          </main>
          <BottomNavigation sx={{width: 500}}>
            <BottomNavigationAction
              component={Link}
              to="/"
              label="Recents"
              value="recents"
              icon={<HomeIcon />}
            />
            <BottomNavigationAction
              component={Link}
              to="/search"
              label="Favorites"
              value="favorites"
              icon={<SearchIcon />}
            />
            <BottomNavigationAction
              component={Link}
              to="upload"
              label="Nearby"
              value="nearby"
              icon={<AddCircleOutlineIcon />}
            />
            <BottomNavigationAction
              component={Link}
              to="profile"
              label="Folder"
              value="folder"
              icon={<PersonOutlineIcon />}
            />
          </BottomNavigation>
        </Container>
      </ThemeProvider>
    </>
  );
};

export default Layout;
