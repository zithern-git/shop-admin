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
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname)
    cb(null, uniqueSuffix + ext)
  },
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
  limits: { fileSize: 5 * 1024 * 1024 },
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
  {
    id: 1,
    username: 'admin',
    name: '管理员',
    password: '111111',
    role: '管理员',
    createTime: '2024-01-01',
    updateTime: '2024-01-01',
  },
  {
    id: 2,
    username: 'zhangsan',
    name: '张三',
    password: '111111',
    role: '运营',
    createTime: '2024-01-02',
    updateTime: '2024-01-02',
  },
  {
    id: 3,
    username: 'lisi',
    name: '李四',
    password: '111111',
    role: '客服',
    createTime: '2024-01-03',
    updateTime: '2024-01-03',
  },
  {
    id: 4,
    username: 'wangwu',
    name: '王五',
    password: '111111',
    role: '运营',
    createTime: '2024-01-04',
    updateTime: '2024-01-04',
  },
  {
    id: 5,
    username: 'zhaoliu',
    name: '赵六',
    password: '111111',
    role: '客服',
    createTime: '2024-01-05',
    updateTime: '2024-01-05',
  },
  {
    id: 6,
    username: 'sunqi',
    name: '孙七',
    password: '111111',
    role: '运营',
    createTime: '2024-01-06',
    updateTime: '2024-01-06',
  },
  {
    id: 7,
    username: 'zhouba',
    name: '周八',
    password: '111111',
    role: '客服',
    createTime: '2024-01-07',
    updateTime: '2024-01-07',
  },
  {
    id: 8,
    username: 'wujiu',
    name: '吴九',
    password: '111111',
    role: '运营',
    createTime: '2024-01-08',
    updateTime: '2024-01-08',
  },
  {
    id: 9,
    username: 'zhengshi',
    name: '郑十',
    password: '111111',
    role: '客服',
    createTime: '2024-01-09',
    updateTime: '2024-01-09',
  },
  {
    id: 10,
    username: 'dongfang',
    name: '东方',
    password: '111111',
    role: '运营',
    createTime: '2024-01-10',
    updateTime: '2024-01-10',
  },
]

let roles = [
  {
    id: 1,
    roleName: '管理员',
    remark: '拥有所有权限',
    createTime: '2024-01-01',
    updateTime: '2024-01-01',
  },
  {
    id: 2,
    roleName: '运营',
    remark: '商品管理权限',
    createTime: '2024-01-02',
    updateTime: '2024-01-02',
  },
  {
    id: 3,
    roleName: '客服',
    remark: '查看权限',
    createTime: '2024-01-03',
    updateTime: '2024-01-03',
  },
]

let permissions = [
  {
    id: 1,
    name: '权限管理',
    type: 1,
    level: 1,
    pid: 0,
    path: '/acl',
    component: 'Layout',
    icon: 'Lock',
    permissionValue: '',
  },
  {
    id: 2,
    name: '用户管理',
    type: 1,
    level: 2,
    pid: 1,
    path: 'user',
    component: 'User',
    icon: 'User',
    permissionValue: '',
  },
  {
    id: 3,
    name: '角色管理',
    type: 1,
    level: 2,
    pid: 1,
    path: 'role',
    component: 'Role',
    icon: 'UserFilled',
    permissionValue: '',
  },
  {
    id: 4,
    name: '菜单管理',
    type: 1,
    level: 2,
    pid: 1,
    path: 'permission',
    component: 'Permission',
    icon: 'Monitor',
    permissionValue: '',
  },
  {
    id: 5,
    name: '商品管理',
    type: 1,
    level: 1,
    pid: 0,
    path: '/product',
    component: 'Layout',
    icon: 'Goods',
    permissionValue: '',
  },
  {
    id: 6,
    name: '品牌管理',
    type: 1,
    level: 2,
    pid: 5,
    path: 'trademark',
    component: 'Trademark',
    icon: 'ShoppingCartFull',
    permissionValue: '',
  },
  {
    id: 7,
    name: 'SPU管理',
    type: 1,
    level: 2,
    pid: 5,
    path: 'spu',
    component: 'Spu',
    icon: 'Calendar',
    permissionValue: '',
  },
  {
    id: 8,
    name: 'SKU管理',
    type: 1,
    level: 2,
    pid: 5,
    path: 'sku',
    component: 'Sku',
    icon: 'Orange',
    permissionValue: '',
  },
  {
    id: 9,
    name: '属性管理',
    type: 1,
    level: 2,
    pid: 5,
    path: 'attr',
    component: 'Attr',
    icon: 'ChromeFilled',
    permissionValue: '',
  },
  {
    id: 10,
    name: '用户添加按钮',
    type: 2,
    level: 3,
    pid: 2,
    path: '',
    component: '',
    icon: '',
    permissionValue: 'btn.user.add',
  },
  {
    id: 11,
    name: '用户删除按钮',
    type: 2,
    level: 3,
    pid: 2,
    path: '',
    component: '',
    icon: '',
    permissionValue: 'btn.user.delete',
  },
  {
    id: 12,
    name: '用户修改按钮',
    type: 2,
    level: 3,
    pid: 2,
    path: '',
    component: '',
    icon: '',
    permissionValue: 'btn.user.update',
  },
  {
    id: 13,
    name: '角色添加按钮',
    type: 2,
    level: 3,
    pid: 3,
    path: '',
    component: '',
    icon: '',
    permissionValue: 'btn.role.add',
  },
  {
    id: 14,
    name: '角色删除按钮',
    type: 2,
    level: 3,
    pid: 3,
    path: '',
    component: '',
    icon: '',
    permissionValue: 'btn.role.delete',
  },
]

// ==================== 商品管理数据 ====================
let trademarks = [
  {
    id: 1,
    tmName: '华为',
    logoUrl: 'http://localhost:3003/uploads/logo-huawei.svg',
    createTime: '2024-01-01',
    updateTime: '2024-01-01',
  },
  {
    id: 2,
    tmName: '小米',
    logoUrl: 'http://localhost:3003/uploads/logo-xiaomi.svg',
    createTime: '2024-01-02',
    updateTime: '2024-01-02',
  },
  {
    id: 3,
    tmName: '苹果',
    logoUrl: 'http://localhost:3003/uploads/logo-apple.svg',
    createTime: '2024-01-03',
    updateTime: '2024-01-03',
  },
  {
    id: 4,
    tmName: '三星',
    logoUrl: 'http://localhost:3003/uploads/logo-samsung.svg',
    createTime: '2024-01-04',
    updateTime: '2024-01-04',
  },
  {
    id: 5,
    tmName: 'OPPO',
    logoUrl: 'http://localhost:3003/uploads/logo-oppo.svg',
    createTime: '2024-01-05',
    updateTime: '2024-01-05',
  },
  {
    id: 6,
    tmName: 'vivo',
    logoUrl: 'http://localhost:3003/uploads/logo-vivo.svg',
    createTime: '2024-01-06',
    updateTime: '2024-01-06',
  },
  {
    id: 7,
    tmName: '耐克',
    logoUrl: 'http://localhost:3003/uploads/logo-nike.svg',
    createTime: '2024-01-07',
    updateTime: '2024-01-07',
  },
  {
    id: 8,
    tmName: '阿迪达斯',
    logoUrl: 'http://localhost:3003/uploads/logo-adidas.svg',
    createTime: '2024-01-08',
    updateTime: '2024-01-08',
  },
  {
    id: 9,
    tmName: '优衣库',
    logoUrl: 'http://localhost:3003/uploads/logo-uniqlo.svg',
    createTime: '2024-01-09',
    updateTime: '2024-01-09',
  },
  {
    id: 10,
    tmName: 'ZARA',
    logoUrl: 'http://localhost:3003/uploads/logo-zara.svg',
    createTime: '2024-01-10',
    updateTime: '2024-01-10',
  },
  {
    id: 11,
    tmName: '海尔',
    logoUrl: 'http://localhost:3003/uploads/logo-haier.svg',
    createTime: '2024-01-11',
    updateTime: '2024-01-11',
  },
  {
    id: 12,
    tmName: '美的',
    logoUrl: 'http://localhost:3003/uploads/logo-midea.svg',
    createTime: '2024-01-12',
    updateTime: '2024-01-12',
  },
  {
    id: 13,
    tmName: '格力',
    logoUrl: 'http://localhost:3003/uploads/logo-gree.svg',
    createTime: '2024-01-13',
    updateTime: '2024-01-13',
  },
  {
    id: 14,
    tmName: '索尼',
    logoUrl: 'http://localhost:3003/uploads/logo-sony.svg',
    createTime: '2024-01-14',
    updateTime: '2024-01-14',
  },
  {
    id: 15,
    tmName: '联想',
    logoUrl: 'http://localhost:3003/uploads/logo-lenovo.svg',
    createTime: '2024-01-15',
    updateTime: '2024-01-15',
  },
  {
    id: 16,
    tmName: '戴尔',
    logoUrl: 'http://localhost:3003/uploads/logo-dell.svg',
    createTime: '2024-01-16',
    updateTime: '2024-01-16',
  },
  {
    id: 17,
    tmName: '诺基亚',
    logoUrl: 'http://localhost:3003/uploads/logo-nokia.svg',
    createTime: '2024-01-17',
    updateTime: '2024-01-17',
  },
  {
    id: 18,
    tmName: '飞利浦',
    logoUrl: 'http://localhost:3003/uploads/logo-philips.svg',
    createTime: '2024-01-18',
    updateTime: '2024-01-18',
  },
]

