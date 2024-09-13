class MainApi {
  constructor(host, headers, corsHeaders) {
    this._host = host;
    this._headers = headers;
    this._corsHeaders = corsHeaders;
    this._userHost = `${this._host}/users`;
    this._companiesHost = `${this._host}/companies`;
  }

  getResOrError(res){
    if (res.ok){
      return res.json();
    }
    return Promise.reject({ error: `Ошибка при загрузке данных`, message: res });
  }

  saveUser(userData) {
    return fetch(this._userHost, {
      method: 'PATCH',
      headers: this._headers,
      // credentials: 'include',
      mode: 'cors',
      body: JSON.stringify(userData),
    })
      .then(this.getResOrError);
  }
}
