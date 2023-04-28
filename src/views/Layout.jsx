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
import {useContext, useEffect, useRef, useState} from 'react';
import {MediaContext} from '../contexts/MediaContext';
import {useUser} from '../hooks/ApiHooks';
import AudioPlayer from '../components/AudioPlayer';
import {SongContext} from '../contexts/SongContext';
import {mediaUrl} from '../utils/variables';

const Layout = () => {
  const theme = createTheme(themeOptions);
  const {user, setUser} = useContext(MediaContext);
  const {getUserByToken} = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const {currentSong, audioRef, progress, setProgress} =
    useContext(SongContext);
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioReady, setAudioReady] = useState(false);
  const playAnimationRef = useRef();

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

  const repeat = () => {
    setProgress(audioRef.current?.currentTime / audioRef.current?.duration);
    playAnimationRef.current = requestAnimationFrame(repeat);
  };

  useEffect(() => {
    if (currentSong) {
      setAudioUrl(currentSong ? mediaUrl + currentSong.filename : mediaUrl);
      setAudioReady(false);
      audioRef.current?.load();
      setTimeout(() => {
        audioRef.current.play();
        playAnimationRef.current = requestAnimationFrame(repeat);
        setAudioReady(true);
      }, 50);
    } else {
      cancelAnimationFrame(playAnimationRef.current);
    }
  }, [currentSong]);

  useEffect(() => {
    if (progress === 1) {
      audioRef.current.load();
    }
  }, [progress]);

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
          {currentSong &&
          audioReady &&
          !(location.pathname === '/login') &&
          !(location.pathname === '/upload') &&
          !(location.pathname === '/player') ? (
            <AudioPlayer className="audioPlayer"></AudioPlayer>
          ) : null}
          {currentSong &&
          !(location.pathname === '/login') &&
          !(location.pathname === '/upload') ? (
            <audio ref={audioRef} src={audioUrl} />
          ) : null}
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
