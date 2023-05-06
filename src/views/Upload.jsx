import useForm from '../hooks/FormHooks';
import {useMedia, useTag} from '../hooks/ApiHooks';
import {Box, Button, Grid, Slider} from '@mui/material';
import {ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import {useState} from 'react';
import uploadIcon from '../assets/plus.svg';
import checkIcon from '../assets/check.svg';
import {useNavigate} from 'react-router-dom';
import {appId} from '../utils/variables';
import {uploadValidators} from '../utils/validators';

import React from 'react';
import {useEffect} from 'react';

const Upload = (props) => {
  const [image, setImage] = useState(null);
  const [audio, setAudio] = useState(null);

  const [selectedImage, setSelectedImage] = useState(
    'https://placekitten.com/600/400'
  );
  // 'https://placehold.co/600x400?text=Choose-media'
  const {postMedia} = useMedia();
  const {postTag} = useTag();
  const [editImg, setEditImg] = useState(true);
  const [editImgBtn, setEditImgBtn] = useState(true);
  const [imageIcon, setImageIcon] = useState(true);
  const [audioIcon, setAudioIcon] = useState();
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
  const toggleImgIcon = () => {
    if (imageIcon) {
      setImageIcon(false);
    } else {
      setImageIcon(true);
    }
  };

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
      dataImage.append('description', JSON.stringify(filterInputs));
      const uploadResultImage = await postMedia(dataImage, userToken);

      await postTag(
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

      await postTag(
        {
          file_id: uploadResultAudio.file_id,
          tag: appId,
        },
        userToken
      );
      navigate('/');
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
    toggleEditImgBtn;
    toggleImgIcon;
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
    setEditImgBtn(!!image);
    setImageIcon(!!image);
    setAudioIcon(!!audio);
  }, [image, audio]);
  return (
    <Grid
      columns={1}
      container
      justifyContent="center"
      alignItems={'center'}
      style={{width: '100%', marginBottom: '6rem'}}
    >
      <Grid
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
        style={{width: '100%'}}
      >
        <ValidatorForm
          style={{width: '100%'}}
          onSubmit={handleSubmit}
          noValidate
        >
          {editImg && <h3>Add Files</h3>}
          {editImg && (
            <Button variant="text" component="label" fullWidth>
              <img
                src={audioIcon ? checkIcon : uploadIcon}
                alt="upload icon"
                height={50}
              />
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
            <img
              src={imageIcon ? checkIcon : uploadIcon}
              alt="upload icon"
              height={50}
            />
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
              Edit Toggle
            </Button>
          )}

          {editImg && (
            <Grid>
              <h3>Add Song Info</h3>
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
                  height: 200,
                  objectFit: 'contain',
                  filter: `
          brightness(${filterInputs.brightness}%)
          contrast(${filterInputs.contrast}%)
          saturate(${filterInputs.saturation}%)
          sepia(${filterInputs.sepia}%)
          `,
                }}
              />
              <h4>Edit Filter</h4>
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
            sx={{mt: '1rem', borderRadius: '10rem'}}
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

export default Upload;
