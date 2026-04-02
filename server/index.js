const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const app = express()
const PORT = 3003
const SECRET_KEY = 'your-secret-key-123456'

// 中间件
app.use(cors())
app.use(express.json())

// ==================== 文件上传配置 ====================
const uploadDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const ext = path.extname(file.originalname)
    cb(null, uniqueSuffix + ext)
  }
})

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg']
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('只允许上传图片文件'), false)
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }
})

app.use('/uploads', express.static(uploadDir))

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

// ==================== 权限管理数据 ====================
let aclUsers = [
  { id: 1, username: 'admin', name: '管理员', password: '111111', role: '管理员', createTime: '2024-01-01', updateTime: '2024-01-01' },
  { id: 2, username: 'zhangsan', name: '张三', password: '111111', role: '运营', createTime: '2024-01-02', updateTime: '2024-01-02' },
  { id: 3, username: 'lisi', name: '李四', password: '111111', role: '客服', createTime: '2024-01-03', updateTime: '2024-01-03' },
  { id: 4, username: 'wangwu', name: '王五', password: '111111', role: '运营', createTime: '2024-01-04', updateTime: '2024-01-04' },
]

let roles = [
  { id: 1, roleName: '管理员', remark: '拥有所有权限', createTime: '2024-01-01', updateTime: '2024-01-01' },
  { id: 2, roleName: '运营', remark: '商品管理权限', createTime: '2024-01-02', updateTime: '2024-01-02' },
  { id: 3, roleName: '客服', remark: '查看权限', createTime: '2024-01-03', updateTime: '2024-01-03' },
]

let permissions = [
  { id: 1, name: '权限管理', type: 1, level: 1, pid: 0, path: '/acl', component: 'Layout', icon: 'Lock', permissionValue: '' },
  { id: 2, name: '用户管理', type: 1, level: 2, pid: 1, path: 'user', component: 'User', icon: 'User', permissionValue: '' },
  { id: 3, name: '角色管理', type: 1, level: 2, pid: 1, path: 'role', component: 'Role', icon: 'UserFilled', permissionValue: '' },
  { id: 4, name: '菜单管理', type: 1, level: 2, pid: 1, path: 'permission', component: 'Permission', icon: 'Monitor', permissionValue: '' },
  { id: 5, name: '商品管理', type: 1, level: 1, pid: 0, path: '/product', component: 'Layout', icon: 'Goods', permissionValue: '' },
  { id: 6, name: '品牌管理', type: 1, level: 2, pid: 5, path: 'trademark', component: 'Trademark', icon: 'ShoppingCartFull', permissionValue: '' },
  { id: 7, name: 'SPU管理', type: 1, level: 2, pid: 5, path: 'spu', component: 'Spu', icon: 'Calendar', permissionValue: '' },
  { id: 8, name: 'SKU管理', type: 1, level: 2, pid: 5, path: 'sku', component: 'Sku', icon: 'Orange', permissionValue: '' },
  { id: 9, name: '属性管理', type: 1, level: 2, pid: 5, path: 'attr', component: 'Attr', icon: 'ChromeFilled', permissionValue: '' },
  { id: 10, name: '用户添加按钮', type: 2, level: 3, pid: 2, path: '', component: '', icon: '', permissionValue: 'btn.user.add' },
  { id: 11, name: '用户删除按钮', type: 2, level: 3, pid: 2, path: '', component: '', icon: '', permissionValue: 'btn.user.delete' },
  { id: 12, name: '用户修改按钮', type: 2, level: 3, pid: 2, path: '', component: '', icon: '', permissionValue: 'btn.user.update' },
  { id: 13, name: '角色添加按钮', type: 2, level: 3, pid: 3, path: '', component: '', icon: '', permissionValue: 'btn.role.add' },
  { id: 14, name: '角色删除按钮', type: 2, level: 3, pid: 3, path: '', component: '', icon: '', permissionValue: 'btn.role.delete' },
]

