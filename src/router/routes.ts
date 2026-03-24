/*
 * @Author: zithern-git 2385186645@qq.com
 * @Date: 2026-03-23 09:51:31
 * @LastEditors: zithern-git 2385186645@qq.com
 * @LastEditTime: 2026-03-24 14:50:17
 * @FilePath: \shop-admin\src\router\routes.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 对外暴露配置路由（常量路由）
export const constantRoutes = [
  {
    // 登录
    path: '/login',
    component: () => import('@/views/login/index.vue'), // 懒加载
    name: 'login', //命名路由
    meta: {
      title: '登录', // 菜单标题
      hidden: true, // 代表路由标题在菜单中是否隐藏，true：隐藏，false：不隐藏
    }
  },
  {
    // 登录成功以后展示数据的路由
    path: '/',
    component: () => import('@/layout/index.vue'),
    name: 'layout',
    meta: {
      // title: 'layout',
      hidden: false,
      // icon: 'Avatar', // 菜单文字左侧的图标，支持element-plus全部图标
    },
    redirect: '/home',
    children: [
      { path: '/home',
        component: () => import('@/views/home/index.vue'),
        meta: {
          title: '首页',
          hidden: false,
          icon: 'HomeFilled',
        }
      },
    ],
  },
  {
    // 数据大屏
    path: '/screen',
    component: () => import('@/views/screen/index.vue'),
    name: 'Screen',
    meta: {
          title: '数据大屏',
          hidden: false,
          icon: 'Platform',
        }
  },
  {
    path: '/acl',
    component: () => import('@/layout/index.vue'),
    name: 'Acl',
    meta: {
      title: '权限管理',
      hidden: false,
      icon: 'Lock',
    },
    redirect: '/acl/user', // 面包屑组件中，点击一级路由重定向到第一个二级路由
    children: [
      { path: '/acl/user',
        // path: '/acl/user',  不能写这种路径，点击之后页面会跳转到404！！！！！
        component: () => import('@/views/acl/uesr/index.vue'),
        name: 'User',
        meta: {
          title: '用户管理',
          hidden: false,
          icon: 'User',
        }
      },
      { path: '/acl/role',
        component: () => import('@/views/acl/role/index.vue'),
        name: 'Role',
        meta: {
          title: '角色管理',
          hidden: false,
          icon: 'UserFilled',
        },
      },
      { path: '/acl/permission',
        component: () => import('@/views/acl/permission/index.vue'),
        name: 'Permission',
        meta: {
          title: '菜单管理',
          hidden: false,
          icon: 'Monitor',
        },
      }
    ],
  },
  {
    path: '/product',
    component: () => import('@/layout/index.vue'),
    name: 'Product',
    meta: {
      title: '商品管理',
      hidden: false,
      icon: 'Goods',
    },
    redirect: '/product/trademark', // 面包屑组件中，点击一级路由重定向到第一个二级路由
    children: [
      { path: '/product/trademark',
        component: () => import('@/views/product/trademark/index.vue'),
        name: 'Trademark',
        meta: {
          title: '品牌管理',
          hidden: false,
          icon: 'ShoppingCartFull',
        }
      },
      { path: '/product/spu',
        component: () => import('@/views/product/spu/index.vue'),
        name: 'Spu',
        meta: {
          title: 'Spu管理',
          hidden: false,
          icon: 'Calendar',
        },
      },
      { path: '/product/sku',
        component: () => import('@/views/product/sku/index.vue'),
        name: 'Sku',
        meta: {
          title: 'Sku管理',
          hidden: false,
          icon: 'Orange',
        },
      },
      { path: '/product/attr',
        component: () => import('@/views/product/attr/index.vue'),
        name: 'Attr',
        meta: {
          title: '属性管理',
          hidden: false,
          icon: 'ChromeFilled',
        },
      }
    ],
  },
  {
    // 404
    path: '/404',
    component: () => import('@/views/404/index.vue'),
    name: '404',
    meta: {
          title: '404',
          hidden: true,
        }
  },
  {
    // 任意路由
    path: '/:pathMatch(.*)*', // 通配符，匹配所有未定义路径
    redirect: '/404',
    name: 'any',
    meta: {
          title: '任意路由',
          hidden: true,
        }
  },
]
