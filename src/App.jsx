import {Route, BrowserRouter as Router, Routes} from 'react-router-dom';
import {MediaProvider} from './contexts/MediaContext';
import './style.scss';
import Home from './views/Home';
import Search from './views/Search';
import Upload from './views/Upload';
import Profile from './views/Profile';
import Layout from './views/Layout';
import Login from './views/Login';
import {SongProvider} from './contexts/SongContext';
import Player from './views/Player';
import Radio from './views/Radio';
import Update from './views/update';

const App = () => {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <MediaProvider>
        <SongProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/update" element={<Update />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/player" element={<Player />} />
              <Route path="/radio" element={<Radio />} />
            </Route>
          </Routes>
        </SongProvider>
      </MediaProvider>
    </Router>
  );
};

export default App;
