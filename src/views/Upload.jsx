import PropTypes from 'prop-types';
import useForm from '../hooks/FormHooks';
import {useMedia, useTag, useUser} from '../hooks/ApiHooks';
import {Box, Button, Grid} from '@mui/material';
import {Container} from '@mui/system';
import {ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import {Avatar} from '@mui/material';
import {useState} from 'react';
import uploadIcon from '../assets/plus.svg';
import {useNavigate} from 'react-router-dom';
import {appId} from '../utils/variables';

const Upload = (props) => {
  const [image, setImage] = useState(null);
  const [audio, setAudio] = useState(null);
  const [selectedImage, setSelectedImage] = useState(
    'https://placekitten.com/600/400'
  );
  // 'https://placehold.co/600x400?text=Choose-media'
  const {postMedia, mediaArray} = useMedia();
  const {postTag, getTag} = useTag();

  const navigate = useNavigate();

  const initValues = {
    songTitle: '',
    genres: '',
    keywords: '',
    artistTags: '',
  };

  const filterInitValues = {
    brightness: 100,
    contrast: 100,
    saturation: 100,
    sepia: 0,
  };

  const doUpload = async () => {
    try {
      const userToken = localStorage.getItem('userToken');
      const dataImage = new FormData();
      dataImage.append('title', inputs.songTitle);
      dataImage.append('file', image);
      console.log('NO HERE! DUMMY');
      const uploadResultImage = await postMedia(dataImage, userToken);

      const tagResultImage = await postTag(
        {
          file_id: uploadResultImage.file_id,
          tag: appId,
        },
        userToken
      );
      const dataAudio = new FormData();
      dataAudio.append('title', inputs.songTitle);
      const allDataAudio = {
        genres: inputs.genres,
        keywords: inputs.keywords,
        artistTags: inputs.artistTags,
        imageId: uploadResultImage.file_id,
      };
      dataAudio.append('description', JSON.stringify(allDataAudio));
      dataAudio.append('file', audio);

      const uploadResultAudio = await postMedia(dataAudio, userToken);

      const tagResultAudio = await postTag(
        {
          file_id: uploadResultAudio.file_id,
          tag: appId,
        },
        userToken
      );
      console.log(uploadResultAudio);
      navigate('/home');
    } catch (error) {
      alert(error.message);
    }
  };

  const handleFileChange = (event) => {
    event.persist();
    if (event.target.name == 'audio') {
      setAudio(event.target.files[0]);
    } else {
      setImage(event.target.files[0]);
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setSelectedImage(reader.result);
      });
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const {inputs, handleSubmit, handleInputChange} = useForm(
    doUpload,
    initValues
  );

  const {inputs: filterInputs, handleInputChange: handleFilterChange} = useForm(
    null,
    filterInitValues
  );

  return (
    <Grid columns={1}>
      <ValidatorForm onSubmit={handleSubmit} noValidate>
        <h3>Add Files</h3>

        <Button variant="text" component="label" fullWidth>
          <img src={uploadIcon} alt="home icon" height={50} />
          Upload Audio
          <input
            hidden
            accept="audio/*"
            multiple
            type="file"
            name="audio"
            onChange={handleFileChange}
          />
        </Button>
        <Button variant="text" component="label" fullWidth>
          <img src={selectedImage} height={50} />
          Upload Image
          <input
            hidden
            accept="image/*"
            multiple
            type="file"
            name="image"
            onChange={handleFileChange}
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