// SPU 图片数据
const spuImages = [
  // ==================== iPhone 15 Pro (spuId: 1) ====================
  {
    id: 1,
    spuId: 1,
    imgName: 'iPhone15Pro-原色钛金属.jpg',
    imgUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop',
  },
  {
    id: 2,
    spuId: 1,
    imgName: 'iPhone15Pro-蓝色钛金属.jpg',
    imgUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop',
  },
  // ==================== 华为 Mate 60 Pro (spuId: 2) ====================
  {
    id: 3,
    spuId: 2,
    imgName: 'Mate60Pro-雅川青.jpg',
    imgUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
  },
  {
    id: 4,
    spuId: 2,
    imgName: 'Mate60Pro-白沙银.jpg',
    imgUrl: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=400&h=400&fit=crop',
  },
  // ==================== 小米 14 Pro (spuId: 3) ====================
  {
    id: 5,
    spuId: 3,
    imgName: 'Xiaomi14Pro-黑色.jpg',
    imgUrl: 'https://images.unsplash.com/photo-1621330396173-e41b1cafd17f?w=400&h=400&fit=crop',
  },
  {
    id: 6,
    spuId: 3,
    imgName: 'Xiaomi14Pro-白色.jpg',
    imgUrl: 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=400&h=400&fit=crop',
  },

  // ==================== iPhone 15 (spuId: 4) ====================
  {
    id: 7,
    spuId: 4,
    imgName: 'iPhone15-粉色.jpg',
    imgUrl: 'https://images.unsplash.com/photo-1505720483508-6e8f9b7c8e47?w=400&h=400&fit=crop',
  },
  {
    id: 8,
    spuId: 4,
    imgName: 'iPhone15-黑色.jpg',
    imgUrl: 'https://images.unsplash.com/photo-1580910051074-3eb694886571?w=400&h=400&fit=crop',
  },
  // ==================== 华为 P60 Pro (spuId: 5) ====================
  {
    id: 9,
    spuId: 5,
    imgName: 'P60Pro-羽砂黑.jpg',
    imgUrl: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&h=400&fit=crop',
  },
  {
    id: 10,
    spuId: 5,
    imgName: 'P60Pro-羽砂白.jpg',
    imgUrl: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=400&fit=crop',
  },

  // ==================== 小米 14 (spuId: 6) ====================
  {
    id: 11,
    spuId: 6,
    imgName: 'Xiaomi14-黑色.jpg',
    imgUrl: 'https://images.unsplash.com/photo-1621330396173-e41b1cafd17f?w=400&h=400&fit=crop',
  },
  {
    id: 12,
    spuId: 6,
    imgName: 'Xiaomi14-白色.jpg',
    imgUrl: 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=400&h=400&fit=crop',
  },
  // ==================== OPPO Find X7 (spuId: 7) ====================
  {
    id: 13,
    spuId: 7,
    imgName: 'FindX7-黑色.jpg',
    imgUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop',
  },
  {
    id: 14,
    spuId: 7,
    imgName: 'FindX7-白色.jpg',
    imgUrl: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&h=400&fit=crop',
  },
  // ==================== vivo X100 (spuId: 8) ====================
  {
    id: 15,
    spuId: 8,
    imgName: 'X100-蓝色.jpg',
    imgUrl: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&h=400&fit=crop',
  },
  {
    id: 16,
    spuId: 8,
    imgName: 'X100-白色.jpg',
    imgUrl: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=400&fit=crop',
  },

  // ==================== 诺基亚 105 (spuId: 9) ====================
  {
    id: 17,
    spuId: 9,
    imgName: 'Nokia105-黑色.jpg',
    imgUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=400&fit=crop',
  },
  {
    id: 18,
    spuId: 9,
    imgName: 'Nokia105-蓝色.jpg',
    imgUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
  },
  // ==================== 飞利浦 E171L (spuId: 10) ====================
  {
    id: 19,
    spuId: 10,
    imgName: 'E171L-金色.jpg',
    imgUrl: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=400&fit=crop',
  },

  // ==================== 联想 ThinkPad X1 Carbon (spuId: 11) ====================
  {
    id: 20,
    spuId: 11,
    imgName: 'ThinkPad-X1C-正面.jpg',
    imgUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=400&fit=crop',
  },
  {
    id: 21,
    spuId: 11,
    imgName: 'ThinkPad-X1C-侧面.jpg',
    imgUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop',
  },
  // ==================== 戴尔 XPS 15 (spuId: 12) ====================
  {
    id: 22,
    spuId: 12,
    imgName: 'XPS15-银色.jpg',
    imgUrl: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=400&fit=crop',
  },
  {
    id: 23,
    spuId: 12,
    imgName: 'XPS15-背面.jpg',
    imgUrl: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400&h=400&fit=crop',
  },

  // ==================== 耐克 Dri-FIT T恤 (spuId: 13) ====================
  {
    id: 24,
    spuId: 13,
    imgName: 'DriFIT-黑色.jpg',
    imgUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
  },
  {
    id: 25,
    spuId: 13,
    imgName: 'DriFIT-白色.jpg',
    imgUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&h=400&fit=crop',
  },
  // ==================== 优衣库 UT (spuId: 14) ====================
  {
    id: 26,
    spuId: 14,
    imgName: 'UT-白色.jpg',
    imgUrl: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400&h=400&fit=crop',
  },
  // ==================== 阿迪达斯 T恤 (spuId: 15) ====================
  {
    id: 27,
    spuId: 15,
    imgName: 'Essentials-灰色.jpg',
    imgUrl: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&h=400&fit=crop',
  },
  // ==================== 优衣库 衬衫 (spuId: 16) ====================
  {
    id: 28,
    spuId: 16,
    imgName: '免烫衬衫-白色.jpg',
    imgUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=400&fit=crop',
  },
  {
    id: 29,
    spuId: 16,
    imgName: '免烫衬衫-蓝色.jpg',
    imgUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop',
  },
  // ==================== ZARA 裙子 (spuId: 17) ====================
  {
    id: 30,
    spuId: 17,
    imgName: '连衣裙-碎花.jpg',
    imgUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=400&fit=crop',
  },
  {
    id: 31,
    spuId: 17,
    imgName: '连衣裙-红色.jpg',
    imgUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop',
  },

  // ==================== 海尔 智慧屏 (spuId: 18) ====================
  {
    id: 32,
    spuId: 18,
    imgName: '海尔75寸电视.jpg',
    imgUrl: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop',
  },
  // ==================== 索尼 Bravia (spuId: 19) ====================
  {
    id: 33,
    spuId: 19,
    imgName: '索尼OLED-65.jpg',
    imgUrl: 'https://images.unsplash.com/photo-1461151304267-38535e780c79?w=400&h=400&fit=crop',
  },
  // ==================== 美的 夜灯 (spuId: 20) ====================
  {
    id: 34,
    spuId: 20,
    imgName: '护眼夜灯.jpg',
    imgUrl: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400&h=400&fit=crop',
  },
]

