import React, {useState} from 'react';
import PropTypes from 'prop-types';

const SongContext = React.createContext();

const SongProvider = ({children}) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [currentSongLength, setCurrentSongLength] = useState(0);
  const [currentSongPlaying, setCurrentSongPlaying] = useState(false);
  const [currentSongImage, setCurrentSongImage] = useState(null);
  const [currentSongTime, setCurrentSongTime] = useState(0);
  const [currentSongEnded, setCurrentSongEnded] = useState(true);
  return (
    <SongContext.Provider
      value={{
        currentSong,
        setCurrentSong,
        currentSongLength,
        setCurrentSongLength,
        currentSongPlaying,
        setCurrentSongPlaying,
        currentSongImage,
        setCurrentSongImage,
        currentSongTime,
        setCurrentSongTime,
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
