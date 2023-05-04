import {
  AppBar,
  Avatar,
  BottomNavigation,
  BottomNavigationAction,
  Container,
  CssBaseline,
  Grid,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme,
} from '@mui/material';
// import {themeOptions} from '../theme/themeOptions';
import {Link, Outlet, useLocation, useNavigate} from 'react-router-dom';
import logo from '../assets/frogify.svg';
import homeIcon from '../assets/home.svg';
import searchIcon from '../assets/search.svg';
import uploadIcon from '../assets/plus.svg';
import radioIcon from '../assets/radio.svg';
import profileIcon from '../assets/person.svg';
import {useContext, useEffect, useRef, useState} from 'react';
import {MediaContext} from '../contexts/MediaContext';
import {useUser} from '../hooks/ApiHooks';
import AudioPlayer from '../components/AudioPlayer';
import {SongContext} from '../contexts/SongContext';
import {mediaUrl} from '../utils/variables';
import {ColorContext} from '../contexts/ColorContext';

const Layout = () => {
  // const theme = createTheme(themeOptions);
  const {user, setUser, setUserStorage} = useContext(MediaContext);
  const {getUserByToken} = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const {currentSong, audioRef, progress, setProgress} =
    useContext(SongContext);
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioReady, setAudioReady] = useState(false);
  const playAnimationRef = useRef();

  const {
    colorHue,
    colorSaturation,
    colorLuminance,
    setColorHue,
    setColorSaturation,
    setColorLuminance,
  } = useContext(ColorContext);

  const theme = createTheme({
    palette: {
      primary: {
        main: '#ffffff',
      },
      secondary: {
        main: `hsl(${colorHue}, ${colorSaturation}%, ${colorLuminance}%)`,
      },
      mode: 'dark',
    },
  });

  const navigateHome = () => {
    navigate('/');
  };

  const getUserInfo = async () => {
    const userToken = localStorage.getItem('userToken');
    if (userToken) {
      const userData = await getUserByToken(userToken);
      if (userData) {
        setUser(userData);
        const storage = JSON.parse(userData.full_name);
        setUserStorage(storage);
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
      if (currentSong.type) {
        setAudioUrl(currentSong.url);
      } else {
        setAudioUrl(currentSong ? mediaUrl + currentSong.filename : mediaUrl);
      }
      setAudioReady(false);
      audioRef.current?.load();
      setTimeout(() => {
        audioRef.current.play();
        if (currentSong.type) {
          audioRef.current.volume = 0.2;
        }
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
  }, [user?.full_name]);

  useEffect(() => {
    const colors = localStorage.getItem('color');
    setColorHue(colors ? JSON.parse(colors).hue : 141);
    setColorSaturation(colors ? JSON.parse(colors).saturation : 76);
    setColorLuminance(colors ? JSON.parse(colors).luminance : 48);
  }, []);

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container
          maxWidth={
            location.pathname === '/player' ||
            location.pathname === '/upload' ||
            location.pathname === '/update'
              ? 'sm'
              : 'xl'
          }
        >
          <AppBar position="fixed">
            <Toolbar disableGutters>
              <Avatar
                alt="Frogify logo"
                src={logo}
                sx={{mx: 1}}
                onClick={navigateHome}
              />
              <Typography variant="h4" color="secondary" onClick={navigateHome}>
                Frogify
              </Typography>
            </Toolbar>
          </AppBar>
          <main
            style={
              location.pathname === '/'
                ? {marginTop: '3.5rem'}
                : {marginTop: '4.5rem'}
            }
          >
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
          <Grid container justifyContent="center">
            <BottomNavigation
              showLabels
              sx={{width: '100%', position: 'fixed', bottom: '0'}}
            >
              <BottomNavigationAction
                component={Link}
                to={user ? '/' : '/login'}
                label="home"
                value="home"
                icon={<img src={homeIcon} alt="home icon" width="40rem" />}
              />
              <BottomNavigationAction
                component={Link}
                to={user ? 'search' : '/login'}
                label="search"
                value="search"
                icon={<img src={searchIcon} alt="search icon" width="40rem" />}
              />
              <BottomNavigationAction
                component={Link}
                to={user ? 'upload' : '/login'}
                label="upload"
                value="upload"
                icon={<img src={uploadIcon} alt="upload icon" width="40rem" />}
              />
              <BottomNavigationAction
                component={Link}
                to={user ? 'radio' : '/login'}
                label="radio"
                value="radio"
                icon={<img src={radioIcon} alt="radio icon" width="40rem" />}
              />
              <BottomNavigationAction
                component={Link}
                to={user ? 'profile' : '/login'}
                label="profile"
                value="profile"
                icon={
                  <img src={profileIcon} alt="profile icon" width="40rem" />
                }
              />
            </BottomNavigation>
          </Grid>
        </Container>
      </ThemeProvider>
    </>
  );
};

export default Layout;
