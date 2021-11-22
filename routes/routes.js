const express = require('express')
const router = express.Router()

const helpers = require('../_helpers')
const restController = require('../controllers/restController')
const adminController = require('../controllers/adminController')
const userController = require('../controllers/userController')
const categoryController = require('../controllers/categoryController')
const commentController = require('../controllers/commentController')

//加入 multer
const multer = require('multer')
const { authenticate } = require('passport')
const upload = multer({ dest: 'temp/' })

const passport = require('../config/passport')

//加入身分驗證
const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    return next()
  }
  res.redirect('/signin')
}

const authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).isAdmin) { return next() }
    return res.redirect('/')
  }
  res.redirect('/signin')
}

//使用者如訪問首頁就會導向 / restaurants 頁面
router.get('/', authenticated, (req, res) => res.redirect('/restaurants'))

//設定前台瀏覽餐廳路由
router.get('/restaurants', authenticated, restController.getRestaurants)

//設定最新動態路由
router.get('/restaurants/feeds', authenticated, restController.getFeeds)

//設定 TOP 10人氣餐廳路由
router.get('/restaurants/top', authenticated, restController.getTopRestaurant)

//設定前台瀏覽個別餐廳路由
router.get('/restaurants/:id', authenticated, restController.getRestaurant)

//設定 Dashboard 頁面路由
router.get('/restaurants/:id/dashboard', authenticated, restController.getDashBoard)

//設定評論餐廳路由
router.post('/comments', authenticated, commentController.postComment)

//設定管理員餐廳評論刪除路由
router.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment)

//設定美食達人頁面路由
router.get('/users/top', authenticated, userController.getTopUser)

//設定使用者個人資料瀏覽及編輯路由
router.get('/users/:id', authenticated, userController.getUser)
router.get('/users/:id/edit', authenticated, userController.editUser)
router.put('/users/:id', authenticated, upload.single('image'), userController.putUser)

//設定加入/移除最愛路由
router.post('/favorite/:restaurantId', authenticated, userController.addFavorite)
router.delete('/favorite/:restaurantId', authenticated, userController.removeFavorite)

//設定 Like/Unlike 路由
router.post('/like/:restaurantId', authenticated, userController.addLike)
router.delete('/like/:restaurantId', authenticated, userController.removeLike)

//設定追蹤功能路由
router.post('/following/:userId', authenticated, userController.addFollowing)
router.delete('/following/:userId', authenticated, userController.removeFollowing)

//連到 /admin 頁面轉到 /admin/restaurants
router.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/restaurants'))

//在 /admin/restaurants 底下交給 adminControlles.getRestaurants 處理
router.get('/admin/restaurants', authenticatedAdmin, adminController.getRestaurants)

//設定新增餐廳表單路由
router.get('/admin/restaurants/create', authenticatedAdmin, adminController.createRestaurant)
router.post('/admin/restaurants', authenticatedAdmin, upload.single('image'), adminController.postRestaurant)

//設定 show 餐廳路由
router.get('/admin/restaurants/:id', authenticatedAdmin, adminController.getRestaurant)

//設定 edit 餐廳路由
router.get('/admin/restaurants/:id/edit', authenticatedAdmin, adminController.editRestaurant)
router.put('/admin/restaurants/:id', authenticatedAdmin, upload.single('image'), adminController.putRestaurant)

//設定刪除餐廳路由
router.delete('/admin/restaurants/:id', authenticatedAdmin, adminController.deleteRestaurant)

//設定瀏覽 category 路由
router.get('/admin/categories', authenticatedAdmin, categoryController.getCategories)

//設定新增 category 路由
router.post('/admin/categories', authenticatedAdmin, categoryController.postCategory)

//設定編輯 category 路由
router.get('/admin/categories/:id', authenticatedAdmin, categoryController.getCategories)
router.put('/admin/categories/:id', authenticatedAdmin, categoryController.putCategory)

//設定刪除 category 路由
router.delete('/admin/categories/:id', authenticatedAdmin, categoryController.deleteCategory)

//設定註冊路由
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

//設定登入和登出路由
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)

//設定使用者權限路由
router.get('/admin/users', authenticatedAdmin, adminController.getUsers)
router.put('/admin/users/:id/toggleAdmin', authenticatedAdmin, adminController.toggleAdmin)

//設定登出路由
router.get('/logout', userController.logout)


module.exports = router