// ==================== 商品管理数据 ====================
let trademarks = [
  { id: 1, tmName: '华为', logoUrl: 'https://img1.baidu.com/it/u=4068546577,3295632343&fm=253&fmt=auto&app=120&f=JPEG?w=800&h=500', createTime: '2024-01-01', updateTime: '2024-01-01' },
  { id: 2, tmName: '小米', logoUrl: 'https://img1.baidu.com/it/u=521293053,2652660591&fm=253&fmt=auto&app=120&f=PNG?w=800&h=800', createTime: '2024-01-02', updateTime: '2024-01-02' },
  { id: 3, tmName: '苹果', logoUrl: 'https://img2.baidu.com/it/u=97948109,3373219309&fm=253&fmt=auto&app=138&f=PNG?w=408&h=500', createTime: '2024-01-03', updateTime: '2024-01-03' },
  { id: 4, tmName: '三星', logoUrl: 'https://img.samsung.com/logo.png', createTime: '2024-01-04', updateTime: '2024-01-04' },
  { id: 5, tmName: 'OPPO', logoUrl: 'https://img.oppo.com/logo.png', createTime: '2024-01-05', updateTime: '2024-01-05' },
  { id: 6, tmName: 'vivo', logoUrl: 'https://img.vivo.com/logo.png', createTime: '2024-01-06', updateTime: '2024-01-06' },
  { id: 7, tmName: '华为', logoUrl: 'https://img1.baidu.com/it/u=4068546577,3295632343&fm=253&fmt=auto&app=120&f=JPEG?w=800&h=500', createTime: '2024-01-01', updateTime: '2024-01-01' },
  { id: 8, tmName: '小米', logoUrl: 'https://img1.baidu.com/it/u=521293053,2652660591&fm=253&fmt=auto&app=120&f=PNG?w=800&h=800', createTime: '2024-01-02', updateTime: '2024-01-02' },
  { id: 9, tmName: '苹果', logoUrl: 'https://img2.baidu.com/it/u=97948109,3373219309&fm=253&fmt=auto&app=138&f=PNG?w=408&h=500', createTime: '2024-01-03', updateTime: '2024-01-03' },
  { id: 10, tmName: '三星', logoUrl: 'https://img.samsung.com/logo.png', createTime: '2024-01-04', updateTime: '2024-01-04' },
  { id:11, tmName: 'OPPO', logoUrl: 'https://img.oppo.com/logo.png', createTime: '2024-01-05', updateTime: '2024-01-05' },
  { id:12, tmName: 'vivo', logoUrl: 'https://img.vivo.com/logo.png', createTime: '2024-01-06', updateTime: '2024-01-06' },
]

let spus = [
  { id: 1, spuName: 'iPhone 15 Pro', description: '苹果最新旗舰手机', category3Id: 61, tmId: 3, spuSaleAttrList: [], spuImageList: [], createTime: '2024-01-01', updateTime: '2024-01-01' },
  { id: 2, spuName: '华为 Mate 60 Pro', description: '华为旗舰手机', category3Id: 61, tmId: 1, spuSaleAttrList: [], spuImageList: [], createTime: '2024-01-02', updateTime: '2024-01-02' },
  { id: 3, spuName: '小米 14 Pro', description: '小米旗舰手机', category3Id: 61, tmId: 2, spuSaleAttrList: [], spuImageList: [], createTime: '2024-01-03', updateTime: '2024-01-03' },
]

let skus = [
  { id: 1, skuName: 'iPhone 15 Pro 256GB 黑色', price: 8999, weight: 200, skuDefaultImg: 'https://img.apple.com/iphone15pro.jpg', skuDesc: '黑色钛金属', category3Id: 61, spuId: 1, tmId: 3, skuAttrValueList: [], skuSaleAttrValueList: [], createTime: '2024-01-01', updateTime: '2024-01-01' },
  { id: 2, skuName: '华为 Mate 60 Pro 512GB 白沙银', price: 6999, weight: 220, skuDefaultImg: 'https://img.huawei.com/mate60pro.jpg', skuDesc: '白沙银配色', category3Id: 61, spuId: 2, tmId: 1, skuAttrValueList: [], skuSaleAttrValueList: [], createTime: '2024-01-02', updateTime: '2024-01-02' },
]

