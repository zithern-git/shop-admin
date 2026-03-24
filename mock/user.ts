// mock/user.ts
// 用户信息数据
function createUserList() {
  return [
    {
      userId: 1,
      avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
      username: 'admin',
      password: '111111',
      desc: '平台管理员',
      roles: ['平台管理员'],
      buttons: ['cuser.detail'],
      routes: ['home'],
      token: 'Admin Token',
    },
    {
      userId: 2,
      avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
      username: 'system',
      password: '111111',
      desc: '系统管理员',
      roles: ['系统管理员'],
      buttons: ['cuser.detail'],
      routes: ['home'],
      token: 'System Token',
    }
  ]
}

// 导出 Mock 接口配置
export default [
  // 登录接口
  {
    url: '/api/user/login',
    method: 'post',
    response: ({ body }) => {
      const { username, password } = body
      const userList = createUserList()
      const user = userList.find(item => item.username === username && item.password === password)

      if (user) {
        return {
          code: 200,
          data: {
            token: user.token
          }
        }
      } else {
        return {
          code: 201,
          data: { message: '用户名或密码错误',}
        }
      }
    }
  },
  // 获取用户信息接口
  {
    url: '/api/user/info',
    method: 'get',
    // response: ({ request }) => { // vite-plugin-mock 没有 request 这个参数！
    response: ({ headers }) => {
      const token = headers.token || ''
      const userList = createUserList()
      const user = userList.find(item => item.token === token)

      if (user) {
        return {
          code: 200,
          // message: '获取用户信息成功',
          data: {
            userId: user.userId,
            avatar: user.avatar,
            username: user.username,
            desc: user.desc,
            roles: user.roles,
            buttons: user.buttons,
            routes: user.routes,
            token: user.token
          }
        }
      } else {
        return {
          code: 201,
          data: {user}
        }
      }
    }
  }
]
