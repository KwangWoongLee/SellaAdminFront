import { atom } from 'recoil';

// recoil state atom
const states = [];

const insert_recoil = (key, base) => states.push(atom({ key, default: base }));

//
insert_recoil('NAV', 0);

// common
insert_recoil('SPINEER', false);
insert_recoil('ALERT', { show: false });
insert_recoil('CONFIRM', { show: false });

// modal
insert_recoil('MODAL:LOGIN', false);
insert_recoil('MODAL:FILEUPLOAD', {
  show: false,
  url: '',
  accept: '',
  label: '',
  frm_data: {},
  title: null,
  cb: null,
  multiple: true,
});

// account
insert_recoil('CONFIG:ACCOUNT', {
  access_token: '',
  email: '',
  grade: -1,
  name: '',
});

//sella common data
insert_recoil('SELLA:CATEGORIES', {
  categories: [],
});

insert_recoil('SELLA:SELLAFORMS', {
  sella_forms: [],
});

insert_recoil('SELLA:PLATFORM', {
  platform: [],
});

insert_recoil('SELLA:AGREEMENT', {
  agreement: [],
});

export default states;
