import {ToggleButton, ToggleButtonGroup} from '@mui/material';
import MediaTable from '../components/MediaTable';
import {useState} from 'react';

const Home = () => {
  const [showedPosts, setShowedPosts] = useState('all');

  // Show all posts or only the followed ones
  const handleChange = (event, newValue) => {
    setShowedPosts(newValue);
  };

  return (
    <>
      <ToggleButtonGroup
        color="primary"
        value={showedPosts}
        exclusive
        onChange={handleChange}
        aria-label="Platform"
        fullWidth
      >
        <ToggleButton value="all">All posts</ToggleButton>
        <ToggleButton value="followed">Followed</ToggleButton>
      </ToggleButtonGroup>
      <MediaTable showedPosts={showedPosts}></MediaTable>
    </>
  );
};

export default Home;
