const restController = require('../controllers/restController')
const adminController = require('../controllers/adminController')
const userController = require('../controllers/userController')

module.exports = (app, passport) => {
  //加入身分驗證
  const authenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/signin')
  }

  const authenticatedAdmin = (req, res, next) => {
    if (req.isAuthenticated()) {
      if (req.user.isAdmin) { return next() }
      return res.redirect('/')
    }
    res.redirect('/signin')
  }

  //使用者如訪問首頁就會導向 / restaurants 頁面
  app.get('/', authenticated, (req, res) => res.redirect('/restaurants'))

  //在 /restaurant 底下交給 restController.getRestaurants 處理
  app.get('/restaurants', authenticated, restController.getRestaurants)

  //連到 /admin 頁面轉到 /admin/restaurants
  app.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/restaurants'))

  //在 /admin/restaurants 底下交給 adminControlles.getRestaurants 處理
  app.get('/admin/restaurants', authenticatedAdmin, adminController.getRestaurants)

  //設定新增餐廳表單路由
  app.get('/admin/restaurants/create', authenticatedAdmin, adminController.createRestaurant)
  app.post('/admin/restaurants', authenticatedAdmin, adminController.postRestaurant)

  //設定 show 餐廳路由
  app.get('/admin/restaurants/:id', authenticatedAdmin, adminController.getRestaurant)

  //設定 edit 餐廳路由
  app.get('/admin/restaurants/:id/edit', authenticatedAdmin, adminController.editRestaurant)
  app.put('/admin/restaurants/:id', authenticatedAdmin, adminController.putRestaurant)

  //設定刪除餐廳路由
  app.delete('/admin/restaurants/:id', authenticatedAdmin, adminController.deleteRestaurant)

  //設定註冊路由
  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)
  //設定登入和登出路由
  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
  app.get('/logout', userController.logout)
}