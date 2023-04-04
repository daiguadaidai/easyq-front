export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './user/Login',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/virtable',
    name: 'virtable',
    icon: 'fileSearch',
    component: './Test/VirTable3',
  },
  {
    path: '/query',
    name: 'query',
    icon: 'fileSearch',
    component: './Query',
  },
  {
    path: '/',
    redirect: '/test',
  },
  {
    component: './404',
  },
];
