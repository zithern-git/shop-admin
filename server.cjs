const jsonServer = require('json-server');
const jwt = require('jsonwebtoken');
const path = require('path');

// 1. 初始化服务器
const server = jsonServer.create();
const dbPath = path.join(__dirname, 'db.json');
const router = jsonServer.router(dbPath);
const middlewares = jsonServer.defaults();

// 2. 配置项
const SECRET_KEY = 'vue-admin-secret-2026'; // 生产环境请更换复杂密钥
const TOKEN_EXPIRES = '2h'; // Token 有效期 2 小时

// 3. 使用中间件
server.use(middlewares);
server.use(jsonServer.bodyParser); // 解析 POST 请求体

// 4. 自定义登录接口：生成 Token
server.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;
    const db = router.db;
    
    // 从 db.json 查找匹配用户
    const user = db.get('users').find({ username, password }).value();

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: '用户名或密码错误' 
      });
    }

    // 生成 Token（不包含密码等敏感信息）
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      SECRET_KEY,
      { expiresIn: TOKEN_EXPIRES }
    );

    // 返回 Token 和用户信息
    res.json({
      success: true,
      message: '登录成功',
      data: {
        token,
        user: { id: user.id, username: user.username, role: user.role }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: '服务器错误', error: err.message });
  }
});

// 5. Token 验证中间件：保护需要登录的接口
server.use('/api', (req, res, next) => {
  // 白名单：登录接口无需验证
  if (req.path === '/login') return next();

  // 从请求头获取 Token（格式：Bearer <token>）
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: '请先登录' });
  }

  const token = authHeader.split(' ')[1];
  try {
    jwt.verify(token, SECRET_KEY); // 验证 Token 有效性
    next(); // 验证通过，继续访问接口
  } catch (err) {
    res.status(401).json({ success: false, message: 'Token 过期或无效，请重新登录' });
  }
});

// 6. 挂载路由（所有接口统一加 /api 前缀）
server.use('/api', router);

// 7. 启动服务器
const PORT = 3001;
server.listen(PORT, () => {
  console.log(`✅ JSON-Server 启动成功！`);
  console.log(`📌 登录接口：POST http://localhost:${PORT}/api/login`);
  console.log(`📌 测试接口：GET http://localhost:${PORT}/api/menus`);
});