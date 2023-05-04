import useForm from '../hooks/FormHooks';
import {useMedia} from '../hooks/ApiHooks';
import {Box, Button, Grid, Slider} from '@mui/material';
import {ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import {useEffect, useState} from 'react';
import {uploadValidators} from '../utils/validators';
import {useLocation, useNavigate} from 'react-router-dom';

import React from 'react';
import {mediaUrl} from '../utils/variables';

const Update = (props) => {
  const {state} = useLocation();
  const file = state.file;
  /* console.log(id); */
  // 'https://placehold.co/600x400?text=Choose-media'
  const {putMedia, mediaArray} = useMedia();
  const image = mediaArray.filter(
    (img) =>
      img.media_type === 'image' &&
      img.file_id === JSON.parse(file.description).imageId
  );
  const [selectedImage, setSelectedImage] = useState();
  const [editImg, setEditImg] = useState(true);
  const navigate = useNavigate();
  const toggleEditImg = () => {
    if (editImg) {
      setSelectedImage(mediaUrl + image.pop()?.filename);
      setEditImg(false);
    } else {
      setEditImg(true);
    }
  };
  console.log(selectedImage);
  useEffect(() => {
    setSelectedImage(mediaUrl + image.pop()?.filename);
  }, [image]);
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
      const dataImage = {
        title: inputs.songTitle,
        description: JSON.stringify(filterInputs),
      };
      const uploadResultImage = await putMedia(
        JSON.parse(file.description).imageId,
        dataImage,
        userToken
      );
      console.log(uploadResultImage);

      const allDataAudio = {
        genres: inputs.genres,
        keywords: inputs.keywords,
        artistTags: inputs.artistTags,
        imageId: JSON.parse(file.description).imageId,
      };
      const dataAudio = {
        title: inputs.songTitle,
        description: JSON.stringify(allDataAudio),
      };

      console.log(dataAudio);
      const uploadResultAudio = await putMedia(
        file.file_id,
        dataAudio,
        userToken
      );

      console.log(uploadResultAudio);
      navigate('/');
    } catch (error) {
      /* alert(error.message); */
      console.log(error);
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
    <Grid
      sx={{width: '100%'}}
      columns={1}
      container
      justifyContent="center"
      alignItems={'center'}
    >
      <Grid
        style={{width: '100%'}}
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <ValidatorForm
          style={{width: '100%'}}
          onSubmit={handleSubmit}
          noValidate
        >
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
            Edit Toggle
          </Button>
          {editImg && (
            <Grid sx={{width: '100%'}}>
              <h3>Edit Song Info</h3>
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
            </Grid>
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
              <Grid container alignItems={'center'} gap={2}>
                <Slider
                  sx={{width: '60%'}}
                  name="brightness"
                  min={0}
                  max={200}
                  step={1}
                  valueLabelDisplay="off"
                  aria-label="Brightness"
                  onChange={handleFilterChange}
                  value={filterInputs.brightness}
                />
                <p style={{width: 'auto'}}>Brighness</p>
              </Grid>
              <Grid container alignItems={'center'} gap={2}>
                <Slider
                  sx={{width: '60%'}}
                  name="contrast"
                  label="contrast"
                  min={0}
                  max={200}
                  step={1}
                  valueLabelDisplay="off"
                  aria-label="Contrast"
                  onChange={handleFilterChange}
                  value={filterInputs.contrast}
                />
                <p style={{width: 'auto'}}>Contrast</p>
              </Grid>
              <Grid container alignItems={'center'} gap={2}>
                <Slider
                  sx={{width: '60%'}}
                  name="saturation"
                  min={0}
                  max={200}
                  step={1}
                  valueLabelDisplay="off"
                  aria-valuetext="Saturation"
                  aria-label="Saturation"
                  onChange={handleFilterChange}
                  value={filterInputs.saturation}
                />
                <p style={{width: 'auto'}}>Saturation</p>
              </Grid>
              <Grid container alignItems={'center'} gap={2}>
                <Slider
                  sx={{width: '60%'}}
                  name="sepia"
                  min={0}
                  max={100}
                  step={1}
                  valueLabelDisplay="off"
                  aria-label="Sepia"
                  onChange={handleFilterChange}
                  value={filterInputs.sepia}
                />
                <p style={{width: 'auto'}}>Sepia</p>
              </Grid>
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
      </Grid>
    </Grid>
  );
};

export default Update;