let attrs = [
  { id: 1, attrName: '颜色', categoryId: 61, categoryLevel: 3, attrValueList: [{ id: 1, valueName: '黑色' }, { id: 2, valueName: '白色' }, { id: 3, valueName: '金色' }] },
  { id: 2, attrName: '内存', categoryId: 61, categoryLevel: 3, attrValueList: [{ id: 4, valueName: '128GB' }, { id: 5, valueName: '256GB' }, { id: 6, valueName: '512GB' }] },
  { id: 3, attrName: '尺寸', categoryId: 61, categoryLevel: 3, attrValueList: [{ id: 7, valueName: '6.1英寸' }, { id: 8, valueName: '6.7英寸' }] },
]

// 三级分类数据结构示例
const categories = [
  // 一级分类 (categoryLevel: 1, categoryId: 0 或 null)
  { id: 1, name: '手机数码', categoryId: 0, categoryLevel: 1 },
  { id: 2, name: '服装鞋包', categoryId: 0, categoryLevel: 1 },
  { id: 3, name: '家用电器', categoryId: 0, categoryLevel: 1 },

  // 二级分类 (categoryId: 对应一级分类的 id, categoryLevel: 2)
  { id: 11, name: '手机', categoryId: 1, categoryLevel: 2 },
  { id: 12, name: '电脑', categoryId: 1, categoryLevel: 2 },
  { id: 21, name: '男装', categoryId: 2, categoryLevel: 2 },
  { id: 22, name: '女装', categoryId: 2, categoryLevel: 2 },
  { id: 31, name: '大家电', categoryId: 3, categoryLevel: 2 },

  // 三级分类 (categoryId: 对应二级分类的 id, categoryLevel: 3)
  { id: 111, name: '智能手机', categoryId: 11, categoryLevel: 3 },
  { id: 112, name: '老人机', categoryId: 11, categoryLevel: 3 },
  { id: 121, name: '笔记本', categoryId: 12, categoryLevel: 3 },
  { id: 211, name: 'T恤', categoryId: 21, categoryLevel: 3 },
  { id: 212, name: '衬衫', categoryId: 21, categoryLevel: 3 },
  { id: 311, name: '电视', categoryId: 31, categoryLevel: 3 },
]

// ==================== 数据大屏数据 ====================
const screenData = {
  // 访问数据
  visitData: {
    day: 1234,
    week: 8765,
    month: 34567,
    year: 456789,
  },
  // 销售额
  salesData: {
    total: 1234567,
    daily: 12345,
    weekly: 87654,
    monthly: 345678,
  },
  // 订单数据
  orderData: {
    total: 8765,
    pending: 123,
    processing: 456,
    completed: 8186,
  },
  // 用户数据
  userData: {
    total: 45678,
    newToday: 123,
    newWeek: 876,
    newMonth: 3456,
  },
  // 分类销售排行
  categoryRank: [
    { name: '手机', value: 123456 },
    { name: '电脑', value: 98765 },
    { name: '平板', value: 87654 },
    { name: '耳机', value: 76543 },
    { name: '手表', value: 65432 },
  ],
  // 销售趋势（折线图数据）
  salesTrend: {
    dates: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    values: [820, 932, 901, 934, 1290, 1330, 1320, 1450, 1560, 1680, 1890, 2100],
  },
}

// ==================== 工具函数 ====================
// 验证token
const verifyToken = (req) => {
  const token = req.headers.token
  if (!token) return { valid: false, message: 'token不能为空' }
  try {
    const decoded = jwt.verify(token, SECRET_KEY)
    return { valid: true, user: decoded }
  } catch (err) {
    return { valid: false, message: 'token无效或已过期' }
  }
}

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
      data: { token },
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
  const { valid, user, message } = verifyToken(req)
  if (!valid) {
    return res.json({ code: 401, message, data: null, ok: false })
  }

  const userInfo = users.find((u) => u.username === user.username)
  if (!userInfo) {
    return res.json({ code: 401, message: '用户不存在', data: null, ok: false })
  }

  res.json({
    code: 200,
    message: '获取成功',
    data: {
      userId: userInfo.userId,
      name: userInfo.name,
      avatar: userInfo.avatar,
      desc: userInfo.desc,
      roles: userInfo.roles,
      buttons: userInfo.buttons,
      routes: userInfo.routes,
    },
    ok: true,
  })
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

