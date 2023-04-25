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
import {Link, Outlet, useLocation, useNavigate} from 'react-router-dom';
import logo from '../assets/frogify.svg';
import homeIcon from '../assets/home.svg';
import searchIcon from '../assets/search.svg';
import uploadIcon from '../assets/plus.svg';
import profileIcon from '../assets/person.svg';
import {useContext, useEffect} from 'react';
import {MediaContext} from '../contexts/MediaContext';
import {useUser} from '../hooks/ApiHooks';
import AudioPlayer from '../components/AudioPlayer';

const Layout = () => {
  const theme = createTheme(themeOptions);

  const {user, setUser} = useContext(MediaContext);
  const {getUserByToken} = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const getUserInfo = async () => {
    const userToken = localStorage.getItem('userToken');
    if (userToken) {
      const userData = await getUserByToken(userToken);
      if (userData) {
        setUser(userData);
        const target = location.pathname === '/login' ? '/' : location.pathname;
        navigate(target);
        return;
      }
    }
    navigate('/');
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container sx={{width: '100%', padding: '0%'}}>
          <AppBar position="static">
            <Toolbar disableGutters>
              <Avatar alt="Frogify logo" src={logo} sx={{mx: 1}} />
              <Typography variant="h4" color="secondary">
                Frogify
              </Typography>
            </Toolbar>
          </AppBar>
          <main>
            <Outlet />
          </main>
          <AudioPlayer className="audioPlayer"></AudioPlayer>
          <BottomNavigation
            sx={{width: '100%', position: 'fixed', bottom: '0'}}
          >
            <BottomNavigationAction
              component={Link}
              to={user ? '/' : '/login'}
              label="Recents"
              value="recents"
              icon={<img src={homeIcon} alt="home icon" />}
            />
            <BottomNavigationAction
              component={Link}
              to={user ? 'search' : '/login'}
              label="Favorites"
              value="favorites"
              icon={<img src={searchIcon} alt="search icon" />}
            />
            <BottomNavigationAction
              component={Link}
              to={user ? 'upload' : '/login'}
              label="Nearby"
              value="nearby"
              icon={<img src={uploadIcon} alt="upload icon" />}
            />
            <BottomNavigationAction
              component={Link}
              to={user ? 'profile' : '/login'}
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
