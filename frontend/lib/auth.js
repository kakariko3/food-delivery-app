import axios from 'axios';
import Cookies from 'js-cookie';

import { API_URL } from './apollo';

// 新しいユーザーを登録
export function registerUser(username, email, password) {
  return new Promise((resolve, reject) => {
    axios
      .post(`${API_URL}/auth/local/register`, {
        username,
        email,
        password,
      })
      .then((res) => {
        Cookies.set('token', res.data.jwt, { expires: 7 });
        resolve(res);
        window.location.href = '/';
      })
      .catch((err) => {
        reject(err);
        console.log(err);
      });
  });
}

// ログイン処理
export function login(identifier, password) {
  return new Promise((resolve, reject) => {
    axios
      .post(`${API_URL}/auth/local`, {
        identifier,
        password,
      })
      .then((res) => {
        Cookies.set('token', res.data.jwt, { expires: 7 });
        resolve(res);
        // window.location.href = '/';
      })
      .catch((err) => {
        reject(err);
        console.log(err);
      });
  });
}