// ==================== 用户管理接口 ====================
// 获取用户列表
app.get('/admin/acl/user/:page/:limit', (req, res) => {
  const { valid, message } = verifyToken(req)
  if (!valid) return res.json({ code: 401, message, data: null, ok: false })

  const page = parseInt(req.params.page) || 1
  const limit = parseInt(req.params.limit) || 10
  const start = (page - 1) * limit
  const end = start + limit
  const list = aclUsers.slice(start, end)

  res.json({
    code: 200,
    message: '获取成功',
    data: {
      records: list,
      total: aclUsers.length,
      size: limit,
      current: page,
      pages: Math.ceil(aclUsers.length / limit),
    },
    ok: true,
  })
})

// 添加用户
app.post('/admin/acl/user/save', (req, res) => {
  const { valid, message } = verifyToken(req)
  if (!valid) return res.json({ code: 401, message, data: null, ok: false })

  const newUser = {
    id: Date.now(),
    ...req.body,
    createTime: new Date().toISOString().split('T')[0],
    updateTime: new Date().toISOString().split('T')[0],
  }
  aclUsers.push(newUser)

  res.json({ code: 200, message: '添加成功', data: null, ok: true })
})

// 更新用户
app.put('/admin/acl/user/update', (req, res) => {
  const { valid, message } = verifyToken(req)
  if (!valid) return res.json({ code: 401, message, data: null, ok: false })

  const index = aclUsers.findIndex((u) => u.id === req.body.id)
  if (index !== -1) {
    aclUsers[index] = { ...aclUsers[index], ...req.body, updateTime: new Date().toISOString().split('T')[0] }
    res.json({ code: 200, message: '更新成功', data: null, ok: true })
  } else {
    res.json({ code: 404, message: '用户不存在', data: null, ok: false })
  }
})

// 删除用户
app.delete('/admin/acl/user/remove/:id', (req, res) => {
  const { valid, message } = verifyToken(req)
  if (!valid) return res.json({ code: 401, message, data: null, ok: false })

  const id = parseInt(req.params.id)
  aclUsers = aclUsers.filter((u) => u.id !== id)
  res.json({ code: 200, message: '删除成功', data: null, ok: true })
})

// ==================== 角色管理接口 ====================
// 获取角色列表
app.get('/admin/acl/role/:page/:limit', (req, res) => {
  const { valid, message } = verifyToken(req)
  if (!valid) return res.json({ code: 401, message, data: null, ok: false })

  const page = parseInt(req.params.page) || 1
  const limit = parseInt(req.params.limit) || 10
  const start = (page - 1) * limit
  const end = start + limit
  const list = roles.slice(start, end)

  res.json({
    code: 200,
    message: '获取成功',
    data: {
      records: list,
      total: roles.length,
      size: limit,
      current: page,
      pages: Math.ceil(roles.length / limit),
    },
    ok: true,
  })
})

// 添加角色
app.post('/admin/acl/role/save', (req, res) => {
  const { valid, message } = verifyToken(req)
  if (!valid) return res.json({ code: 401, message, data: null, ok: false })

  const newRole = {
    id: Date.now(),
    ...req.body,
    createTime: new Date().toISOString().split('T')[0],
    updateTime: new Date().toISOString().split('T')[0],
  }
  roles.push(newRole)

  res.json({ code: 200, message: '添加成功', data: null, ok: true })
})

// 更新角色
app.put('/admin/acl/role/update', (req, res) => {
  const { valid, message } = verifyToken(req)
  if (!valid) return res.json({ code: 401, message, data: null, ok: false })

  const index = roles.findIndex((r) => r.id === req.body.id)
  if (index !== -1) {
    roles[index] = { ...roles[index], ...req.body, updateTime: new Date().toISOString().split('T')[0] }
    res.json({ code: 200, message: '更新成功', data: null, ok: true })
  } else {
    res.json({ code: 404, message: '角色不存在', data: null, ok: false })
  }
})

