// 路由鉴权：鉴权，项目当中路由能不能被访问的权限的设置（某一个路由什么条件下可以访问，什么条件下不可以访问）
import router from './router'
import nprogress from 'nprogress'
// 引入进度条样式
import 'nprogress/nprogress.css'
// 获取用户相关的小仓库内部token数据，去判断用户是否登录成功
import useUserStore from './store/modules/user'
// 在 “非组件文件” 里使用 Pinia 仓库的标准写法
import pinia from './store'
import { setting } from './setting'

// 关闭 NProgress 进度条右侧那个旋转的小圆圈（加载动画）
nprogress.configure({ showSpinner: false })
const userStore = useUserStore(pinia)

// 全局守卫：项目当中任意路由切换都会触发的钩子
// 全局前置守卫
router.beforeEach(async (to, from) => {
  document.title = `${setting.title}-${to.meta.title}`
  // to：即将进入的目标路由对象（目标地址、参数、元信息等）。
  // from：当前正要离开的路由对象。
  // next：控制导航的回调函数（Vue 3 可通过返回值替代）：
  // next()：放行，继续导航。
  // next(false)：取消当前导航。
  // next('/login')：重定向到指定路由。
  // next(error)：导航失败并抛出错误。
  nprogress.start()
  // 获取token，去判断用户是否登录
  const token = userStore.token
  // 获取用户名字
  const username = userStore.username
  if (token) {
    // 用户登录判断
    // 登录成功，访问login，不能访问，指向首页
    if (to.path === '/login') {
      return '/'
    } else {
      // 登录成功访问其余6个路由（登录排除）
      // 有用户信息
      if (username) {
        // 放行
        return undefined
      } else {
        // 如果没有用户信息，在守卫这里发请求获取了用户信息再放行
        try {
          // 获取用户信息
          await userStore.userInfo()
          // 放行
          return undefined
        } catch (error) {
          // token过期：获取不到用户信息了
          // 用户手动修改本地存储token
          // 退出登录-> 用户相关数据清空
          await userStore.userLogout()
          return { path: '/login', query: { redirect: to.path } }
        }
      }
    }
  } else {
    // 用户未登录判断
    if (to.path === '/login') {
      return undefined
    } else {
      return { path: '/login', query: { redirect: to.path } }
    }
  }
})

// 全局后置守卫
router.afterEach((to, from) => {
  nprogress.done()
})

// 第一个问题：任意路由切换实现进度条业务————nprogress
// 第二个问题：路由鉴权（路由组件访问权限的设置）
// 全部路由组件：登录|404|任意路由|首页|数据大屏|权限管理（三个子路由）|商品管理（四个子路由）

// 用户未登录：可以访问login，其余6个路由不能访问（指向login）
// 用户登录成功：不可以访问login[指向首页]，其余的路由可以访问
