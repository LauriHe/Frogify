import PropTypes from 'prop-types';
import useForm from '../hooks/FormHooks';
import {useMedia, useUser} from '../hooks/ApiHooks';
import {Box, Button, Grid} from '@mui/material';
import {Container} from '@mui/system';
import {ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import {Avatar} from '@mui/material';
import {useState} from 'react';
import uploadIcon from '../assets/plus.svg';

const submitSong = (postMedia, inputs) => {
  postMedia(inputs.image)
};

const initValues = {
  songTitle: '',
  genres: '',
  keywords: '',
  artistTags: '',
  image: undefined,
};

const Upload = () => {
  const {postMedia} = useMedia();
  const {handleSubmit, handleInputChange, inputs} = useForm(
    () => submitSong(postMedia, inputs),
    initValues
  );
  const [imageSource, setImageSource] = useState('');

  const convertToBase64 = (file) => {
    const fileReader = new FileReader();
    fileReader.onload = (frEvent) => {
      setImageSource(frEvent.target.result);
    };
    fileReader.readAsDataURL(file);
  };
  const uploadFile = (e) => {
    if (e.target.files?.length) {
      const name = e.target.name;
      console.log(name);
      const file = e.target.files[0];
      handleInputChange({
        target: {
          name,
          value: file,
        },
      });
      name === 'image' && convertToBase64(file);
    }
  };
  return (
    <Grid columns={1}>
      <ValidatorForm onSubmit={handleSubmit} noValidate>
      <h3>Add Files</h3>
      
        <Button variant="text" component="label">
        <img src={uploadIcon} alt="home icon" height={50} />
          Upload Audio
          <input
            hidden
            accept="audio/*"
            multiple
            type="file"
            name="audioFile"
            onChange={uploadFile}
          />
        </Button>
        <Button variant="text" component="label">
          <img src={imageSource} height={50} />
          Upload Image
          <input
            hidden
            accept="image/*"
            multiple
            type="file"
            name="image"
            onChange={uploadFile}
          />
          
        </Button>
        
        <h3>Add Song Info</h3>
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
