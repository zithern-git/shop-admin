// 纯 CommonJS 写法，避免 ES 模块冲突
const jsonServer = require('json-server');
const jwt = require('jsonwebtoken');
const path = require('path'); // 引入 path 模块，确保路径绝对正确

// 创建服务器实例
const server = jsonServer.create();

// 绝对路径加载 db.json（避免相对路径问题）
const dbPath = path.join(__dirname, 'db.json');
const router = jsonServer.router(dbPath);

// 默认中间件（CORS、静态文件、解析 JSON 等）
const middlewares = jsonServer.defaults();

// 配置
const SECRET_KEY = 'shop-admin-secret-2026'; // 自定义密钥
const EXPIRES_IN = '1h'; // Token 有效期 1 小时

// 使用中间件
server.use(middlewares);
server.use(jsonServer.bodyParser); // 必须：解析 POST 请求体

// 1. 自定义登录接口（生成 Token）
server.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;
    // 从 db.json 中查找用户
    const db = router.db;
    const user = db.get('users').find({ username, password }).value();

    if (!user) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }

    // 生成 Token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      SECRET_KEY,
      { expiresIn: EXPIRES_IN }
    );

    // 返回结果
    res.json({
      message: '登录成功',
      token,
      user: { id: user.id, username: user.username }
    });
  } catch (err) {
    res.status(500).json({ message: '服务器错误', error: err.message });
  }
});

// 2. Token 验证中间件（保护接口）
server.use((req, res, next) => {
  // 白名单：无需验证的接口
  const whiteList = ['/login', '/favicon.ico'];
  if (whiteList.includes(req.path)) {
    return next();
  }

  // 从请求头获取 Token
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: '请先登录（未携带 Token）' });
  }

  // 提取 Token 并验证
  const token = authHeader.split(' ')[1];
  try {
    jwt.verify(token, SECRET_KEY);
    next(); // 验证通过，继续访问接口
  } catch (err) {
    return res.status(401).json({ message: 'Token 过期或无效，请重新登录' });
  }
});

// 挂载路由
server.use(router);

// 启动服务器（端口 3000）
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`✅ JSON Server 启动成功！地址：http://localhost:${PORT}`);
  console.log(`📌 登录接口：POST http://localhost:${PORT}/login`);
  console.log(`📌 测试接口：GET http://localhost:${PORT}/users`);
});