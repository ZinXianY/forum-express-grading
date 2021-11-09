const express = require('express')
const handlebars = require('express-handlebars')
const db = require('./models') //引入資料庫
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('./config/passport')
const app = express()
const port = 3000

//設定樣板引擎
app.engine('handlebars', handlebars())
app.set('view engine', 'handlebars')

//設定 body-parser
app.use(express.urlencoded({ extended: true }))

//設定 seesion, connect-flash
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
app.use(flash())

//設定 passport
app.use(passport.initialize())
app.use(passport.session())

// req.flash 放入 res.locals
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = req.user
  next()
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

require('./routes')(app, passport)

module.exports = app
