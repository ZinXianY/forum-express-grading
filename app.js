const express = require('express')
const exhbs = require('express-handlebars')
const app = express()
const port = 3000

//設定樣板引擎
app.engine('hbs', exhbs())
app.set('view engine', 'hbs')

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

require('./routes')(app)

module.exports = app
