const routers = [
  {
    path: '/login',
    meta: {
      title: '登录'
    },
    component: (resolve) => require(['./views/login.vue'], resolve)
  },
  {
    path: '/',
    meta: {
      title: '主页'
    },
    component: (resolve) => require(['./views/index.vue'], resolve)
  },
    {
        path: '/subject',
        meta: {
            title: '管理'
        },
        component: (resolve) => require(['./views/subject.vue'], resolve)
    },

];
export default routers;