// 删除角色
app.delete('/admin/acl/role/remove/:id', (req, res) => {
  const { valid, message } = verifyToken(req)
  if (!valid) return res.json({ code: 401, message, data: null, ok: false })

  const id = parseInt(req.params.id)
  roles = roles.filter((r) => r.id !== id)
  res.json({ code: 200, message: '删除成功', data: null, ok: true })
})

// ==================== 菜单/权限管理接口 ====================
// 获取权限列表
app.get('/admin/acl/permission', (req, res) => {
  const { valid, message } = verifyToken(req)
  if (!valid) return res.json({ code: 401, message, data: null, ok: false })

  res.json({
    code: 200,
    message: '获取成功',
    data: permissions,
    ok: true,
  })
})

// 添加权限
app.post('/admin/acl/permission/save', (req, res) => {
  const { valid, message } = verifyToken(req)
  if (!valid) return res.json({ code: 401, message, data: null, ok: false })

  const newPermission = {
    id: Date.now(),
    ...req.body,
  }
  permissions.push(newPermission)

  res.json({ code: 200, message: '添加成功', data: null, ok: true })
})

// 更新权限
app.put('/admin/acl/permission/update', (req, res) => {
  const { valid, message } = verifyToken(req)
  if (!valid) return res.json({ code: 401, message, data: null, ok: false })

  const index = permissions.findIndex((p) => p.id === req.body.id)
  if (index !== -1) {
    permissions[index] = { ...permissions[index], ...req.body }
    res.json({ code: 200, message: '更新成功', data: null, ok: true })
  } else {
    res.json({ code: 404, message: '权限不存在', data: null, ok: false })
  }
})

// 删除权限
app.delete('/admin/acl/permission/remove/:id', (req, res) => {
  const { valid, message } = verifyToken(req)
  if (!valid) return res.json({ code: 401, message, data: null, ok: false })

  const id = parseInt(req.params.id)
  permissions = permissions.filter((p) => p.id !== id)
  res.json({ code: 200, message: '删除成功', data: null, ok: true })
})

