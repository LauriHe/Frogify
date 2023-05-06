import PropTypes from 'prop-types';
import useForm from '../hooks/FormHooks';
import {useUser} from '../hooks/ApiHooks';
import {Button} from '@mui/material';
import {Container} from '@mui/system';
import {ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import {registerForm} from '../utils/errorMessages';
import {registerValidators} from '../utils/validators';
import {useEffect} from 'react';

const RegisterForm = ({toggle}) => {
  const {postUser, getCheckUser} = useUser();

  const initValues = {
    username: '',
    password: '',
    confirm: '',
    email: '',
  };

  const doRegister = async () => {
    try {
      const withoutConfirm = {...inputs};
      delete withoutConfirm.confirm;
      withoutConfirm.full_name = JSON.stringify({
        following: [],
        history: [],
      });
      const userResult = await postUser(withoutConfirm);
      alert(userResult.message);
      toggle();
    } catch (error) {
      alert(error.message);
    }
  };

  const {inputs, handleSubmit, handleInputChange} = useForm(
    doRegister,
    initValues
  );

  useEffect(() => {
    ValidatorForm.addValidationRule(
      'isPasswordMatch',
      (value) => value === inputs.password
    );
    ValidatorForm.addValidationRule('isUsernameAvailable', async (value) => {
      return await getCheckUser(inputs.username);
    });
  }, [inputs]);

  return (
    <Container maxWidth="xs">
      <ValidatorForm onSubmit={handleSubmit} noValidate>
        <TextValidator
          className="inputRounded"
          fullWidth
          margin="dense"
          name="username"
          label="Username"
          autoCapitalize="none"
          value={inputs.username}
          onChange={handleInputChange}
          validators={registerValidators.username}
          errorMessages={registerForm.username}
        />
        <TextValidator
          className="inputRounded"
          fullWidth
          margin="dense"
          name="password"
          type="password"
          label="Password"
          autoCapitalize="none"
          onChange={handleInputChange}
          value={inputs.password}
          validators={registerValidators.password}
          errorMessages={registerForm.password}
        />
        <TextValidator
          className="inputRounded"
          fullWidth
          margin="dense"
          name="confirm"
          type="password"
          label="Confirm password"
          autoCapitalize="none"
          onChange={handleInputChange}
          value={inputs.confirm}
          validators={registerValidators.confirm}
          errorMessages={registerForm.confirm}
        />
        <TextValidator
          className="inputRounded"
          fullWidth
          margin="dense"
          name="email"
          type="email"
          label="Email"
          autoCapitalize="none"
          onChange={handleInputChange}
          value={inputs.email}
          validators={registerValidators.email}
          errorMessages={registerForm.email}
        />
        <Button
          color="secondary"
          fullWidth
          sx={{mt: 1, borderRadius: '10rem'}}
          variant="contained"
          type="submit"
        >
          Sign up
        </Button>
      </ValidatorForm>
    </Container>
  );
};

RegisterForm.propTypes = {
  toggle: PropTypes.func,
};

export default RegisterForm;