// SPU 销售属性数据
const spuSaleAttrs = [
  // ==================== iPhone 15 Pro (spuId: 1) ====================
  {
    id: 1,
    spuId: 1,
    baseSaleAttrId: 1,
    saleAttrName: '颜色',
    spuSaleAttrValueList: [
      { id: 1, baseSaleAttrId: 1, saleAttrValueName: '黑色', saleAttrName: '颜色' },
      { id: 2, baseSaleAttrId: 1, saleAttrValueName: '白色', saleAttrName: '颜色' },
      { id: 3, baseSaleAttrId: 1, saleAttrValueName: '蓝色', saleAttrName: '颜色' },
    ],
  },
  {
    id: 2,
    spuId: 1,
    baseSaleAttrId: 2,
    saleAttrName: '版本',
    spuSaleAttrValueList: [
      { id: 4, baseSaleAttrId: 2, saleAttrValueName: '128GB', saleAttrName: '版本' },
      { id: 5, baseSaleAttrId: 2, saleAttrValueName: '256GB', saleAttrName: '版本' },
      { id: 6, baseSaleAttrId: 2, saleAttrValueName: '512GB', saleAttrName: '版本' },
      { id: 7, baseSaleAttrId: 2, saleAttrValueName: '1TB', saleAttrName: '版本' },
    ],
  },

  // ==================== 华为 Mate 60 Pro (spuId: 2) ====================
  {
    id: 3,
    spuId: 2,
    baseSaleAttrId: 1,
    saleAttrName: '颜色',
    spuSaleAttrValueList: [
      { id: 8, baseSaleAttrId: 1, saleAttrValueName: '雅川青', saleAttrName: '颜色' },
      { id: 9, baseSaleAttrId: 1, saleAttrValueName: '白沙银', saleAttrName: '颜色' },
      { id: 10, baseSaleAttrId: 1, saleAttrValueName: '南糯紫', saleAttrName: '颜色' },
    ],
  },
  {
    id: 4,
    spuId: 2,
    baseSaleAttrId: 2,
    saleAttrName: '版本',
    spuSaleAttrValueList: [
      { id: 11, baseSaleAttrId: 2, saleAttrValueName: '256GB', saleAttrName: '版本' },
      { id: 12, baseSaleAttrId: 2, saleAttrValueName: '512GB', saleAttrName: '版本' },
      { id: 13, baseSaleAttrId: 2, saleAttrValueName: '1TB', saleAttrName: '版本' },
    ],
  },

  // ==================== 小米 14 Pro (spuId: 3) ====================
  {
    id: 5,
    spuId: 3,
    baseSaleAttrId: 1,
    saleAttrName: '颜色',
    spuSaleAttrValueList: [
      { id: 14, baseSaleAttrId: 1, saleAttrValueName: '黑色', saleAttrName: '颜色' },
      { id: 15, baseSaleAttrId: 1, saleAttrValueName: '白色', saleAttrName: '颜色' },
      { id: 16, baseSaleAttrId: 1, saleAttrValueName: '绿色', saleAttrName: '颜色' },
    ],
  },

  // ==================== iPhone 15 (spuId: 4) ====================
  {
    id: 6,
    spuId: 4,
    baseSaleAttrId: 1,
    saleAttrName: '颜色',
    spuSaleAttrValueList: [
      { id: 17, baseSaleAttrId: 1, saleAttrValueName: '粉色', saleAttrName: '颜色' },
      { id: 18, baseSaleAttrId: 1, saleAttrValueName: '黄色', saleAttrName: '颜色' },
      { id: 19, baseSaleAttrId: 1, saleAttrValueName: '蓝色', saleAttrName: '颜色' },
      { id: 20, baseSaleAttrId: 1, saleAttrValueName: '黑色', saleAttrName: '颜色' },
    ],
  },

  // ==================== 华为 P60 Pro (spuId: 5) ====================
  {
    id: 7,
    spuId: 5,
    baseSaleAttrId: 1,
    saleAttrName: '颜色',
    spuSaleAttrValueList: [
      { id: 21, baseSaleAttrId: 1, saleAttrValueName: '羽砂黑', saleAttrName: '颜色' },
      { id: 22, baseSaleAttrId: 1, saleAttrValueName: '羽砂白', saleAttrName: '颜色' },
      { id: 23, baseSaleAttrId: 1, saleAttrValueName: '翡冷翠', saleAttrName: '颜色' },
    ],
  },

  // ==================== 小米 14 (spuId: 6) ====================
  {
    id: 8,
    spuId: 6,
    baseSaleAttrId: 1,
    saleAttrName: '颜色',
    spuSaleAttrValueList: [
      { id: 24, baseSaleAttrId: 1, saleAttrValueName: '黑色', saleAttrName: '颜色' },
      { id: 25, baseSaleAttrId: 1, saleAttrValueName: '白色', saleAttrName: '颜色' },
    ],
  },
  {
    id: 9,
    spuId: 6,
    baseSaleAttrId: 4,
    saleAttrName: '尺码',
    spuSaleAttrValueList: [],
  },

  // ==================== OPPO Find X7 (spuId: 7) ====================
  {
    id: 10,
    spuId: 7,
    baseSaleAttrId: 1,
    saleAttrName: '颜色',
    spuSaleAttrValueList: [
      { id: 26, baseSaleAttrId: 1, saleAttrValueName: '海阔天空', saleAttrName: '颜色' },
      { id: 27, baseSaleAttrId: 1, saleAttrValueName: '暮山紫', saleAttrName: '颜色' },
    ],
  },

  // ==================== vivo X100 (spuId: 8) ====================
  {
    id: 11,
    spuId: 8,
    baseSaleAttrId: 1,
    saleAttrName: '颜色',
    spuSaleAttrValueList: [
      { id: 28, baseSaleAttrId: 1, saleAttrValueName: '落日橙', saleAttrName: '颜色' },
      { id: 29, baseSaleAttrId: 1, saleAttrValueName: '星迹蓝', saleAttrName: '颜色' },
    ],
  },

  // ==================== 联想 ThinkPad X1 Carbon (spuId: 9) ====================
  {
    id: 12,
    spuId: 9,
    baseSaleAttrId: 2,
    saleAttrName: '版本',
    spuSaleAttrValueList: [
      { id: 30, baseSaleAttrId: 2, saleAttrValueName: 'i7/16GB/512GB', saleAttrName: '版本' },
      { id: 31, baseSaleAttrId: 2, saleAttrValueName: 'i7/32GB/1TB', saleAttrName: '版本' },
    ],
  },

  // ==================== 戴尔 XPS 15 (spuId: 10) ====================
  {
    id: 13,
    spuId: 10,
    baseSaleAttrId: 2,
    saleAttrName: '版本',
    spuSaleAttrValueList: [
      { id: 32, baseSaleAttrId: 2, saleAttrValueName: 'i9/32GB/1TB', saleAttrName: '版本' },
      { id: 33, baseSaleAttrId: 2, saleAttrValueName: 'i7/16GB/512GB', saleAttrName: '版本' },
    ],
  },

  // ==================== 诺基亚 105 (spuId: 11) ====================
  {
    id: 14,
    spuId: 11,
    baseSaleAttrId: 1,
    saleAttrName: '颜色',
    spuSaleAttrValueList: [
      { id: 34, baseSaleAttrId: 1, saleAttrValueName: '黑色', saleAttrName: '颜色' },
      { id: 35, baseSaleAttrId: 1, saleAttrValueName: '蓝色', saleAttrName: '颜色' },
    ],
  },

  // ==================== 飞利浦 E171L (spuId: 12) ====================
  {
    id: 15,
    spuId: 12,
    baseSaleAttrId: 1,
    saleAttrName: '颜色',
    spuSaleAttrValueList: [
      { id: 36, baseSaleAttrId: 1, saleAttrValueName: '金色', saleAttrName: '颜色' },
      { id: 37, baseSaleAttrId: 1, saleAttrValueName: '黑色', saleAttrName: '颜色' },
    ],
  },

  // ==================== 耐克 Dri-FIT T恤 (spuId: 13) ====================
  {
    id: 16,
    spuId: 13,
    baseSaleAttrId: 1,
    saleAttrName: '颜色',
    spuSaleAttrValueList: [
      { id: 38, baseSaleAttrId: 1, saleAttrValueName: '黑色', saleAttrName: '颜色' },
      { id: 39, baseSaleAttrId: 1, saleAttrValueName: '白色', saleAttrName: '颜色' },
      { id: 40, baseSaleAttrId: 1, saleAttrValueName: '灰色', saleAttrName: '颜色' },
    ],
  },
  {
    id: 17,
    spuId: 13,
    baseSaleAttrId: 4,
    saleAttrName: '尺码',
    spuSaleAttrValueList: [
      { id: 41, baseSaleAttrId: 4, saleAttrValueName: 'S', saleAttrName: '尺码' },
      { id: 42, baseSaleAttrId: 4, saleAttrValueName: 'M', saleAttrName: '尺码' },
      { id: 43, baseSaleAttrId: 4, saleAttrValueName: 'L', saleAttrName: '尺码' },
      { id: 44, baseSaleAttrId: 4, saleAttrValueName: 'XL', saleAttrName: '尺码' },
      { id: 45, baseSaleAttrId: 4, saleAttrValueName: 'XXL', saleAttrName: '尺码' },
    ],
  },

  // ==================== 优衣库 UT T恤 (spuId: 14) ====================
  {
    id: 18,
    spuId: 14,
    baseSaleAttrId: 1,
    saleAttrName: '颜色',
    spuSaleAttrValueList: [
      { id: 46, baseSaleAttrId: 1, saleAttrValueName: '白色', saleAttrName: '颜色' },
      { id: 47, baseSaleAttrId: 1, saleAttrValueName: '黑色', saleAttrName: '颜色' },
      { id: 48, baseSaleAttrId: 1, saleAttrValueName: '藏青色', saleAttrName: '颜色' },
    ],
  },
  {
    id: 19,
    spuId: 14,
    baseSaleAttrId: 4,
    saleAttrName: '尺码',
    spuSaleAttrValueList: [
      { id: 49, baseSaleAttrId: 4, saleAttrValueName: 'S', saleAttrName: '尺码' },
      { id: 50, baseSaleAttrId: 4, saleAttrValueName: 'M', saleAttrName: '尺码' },
      { id: 51, baseSaleAttrId: 4, saleAttrValueName: 'L', saleAttrName: '尺码' },
      { id: 52, baseSaleAttrId: 4, saleAttrValueName: 'XL', saleAttrName: '尺码' },
      { id: 53, baseSaleAttrId: 4, saleAttrValueName: 'XXL', saleAttrName: '尺码' },
    ],
  },

  // ==================== 阿迪达斯 T恤 (spuId: 15) ====================
  {
    id: 20,
    spuId: 15,
    baseSaleAttrId: 1,
    saleAttrName: '颜色',
    spuSaleAttrValueList: [
      { id: 54, baseSaleAttrId: 1, saleAttrValueName: '灰色', saleAttrName: '颜色' },
      { id: 55, baseSaleAttrId: 1, saleAttrValueName: '黑色', saleAttrName: '颜色' },
    ],
  },

  // ==================== 优衣库 衬衫 (spuId: 16) ====================
  {
    id: 21,
    spuId: 16,
    baseSaleAttrId: 1,
    saleAttrName: '颜色',
    spuSaleAttrValueList: [
      { id: 56, baseSaleAttrId: 1, saleAttrValueName: '白色', saleAttrName: '颜色' },
      { id: 57, baseSaleAttrId: 1, saleAttrValueName: '蓝色', saleAttrName: '颜色' },
    ],
  },
  {
    id: 22,
    spuId: 16,
    baseSaleAttrId: 4,
    saleAttrName: '尺码',
    spuSaleAttrValueList: [
      { id: 58, baseSaleAttrId: 4, saleAttrValueName: '38', saleAttrName: '尺码' },
      { id: 59, baseSaleAttrId: 4, saleAttrValueName: '39', saleAttrName: '尺码' },
      { id: 60, baseSaleAttrId: 4, saleAttrValueName: '40', saleAttrName: '尺码' },
      { id: 61, baseSaleAttrId: 4, saleAttrValueName: '41', saleAttrName: '尺码' },
    ],
  },

  // ==================== ZARA 连衣裙 (spuId: 17) ====================
  {
    id: 23,
    spuId: 17,
    baseSaleAttrId: 1,
    saleAttrName: '颜色',
    spuSaleAttrValueList: [
      { id: 62, baseSaleAttrId: 1, saleAttrValueName: '碎花', saleAttrName: '颜色' },
      { id: 63, baseSaleAttrId: 1, saleAttrValueName: '红色', saleAttrName: '颜色' },
      { id: 64, baseSaleAttrId: 1, saleAttrValueName: '黑色', saleAttrName: '颜色' },
    ],
  },
  {
    id: 24,
    spuId: 17,
    baseSaleAttrId: 4,
    saleAttrName: '尺码',
    spuSaleAttrValueList: [
      { id: 65, baseSaleAttrId: 4, saleAttrValueName: 'S', saleAttrName: '尺码' },
      { id: 66, baseSaleAttrId: 4, saleAttrValueName: 'M', saleAttrName: '尺码' },
      { id: 67, baseSaleAttrId: 4, saleAttrValueName: 'L', saleAttrName: '尺码' },
    ],
  },

  // ==================== 海尔 智慧屏电视 (spuId: 18) ====================
  {
    id: 25,
    spuId: 18,
    baseSaleAttrId: 2,
    saleAttrName: '版本',
    spuSaleAttrValueList: [
      { id: 68, baseSaleAttrId: 2, saleAttrValueName: '75英寸4K', saleAttrName: '版本' },
      { id: 69, baseSaleAttrId: 2, saleAttrValueName: '85英寸4K', saleAttrName: '版本' },
    ],
  },

  // ==================== 索尼 Bravia OLED (spuId: 19) ====================
  {
    id: 26,
    spuId: 19,
    baseSaleAttrId: 2,
    saleAttrName: '版本',
    spuSaleAttrValueList: [
      { id: 70, baseSaleAttrId: 2, saleAttrValueName: '55英寸OLED', saleAttrName: '版本' },
      { id: 71, baseSaleAttrId: 2, saleAttrValueName: '65英寸OLED', saleAttrName: '版本' },
    ],
  },

  // ==================== 美的 护眼夜灯 (spuId: 20) ====================
  {
    id: 27,
    spuId: 20,
    baseSaleAttrId: 1,
    saleAttrName: '颜色',
    spuSaleAttrValueList: [
      { id: 72, baseSaleAttrId: 1, saleAttrValueName: '白色', saleAttrName: '颜色' },
      { id: 73, baseSaleAttrId: 1, saleAttrValueName: '粉色', saleAttrName: '颜色' },
    ],
  },
]

// 基础销售属性列表（供选择）
const baseSaleAttrList = [
  { id: 1, name: '颜色' },
  { id: 2, name: '版本' },
  { id: 3, name: '套餐' },
  { id: 4, name: '尺码' },
]

