const USER_KEY = 'user'

export const getToken = () => {

}

export const setToken = () => {

}

export const getUser = () => {
  return JSON.parse(window.localStorage.getItem(USER_KEY))
}

export const setUser = (data) => {
  console.log(data);
  if (data) window.localStorage.setItem(USER_KEY, JSON.stringify(data))
}