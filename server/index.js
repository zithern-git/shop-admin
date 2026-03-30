const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')

const app = express()
const PORT = 3002
const SECRET_KEY = 'your-secret-key-123456'

// 中间件
app.use(cors())
app.use(express.json())

// 模拟用户数据
const users = [
  {
    username: 'admin',
    password: '111111',
    name: '管理员',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
  },
]

// 登录接口
app.post('/admin/acl/index/login', (req, res) => {
  const { username, password } = req.body

  console.log('登录请求:', { username, password })

  const user = users.find(u => u.username === username && u.password === password)

  if (user) {
    const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '24h' })
    res.json({
      code: 200,
      message: '登录成功',
      data: { token },
    })
  } else {
    res.status(201).json({
      code: 201,
      message: '用户名或密码错误',
      data: null,
    })
  }
})

// 获取用户信息
app.get('/admin/acl/index/info', (req, res) => {
  const token = req.headers.token

  try {
    const decoded = jwt.verify(token, SECRET_KEY)
    const user = users.find(u => u.username === decoded.username)

    res.json({
      code: 200,
      message: '获取成功',
      data: {
        name: user.name,
        avatar: user.avatar,
        roles: ['admin'],
      },
    })
  } catch (err) {
    res.status(401).json({
      code: 401,
      message: 'token无效',
      data: null,
    })
  }
})

// 退出登录
app.post('/admin/acl/index/logout', (req, res) => {
  res.json({
    code: 200,
    message: '退出成功',
    data: null,
  })
})

app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`)
  console.log('可用接口:')
  console.log(`  POST http://localhost:${PORT}/admin/acl/index/login`)
  console.log(`  GET  http://localhost:${PORT}/admin/acl/index/info`)
  console.log(`  POST http://localhost:${PORT}/admin/acl/index/logout`)
})
