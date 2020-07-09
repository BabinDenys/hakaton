import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true,
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true,
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true,
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true,
  },
  {
    path: '/',
    component: Layout,
    redirect: '/operator/list',
  },
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [

  /** when your routing map is too long, you can split it into small modules **/
  {
    path: '/categories',
    component: Layout,
    name: 'Категории',
    meta: { title: 'Категории', icon: 'folder' },
    children: [
      {
        path: 'categories',
        component: () => import('@/views/products/CategoriesPage'),
        name: 'Список категорий',
        meta: { title: 'Список категорий', icon: 'eye-open' },
      },
      {
        path: 'createCategory',
        component: () => import('@/views/products/CategoryCreatePage'),
        name: 'Создание категории',
        meta: { title: 'Создание категории', icon: 'form' },
      },
    ],
  },
  {
    path: '/operator',
    component: Layout,
    name: 'Товары',
    meta: { title: 'Товары', icon: 'list' },
    children: [
      {
        path: 'list',
        component: () => import('@/views/products/ProductsListOperatorPage'),
        name: 'Список товаров',
        meta: { title: 'Список товаров', icon: 'eye-open' },
      },
      {
        path: 'createProduct',
        component: () => import('@/views/products/ProductsCreatePageOperator'),
        name: 'Создание продукта',
        meta: { title: 'Создание товара', icon: 'form' },
      },
      {
        path: 'edit/:id',
        component: () => import('@/views/products/ProductsEditOperatorPage'),
        name: 'Редактирование продукта',
        meta: { title: 'Редактирование товара', icon: 'edit' },
        hidden: true,
      },
      {
        path: 'product/:id',
        component: () => import('@/views/products/ProductOperatorPage'),
        name: 'Описание',
        meta: { title: 'Просмотр товара', icon: 'tab' },
        hidden: true,
      },
    ],
  },

  {
    path: '/remains',
    component: Layout,
    name: 'Остатки',
    meta: { title: 'Остатки', icon: 'documentation' },
    children: [
      {
        path: 'list',
        component: () => import('@/views/products/RemainsOperatorPage'),
        name: 'Все остатки',
        meta: { title: 'Все остатки', icon: 'tab' },
      },
    ],
  },

  // {
  //   path: '/products',
  //   component: Layout,
  //   name: 'Фермер',
  //   meta: { title: 'Фермер', icon: 'tab' },
  //   children: [
  //     {
  //       path: 'list',
  //       component: () => import('@/views/products/ProductsListPage'),
  //       name: 'Список товаров',
  //       meta: { title: 'Список товаров', icon: 'tab' },
  //     },
  //     {
  //       path: 'create',
  //       component: () => import('@/views/products/ProductsCreatePageFarmer'),
  //       name: 'Создание товара',
  //       meta: { title: 'Добавление товара', icon: 'tab' },
  //     },
  //     {
  //       path: 'edit/:id',
  //       component: () => import('@/views/products/ProductsEditFarmerPage'),
  //       name: 'Редактирование товара',
  //       meta: { title: 'Редактирование товара', icon: 'tab' },
  //       hidden: true,
  //     },
  //     {
  //       path: 'product/:id',
  //       component: () => import('@/views/products/ProductPage'),
  //       name: 'Описание',
  //       meta: { title: 'Просмотр товара', icon: 'tab' },
  //       hidden: true,
  //     },
  //   ],
  // },
  {
    path: '/settings',
    component: Layout,
    name: 'Настройки',
    meta: { title: 'Настройки', icon: 'tab' },
    children: [
      {
        path: 'profile',
        component: () => import('@/views/products/SettingsPage'),
        name: 'Профиль',
        meta: { title: 'Профиль', icon: 'settings' },
      },
    ],
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true },
]

const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes,
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
