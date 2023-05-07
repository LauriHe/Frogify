import {useEffect, useState} from 'react';
import MediaTableSearch from '../components/MediaTableSearch';
import {Container, InputAdornment, TextField} from '@mui/material';
import SearchIcon from '../assets/search.svg';
import {useMedia} from '../hooks/ApiHooks';

const Search = () => {
  const {mediaArray} = useMedia();
  const audioArray = mediaArray.filter((item) => item.media_type === 'audio');
  audioArray.reverse();
  const [searchArray, setSearchArray] = useState(audioArray);

  // Handle search term change
  const handleChange = (event) => {
    const searchTerm = event.target.value;
    if (searchTerm === '') {
      setSearchArray(audioArray); // If search term is empty, show all audio files
    } else {
      const filteredArray = audioArray.filter((file) => {
        return file.title.toLowerCase().includes(searchTerm.toLowerCase()); // Search for files that contain the search term in the title
      });
      setSearchArray(filteredArray);
    }
  };

  useEffect(() => {
    // Show all files by default
    setSearchArray(
      mediaArray.filter((item) => item.media_type === 'audio').reverse()
    );
  }, [mediaArray]);

  return (
    <>
      <Container sx={{mt: 3, width: '100%'}}>
        <TextField
          id="search"
          type="search"
          label="Search"
          onChange={handleChange}
          sx={{width: '100%'}}
          InputProps={{
            startAdornment: (
              <InputAdornment sx={{mr: 2}} position="start">
                <img src={SearchIcon} alt="search icon" height={30} />
              </InputAdornment>
            ),
          }}
        />
      </Container>
      <MediaTableSearch
        searchArray={searchArray}
        mediaArray={mediaArray}
      ></MediaTableSearch>
    </>
  );
};

export default Search;
