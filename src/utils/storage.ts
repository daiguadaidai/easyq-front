const storageKeyUser = 'user';

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

export { setUser, getUser, cleanUser, getToken };
