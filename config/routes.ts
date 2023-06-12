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
    path: '/priv',
    name: 'priv',
    icon: 'team',
    routes: [
      {
        name: 'apply',
        path: '/priv/apply',
        component: './Priv/PrivApply',
      },
      {
        name: 'priv-apply-order',
        path: '/priv/priv-apply-order',
        component: './Priv/PrivApplyOrder',
      },
    ],
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
