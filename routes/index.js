const restController = require('../controllers/restController')
const adminController = require('../controllers/adminController')

module.exports = app => {
  //使用者如訪問首頁就會導向 / restaurants 頁面
  app.get('/', (req, res) => res.redirect('/restaurants'))
  //在 /restaurant 底下交給 restController.getRestaurants 處理
  app.get('/restaurants', restController.getRestaurants)
  //連到 /admin 頁面轉到 /admin/restaurants
  app.get('/admin', (req, res) => res.redirect('/admin/restaurants'))
  //在 /admin/restaurants 底下交給 adminControlles.getRestaurants 處理
  app.get('/admin/restaurants', adminController.getRestaurants)
}