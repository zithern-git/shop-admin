const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')

const app = express()
const PORT = 3002
const SECRET_KEY = 'your-secret-key-123456'

// 中间件
app.use(cors())
app.use(express.json())

// ==================== 用户数据 ====================
const users = [
  {
    userId: 1,
    username: 'admin',
    password: '111111',
    name: '管理员',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    desc: '平台管理员',
    roles: ['admin'],
    buttons: ['btn.add', 'btn.delete', 'btn.update', 'btn.select'],
    routes: ['home', 'screen', 'acl', 'product'],
  },
  {
    userId: 2,
    username: 'user',
    password: '111111',
    name: '普通用户',
    avatar: 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png',
    desc: '普通用户',
    roles: ['user'],
    buttons: ['btn.select'],
    routes: ['home', 'screen'],
  },
]

// ==================== 接口 ====================

// 1. 登录接口
app.post('/admin/acl/index/login', (req, res) => {
  const { username, password } = req.body

  console.log('登录请求:', { username, password })

  const user = users.find((u) => u.username === username && u.password === password)

  if (user) {
    const token = jwt.sign({ userId: user.userId, username: user.username }, SECRET_KEY, {
      expiresIn: '24h',
    })
    res.json({
      code: 200,
      message: '登录成功',
      data: token,
      ok: true,
    })
  } else {
    res.json({
      code: 201,
      message: '用户名或密码错误',
      data: null,
      ok: false,
    })
  }
})

// 2. 获取用户信息
app.get('/admin/acl/index/info', (req, res) => {
  const token = req.headers.token

  if (!token) {
    return res.json({
      code: 401,
      message: 'token不能为空',
      data: null,
      ok: false,
    })
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY)
    const user = users.find((u) => u.username === decoded.username)

    if (!user) {
      return res.json({
        code: 401,
        message: '用户不存在',
        data: null,
        ok: false,
      })
    }

    res.json({
      code: 200,
      message: '获取成功',
      data: {
        userId: user.userId,
        name: user.name,
        avatar: user.avatar,
        desc: user.desc,
        roles: user.roles,
        buttons: user.buttons,
        routes: user.routes,
      },
      ok: true,
    })
  } catch (err) {
    res.json({
      code: 401,
      message: 'token无效或已过期',
      data: null,
      ok: false,
    })
  }
})

// 3. 退出登录
app.post('/admin/acl/index/logout', (req, res) => {
  res.json({
    code: 200,
    message: '退出成功',
    data: null,
    ok: true,
  })
})

// ==================== 启动服务 ====================
app.listen(PORT, () => {
  console.log(`\n✅ 服务器运行在 http://localhost:${PORT}\n`)
  console.log('📋 可用接口:')
  console.log(`  POST http://localhost:${PORT}/admin/acl/index/login`)
  console.log(`  GET  http://localhost:${PORT}/admin/acl/index/info`)
  console.log(`  POST http://localhost:${PORT}/admin/acl/index/logout`)
  console.log('\n👤 测试账号:')
  console.log('  管理员: admin / 111111')
  console.log('  普通用户: user / 111111\n')
})
