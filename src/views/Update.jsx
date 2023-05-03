import PropTypes from 'prop-types';
import {useParams} from 'react-router-dom';
import useForm from '../hooks/FormHooks';
import {useMedia, useTag, useUser} from '../hooks/ApiHooks';
import {Box, Button, Grid, Slider} from '@mui/material';
import {Container} from '@mui/system';
import {ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import {useState} from 'react';
import uploadIcon from '../assets/plus.svg';
import {appId} from '../utils/variables';
import {uploadValidators} from '../utils/validators';
import {useLocation, useNavigate} from 'react-router-dom';

import React from 'react';
import {useEffect} from 'react';

const Update = (props) => {
  const [image, setImage] = useState(null);
  const [audio, setAudio] = useState(null);
  const {state} = useLocation();
  const file = state.file;
  const {id} = useParams();
  /* console.log(id); */

  const [selectedImage, setSelectedImage] = useState(
    'https://placekitten.com/600/400'
  );
  // 'https://placehold.co/600x400?text=Choose-media'
  const {putMedia} = useMedia();
  const {postTag, getTag} = useTag();
  const [editImg, setEditImg] = useState(true);
  const [editImgBtn, setEditImgBtn] = useState(true);
  const [initialFile, setInitialFile] = useState();
  const navigate = useNavigate();
  const toggleEditImg = () => {
    if (editImg) {
      setEditImg(false);
    } else {
      setEditImg(true);
    }
  };
  const toggleEditImgBtn = () => {
    if (editImgBtn) {
      setEditImgBtn(false);
    } else {
      setEditImgBtn(true);
    }
  };
  dataA;
  console.log(file);
  const initValues = {
    songTitle: file.title,
    genres: JSON.parse(file.description).genres,
    keywords: JSON.parse(file.description).keywords,
    artistTags: JSON.parse(file.description).artistTags,
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
      dataImage.append('description', JSON.stringify(filterInputs));
      /* const uploadResultImage = await putMedia(
        JSON.parse(file.description).imageId,
        dataImage,
        userToken
      ); */

      const dataAudio = new FormData();
      dataAudio.append('title', inputs.songTitle);
      const allDataAudio = {
        genres: inputs.genres,
        keywords: inputs.keywords,
        artistTags: inputs.artistTags,
        imageId: JSON.parse(file.description).imageId,
      };

      dataAudio.append('description', JSON.stringify(allDataAudio));

      const uploadResultAudio = await putMedia(
        file.file_id,
        dataAudio,
        userToken
      );

      console.log(uploadResultAudio);
      navigate('/home');
    } catch (error) {
      /* alert(error.message); */
      console.log(error);
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
    toggleEditImgBtn;
  };

  const {inputs, handleSubmit, handleInputChange} = useForm(
    doUpload,
    initValues
  );

  const {inputs: filterInputs, handleInputChange: handleFilterChange} = useForm(
    null,
    filterInitValues
  );

  useEffect(() => {
    setEditImgBtn(!editImgBtn);
  }, [image]);

  return (
    <Grid columns={1}>
      <Box
        sx={{
          marginLeft: '3rem',
          marginRight: '3rem',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <ValidatorForm onSubmit={handleSubmit} noValidate>
          <h3>Add Files</h3>

          {editImg && (
            <Button variant="text" component="label" fullWidth>
              <img src={uploadIcon} alt="upload icon" height={50} />
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
          )}
          <Button variant="text" component="label" fullWidth>
            <img src={uploadIcon} alt="upload icon" height={50} />
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
          {editImgBtn && (
            <Button
              id="editBtn"
              color="secondary"
              hidden
              sx={{
                mt: 1,
                borderRadius: '10rem',
                left: '50%',
                transform: 'translate(-50%)',
              }}
              variant="text"
              onClick={toggleEditImg}
            >
              Edit Image
            </Button>
          )}
          {editImg && (
            <Box>
              <h3 margin="dense">Add Song Info</h3>

              <TextValidator
                className="inputRounded"
                fullWidth
                margin="dense"
                name="songTitle"
                label="Song Title"
                onChange={handleInputChange}
                value={inputs.songTitle}
                validators={uploadValidators.songTitle}
                variant="standard"
              />
              <TextValidator
                className="inputRounded"
                fullWidth
                margin="dense"
                name="genres"
                label="genres"
                onChange={handleInputChange}
                value={inputs.genres}
                validators={uploadValidators.genres}
                variant="standard"
              />
              <TextValidator
                className="inputRounded"
                fullWidth
                margin="dense"
                name="keywords"
                label="Keywords"
                onChange={handleInputChange}
                value={inputs.keywords}
                validators={uploadValidators.keywords}
                variant="standard"
              />
              <TextValidator
                className="inputRounded"
                fullWidth
                margin="dense"
                name="artistTags"
                label="Tag other artists!"
                onChange={handleInputChange}
                value={inputs.artistTags}
                validators={uploadValidators.artistTags}
                variant="standard"
                sx={{marginBottom: '2rem'}}
              />
            </Box>
          )}
          {!editImg && (
            <Box>
              <img
                src={selectedImage}
                alt="preview"
                style={{
                  width: '100%',
                  height: 400,
                  objectFit: 'contain',
                  filter: `
          brightness(${filterInputs.brightness}%)
          contrast(${filterInputs.contrast}%)
          saturate(${filterInputs.saturation}%)
          sepia(${filterInputs.sepia}%)
          `,
                }}
              />
              <Slider
                name="brightness"
                min={0}
                max={200}
                step={1}
                valueLabelDisplay="auto"
                onChange={handleFilterChange}
                value={filterInputs.brightness}
              />

              <Slider
                name="contrast"
                min={0}
                max={200}
                step={1}
                valueLabelDisplay="auto"
                onChange={handleFilterChange}
                value={filterInputs.contrast}
              />
              <Slider
                name="saturation"
                min={0}
                max={200}
                step={1}
                valueLabelDisplay="auto"
                onChange={handleFilterChange}
                value={filterInputs.saturation}
              />
              <Slider
                name="sepia"
                min={0}
                max={100}
                step={1}
                valueLabelDisplay="auto"
                onChange={handleFilterChange}
                value={filterInputs.sepia}
              />
            </Box>
          )}
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
      </Box>
    </Grid>
  );
};

export default Update;
