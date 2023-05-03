const registerValidators = {
  username: [
    'required',
    'minStringLength:3',
    'isUsernameAvailable',
    'maxStringLength:40',
  ],
  password: ['required', 'minStringLength:5'],
  confirm: ['required', 'isPasswordMatch'],
  email: ['required', 'isEmail'],
  full_name: ['matchRegexp:^(.{2,})?$'],
};

const loginValidators = {
  username: ['required'],
  password: ['required'],
};

const uploadValidators = {
  songTitle: ['required', 'maxStringLength:30'],
  genres: ['required', 'maxStringLength:40'],
  keywords: ['required', 'maxStringLength:40'],
  artistTags: ['maxStringLength:40'],
};

export {registerValidators, loginValidators, uploadValidators};
