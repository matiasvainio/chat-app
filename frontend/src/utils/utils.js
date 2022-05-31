const USER_KEY = 'user'

export const getToken = () => {

}

export const setToken = () => {

}

export const getUser = () => {

}

export const setUser = (data) => {
  if (data) window.localStorage.setItem(USER_KEY, JSON.stringify(data))
}