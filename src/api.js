import axios from 'axios';
import qs from 'qs';

const BASE = 'http://www.zlihj.cn/rest';
let token = '';

axios.defaults.baseURL = BASE;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

// Add a request interceptor
axios.interceptors.request.use(function (config) {
  config.headers.token = token;
  return config;
}, function (error) {
  return Promise.reject(error);
});

function getCookie(c_name) {
  var arr, reg = new RegExp("(^| )" + c_name + "=([^;]*)(;|$)");

  if (arr = document.cookie.match(reg))
    return unescape(arr[2]);
  else
    return null;
}

function setCookie(name, value) {
  var Days = 1;
  var exp = new Date();
  exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
  document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}

const Api = {
  checkLogin: function () {
    let _token = getCookie('token');
    token = _token;

    return axios.get('/checkLogin');
  },
  storeToken: function (_token) {
    token = _token;

    setCookie('token', _token);
  },
  login: function (email, passwd) {
    return axios.post('/staff/login', qs.stringify({
      user: email,
      password: passwd
    }));
  },
  listProject: function (pid) {
    return axios.get('/project/list?pid=' + pid);
  },
  listStaff: function (page) {
    if (!page) {
      page = 1;
    }
    return axios.get('/staff/list?page=' + page);
  },
  moveStaff: function (moveItem) {
    return axios.post('/staff/move', qs.stringify(moveItem));
  },
  saveProject: function (project) {
    return axios.post('/project/save', qs.stringify(project));
  }
};

export default Api;