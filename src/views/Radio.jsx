import {Button} from '@mui/material';
import {RadioBrowserApi} from 'radio-browser-api';
import {useEffect, useRef, useState} from 'react';

const Radio = () => {
  const api = new RadioBrowserApi('My Radio App');
  /* https://stream.radioplay.fi/nrj/nrj_64.aac?direct=true&listenerid=undefined&aw_0_1st.bauer_listenerid=undefined&aw_0_1st.playerid=BMUK_inpage_html5&aw_0_1st.skey=1683025260&aw_0_1st.bauer_loggedin=false */
  const [stationUrl, setStationUrl] = useState(
    'https://icecast.synthwaveradio.eu:8000/live?nocache=122809'
  );
  const audioRef = useRef();

  const fetchStations = async () => {
    const stations = await api.searchStations({
      countryCode: 'FI',
      limit: 500,
      offset: 0,
    });
    console.log(
      'getStations ~ stations:',
      stations
        .map((s) => ({name: s.name, url: s.urlResolved}))
        .filter((s) => !s.url.includes('m3u8'))
    );
  };

  const toggleAudio = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  };

  useEffect(() => {
    fetchStations();
    audioRef.current.volume = 0.5;
    audioRef.current.load();
  }, []);

  return (
    <>
      <audio ref={audioRef} src={stationUrl} />
      <Button onClick={toggleAudio}>play</Button>
    </>
  );
};

export default Radio;
