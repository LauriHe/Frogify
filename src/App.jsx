import {Route, BrowserRouter as Router, Routes} from 'react-router-dom';
import Home from './views/Home';
import Search from './views/Search';
import Upload from './views/Upload';
import Profile from './views/Profile';
import Layout from './views/Layout';
import {MediaProvider} from './contexts/MediaContext';

const App = () => {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <MediaProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </MediaProvider>
    </Router>
  );
};

export default App;
