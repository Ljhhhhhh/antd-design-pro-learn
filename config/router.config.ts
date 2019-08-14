export default [
  {
    path: '/account',
    component: '../layouts/UserLayout',
    routes: [
      {
        name: 'login',
        path: '/account/login',
        component: './Account/login',
      },
    ],
  },
  {
    path: '/exception',
    routes: [
      {
        path: '/exception/404',
        component: './Exception/404',
      },
      {
        path: '/exception/403',
        component: './Exception/403',
      },
    ],
  },
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['admin', 'user'],
    routes: [
      {
        path: '/',
        name: 'dashboard',
        icon: 'home',
        component: './Home',
      },
      {
        path: '/product',
        name: 'product',
        icon: 'shop',
        routes: [
          {
            name: 'productList',
            path: '/product/product',
            component: './Product/product',
          },
          {
            name: 'createProduct',
            path: '/product/create',
            component: './Product/product/create',
            hideInMenu: true,
          },
          {
            name: 'category',
            path: '/product/category',
            component: './Product/category',
          },
        ],
      },
      {
        name: 'user',
        path: '/user',
        icon: 'user',
        component: './User/list',
        authority: 'admin',
      },
    ],
  },
  {
    component: './Exception/404',
  },
];
