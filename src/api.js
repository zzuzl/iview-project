import axios from 'axios';
import qs from 'qs';

const BASE = 'http://www.zlihj.cn/rest';

const a = axios.create({
  baseURL: BASE,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiI2NzIzOTkxNzFAcXEuY29tIiwiZXhwIjoxNTQzNDc3MzUwfQ.6zxnhurgkAZ6RECQ8FFAdKOZdsFqR6sWnMNOh6qe5E8'
  }
});

const Api = {
  checkLogin: function () {
    a.get('/checkLogin')
      .then(function (res) {
        console.log(res);
      });
  },
  login: function () {
    a.post('/staff/login', qs.stringify({
      user: '672399171@qq.com',
      password: '123456.com'
    })).then(function (res) {
      console.log(res.data);
    });
  },
  listProject: function (pid) {
    return a.get('/project/list?pid=' + pid);
  },
  listStaff: function (page) {
    if (!page) {
      page = 1;
    }
    return a.get('/staff/list?page=' + page);
  },
  moveStaff: function (moveItem) {
    return a.post('/staff/move', qs.stringify(moveItem));
  },
  saveProject: function (project) {
    return a.post('/project/save', qs.stringify(project));
  }
};

export default Api;