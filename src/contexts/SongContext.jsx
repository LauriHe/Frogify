import React, {useRef, useState} from 'react';
import PropTypes from 'prop-types';

const SongContext = React.createContext();

const SongProvider = ({children}) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [currentSongImage, setCurrentSongImage] = useState(null);
  const [progress, setProgress] = useState(null);
  const [bgColor, setBgColor] = useState(null);
  const [textColor, setTextColor] = useState(null);
  const audioRef = useRef();

  return (
    <SongContext.Provider
      value={{
        currentSong,
        setCurrentSong,
        currentSongImage,
        setCurrentSongImage,
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
