import axios from 'axios';
import qs from 'qs';

const BASE = 'http://localhost:8888/rest';
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
  let arr, reg = new RegExp("(^| )" + c_name + "=([^;]*)(;|$)");

  if (arr = document.cookie.match(reg))
    return unescape(arr[2]);
  else
    return null;
}

function setCookie(name, value) {
  let Days = 1;
  let exp = new Date();
  exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
  document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}

const Api = {
  checkLogin: function () {
    let _token = getCookie('token');
    token = _token;

    return axios.get('/checkLogin');
  },
  workTypes: function () {
    return axios.get('/resource/workTypes');
  },
  getPermissions: function () {
    return axios.get('/staff/permissions');
  },
  storeToken: function (_token) {
    token = _token;

    setCookie('token', _token);
  },
  reportUuid: function (uuid) {
    return axios.post('/reportUuid?uuid=' + uuid);
  },
  sendMail: function (email, code) {
      return axios.post('/resource/spe', qs.stringify({
          email: email,
          code: code
      }), {
        headers: {
          "KAPTCHA_SESSION_KEY": getCookie("KAPTCHA_SESSION_KEY")
        }
      });
  },
  login: function (email, passwd) {
    return axios.post('/staff/login', qs.stringify({
      user: email,
      password: passwd
    }));
  },
  logout: function () {
    setCookie('token', '');
  },
  changePassword: function (obj) {
    return axios.post('/staff/changePassword', qs.stringify(obj));
  },
  updateInfo: function (info) {
    return axios.post('/staff/updateInfo', info);
  },
  saveResume: function (body) {
    return axios.post('/resume/save', body);
  },
  delResume: function (id) {
    return axios.post('/resume/del', qs.stringify({id: id}));
  },
  listProject: function (pid) {
    return axios.get('/project/list?pid=' + pid);
  },
  listCompany: function (pid) {
    return axios.get('/company/list?pid=' + pid);
  },
  listResume: function (staffId) {
    return axios.get('/resume/findByStaff?staffId=' + staffId);
  },
  listStaff: function (page, key) {
    if (!page) {
      page = 1;
    }

    let otherParam = (key && key.trim()) ? "&key=" + key.trim() : "";

    return axios.get('/staff/list?page=' + page + otherParam);
  },
  moveStaff: function (moveItem) {
    let index = moveItem.pid.indexOf('_');

    return axios.post('/staff/move', qs.stringify({
      id: moveItem.id,
      source: parseInt(moveItem.pid.substring(0, index)),
      pid: parseInt(moveItem.pid.substring(index + 1)),
      oldSource: moveItem.oldSource,
      oldPid: moveItem.oldPid
    }));
  },
  saveProject: function (project) {
    return axios.post('/project/save', project);
  },
  delProject: function (id) {
    return axios.post('/project/del', qs.stringify({id: id}));
  },
  delStaff: function (id) {
    return axios.post('/staff/del', qs.stringify({id: id}));
  },
  saveCompany: function (company) {
    return axios.post('/company/save', company);
  },
  saveStaff: function (staff) {
    let _staff = {
      id: staff.id,
      pid: staff.pid.substring(2, staff.pid.length),
      name: staff.name,
      type: staff.type,
      email: staff.email,
      gender: parseInt(staff.gender),
      qq: staff.qq,
      wx: staff.wx,
      gxtAccount: staff.gxtAccount,
      workAddress: staff.workAddress,
      source: parseInt(staff.pid.charAt(0)),
      birthday: staff.birthday,
      school: staff.school,
      major: staff.major,
      phone: staff.phone,
    };

    return axios.post('/staff/save', _staff);
  }
};

export default Api;