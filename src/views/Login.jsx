import {
  Button,
  CssBaseline,
  Grid,
  ThemeProvider,
  Typography,
  createTheme,
} from '@mui/material';
import {useState} from 'react';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import {themeOptions} from '../theme/themeOptions';

const Login = () => {
  const theme = createTheme(themeOptions);
  const [formToggle, setFormToggle] = useState(true);
  const toggle = () => {
    setFormToggle(!formToggle);
  };
  const setFormSignIn = () => {
    setFormToggle(true);
  };
  const setFormSignUp = () => {
    setFormToggle(false);
  };
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Grid container direction="column" alignItems="center" mt={5}>
        <Grid
          container
          direction="column"
          alignItems="center"
          sx={{width: '75%'}}
          gap={1}
        >
          <Grid item container direction="column" alignItems="center" gap={5}>
            <Typography component="h1" variant="h1" color="#1ed760">
              Frogify
            </Typography>
            <Grid item>
              <Button
                color={formToggle ? 'secondary' : 'primary'}
                onClick={setFormSignIn}
              >
                Sign in
              </Button>
              <Button
                color={formToggle ? 'primary' : 'secondary'}
                onClick={setFormSignUp}
              >
                Sign up
              </Button>
            </Grid>
          </Grid>
          <Grid item>
            {formToggle ? <LoginForm /> : <RegisterForm toggle={toggle} />}
          </Grid>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default Login;
