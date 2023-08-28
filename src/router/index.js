import { createRouter, createWebHistory } from 'vue-router'
import useStore from 'store'
import { selMenusOfCurrent } from 'api/sec/secMenu.js'
import { final } from "utils/base.js";

const routes = [
  {
    path: '/',
    component: () => import('@/layout/Layout.vue'),
    children: [
      {
        path: '',
        component: () => import('views/home/Home.vue')
      },
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
        path: 'sort/list',
        component: () => import('views/pages/sort/Sort.vue')
      },
      {
        path: 'sort/apply',
        component: () => import('views/pages/sort/SortApply.vue')
      },
      {
        path: 'link/list',
        component: () => import('views/pages/link/Link.vue')
      },
      {
        path: 'link/apply',
        component: () => import('views/pages/link/LinkApply.vue')
      },
      {
        path: 'dict',
        component: () => import('views/pages/dict/Dict.vue')
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
    component: () => import('views/login/Login.vue')
  },
  {
    path: '/403',
    component: () => import('views/error/403.vue')
  },
  {
    path: '/404',
    component: () => import('views/error/404.vue')
  },
  {
    path: '/:pathMatch(.*)',
    redirect: `/404`
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 始终滚动到顶部
    return { top: 0 }
  }
})

const whiteList = ['/403', '/404']
router.beforeEach((to, from, next) => {
  useStore().page.init()
  if (whiteList.includes(to.path)) {
    next()
  } else if (!useStore().user.isLogin && to.path !== '/login') {
    next({
      path: '/login',
      query: {
        redirect: to.path
      }
    })
  } else if (to.path === '/login') {
    next()
  } else {
    selMenusOfCurrent().then(res => {
      let tp = to.path.substring('/admin'.length)
      let menuList = res.data
      useStore().menu.setMenus(menuList)
      let reg = /^(?!^\/.*-$)(?!^\/-.*$)(?!.*(--).*)\/[a-z0-9-]+/
      let arr = []
      let l = tp.match(/\//g, '')?.length ?? 0
      if (tp !== '') {
        for (let i = 0; i < l; i++) {
          let find = menuList.find(item => item.meParentId === (i === 0 ? final.DEFAULT_PARENT_ID : arr[i - 1].meId) && item.mePath === tp.match(reg)[0])
          if (!!find) {
            arr.push(find)
          } else {
            break
          }
          tp = tp.substring(tp.match(reg)[0].length)
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

export default router
