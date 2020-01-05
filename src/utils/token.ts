const token = {
  get token () {
    return this._token || ''
  },
  set token (token) {
    this._token = token || ''
  },
  get refreshToken () {
    return this._refreshToken || ''
  },
  set refreshToken (token) {
    this._refreshToken = token || ''
  },
}

export { token }
export default token
