import React, {useState} from 'react';
import PropTypes from 'prop-types';

const MediaContext = React.createContext();

// Variables to store the logged in user and the user's storage
// The user storage includes followed users and play history
const MediaProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [userStorage, setUserStorage] = useState([]);
  return (
    <MediaContext.Provider value={{user, setUser, userStorage, setUserStorage}}>
      {children}
    </MediaContext.Provider>
  );
};

MediaProvider.propTypes = {
  children: PropTypes.node,
};

export {MediaContext, MediaProvider};
