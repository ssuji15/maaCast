const express = require('express')
const path = require('path')
const hbs = require('hbs')
app = express()
const publicPath = path.join(__dirname,'../public')
const viewPath = path.join(__dirname,'../template/views')
const partialPath = path.join(__dirname,'../template/partials')

app.use(express.static(publicPath))
app.set('view engine', 'hbs')
app.set('views', viewPath)
hbs.registerPartials(partialPath)


app.get('',(req,res) => {
    res.render('index')
})

app.get('/about',(req,res) => {
    res.render('about')
})

app.listen(3000, () => {
    console.log('Server started! running at 3000')
})