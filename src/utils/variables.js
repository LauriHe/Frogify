const baseUrl = 'https://media.mw.metropolia.fi/wbma/';
const mediaUrl = baseUrl + 'uploads/';
const appId = 'lNL5UGRCF9FBg4r8KBKu';
const radioList = [
  {
    title: 'Sea FM',
    url: 'https://s3.myradiostream.com/:4976/listen.mp3?nocache=1683029766',
    logo: './seaFmLogo.jpg',
    type: 'radio',
  },
  {
    title: 'Synthwave Radio',
    url: 'https://icecast.synthwaveradio.eu:8000/live?nocache=122809',
    logo: './synthwaveRadioLogo.png',
    type: 'radio',
  },
  {
    title: 'Radio Sandels',
    url: 'http://suomiradio.pro:8080/stream/1/',
    logo: './sandels.png',
    type: 'radio',
  },
  {
    title: 'YLE Puhe',
    url: 'https://icecast.live.yle.fi/radio/YlePuhe/icecast.audio',
    logo: './ylePuheLogo.png',
    type: 'radio',
  },
  {
    title: 'YleX',
    url: 'https://icecast.live.yle.fi/radio/YleX/icecast.audio',
    logo: './ylexLogo.png',
    type: 'radio',
  },
];

export {baseUrl, mediaUrl, appId, radioList};
