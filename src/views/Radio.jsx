import {RadioBrowserApi} from 'radio-browser-api';
import {useEffect} from 'react';
import MediaTableRadio from '../components/MediaTableRadio';
import {radioList} from '../utils/variables';

const Radio = () => {
  const api = new RadioBrowserApi('My Radio App');
  /* https://stream.radioplay.fi/nrj/nrj_64.aac?direct=true&listenerid=undefined&aw_0_1st.bauer_listenerid=undefined&aw_0_1st.playerid=BMUK_inpage_html5&aw_0_1st.skey=1683025260&aw_0_1st.bauer_loggedin=false */

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

  useEffect(() => {
    // fetchStations();
  }, []);

  return (
    <>
      <MediaTableRadio radioList={radioList}></MediaTableRadio>
    </>
  );
};

export default Radio;
