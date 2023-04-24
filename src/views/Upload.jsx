import PropTypes from 'prop-types';
import useForm from '../hooks/FormHooks';
import {useUser} from '../hooks/ApiHooks';
import {Button, Grid} from '@mui/material';
import {Container} from '@mui/system';
import {ValidatorForm, TextValidator} from 'react-material-ui-form-validator';

const submitSong = (inputs) => {
  console.log(inputs);
};

const initValues = {
  songTitle: '',
  genres: '',
  keywords: '',
  artistTags: '',
  image: undefined,
};

const Upload = () => {
  const {handleSubmit, handleInputChange, inputs} = useForm(
    () => submitSong(inputs),
    initValues
  );

  const uploadImage = (e) => {
    console.log(e.target.files)
    const fileReader = new FileReader();
    fileReader.onload = (frEvent) => {
      console.log(frEvent.target.result);
      handleInputChange({
        target: {
          name: "image",
          value: frEvent.target.result
        }
      })
    }
    if(e.target.files) {
      fileReader.readAsDataURL(e.target.files[0])
    }
  }

  return (
    <Grid>
      <ValidatorForm onSubmit={handleSubmit} noValidate>
        <Button variant="contained" component="label">
          Upload
          <input
            hidden
            accept="audio/*"
            multiple
            type="file"
            name="audioFile"
            onChange={handleInputChange}
          />
        </Button>
        <Button variant="contained" component="label">
          Upload
          <input
            hidden
            accept="image/*"
            multiple
            type="file"
            name="image"
            onChange={uploadImage}
          />
        </Button>
        <TextValidator
          className="inputRounded"
          fullWidth
          margin="dense"
          name="songTitle"
          label="Song Title"
          onChange={handleInputChange}
          value={inputs.songTitle}
        />
        <TextValidator
          className="inputRounded"
          fullWidth
          margin="dense"
          name="genres"
          label="genres"
          onChange={handleInputChange}
          value={inputs.genres}
        />
        <TextValidator
          className="inputRounded"
          fullWidth
          margin="dense"
          name="keywords"
          label="Keywords"
          onChange={handleInputChange}
          value={inputs.keywords}
        />
        <TextValidator
          className="inputRounded"
          fullWidth
          margin="dense"
          name="artistTags"
          label="Tag other artists!"
          onChange={handleInputChange}
          value={inputs.artistTags}
        />
        <Button
          color="secondary"
          fullWidth
          sx={{mt: 1, borderRadius: '10rem'}}
          variant="contained"
          type="submit"
        >
          Submit
        </Button>
      </ValidatorForm>
    </Grid>
  );
};

export default Upload;