let spus = [
  // ==================== 智能手机 (category3Id: 111) ====================
  {
    id: 1,
    spuName: 'iPhone 15 Pro',
    description: '苹果最新旗舰手机',
    category3Id: 111,
    tmId: 3,
    spuSaleAttrList: [1, 2],
    spuImageList: [1, 2],
    createTime: '2024-01-01',
    updateTime: '2024-01-01',
  },
  {
    id: 2,
    spuName: '华为 Mate 60 Pro',
    description: '华为旗舰手机',
    category3Id: 111,
    tmId: 1,
    spuSaleAttrList: [3, 4],
    spuImageList: [3, 4],
    createTime: '2024-01-02',
    updateTime: '2024-01-02',
  },
  {
    id: 3,
    spuName: '小米 14 Pro',
    description: '小米旗舰手机',
    category3Id: 111,
    tmId: 2,
    spuSaleAttrList: [5],
    spuImageList: [5, 6],
    createTime: '2024-01-03',
    updateTime: '2024-01-03',
  },
  {
    id: 4,
    spuName: 'iPhone 15',
    description: '苹果标准版',
    category3Id: 111,
    tmId: 3,
    spuSaleAttrList: [6],
    spuImageList: [7, 8],
    createTime: '2024-01-04',
    updateTime: '2024-01-04',
  },
  {
    id: 5,
    spuName: '华为 P60 Pro',
    description: '华为P系列旗舰',
    category3Id: 111,
    tmId: 1,
    spuSaleAttrList: [7],
    spuImageList: [9, 10],
    createTime: '2024-01-05',
    updateTime: '2024-01-05',
  },
  {
    id: 6,
    spuName: '小米 14',
    description: '小米标准版',
    category3Id: 111,
    tmId: 2,
    spuSaleAttrList: [8],
    spuImageList: [11, 12],
    createTime: '2024-01-06',
    updateTime: '2024-01-06',
  },
  {
    id: 7,
    spuName: 'OPPO Find X7',
    description: 'OPPO旗舰手机',
    category3Id: 111,
    tmId: 5,
    spuSaleAttrList: [10],
    spuImageList: [13, 14],
    createTime: '2024-01-07',
    updateTime: '2024-01-07',
  },
  {
    id: 8,
    spuName: 'vivo X100',
    description: 'vivo旗舰手机',
    category3Id: 111,
    tmId: 6,
    spuSaleAttrList: [11],
    spuImageList: [15, 16],
    createTime: '2024-01-08',
    updateTime: '2024-01-08',
  },

  // ==================== 老人机 (category3Id: 112) ====================
  {
    id: 9,
    spuName: '诺基亚 105',
    description: '经典老人机，超长待机',
    category3Id: 112,
    tmId: 17,
    spuSaleAttrList: [14],
    spuImageList: [17, 18],
    createTime: '2024-01-06',
    updateTime: '2024-01-06',
  },
  {
    id: 10,
    spuName: '飞利浦 E171L',
    description: '双卡双待老人机',
    category3Id: 112,
    tmId: 18,
    spuSaleAttrList: [15],
    spuImageList: [19],
    createTime: '2024-01-07',
    updateTime: '2024-01-07',
  },

  // ==================== 笔记本 (category3Id: 121) ====================
  {
    id: 11,
    spuName: '联想 ThinkPad X1 Carbon',
    description: '商务轻薄笔记本',
    category3Id: 121,
    tmId: 15,
    spuSaleAttrList: [12],
    spuImageList: [20, 21],
    createTime: '2024-01-08',
    updateTime: '2024-01-08',
  },
  {
    id: 12,
    spuName: '戴尔 XPS 15',
    description: '高性能创作本',
    category3Id: 121,
    tmId: 16,
    spuSaleAttrList: [13],
    spuImageList: [22, 23],
    createTime: '2024-01-09',
    updateTime: '2024-01-09',
  },

  // ==================== T恤 (category3Id: 211) ====================
  {
    id: 13,
    spuName: '耐克 Dri-FIT 运动T恤',
    description: '速干透气运动T恤',
    category3Id: 211,
    tmId: 7,
    spuSaleAttrList: [16, 17],
    spuImageList: [24, 25],
    createTime: '2024-02-01',
    updateTime: '2024-02-01',
  },
  {
    id: 14,
    spuName: '优衣库 UT系列纯棉T恤',
    description: '经典圆领纯棉T恤',
    category3Id: 211,
    tmId: 9,
    spuSaleAttrList: [18, 19],
    spuImageList: [26],
    createTime: '2024-02-02',
    updateTime: '2024-02-02',
  },
  {
    id: 15,
    spuName: '阿迪达斯 Essentials T恤',
    description: '休闲基础款T恤',
    category3Id: 211,
    tmId: 8,
    spuSaleAttrList: [20],
    spuImageList: [27],
    createTime: '2024-02-03',
    updateTime: '2024-02-03',
  },

  // ==================== 衬衫 (category3Id: 212) ====================
  {
    id: 16,
    spuName: '优衣库 免烫衬衫',
    description: '商务正装免烫衬衫',
    category3Id: 212,
    tmId: 9,
    spuSaleAttrList: [21, 22],
    spuImageList: [28, 29],
    createTime: '2024-03-01',
    updateTime: '2024-03-01',
  },

  // ==================== 裙子 (category3Id: 221) ====================
  {
    id: 17,
    spuName: 'ZARA 连衣裙',
    description: '法式碎花连衣裙',
    category3Id: 221,
    tmId: 10,
    spuSaleAttrList: [23, 24],
    spuImageList: [30, 31],
    createTime: '2024-04-01',
    updateTime: '2024-04-01',
  },

  // ==================== 电视 (category3Id: 311) ====================
  {
    id: 18,
    spuName: '海尔 智慧屏电视',
    description: '75英寸4K超高清智能电视',
    category3Id: 311,
    tmId: 11,
    spuSaleAttrList: [25],
    spuImageList: [32],
    createTime: '2024-05-01',
    updateTime: '2024-05-01',
  },
  {
    id: 19,
    spuName: '索尼 Bravia OLED电视',
    description: '65英寸OLED旗舰电视',
    category3Id: 311,
    tmId: 14,
    spuSaleAttrList: [26],
    spuImageList: [33],
    createTime: '2024-05-02',
    updateTime: '2024-05-02',
  },

  // ==================== 夜灯 (category3Id: 321) ====================
  {
    id: 20,
    spuName: '美的 护眼夜灯',
    description: '智能调光护眼台灯',
    category3Id: 321,
    tmId: 12,
    spuSaleAttrList: [27],
    spuImageList: [34],
    createTime: '2024-06-01',
    updateTime: '2024-06-01',
  },
]

