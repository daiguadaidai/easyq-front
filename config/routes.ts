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
    component: '@/pages/Test/VirTable3',
  },
  {
    path: '/priv',
    name: 'priv',
    icon: 'team',
    routes: [
      {
        path: '/priv',
        redirect: '/priv/apply',
      },
      {
        name: 'user-list',
        icon: 'user',
        path: '/priv/user',
        component: '@/pages/Priv/User',
      },
      {
        name: 'apply',
        path: '/priv/apply',
        component: '@/pages/Priv/PrivApply',
      },
      {
        name: 'priv-apply-order',
        path: '/priv/priv-apply-order',
        component: '@/pages/Priv/PrivApplyOrder',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/query',
    name: 'query',
    icon: 'fileSearch',
    component: '@/pages/Query',
  },
  {
    path: '/',
    redirect: '/test',
  },
  {
    component: './404',
  },
];
