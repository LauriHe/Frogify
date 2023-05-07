import React, {useRef, useState} from 'react';
import PropTypes from 'prop-types';

const SongContext = React.createContext();

// Variables for the current song being played
const SongProvider = ({children}) => {
  const [currentSong, setCurrentSong] = useState(null); // The current song being played
  const [currentSongImage, setCurrentSongImage] = useState(null); // The current song's image
  const [imageFilters, setImageFilters] = useState(null); // Possible filters for the current song's image
  const [progress, setProgress] = useState(null); // Timestamp of the current song's progress
  const [bgColor, setBgColor] = useState(null); // Background color picked from the current song's image
  const [textColor, setTextColor] = useState(null); // Correct text color to use with the background color
  const audioRef = useRef(); // Reference to the audio element

  return (
    <SongContext.Provider
      value={{
        currentSong,
        setCurrentSong,
        currentSongImage,
        setCurrentSongImage,
        imageFilters,
        setImageFilters,
        progress,
        setProgress,
        bgColor,
        setBgColor,
        textColor,
        setTextColor,
        audioRef,
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
