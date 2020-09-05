const isBrowser = typeof window !== `undefined`

export const setUser = user => (window.localStorage.userData = JSON.stringify(user))

const getUser = () => {
  if (window.localStorage.userData) {
    let user = JSON.parse(window.localStorage.userData)
    return user ? user : {}
  }
  return {}
}

export const isLoggedIn = () => {
  if (!isBrowser) return false

  const user = getUser()
  if (user) return !!user.username
}

export const getCurrentUser = () => isBrowser && getUser()

export const logout = callback => {
  if (!isBrowser) return
  setUser(null)
  callback()
}