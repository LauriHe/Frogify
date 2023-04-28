import {Box, Button, Container, TextField} from '@mui/material';
import {useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import {MediaContext} from '../contexts/MediaContext';
import {useAuthentication} from '../hooks/ApiHooks';
import useForm from '../hooks/FormHooks';

const LoginForm = () => {
  const {setUser} = useContext(MediaContext);
  const {postLogin} = useAuthentication();
  const navigate = useNavigate();

  const initValues = {
    username: '',
    password: '',
  };

  const doLogin = async () => {
    try {
      const loginResult = await postLogin(inputs);
      localStorage.setItem('userToken', loginResult.token);
      setUser(loginResult.user);
      navigate('/');
    } catch (error) {
      alert(error.message);
    }
  };

  const {inputs, handleSubmit, handleInputChange} = useForm(
    doLogin,
    initValues
  );

  return (
    <Container maxWidth="xs">
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          className="inputRounded"
          fullWidth
          margin="dense"
          name="username"
          label="Username"
          onChange={handleInputChange}
          value={inputs.username}
        />
        <TextField
          className="inputRounded"
          fullWidth
          margin="dense"
          name="password"
          type="password"
          label="Password"
          onChange={handleInputChange}
          value={inputs.password}
        />
        <Button
          color="secondary"
          fullWidth
          sx={{mt: 1, borderRadius: '10rem'}}
          variant="contained"
          type="submit"
        >
          Sign in
        </Button>
      </Box>
    </Container>
  );
};

export default LoginForm;
