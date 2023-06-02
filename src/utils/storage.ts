const storageKeyUser = 'user';
const storageKeyQueryData = 'queryData';

function setUser(user: API.User | undefined) {
  localStorage.setItem(storageKeyUser, JSON.stringify(user));
}

function getUser(): API.User {
  let userJsonStr = localStorage.getItem(storageKeyUser);
  if (userJsonStr === null) {
    userJsonStr = '{}';
  }

  return JSON.parse(userJsonStr);
}

function cleanUser() {
  localStorage.setItem(storageKeyUser, '{}');
}

function getToken() {
  const token = getUser().token;

  return token ? token : '';
}

function storeQueryData(value: any) {
  localStorage.setItem(storageKeyQueryData, JSON.stringify(value));
}

function getQueryDataFromLocalStore() {
  const dataJsonStr = localStorage.getItem(storageKeyQueryData);
  if (!dataJsonStr || dataJsonStr == '') {
    return null;
  }

  let data = null;
  try {
    data = JSON.parse(dataJsonStr);
  } catch (err) {
    cleanQueryDataToLocalStore();
  }

  return data;
}

function cleanQueryDataToLocalStore() {
  localStorage.removeItem(storageKeyQueryData);
}

export {
  setUser,
  getUser,
  cleanUser,
  getToken,
  storeQueryData,
  getQueryDataFromLocalStore,
  cleanQueryDataToLocalStore,
};
