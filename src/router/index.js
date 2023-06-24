import { createRouter, createWebHistory } from 'vue-router';
import useStore from 'store';
import { selMenusOfCurrent } from 'api/sec/secMenu.js';

const routes = [
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: 'sec/role',
        component: () => import('views/pages/sec/Role.vue')
      },
      {
        path: 'sec/user-role',
        component: () => import('views/pages/sec/UserRole.vue')
      },
      {
        path: 'sec/menu',
        component: () => import('views/pages/sec/Menu.vue')
      },
      {
        path: 'sec/role-menu',
        component: () => import('views/pages/sec/RoleMenu.vue')
      },
      {
        path: 'searchengine',
        component: () => import('views/pages/searchengine/SearchEngine.vue')
      },
      {
        path: 'sort',
        component: () => import('views/pages/sort/Sort.vue')
      },
      {
        path: 'link',
        component: () => import('views/pages/link/Link.vue')
      },
      {
        path: 'user/user',
        component: () => import('views/pages/user/User.vue')
      },
      {
        path: 'user/loginlog',
        component: () => import('views/pages/user/LoginLog.vue')
      },
      {
        path: 'file/upload',
        component: () => import('views/pages/file/Upload.vue')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('views/login/index.vue')
  },
  {
    path: '/test',
    component: () => import('comp/template/tablePage.vue')
  },
  {
    path: '/403',
    component: () => import('comp/error/403.vue')
  },
  {
    path: '/404',
    component: () => import('comp/error/404.vue')
  },
  // {
  //   path: '*',
  //   component: () => import('comp/error/404.vue')
  // }
]

export const router = createRouter({
  history: createWebHistory(),
  routes: routes
});

const whiteList = ['/403', '/404']
router.beforeEach((to, from, next) => {
  useStore().page.init();
  if (whiteList.includes(to.path)) {
    next()
  } else if (!useStore().user.isLogin && to.path !== '/login') {
    next({
      path: '/login',
      query: {
        redirect: to.path
      },
      replace: true
    });
  } else if (to.path === '/login') {
    next();
  } else {
    selMenusOfCurrent().then(res => {
      let tp = to.path.substring('/admin'.length);
      let menuList = res.data;
      useStore().menu.setMenus(menuList);
      let reg = /^(?!^\/.*-$)(?!^\/-.*$)(?!.*(--).*)\/[a-z0-9-]+/;
      let arr = [];
      let l = tp.match(/\//g, '')?.length ?? 0;
      if (tp !== '') {
        for (let i = 0; i < l; i++) {
          let find = menuList.find(item => item.meParentId === (i === 0 ? '0' : arr[i - 1].meId) && item.mePath === tp.match(reg)[0]);
          if (!!find) {
            arr.push(find);
          } else {
            break;
          }
          tp = tp.substring(tp.match(reg)[0].length);
        }
      }
      if (l === arr.length) {
        if (to.path === '/') {
          next()
        } else {
          let p = to.path
          let b = true
          for (let i = 0; i < to.path.length - to.path.replace(/\//g, '').length; i++) {
            let i = 0
            let s = `/${p.match(/^\/([A-Za-z0-9._-]*\/|)/)[0].replace(/\//g, '')}`
            let a = p.match(/\//g).length === 1 ? p : s
            if (!!!menuList.find(item => item.mePath === a)) {
              b = false
            }
            p = `/${p.replace(/^\/([A-Za-z0-9._-]*\/|)/, '')}`
          }
          if (b) {
            next()
          } else {
            next('/403')
          }
        }
      } else {
        next('/403')
      }
    })
  }
})

export default router;
