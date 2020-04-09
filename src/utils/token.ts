class Token {
  get token() {
    return this._token || '';
  }
  set token(token) {
    this._token = token || '';
  }
  get refreshToken() {
    return this._refreshToken || '';
  }
  set refreshToken(token) {
    this._refreshToken = token || '';
  }

  private _token: string = '';
  private _refreshToken: string = '';
}

export const token = new Token();
export default token;
