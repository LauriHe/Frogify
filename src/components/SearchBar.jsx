import {Container, InputAdornment, TextField} from '@mui/material';
import {useState} from 'react';
import SearchIcon from '../assets/search.svg';

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Container sx={{mt: 3, width: '100%'}}>
      <TextField
        id="search"
        type="search"
        label="Search"
        value={searchTerm}
        onChange={handleChange}
        sx={{width: '100%'}}
        InputProps={{
          startAdornment: (
            <InputAdornment sx={{mr: 2}}>
              <img src={SearchIcon} alt="search icon" height={30} />
            </InputAdornment>
          ),
        }}
      />
    </Container>
  );
}