let skus = [
  // ==================== 智能手机 (spuId: 1-8, category3Id: 111) ====================
  {
    id: 1,
    skuName: 'iPhone 15 Pro 256GB 黑色',
    price: 8999,
    weight: 200,
    skuDefaultImg:
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop',
    skuDesc: '黑色钛金属',
    isSale: 1,
    category3Id: 111,
    spuId: 1,
    tmId: 3,
    skuAttrValueList: [
      { attrId: 1, valueId: 11, valueName: '256GB' },
      { attrId: 2, valueId: 21, valueName: '黑色' },
      { attrId: 3, valueId: 31, valueName: '钛金属材质' }
    ],
    skuSaleAttrValueList: [
      { saleAttrId: 1, saleAttrValueId: 101, saleAttrValueName: '内存版本' },
      { saleAttrId: 2, saleAttrValueId: 102, saleAttrValueName: '颜色' }
    ],
    skuImageList: [
      { id: 1, imgName: 'iPhone15Pro-black-1.jpg', imgUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop', spuId: 1, isDefault: '1' },
      { id: 2, imgName: 'iPhone15Pro-black-2.jpg', imgUrl: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=400&h=400&fit=crop', spuId: 1, isDefault: '0' },
      { id: 3, imgName: 'iPhone15Pro-black-3.jpg', imgUrl: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400&h=400&fit=crop', spuId: 1, isDefault: '0' },
      { id: 4, imgName: 'iPhone15Pro-black-4.jpg', imgUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop', spuId: 1, isDefault: '0' }
    ],
    createTime: '2024-01-01',
    updateTime: '2024-01-01',
  },
  {
    id: 2,
    skuName: 'iPhone 15 Pro 256GB 蓝色',
    price: 8999,
    weight: 200,
    skuDefaultImg:
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop',
    skuDesc: '蓝色钛金属',
    isSale: 1,
    category3Id: 111,
    spuId: 1,
    tmId: 3,
    skuAttrValueList: [
      { attrId: 1, valueId: 11, valueName: '256GB' },
      { attrId: 2, valueId: 22, valueName: '蓝色' },
      { attrId: 3, valueId: 31, valueName: '钛金属材质' }
    ],
    skuSaleAttrValueList: [
      { saleAttrId: 1, saleAttrValueId: 101, saleAttrValueName: '内存版本' },
      { saleAttrId: 2, saleAttrValueId: 103, saleAttrValueName: '颜色' }
    ],
    skuImageList: [
      { id: 5, imgName: 'iPhone15Pro-blue-1.jpg', imgUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop', spuId: 1, isDefault: '1' },
      { id: 6, imgName: 'iPhone15Pro-blue-2.jpg', imgUrl: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=400&h=400&fit=crop', spuId: 1, isDefault: '0' },
      { id: 7, imgName: 'iPhone15Pro-blue-3.jpg', imgUrl: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400&h=400&fit=crop', spuId: 1, isDefault: '0' }
    ],
    createTime: '2024-01-01',
    updateTime: '2024-01-01',
  },
  {
    id: 3,
    skuName: '华为 Mate 60 Pro 512GB 雅川青',
    price: 6999,
    weight: 220,
    skuDefaultImg:
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
    skuDesc: '雅川青配色',
    isSale: 1,
    category3Id: 111,
    spuId: 2,
    tmId: 1,
    skuAttrValueList: [
      { attrId: 1, valueId: 12, valueName: '512GB' },
      { attrId: 2, valueId: 23, valueName: '雅川青' },
      { attrId: 4, valueId: 41, valueName: '麒麟芯片' }
    ],
    skuSaleAttrValueList: [
      { saleAttrId: 1, saleAttrValueId: 102, saleAttrValueName: '存储容量' },
      { saleAttrId: 2, saleAttrValueId: 104, saleAttrValueName: '颜色' }
    ],
    skuImageList: [
      { id: 8, imgName: 'mate60pro-green-1.jpg', imgUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop', spuId: 2, isDefault: '1' },
      { id: 9, imgName: 'mate60pro-green-2.jpg', imgUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop', spuId: 2, isDefault: '0' },
      { id: 10, imgName: 'mate60pro-green-3.jpg', imgUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop', spuId: 2, isDefault: '0' }
    ],
    createTime: '2024-01-02',
    updateTime: '2024-01-02',
  },
  {
    id: 4,
    skuName: '华为 Mate 60 Pro 512GB 白沙银',
    price: 6999,
    weight: 220,
    skuDefaultImg:
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=400&h=400&fit=crop',
    skuDesc: '白沙银配色',
    isSale: 0,
    category3Id: 111,
    spuId: 2,
    tmId: 1,
    skuAttrValueList: [
      { attrId: 1, valueId: 12, valueName: '512GB' },
      { attrId: 2, valueId: 24, valueName: '白沙银' },
      { attrId: 4, valueId: 41, valueName: '麒麟芯片' }
    ],
    skuSaleAttrValueList: [
      { saleAttrId: 1, saleAttrValueId: 102, saleAttrValueName: '存储容量' },
      { saleAttrId: 2, saleAttrValueId: 105, saleAttrValueName: '颜色' }
    ],
    skuImageList: [
      { id: 11, imgName: 'mate60pro-white-1.jpg', imgUrl: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=400&h=400&fit=crop', spuId: 2, isDefault: '1' },
      { id: 12, imgName: 'mate60pro-white-2.jpg', imgUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop', spuId: 2, isDefault: '0' }
    ],
    createTime: '2024-01-02',
    updateTime: '2024-01-02',
  },
  {
    id: 5,
    skuName: '小米 14 Pro 256GB 黑色',
    price: 4999,
    weight: 210,
    skuDefaultImg:
      'https://images.unsplash.com/photo-1621330396173-e41b1cafd17f?w=400&h=400&fit=crop',
    skuDesc: '黑色版',
    isSale: 1,
    category3Id: 111,
    spuId: 3,
    tmId: 2,
    skuAttrValueList: [
      { attrId: 1, valueId: 11, valueName: '256GB' },
      { attrId: 2, valueId: 21, valueName: '黑色' },
      { attrId: 5, valueId: 51, valueName: '骁龙8Gen3' }
    ],
    skuSaleAttrValueList: [
      { saleAttrId: 1, saleAttrValueId: 101, saleAttrValueName: '内存版本' },
      { saleAttrId: 2, saleAttrValueId: 102, saleAttrValueName: '颜色' }
    ],
    skuImageList: [
      { id: 13, imgName: 'xiaomi14pro-black-1.jpg', imgUrl: 'https://images.unsplash.com/photo-1621330396173-e41b1cafd17f?w=400&h=400&fit=crop', spuId: 3, isDefault: '1' },
      { id: 14, imgName: 'xiaomi14pro-black-2.jpg', imgUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop', spuId: 3, isDefault: '0' },
      { id: 15, imgName: 'xiaomi14pro-black-3.jpg', imgUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop', spuId: 3, isDefault: '0' }
    ],
    createTime: '2024-01-03',
    updateTime: '2024-01-03',
  },
  {
    id: 6,
    skuName: '小米 14 Pro 256GB 白色',
    price: 4999,
    weight: 210,
    skuDefaultImg:
      'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=400&h=400&fit=crop',
    skuDesc: '白色版',
    isSale: 0,
    category3Id: 111,
    spuId: 3,
    tmId: 2,
    skuAttrValueList: [],
    skuSaleAttrValueList: [],
    createTime: '2024-01-03',
    updateTime: '2024-01-03',
  },
  {
    id: 7,
    skuName: 'iPhone 15 128GB 粉色',
    price: 5999,
    weight: 180,
    skuDefaultImg:
      'https://images.unsplash.com/photo-1505720483508-6e8f9b7c8e47?w=400&h=400&fit=crop',
    skuDesc: '粉色版',
    isSale: 1,
    category3Id: 111,
    spuId: 4,
    tmId: 3,
    skuAttrValueList: [],
    skuSaleAttrValueList: [],
    createTime: '2024-01-04',
    updateTime: '2024-01-04',
  },
  {
    id: 8,
    skuName: 'iPhone 15 128GB 黑色',
    price: 5999,
    weight: 180,
    skuDefaultImg:
      'https://images.unsplash.com/photo-1580910051074-3eb694886571?w=400&h=400&fit=crop',
    skuDesc: '黑色版',
    isSale: 1,
    category3Id: 111,
    spuId: 4,
    tmId: 3,
    skuAttrValueList: [],
    skuSaleAttrValueList: [],
    createTime: '2024-01-04',
    updateTime: '2024-01-04',
  },
  {
    id: 9,
    skuName: '华为 P60 Pro 256GB 羽砂黑',
    price: 5988,
    weight: 200,
    skuDefaultImg:
      'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&h=400&fit=crop',
    skuDesc: '羽砂黑配色',
    isSale: 1,
    category3Id: 111,
    spuId: 5,
    tmId: 1,
    skuAttrValueList: [],
    skuSaleAttrValueList: [],
    createTime: '2024-01-05',
    updateTime: '2024-01-05',
  },
  {
    id: 10,
    skuName: '华为 P60 Pro 256GB 羽砂白',
    price: 5988,
    weight: 200,
    skuDefaultImg:
      'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=400&fit=crop',
    skuDesc: '羽砂白配色',
    isSale: 0,
    category3Id: 111,
    spuId: 5,
    tmId: 1,
    skuAttrValueList: [],
    skuSaleAttrValueList: [],
    createTime: '2024-01-05',
    updateTime: '2024-01-05',
  },
  {
    id: 11,
    skuName: '小米 14 256GB 黑色',
    price: 3999,
    weight: 190,
    skuDefaultImg:
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop',
    skuDesc: '黑色版',
    isSale: 1,
    category3Id: 111,
    spuId: 6,
    tmId: 2,
    skuAttrValueList: [],
    skuSaleAttrValueList: [],
    createTime: '2024-01-06',
    updateTime: '2024-01-06',
  },
  {
    id: 12,
    skuName: '小米 14 256GB 白色',
    price: 3999,
    weight: 190,
    skuDefaultImg:
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
    skuDesc: '白色版',
    isSale: 1,
    category3Id: 111,
    spuId: 6,
    tmId: 2,
    skuAttrValueList: [],
    skuSaleAttrValueList: [],
    createTime: '2024-01-06',
    updateTime: '2024-01-06',
  },
  {
    id: 13,
    skuName: 'OPPO Find X7 256GB 海阔天空',
    price: 3999,
    weight: 210,
    skuDefaultImg:
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop',
    skuDesc: '海阔天空配色',
    isSale: 0,
    category3Id: 111,
    spuId: 7,
    tmId: 5,
    skuAttrValueList: [],
    skuSaleAttrValueList: [],
    createTime: '2024-01-07',
    updateTime: '2024-01-07',
  },
  {
    id: 14,
    skuName: 'vivo X100 256GB 落日橙',
    price: 3999,
    weight: 200,
    skuDefaultImg:
      'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&h=400&fit=crop',
    skuDesc: '落日橙配色',
    isSale: 1,
    category3Id: 111,
    spuId: 8,
    tmId: 6,
    skuAttrValueList: [],
    skuSaleAttrValueList: [],
    createTime: '2024-01-08',
    updateTime: '2024-01-08',
  },
  // ==================== 老人机 (spuId: 9-10, category3Id: 112) ====================
  {
    id: 15,
    skuName: '诺基亚 105 黑色',
    price: 199,
    weight: 80,
    skuDefaultImg:
      'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=400&fit=crop',
    skuDesc: '经典黑色',
    isSale: 1,
    category3Id: 112,
    spuId: 9,
    tmId: 17,
    skuAttrValueList: [],
    skuSaleAttrValueList: [],
    createTime: '2024-01-09',
    updateTime: '2024-01-09',
  },
  {
    id: 16,
    skuName: '诺基亚 105 蓝色',
    price: 199,
    weight: 80,
    skuDefaultImg:
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
    skuDesc: '活力蓝色',
    isSale: 0,
    category3Id: 112,
    spuId: 9,
    tmId: 17,
    skuAttrValueList: [],
    skuSaleAttrValueList: [],
    createTime: '2024-01-09',
    updateTime: '2024-01-09',
  },
  {
    id: 17,
    skuName: '飞利浦 E171L 金色',
    price: 299,
    weight: 90,
    skuDefaultImg:
      'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=400&fit=crop',
    skuDesc: '典雅金色',
    isSale: 1,
    category3Id: 112,
    spuId: 10,
    tmId: 18,
    skuAttrValueList: [],
    skuSaleAttrValueList: [],
    createTime: '2024-01-10',
    updateTime: '2024-01-10',
  },
  // ==================== 笔记本 (spuId: 11-12, category3Id: 121) ====================
  {
    id: 18,
    skuName: 'ThinkPad X1 Carbon i7/16GB/512GB',
    price: 12999,
    weight: 1120,
    skuDefaultImg:
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=400&fit=crop',
    skuDesc: '商务轻薄款',
    isSale: 1,
    category3Id: 121,
    spuId: 11,
    tmId: 15,
    skuAttrValueList: [],
    skuSaleAttrValueList: [],
    createTime: '2024-01-11',
    updateTime: '2024-01-11',
  },
  {
    id: 19,
    skuName: '戴尔 XPS 15 i9/32GB/1TB',
    price: 15999,
    weight: 1800,
    skuDefaultImg:
      'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&h=400&fit=crop',
    skuDesc: '高性能创作款',
    isSale: 0,
    category3Id: 121,
    spuId: 12,
    tmId: 16,
    skuAttrValueList: [],
    skuSaleAttrValueList: [],
    createTime: '2024-01-12',
    updateTime: '2024-01-12',
  },
  // ==================== T恤 (spuId: 13-15, category3Id: 211) ====================
  {
    id: 20,
    skuName: '耐克 Dri-FIT 运动T恤 黑色 M',
    price: 299,
    weight: 150,
    skuDefaultImg:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
    skuDesc: '黑色M码',
    isSale: 1,
    category3Id: 211,
    spuId: 13,
    tmId: 7,
    skuAttrValueList: [],
    skuSaleAttrValueList: [],
    createTime: '2024-02-01',
    updateTime: '2024-02-01',
  },
  {
    id: 21,
    skuName: '优衣库 UT系列纯棉T恤 白色 L',
    price: 79,
    weight: 130,
    skuDefaultImg:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
    skuDesc: '白色L码',
    isSale: 1,
    category3Id: 211,
    spuId: 14,
    tmId: 9,
    skuAttrValueList: [],
    skuSaleAttrValueList: [],
    createTime: '2024-02-02',
    updateTime: '2024-02-02',
  },
  {
    id: 22,
    skuName: '阿迪达斯 Essentials T恤 黑色 XL',
    price: 199,
    weight: 160,
    skuDefaultImg:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
    skuDesc: '黑色XL码',
    isSale: 0,
    category3Id: 211,
    spuId: 15,
    tmId: 8,
    skuAttrValueList: [],
    skuSaleAttrValueList: [],
    createTime: '2024-02-03',
    updateTime: '2024-02-03',
  },
  // ==================== 衬衫 (spuId: 16, category3Id: 212) ====================
  {
    id: 23,
    skuName: '优衣库 免烫衬衫 白色 M',
    price: 199,
    weight: 170,
    skuDefaultImg:
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop',
    skuDesc: '白色M码',
    isSale: 1,
    category3Id: 212,
    spuId: 16,
    tmId: 9,
    skuAttrValueList: [],
    skuSaleAttrValueList: [],
    createTime: '2024-03-01',
    updateTime: '2024-03-01',
  },
  // ==================== 裙子 (spuId: 17, category3Id: 221) ====================
  {
    id: 24,
    skuName: 'ZARA 连衣裙 碎花 S',
    price: 599,
    weight: 200,
    skuDefaultImg:
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=400&fit=crop',
    skuDesc: '碎花S码',
    isSale: 1,
    category3Id: 221,
    spuId: 17,
    tmId: 10,
    skuAttrValueList: [],
    skuSaleAttrValueList: [],
    createTime: '2024-04-01',
    updateTime: '2024-04-01',
  },
  // ==================== 电视 (spuId: 18-19, category3Id: 311) ====================
  {
    id: 25,
    skuName: '海尔 智慧屏电视 75英寸',
    price: 5999,
    weight: 25000,
    skuDefaultImg:
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop',
    skuDesc: '75英寸4K',
    isSale: 1,
    category3Id: 311,
    spuId: 18,
    tmId: 11,
    skuAttrValueList: [],
    skuSaleAttrValueList: [],
    createTime: '2024-05-01',
    updateTime: '2024-05-01',
  },
  {
    id: 26,
    skuName: '索尼 Bravia OLED电视 65英寸',
    price: 12999,
    weight: 18000,
    skuDefaultImg:
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop',
    skuDesc: '65英寸OLED',
    isSale: 0,
    category3Id: 311,
    spuId: 19,
    tmId: 14,
    skuAttrValueList: [],
    skuSaleAttrValueList: [],
    createTime: '2024-05-02',
    updateTime: '2024-05-02',
  },
  // ==================== 夜灯 (spuId: 20, category3Id: 321) ====================
  {
    id: 27,
    skuName: '美的 护眼夜灯 白色',
    price: 89,
    weight: 200,
    skuDefaultImg:
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400&h=400&fit=crop',
    skuDesc: '白色智能调光',
    isSale: 1,
    category3Id: 321,
    spuId: 20,
    tmId: 12,
    skuAttrValueList: [],
    skuSaleAttrValueList: [],
    createTime: '2024-06-01',
    updateTime: '2024-06-01',
  },
]

// let attrs = [
//   { id: 1, attrName: '颜色', categoryId: 61, categoryLevel: 3, attrValueList: [{ id: 1, valueName: '黑色' }, { id: 2, valueName: '白色' }, { id: 3, valueName: '金色' }] },
//   { id: 2, attrName: '内存', categoryId: 61, categoryLevel: 3, attrValueList: [{ id: 4, valueName: '128GB' }, { id: 5, valueName: '256GB' }, { id: 6, valueName: '512GB' }] },
//   { id: 3, attrName: '尺寸', categoryId: 61, categoryLevel: 3, attrValueList: [{ id: 7, valueName: '6.1英寸' }, { id: 8, valueName: '6.7英寸' }] },
// ]
let attrs = [
  // ==================== 智能手机 (category3Id: 111) ====================
  {
    id: 106,
    attrName: '手机一级',
    categoryId: 111,
    categoryLevel: 3,
    attrValueList: [
      { attrId: 106, id: 1001, valueName: '旗舰机' },
      { attrId: 106, id: 1002, valueName: '中端机' },
      { attrId: 106, id: 1003, valueName: '入门机' },
    ],
  },
  {
    id: 107,
    attrName: '电池容量',
    categoryId: 111,
    categoryLevel: 3,
    attrValueList: [
      { attrId: 107, id: 1004, valueName: '4000mAh' },
      { attrId: 107, id: 1005, valueName: '5000mAh' },
      { attrId: 107, id: 1006, valueName: '5500mAh' },
    ],
  },
  {
    id: 23,
    attrName: '运行内存',
    categoryId: 111,
    categoryLevel: 3,
    attrValueList: [
      { attrId: 23, id: 1007, valueName: '8GB' },
      { attrId: 23, id: 1008, valueName: '12GB' },
      { attrId: 23, id: 1009, valueName: '16GB' },
    ],
  },
  {
    id: 24,
    attrName: '机身内存',
    categoryId: 111,
    categoryLevel: 3,
    attrValueList: [
      { attrId: 24, id: 1010, valueName: '128GB' },
      { attrId: 24, id: 1011, valueName: '256GB' },
      { attrId: 24, id: 1012, valueName: '512GB' },
      { attrId: 24, id: 1013, valueName: '1TB' },
    ],
  },
  {
    id: 111,
    attrName: 'CPU型号',
    categoryId: 111,
    categoryLevel: 3,
    attrValueList: [
      { attrId: 111, id: 1014, valueName: '骁龙8Gen3' },
      { attrId: 111, id: 1015, valueName: '天玑9300' },
      { attrId: 111, id: 1016, valueName: 'A17 Pro' },
    ],
  },
  {
    id: 112,
    attrName: '屏幕尺寸',
    categoryId: 111,
    categoryLevel: 3,
    attrValueList: [
      { attrId: 112, id: 1017, valueName: '6.36英寸' },
      { attrId: 112, id: 1018, valueName: '6.7英寸' },
      { attrId: 112, id: 1019, valueName: '6.82英寸' },
    ],
  },

  // ==================== 1. 智能手机 (categoryId: 111) ====================
  {
    id: 1,
    attrName: '品牌',
    categoryId: 111,
    categoryLevel: 3,
    attrValueList: [
      { attrId: 1, id: 1, valueName: '华为' },
      { attrId: 1, id: 2, valueName: '小米' },
      { attrId: 1, id: 3, valueName: '苹果' },
      { attrId: 1, id: 4, valueName: 'OPPO' },
    ],
  },
  {
    id: 2,
    attrName: '颜色',
    categoryId: 111,
    categoryLevel: 3,
    attrValueList: [
      { attrId: 2, id: 5, valueName: '黑色' },
      { attrId: 2, id: 6, valueName: '白色' },
      { attrId: 2, id: 7, valueName: '金色' },
      { attrId: 2, id: 8, valueName: '蓝色' },
    ],
  },
  {
    id: 3,
    attrName: '内存',
    categoryId: 111,
    categoryLevel: 3,
    attrValueList: [
      { attrId: 3, id: 9, valueName: '128GB' },
      { attrId: 3, id: 10, valueName: '256GB' },
      { attrId: 3, id: 11, valueName: '512GB' },
      { attrId: 3, id: 12, valueName: '1TB' },
    ],
  },
  {
    id: 4,
    attrName: '尺寸',
    categoryId: 111,
    categoryLevel: 3,
    attrValueList: [
      { attrId: 4, id: 13, valueName: '6.1英寸' },
      { attrId: 4, id: 14, valueName: '6.7英寸' },
      { attrId: 4, id: 15, valueName: '6.8英寸' },
    ],
  },

  // ==================== 2. 老人机 (categoryId: 112) ====================
  {
    id: 5,
    attrName: '品牌',
    categoryId: 112,
    categoryLevel: 3,
    attrValueList: [
      { attrId: 5, id: 16, valueName: '诺基亚' },
      { attrId: 5, id: 17, valueName: '飞利浦' },
      { attrId: 5, id: 18, valueName: '天语' },
    ],
  },
  {
    id: 6,
    attrName: '颜色',
    categoryId: 112,
    categoryLevel: 3,
    attrValueList: [
      { attrId: 6, id: 19, valueName: '黑色' },
      { attrId: 6, id: 20, valueName: '红色' },
      { attrId: 6, id: 21, valueName: '金色' },
    ],
  },
  {
    id: 7,
    attrName: '续航',
    categoryId: 112,
    categoryLevel: 3,
    attrValueList: [
      { attrId: 7, id: 22, valueName: '3天' },
      { attrId: 7, id: 23, valueName: '7天' },
      { attrId: 7, id: 24, valueName: '15天' },
    ],
  },

  // ==================== 3. 笔记本 (categoryId: 121) ====================
  {
    id: 8,
    attrName: '品牌',
    categoryId: 121,
    categoryLevel: 3,
    attrValueList: [
      { attrId: 8, id: 25, valueName: '联想' },
      { attrId: 8, id: 26, valueName: '戴尔' },
      { attrId: 8, id: 27, valueName: '苹果' },
      { attrId: 8, id: 28, valueName: '华为' },
    ],
  },
  {
    id: 9,
    attrName: '颜色',
    categoryId: 121,
    categoryLevel: 3,
    attrValueList: [
      { attrId: 9, id: 29, valueName: '银色' },
      { attrId: 9, id: 30, valueName: '黑色' },
      { attrId: 9, id: 31, valueName: '灰色' },
    ],
  },
  {
    id: 10,
    attrName: '内存',
    categoryId: 121,
    categoryLevel: 3,
    attrValueList: [
      { attrId: 10, id: 32, valueName: '8GB' },
      { attrId: 10, id: 33, valueName: '16GB' },
      { attrId: 10, id: 34, valueName: '32GB' },
    ],
  },
  {
    id: 11,
    attrName: '硬盘',
    categoryId: 121,
    categoryLevel: 3,
    attrValueList: [
      { attrId: 11, id: 35, valueName: '512GB SSD' },
      { attrId: 11, id: 36, valueName: '1TB SSD' },
      { attrId: 11, id: 37, valueName: '2TB SSD' },
    ],
  },

  // ==================== 4. T恤 (categoryId: 211) ====================
  {
    id: 12,
    attrName: '颜色',
    categoryId: 211,
    categoryLevel: 3,
    attrValueList: [
      { attrId: 12, id: 38, valueName: '白色' },
      { attrId: 12, id: 39, valueName: '黑色' },
      { attrId: 12, id: 40, valueName: '灰色' },
      { attrId: 12, id: 41, valueName: '蓝色' },
    ],
  },
  {
    id: 13,
    attrName: '尺码',
    categoryId: 211,
    categoryLevel: 3,
    attrValueList: [
      { attrId: 13, id: 42, valueName: 'S' },
      { attrId: 13, id: 43, valueName: 'M' },
      { attrId: 13, id: 44, valueName: 'L' },
      { attrId: 13, id: 45, valueName: 'XL' },
      { attrId: 13, id: 46, valueName: 'XXL' },
    ],
  },
  {
    id: 14,
    attrName: '材质',
    categoryId: 211,
    categoryLevel: 3,
    attrValueList: [
      { attrId: 14, id: 47, valueName: '纯棉' },
      { attrId: 14, id: 48, valueName: '棉麻' },
      { attrId: 14, id: 49, valueName: '涤纶' },
    ],
  },

  // ==================== 5. 衬衫 (categoryId: 212) ====================
  {
    id: 15,
    attrName: '颜色',
    categoryId: 212,
    categoryLevel: 3,
    attrValueList: [
      { attrId: 15, id: 50, valueName: '白色' },
      { attrId: 15, id: 51, valueName: '蓝色' },
      { attrId: 15, id: 52, valueName: '灰色' },
    ],
  },
  {
    id: 16,
    attrName: '尺码',
    categoryId: 212,
    categoryLevel: 3,
    attrValueList: [
      { attrId: 16, id: 53, valueName: '38' },
      { attrId: 16, id: 54, valueName: '39' },
      { attrId: 16, id: 55, valueName: '40' },
      { attrId: 16, id: 56, valueName: '41' },
    ],
  },
  {
    id: 17,
    attrName: '领型',
    categoryId: 212,
    categoryLevel: 3,
    attrValueList: [
      { attrId: 17, id: 57, valueName: '标准领' },
      { attrId: 17, id: 58, valueName: '尖领' },
      { attrId: 17, id: 59, valueName: '方领' },
    ],
  },

  // ==================== 6. 裙子 (categoryId: 221) ====================
  {
    id: 18,
    attrName: '颜色',
    categoryId: 221,
    categoryLevel: 3,
    attrValueList: [
      { attrId: 18, id: 60, valueName: '黑色' },
      { attrId: 18, id: 61, valueName: '白色' },
      { attrId: 18, id: 62, valueName: '红色' },
      { attrId: 18, id: 63, valueName: '碎花' },
    ],
  },
  {
    id: 19,
    attrName: '尺码',
    categoryId: 221,
    categoryLevel: 3,
    attrValueList: [
      { attrId: 19, id: 64, valueName: 'S' },
      { attrId: 19, id: 65, valueName: 'M' },
      { attrId: 19, id: 66, valueName: 'L' },
      { attrId: 19, id: 67, valueName: 'XL' },
    ],
  },
  {
    id: 20,
    attrName: '款式',
    categoryId: 221,
    categoryLevel: 3,
    attrValueList: [
      { attrId: 20, id: 68, valueName: '连衣裙' },
      { attrId: 20, id: 69, valueName: '半身裙' },
      { attrId: 20, id: 70, valueName: 'A字裙' },
    ],
  },

  // ==================== 7. 电视 (categoryId: 311) ====================
  {
    id: 21,
    attrName: '品牌',
    categoryId: 311,
    categoryLevel: 3,
    attrValueList: [
      { attrId: 21, id: 71, valueName: '小米' },
      { attrId: 21, id: 72, valueName: '海信' },
      { attrId: 21, id: 73, valueName: 'TCL' },
      { attrId: 21, id: 74, valueName: '索尼' },
    ],
  },
  {
    id: 22,
    attrName: '尺寸',
    categoryId: 311,
    categoryLevel: 3,
    attrValueList: [
      { attrId: 22, id: 75, valueName: '55英寸' },
      { attrId: 22, id: 76, valueName: '65英寸' },
      { attrId: 22, id: 77, valueName: '75英寸' },
      { attrId: 22, id: 78, valueName: '85英寸' },
    ],
  },
  {
    id: 23,
    attrName: '分辨率',
    categoryId: 311,
    categoryLevel: 3,
    attrValueList: [
      { attrId: 23, id: 79, valueName: '4K' },
      { attrId: 23, id: 80, valueName: '8K' },
    ],
  },

  // ==================== 8. 夜灯 (categoryId: 321) ====================
  {
    id: 24,
    attrName: '品牌',
    categoryId: 321,
    categoryLevel: 3,
    attrValueList: [
      { attrId: 24, id: 81, valueName: '小米' },
      { attrId: 24, id: 82, valueName: '飞利浦' },
      { attrId: 24, id: 83, valueName: '欧普' },
    ],
  },
  {
    id: 25,
    attrName: '颜色',
    categoryId: 321,
    categoryLevel: 3,
    attrValueList: [
      { attrId: 25, id: 84, valueName: '白色' },
      { attrId: 25, id: 85, valueName: '黄色' },
      { attrId: 25, id: 86, valueName: '粉色' },
    ],
  },
  {
    id: 26,
    attrName: '亮度',
    categoryId: 321,
    categoryLevel: 3,
    attrValueList: [
      { attrId: 26, id: 87, valueName: '可调光' },
      { attrId: 26, id: 88, valueName: '固定亮度' },
    ],
  },
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
  // { id: 13, name: '平板', categoryId: 1, categoryLevel: 2 },
  { id: 21, name: '男装', categoryId: 2, categoryLevel: 2 },
  { id: 22, name: '女装', categoryId: 2, categoryLevel: 2 },
  { id: 31, name: '大家电', categoryId: 3, categoryLevel: 2 },
  { id: 32, name: '小家电', categoryId: 3, categoryLevel: 2 },

  // 三级分类 (categoryId: 对应二级分类的 id, categoryLevel: 3)
  { id: 111, name: '智能手机', categoryId: 11, categoryLevel: 3 },
  { id: 112, name: '老人机', categoryId: 11, categoryLevel: 3 },
  { id: 121, name: '笔记本', categoryId: 12, categoryLevel: 3 },
  { id: 211, name: 'T恤', categoryId: 21, categoryLevel: 3 },
  { id: 212, name: '衬衫', categoryId: 21, categoryLevel: 3 },
  { id: 221, name: '裙子', categoryId: 22, categoryLevel: 3 },
  { id: 311, name: '电视', categoryId: 31, categoryLevel: 3 },
  { id: 321, name: '夜灯', categoryId: 32, categoryLevel: 3 },
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
const verifyToken = req => {
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

  const user = users.find(u => u.username === username && u.password === password)

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

  const userInfo = users.find(u => u.username === user.username)
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

  const index = aclUsers.findIndex(u => u.id === req.body.id)
  if (index !== -1) {
    aclUsers[index] = {
      ...aclUsers[index],
      ...req.body,
      updateTime: new Date().toISOString().split('T')[0],
    }
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
  aclUsers = aclUsers.filter(u => u.id !== id)
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

  const index = roles.findIndex(r => r.id === req.body.id)
  if (index !== -1) {
    roles[index] = {
      ...roles[index],
      ...req.body,
      updateTime: new Date().toISOString().split('T')[0],
    }
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
  roles = roles.filter(r => r.id !== id)
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

  const index = permissions.findIndex(p => p.id === req.body.id)
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
  permissions = permissions.filter(p => p.id !== id)
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
  const index = trademarks.findIndex(t => t.id === id)
  if (index !== -1) {
    trademarks[index] = {
      ...trademarks[index],
      ...req.body,
      id: id,
      updateTime: new Date().toISOString().split('T')[0],
    }
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
  trademarks = trademarks.filter(t => t.id !== id)
  res.json({ code: 200, message: '删除成功', data: null, ok: true })
})

// 根据ID获取单个品牌
app.get('/admin/product/baseTrademark/get/:id', (req, res) => {
  const { valid, message } = verifyToken(req)
  if (!valid) return res.json({ code: 401, message, data: null, ok: false })

  const id = parseInt(req.params.id)
  const trademark = trademarks.find(t => t.id === id)
  if (trademark) {
    res.json({ code: 200, message: '获取成功', data: trademark, ok: true })
  } else {
    res.json({ code: 404, message: '品牌不存在', data: null, ok: false })
  }
})

// 获取全部品牌列表（不分页）
app.get('/admin/product/baseTrademark/getTrademarkList', (req, res) => {
  const { valid, message } = verifyToken(req)
  if (!valid) return res.json({ code: 401, message, data: null, ok: false })

  res.json({ code: 200, message: '获取成功', data: trademarks, ok: true })
})

// 根据关键词搜索品牌
app.get('/admin/product/baseTrademark/findBaseTrademarkByKeyword/:keyword', (req, res) => {
  const { valid, message } = verifyToken(req)
  if (!valid) return res.json({ code: 401, message, data: null, ok: false })

  const keyword = req.params.keyword.toLowerCase()
  const list = trademarks.filter(t => t.tmName.toLowerCase().includes(keyword))

  res.json({ code: 200, message: '搜索成功', data: list, ok: true })
})

// ==================== SPU管理接口 ====================

// 具体路由必须放在通配路由之前，否则 /admin/product/spuImageList/17 会被 /:page/:limit 匹配

// 获取SPU图片列表
app.get('/admin/product/spuImageList/:spuId', (req, res) => {
  const { valid, message } = verifyToken(req)
  if (!valid) return res.json({ code: 401, message, data: null, ok: false })

  const spuId = parseInt(req.params.spuId)
  const list = spuImages.filter(img => img.spuId === spuId)

  res.json({ code: 200, message: '获取成功', data: list, ok: true })
})

// 获取SPU销售属性
app.get('/admin/product/spuSaleAttrList/:spuId', (req, res) => {
  const { valid, message } = verifyToken(req)
  if (!valid) return res.json({ code: 401, message, data: null, ok: false })

  const spuId = parseInt(req.params.spuId)
  const list = spuSaleAttrs.filter(attr => attr.spuId === spuId)

  res.json({ code: 200, message: '获取成功', data: list, ok: true })
})

// 获取全部基础销售属性
app.get('/admin/product/baseSaleAttrList', (req, res) => {
  const { valid, message } = verifyToken(req)
  if (!valid) return res.json({ code: 401, message, data: null, ok: false })

  res.json({ code: 200, message: '获取成功', data: baseSaleAttrList, ok: true })
})

// 根据SPU ID获取已有的SKU列表
app.get('/admin/product/findBySpuId/:spuId', (req, res) => {
  const { valid, message } = verifyToken(req)
  if (!valid) return res.json({ code: 401, message, data: null, ok: false })

  const spuId = parseInt(req.params.spuId)
  const skuList = skus.filter(sku => sku.spuId === spuId)

  res.json({ code: 200, message: '获取成功', data: skuList, ok: true })
})

// 删除SPU
app.delete('/admin/product/deleteSpu/:spuId', (req, res) => {
  const { valid, message } = verifyToken(req)
  if (!valid) return res.json({ code: 401, message, data: null, ok: false })

  const spuId = parseInt(req.params.spuId)
  spus = spus.filter(s => s.id !== spuId)
  res.json({ code: 200, message: '删除成功', data: null, ok: true })
})

// 获取SPU列表（通配路由，必须放在最后）
app.get('/admin/product/:page/:limit', (req, res) => {
  const { valid, message } = verifyToken(req)
  if (!valid) return res.json({ code: 401, message, data: null, ok: false })

  const page = parseInt(req.params.page) || 1
  const limit = parseInt(req.params.limit) || 10
  const category3Id = req.query.category3Id

  let list = spus
  if (category3Id) {
    list = spus.filter(s => s.category3Id === parseInt(category3Id))
  }

  // 填充完整的图片和销售属性数据
  const records = list.map(spu => ({
    ...spu,
    spuImageList: spuImages.filter(img => img.spuId === spu.id),
    spuSaleAttrList: spuSaleAttrs.filter(attr => attr.spuId === spu.id),
  }))

  const start = (page - 1) * limit
  const end = start + limit

  res.json({
    code: 200,
    message: '获取成功',
    data: {
      records: records.slice(start, end),
      total: records.length,
      size: limit,
      current: page,
      pages: Math.ceil(records.length / limit),
    },
    ok: true,
  })
})

// 添加SPU
app.post('/admin/product/saveSpuInfo', (req, res) => {
  const { valid, message } = verifyToken(req)
  if (!valid) return res.json({ code: 401, message, data: null, ok: false })

  const { spuImageList, spuSaleAttrList, ...spuData } = req.body
  const newSpuId = Date.now()

  const newSpu = {
    id: newSpuId,
    ...spuData,
    spuImageList: [],
    spuSaleAttrList: [],
    createTime: new Date().toISOString().split('T')[0],
    updateTime: new Date().toISOString().split('T')[0],
  }
  spus.push(newSpu)

  // 保存图片
  if (spuImageList && spuImageList.length > 0) {
    spuImageList.forEach((img, index) => {
      spuImages.push({
        id: Date.now() + index,
        spuId: newSpuId,
        imgName: img.imgName || img.name || `image-${index}.jpg`,
        imgUrl: img.imgUrl || img.url,
      })
    })
  }

  // 保存销售属性
  if (spuSaleAttrList && spuSaleAttrList.length > 0) {
    spuSaleAttrList.forEach((attr, index) => {
      spuSaleAttrs.push({
        id: Date.now() + index,
        spuId: newSpuId,
        baseSaleAttrId: attr.baseSaleAttrId,
        saleAttrName: attr.saleAttrName,
        spuSaleAttrValueList: attr.spuSaleAttrValueList || [],
      })
    })
  }

  res.json({ code: 200, message: '添加成功', data: null, ok: true })
})

// 更新SPU
app.post('/admin/product/updateSpuInfo', (req, res) => {
  const { valid, message } = verifyToken(req)
  if (!valid) return res.json({ code: 401, message, data: null, ok: false })

  const { spuImageList, spuSaleAttrList, ...spuData } = req.body
  const spuId = parseInt(spuData.id)
  const index = spus.findIndex(s => s.id === spuId)

  if (index !== -1) {
    spus[index] = { ...spus[index], ...spuData, updateTime: new Date().toISOString().split('T')[0] }

    // 更新图片：先删除旧图片，再添加新图片
    if (spuImageList) {
      // 删除旧图片
      for (let i = spuImages.length - 1; i >= 0; i--) {
        if (spuImages[i].spuId === spuId) {
          spuImages.splice(i, 1)
        }
      }
      // 添加新图片
      spuImageList.forEach((img, idx) => {
        spuImages.push({
          id: Date.now() + idx,
          spuId: spuId,
          imgName: img.imgName || img.name || `image-${idx}.jpg`,
          imgUrl: img.imgUrl || img.url,
        })
      })
    }

    // 更新销售属性：先删除旧属性，再添加新属性
    if (spuSaleAttrList) {
      // 删除旧属性
      for (let i = spuSaleAttrs.length - 1; i >= 0; i--) {
        if (spuSaleAttrs[i].spuId === spuId) {
          spuSaleAttrs.splice(i, 1)
        }
      }
      // 添加新属性
      spuSaleAttrList.forEach((attr, idx) => {
        spuSaleAttrs.push({
          id: Date.now() + idx,
          spuId: spuId,
          baseSaleAttrId: attr.baseSaleAttrId,
          saleAttrName: attr.saleAttrName,
          spuSaleAttrValueList: attr.spuSaleAttrValueList || [],
        })
      })
    }

    res.json({ code: 200, message: '更新成功', data: null, ok: true })
  } else {
    res.json({ code: 404, message: 'SPU不存在', data: null, ok: false })
  }
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
  skus = skus.filter(s => s.id !== skuId)
  res.json({ code: 200, message: '删除成功', data: null, ok: true })
})

// SKU上架
app.get('/admin/product/onSale/:skuId', (req, res) => {
  const { valid, message } = verifyToken(req)
  if (!valid) return res.json({ code: 401, message, data: null, ok: false })

  const skuId = parseInt(req.params.skuId)
  const sku = skus.find(s => s.id === skuId)
  if (sku) {
    sku.isSale = 1
    sku.updateTime = new Date().toISOString().split('T')[0]
    res.json({ code: 200, message: '上架成功', data: null, ok: true })
  } else {
    res.json({ code: 404, message: 'SKU不存在', data: null, ok: false })
  }
})

// SKU下架
app.get('/admin/product/cancelSale/:skuId', (req, res) => {
  const { valid, message } = verifyToken(req)
  if (!valid) return res.json({ code: 401, message, data: null, ok: false })

  const skuId = parseInt(req.params.skuId)
  const sku = skus.find(s => s.id === skuId)
  if (sku) {
    sku.isSale = 0
    sku.updateTime = new Date().toISOString().split('T')[0]
    res.json({ code: 200, message: '下架成功', data: null, ok: true })
  } else {
    res.json({ code: 404, message: 'SKU不存在', data: null, ok: false })
  }
})

// 获取SKU详情
// app.get('/admin/product/getSkuById/:skuId', (req, res) => {
//   const { valid, message } = verifyToken(req)
//   if (!valid) return res.json({ code: 401, message, data: null, ok: false })

//   const skuId = parseInt(req.params.skuId)
//   const sku = skus.find(s => s.id === skuId)
//   if (sku) {
//     res.json({ code: 200, message: '获取成功', data: sku, ok: true })
//   } else {
//     res.json({ code: 404, message: 'SKU不存在', data: null, ok: false })
//   }
// })
// 获取SKU详情 【修复版】
app.get('/admin/product/sku/detail/:skuId', (req, res) => {
    // 加这一行！！！
  console.log('========= 我执行了！skuId =', req.params.skuId);
  const { valid, message } = verifyToken(req)
  if (!valid) return res.json({ code: 401, message, data: null, ok: false })

  const skuId = parseInt(req.params.skuId)

  // ------------- 关键修复 -------------
  // 如果 skus 是分页对象，先取出 records 数组
  const skuList = skus.records || skus

  // 再查找
  const sku = skuList.find(s => s.id === skuId)
  // ------------------------------------

  if (sku) {
    // 直接返回【单个对象】
    res.json({ code: 200, message: '获取成功', data: sku, ok: true })
  } else {
    res.json({ code: 404, message: 'SKU不存在', data: null, ok: false })
  }
})

// ==================== 属性管理接口 ====================
// 获取属性列表
app.get('/admin/product/attrInfoList/:category1Id/:category2Id/:category3Id', (req, res) => {
  const { valid, message } = verifyToken(req)
  if (!valid) return res.json({ code: 401, message, data: null, ok: false })

  const category3Id = parseInt(req.params.category3Id)
  const list = attrs.filter(a => a.categoryId === category3Id)

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
app.get('/admin/my/getCategory2/:category1Id', (req, res) => {
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
app.get('/admin/my/getCategory3/:category2Id', (req, res) => {
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
    const index = attrs.findIndex(a => a.id === req.body.id)
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
  attrs = attrs.filter(a => a.id !== attrId)
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
  console.log(`  GET    http://localhost:${PORT}/admin/product/baseTrademark/get/:id`)
  console.log(`  GET    http://localhost:${PORT}/admin/product/baseTrademark/getTrademarkList`)
  console.log(
    `  GET    http://localhost:${PORT}/admin/product/baseTrademark/findBaseTrademarkByKeyword/:keyword`
  )
  console.log(`  POST   http://localhost:${PORT}/admin/product/baseTrademark/save`)
  console.log(`  PUT    http://localhost:${PORT}/admin/product/baseTrademark/update`)
  console.log(`  DELETE http://localhost:${PORT}/admin/product/baseTrademark/remove/:id`)
  console.log('\n【SPU管理】')
  console.log(`  GET    http://localhost:${PORT}/admin/product/:page/:limit?category3Id=61`)
  console.log(`  GET    http://localhost:${PORT}/admin/product/spuImageList/:spuId`)
  console.log(`  GET    http://localhost:${PORT}/admin/product/spuSaleAttrList/:spuId`)
  console.log(`  GET    http://localhost:${PORT}/admin/product/baseSaleAttrList`)
  console.log(`  POST   http://localhost:${PORT}/admin/product/saveSpuInfo`)
  console.log(`  POST   http://localhost:${PORT}/admin/product/updateSpuInfo`)
  console.log(`  DELETE http://localhost:${PORT}/admin/product/deleteSpu/:spuId`)
  console.log('\n【SKU管理】')
  console.log(`  GET    http://localhost:${PORT}/admin/product/list/:page/:limit`)
  console.log(`  POST   http://localhost:${PORT}/admin/product/saveSkuInfo`)
  console.log(`  DELETE http://localhost:${PORT}/admin/product/deleteSku/:skuId`)
  console.log(`  GET    http://localhost:${PORT}/admin/product/onSale/:skuId`)
  console.log(`  GET    http://localhost:${PORT}/admin/product/cancelSale/:skuId`)
  console.log(`  GET    http://localhost:${PORT}/admin/product/getSkuById/:skuId`)
  console.log('\n【属性管理】')
  console.log(
    `  GET    http://localhost:${PORT}/admin/product/attrInfoList/:category1Id/:category2Id/:category3Id`
  )
  console.log(`  POST   http://localhost:${PORT}/admin/product/saveAttrInfo`)
  console.log(`  DELETE http://localhost:${PORT}/admin/product/deleteAttr/:attrId`)
  console.log('\n【数据大屏】')
  console.log(`  GET    http://localhost:${PORT}/screen/data`)
  console.log('\n👤 测试账号:')
  console.log('  管理员: admin / 111111')
  console.log('  普通用户: user / 111111\n')
})
