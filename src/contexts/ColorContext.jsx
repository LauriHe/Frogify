import React, {useState} from 'react';
import PropTypes from 'prop-types';

const ColorContext = React.createContext();

// Variables for the application theme color picker
// The variables are used to set various element's colors in the application
const ColorProvider = ({children}) => {
  const [colorHue, setColorHue] = useState(141);
  const [colorSaturation, setColorSaturation] = useState(76);
  const [colorLuminance, setColorLuminance] = useState(48);
  return (
    <ColorContext.Provider
      value={{
        colorHue,
        setColorHue,
        colorSaturation,
        setColorSaturation,
        colorLuminance,
        setColorLuminance,
      }}
    >
      {children}
    </ColorContext.Provider>
  );
};

ColorProvider.propTypes = {
  children: PropTypes.node,
};

export {ColorContext, ColorProvider};
