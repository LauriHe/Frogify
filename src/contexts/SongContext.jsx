import React, {useState} from 'react';
import PropTypes from 'prop-types';

const SongContext = React.createContext();

const SongProvider = ({children}) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [currentSongImage, setCurrentSongImage] = useState(null);
  const [currentSongEnded, setCurrentSongEnded] = useState(true);
  return (
    <SongContext.Provider
      value={{
        currentSong,
        setCurrentSong,
        currentSongImage,
        setCurrentSongImage,
        currentSongEnded,
        setCurrentSongEnded,
      }}
    >
      {children}
    </SongContext.Provider>
  );
};

SongProvider.propTypes = {
  children: PropTypes.node,
};

export {SongContext as SongContext, SongProvider};