// ==================== 文件上传接口 ====================
app.post('/admin/product/fileUpload', upload.single('file'), (req, res) => {
  console.log('📤 收到文件上传请求')
  const { valid, message } = verifyToken(req)
  if (!valid) {
    console.log('❌ Token 验证失败:', message)
    return res.json({ code: 401, message, data: null, ok: false })
  }

  try {
    if (!req.file) {
      console.log('❌ 没有上传文件')
      return res.json({ code: 400, message: '没有上传文件', data: null, ok: false })
    }
    const fileUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`
    console.log('✅ 上传成功，URL:', fileUrl)
    res.json({ code: 200, message: '上传成功', data: fileUrl, ok: true })
  } catch (error) {
    console.log('❌ 上传失败:', error.message)
    res.json({ code: 500, message: '上传失败: ' + error.message, data: null, ok: false })
  }
})

// ==================== 品牌管理接口 ====================
// 获取品牌列表
app.get('/admin/product/baseTrademark/:page/:limit', (req, res) => {
  const { valid, message } = verifyToken(req)
  if (!valid) return res.json({ code: 401, message, data: null, ok: false })

  const page = parseInt(req.params.page) || 1
  const limit = parseInt(req.params.limit) || 10
  const start = (page - 1) * limit
  const end = start + limit
  const list = trademarks.slice(start, end)

  res.json({
    code: 200,
    message: '获取成功',
    data: {
      records: list,
      total: trademarks.length,
      size: limit,
      current: page,
      pages: Math.ceil(trademarks.length / limit),
    },
    ok: true,
  })
})

// 添加品牌
app.post('/admin/product/baseTrademark/save', (req, res) => {
  const { valid, message } = verifyToken(req)
  if (!valid) return res.json({ code: 401, message, data: null, ok: false })

  const newTrademark = {
    id: Date.now(),
    ...req.body,
    createTime: new Date().toISOString().split('T')[0],
    updateTime: new Date().toISOString().split('T')[0],
  }
  trademarks.push(newTrademark)

  res.json({ code: 200, message: '添加成功', data: null, ok: true })
})

// 更新品牌
app.put('/admin/product/baseTrademark/update', (req, res) => {
  const { valid, message } = verifyToken(req)
  if (!valid) return res.json({ code: 401, message, data: null, ok: false })

  const id = parseInt(req.body.id)
  const index = trademarks.findIndex((t) => t.id === id)
  if (index !== -1) {
    trademarks[index] = { ...trademarks[index], ...req.body, id: id, updateTime: new Date().toISOString().split('T')[0] }
    res.json({ code: 200, message: '更新成功', data: null, ok: true })
  } else {
    res.json({ code: 404, message: '品牌不存在', data: null, ok: false })
  }
})

// 删除品牌
app.delete('/admin/product/baseTrademark/remove/:id', (req, res) => {
  const { valid, message } = verifyToken(req)
  if (!valid) return res.json({ code: 401, message, data: null, ok: false })

  const id = parseInt(req.params.id)
  trademarks = trademarks.filter((t) => t.id !== id)
  res.json({ code: 200, message: '删除成功', data: null, ok: true })
})

// ==================== SPU管理接口 ====================
// 获取SPU列表
app.get('/admin/product/:page/:limit', (req, res) => {
  const { valid, message } = verifyToken(req)
  if (!valid) return res.json({ code: 401, message, data: null, ok: false })

  const page = parseInt(req.params.page) || 1
  const limit = parseInt(req.params.limit) || 10
  const category3Id = req.query.category3Id

  let list = spus
  if (category3Id) {
    list = spus.filter((s) => s.category3Id === parseInt(category3Id))
  }

  const start = (page - 1) * limit
  const end = start + limit

  res.json({
    code: 200,
    message: '获取成功',
    data: {
      records: list.slice(start, end),
      total: list.length,
      size: limit,
      current: page,
      pages: Math.ceil(list.length / limit),
    },
    ok: true,
  })
})

// 添加SPU
app.post('/admin/product/saveSpuInfo', (req, res) => {
  const { valid, message } = verifyToken(req)
  if (!valid) return res.json({ code: 401, message, data: null, ok: false })

  const newSpu = {
    id: Date.now(),
    ...req.body,
    createTime: new Date().toISOString().split('T')[0],
    updateTime: new Date().toISOString().split('T')[0],
  }
  spus.push(newSpu)

  res.json({ code: 200, message: '添加成功', data: null, ok: true })
})

// 更新SPU
app.post('/admin/product/updateSpuInfo', (req, res) => {
  const { valid, message } = verifyToken(req)
  if (!valid) return res.json({ code: 401, message, data: null, ok: false })

  const index = spus.findIndex((s) => s.id === req.body.id)
  if (index !== -1) {
    spus[index] = { ...spus[index], ...req.body, updateTime: new Date().toISOString().split('T')[0] }
    res.json({ code: 200, message: '更新成功', data: null, ok: true })
  } else {
    res.json({ code: 404, message: 'SPU不存在', data: null, ok: false })
  }
})

// 删除SPU
app.delete('/admin/product/deleteSpu/:spuId', (req, res) => {
  const { valid, message } = verifyToken(req)
  if (!valid) return res.json({ code: 401, message, data: null, ok: false })

  const spuId = parseInt(req.params.spuId)
  spus = spus.filter((s) => s.id !== spuId)
  res.json({ code: 200, message: '删除成功', data: null, ok: true })
})

// ==================== SKU管理接口 ====================
// 获取SKU列表
app.get('/admin/product/list/:page/:limit', (req, res) => {
  const { valid, message } = verifyToken(req)
  if (!valid) return res.json({ code: 401, message, data: null, ok: false })

  const page = parseInt(req.params.page) || 1
  const limit = parseInt(req.params.limit) || 10
  const start = (page - 1) * limit
  const end = start + limit

  res.json({
    code: 200,
    message: '获取成功',
    data: {
      records: skus.slice(start, end),
      total: skus.length,
      size: limit,
      current: page,
      pages: Math.ceil(skus.length / limit),
    },
    ok: true,
  })
})

// 添加SKU
app.post('/admin/product/saveSkuInfo', (req, res) => {
  const { valid, message } = verifyToken(req)
  if (!valid) return res.json({ code: 401, message, data: null, ok: false })

  const newSku = {
    id: Date.now(),
    ...req.body,
    createTime: new Date().toISOString().split('T')[0],
    updateTime: new Date().toISOString().split('T')[0],
  }
  skus.push(newSku)

  res.json({ code: 200, message: '添加成功', data: null, ok: true })
})

// 删除SKU
app.delete('/admin/product/deleteSku/:skuId', (req, res) => {
  const { valid, message } = verifyToken(req)
  if (!valid) return res.json({ code: 401, message, data: null, ok: false })

  const skuId = parseInt(req.params.skuId)
  skus = skus.filter((s) => s.id !== skuId)
  res.json({ code: 200, message: '删除成功', data: null, ok: true })
})

// ==================== 属性管理接口 ====================
// 获取属性列表
app.get('/admin/product/attrInfoList/:category1Id/:category2Id/:category3Id', (req, res) => {
  const { valid, message } = verifyToken(req)
  if (!valid) return res.json({ code: 401, message, data: null, ok: false })

  const category3Id = parseInt(req.params.category3Id)
  const list = attrs.filter((a) => a.categoryId === category3Id)

  res.json({
    code: 200,
    message: '获取成功',
    data: list,
    ok: true,
  })
})

// 1. 获取一级分类列表
// 接口：GET /admin/product/getCategory1
app.get('/admin/product/getCategory1', (req, res) => {
  // Token 验证（保留原有逻辑）
  const { valid, message } = verifyToken(req)
  if (!valid) return res.json({ code: 401, message, data: null, ok: false })

  // 过滤出一级分类（categoryLevel === 1）
  const category1List = categories.filter(item => item.categoryLevel === 1)

  // 返回统一格式
  res.json({
    code: 200,
    message: '获取一级分类成功',
    data: category1List,
    ok: true,
  })
})

// 2. 根据一级分类 ID 获取二级分类列表
// 接口：GET /admin/product/getCategory2/:category1Id
app.get('/admin/product/getCategory2/:category1Id', (req, res) => {
  const { valid, message } = verifyToken(req)
  if (!valid) return res.json({ code: 401, message, data: null, ok: false })

  // 获取路径参数中的一级分类 ID
  const category1Id = parseInt(req.params.category1Id)

  // 过滤出二级分类（categoryLevel === 2 且 categoryId === 一级分类 ID）
  const category2List = categories.filter(
    item => item.categoryLevel === 2 && item.categoryId === category1Id
  )

  res.json({
    code: 200,
    message: '获取二级分类成功',
    data: category2List,
    ok: true,
  })
})

// 3. 根据二级分类 ID 获取三级分类列表
// 接口：GET /admin/product/getCategory3/:category2Id
app.get('/admin/product/getCategory3/:category2Id', (req, res) => {
  const { valid, message } = verifyToken(req)
  if (!valid) return res.json({ code: 401, message, data: null, ok: false })

  // 获取路径参数中的二级分类 ID
  const category2Id = parseInt(req.params.category2Id)

  // 过滤出三级分类（categoryLevel === 3 且 categoryId === 二级分类 ID）
  const category3List = categories.filter(
    item => item.categoryLevel === 3 && item.categoryId === category2Id
  )

  res.json({
    code: 200,
    message: '获取三级分类成功',
    data: category3List,
    ok: true,
  })
})

// 添加属性
app.post('/admin/product/saveAttrInfo', (req, res) => {
  const { valid, message } = verifyToken(req)
  if (!valid) return res.json({ code: 401, message, data: null, ok: false })

  if (req.body.id) {
    // 更新
    const index = attrs.findIndex((a) => a.id === req.body.id)
    if (index !== -1) {
      attrs[index] = { ...attrs[index], ...req.body }
      res.json({ code: 200, message: '更新成功', data: null, ok: true })
    } else {
      res.json({ code: 404, message: '属性不存在', data: null, ok: false })
    }
  } else {
    // 添加
    const newAttr = {
      id: Date.now(),
      ...req.body,
    }
    attrs.push(newAttr)
    res.json({ code: 200, message: '添加成功', data: null, ok: true })
  }
})

// 删除属性
app.delete('/admin/product/deleteAttr/:attrId', (req, res) => {
  const { valid, message } = verifyToken(req)
  if (!valid) return res.json({ code: 401, message, data: null, ok: false })

  const attrId = parseInt(req.params.attrId)
  attrs = attrs.filter((a) => a.id !== attrId)
  res.json({ code: 200, message: '删除成功', data: null, ok: true })
})

// ==================== 数据大屏接口 ====================
app.get('/screen/data', (req, res) => {
  const { valid, message } = verifyToken(req)
  if (!valid) return res.json({ code: 401, message, data: null, ok: false })

  res.json({
    code: 200,
    message: '获取成功',
    data: screenData,
    ok: true,
  })
})

// ==================== 启动服务 ====================
app.listen(PORT, () => {
  console.log(`\n✅ 服务器运行在 http://localhost:${PORT}\n`)
  console.log('📋 可用接口:')
  console.log('\n【认证相关】')
  console.log(`  POST http://localhost:${PORT}/admin/acl/index/login`)
  console.log(`  GET  http://localhost:${PORT}/admin/acl/index/info`)
  console.log(`  POST http://localhost:${PORT}/admin/acl/index/logout`)
  console.log('\n【用户管理】')
  console.log(`  GET    http://localhost:${PORT}/admin/acl/user/:page/:limit`)
  console.log(`  POST   http://localhost:${PORT}/admin/acl/user/save`)
  console.log(`  PUT    http://localhost:${PORT}/admin/acl/user/update`)
  console.log(`  DELETE http://localhost:${PORT}/admin/acl/user/remove/:id`)
  console.log('\n【角色管理】')
  console.log(`  GET    http://localhost:${PORT}/admin/acl/role/:page/:limit`)
  console.log(`  POST   http://localhost:${PORT}/admin/acl/role/save`)
  console.log(`  PUT    http://localhost:${PORT}/admin/acl/role/update`)
  console.log(`  DELETE http://localhost:${PORT}/admin/acl/role/remove/:id`)
  console.log('\n【菜单管理】')
  console.log(`  GET    http://localhost:${PORT}/admin/acl/permission`)
  console.log(`  POST   http://localhost:${PORT}/admin/acl/permission/save`)
  console.log(`  PUT    http://localhost:${PORT}/admin/acl/permission/update`)
  console.log(`  DELETE http://localhost:${PORT}/admin/acl/permission/remove/:id`)
  console.log('\n【品牌管理】')
  console.log(`  GET    http://localhost:${PORT}/admin/product/baseTrademark/:page/:limit`)
  console.log(`  POST   http://localhost:${PORT}/admin/product/baseTrademark/save`)
  console.log(`  PUT    http://localhost:${PORT}/admin/product/baseTrademark/update`)
  console.log(`  DELETE http://localhost:${PORT}/admin/product/baseTrademark/remove/:id`)
  console.log('\n【SPU管理】')
  console.log(`  GET    http://localhost:${PORT}/admin/product/:page/:limit?category3Id=61`)
  console.log(`  POST   http://localhost:${PORT}/admin/product/saveSpuInfo`)
  console.log(`  POST   http://localhost:${PORT}/admin/product/updateSpuInfo`)
  console.log(`  DELETE http://localhost:${PORT}/admin/product/deleteSpu/:spuId`)
  console.log('\n【SKU管理】')
  console.log(`  GET    http://localhost:${PORT}/admin/product/list/:page/:limit`)
  console.log(`  POST   http://localhost:${PORT}/admin/product/saveSkuInfo`)
  console.log(`  DELETE http://localhost:${PORT}/admin/product/deleteSku/:skuId`)
  console.log('\n【属性管理】')
  console.log(`  GET    http://localhost:${PORT}/admin/product/attrInfoList/:category1Id/:category2Id/:category3Id`)
  console.log(`  POST   http://localhost:${PORT}/admin/product/saveAttrInfo`)
  console.log(`  DELETE http://localhost:${PORT}/admin/product/deleteAttr/:attrId`)
  console.log('\n【数据大屏】')
  console.log(`  GET    http://localhost:${PORT}/screen/data`)
  console.log('\n👤 测试账号:')
  console.log('  管理员: admin / 111111')
  console.log('  普通用户: user / 111111\n')
})
