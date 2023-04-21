import {useEffect, useState} from 'react';
import MediaTableSearch from '../components/MediaTableSearch';
import {Container, InputAdornment, TextField} from '@mui/material';
import SearchIcon from '../assets/search.svg';
import {useMedia} from '../hooks/ApiHooks';

const Search = () => {
  const {mediaArray} = useMedia();
  const [searchArray, setSearchArray] = useState(mediaArray);

  const handleChange = (event) => {
    const searchTerm = event.target.value;
    if (searchTerm === '') {
      setSearchArray(mediaArray);
    } else {
      const filteredArray = mediaArray.filter((file) => {
        return file.title.toLowerCase().includes(searchTerm.toLowerCase());
      });
      setSearchArray(filteredArray);
    }
  };

  useEffect(() => {
    setSearchArray(mediaArray);
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
      <MediaTableSearch searchArray={searchArray}></MediaTableSearch>
    </>
  );
};

export default Search;
