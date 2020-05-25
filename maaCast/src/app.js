const express = require('express')
const path = require('path')
const hbs = require('hbs')
const bodyParser = require('body-parser')
const logger = require('./service/logger_service')

const publicPath = path.join(__dirname,'../public')
const viewPath = path.join(__dirname,'../template/views')
const partialPath = path.join(__dirname,'../template/partials')

app = express()
app.use(express.static(publicPath))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.set('view engine', 'hbs')
app.set('views', viewPath)
hbs.registerPartials(partialPath)


//logger = new Logger('app')

app.get('/test',(req,res) => {
    logger.setLogData(req.body)
    logger.info("Request recieved at home", req.body)
    logger.info("Return success response - test", {"success": true})
    res.send('SUCCESS')
})

app.get('/test2',(req,res) => {
    logger.setLogData(req.body)
    logger.info("Request recieved at home", req.body)
    logger.info("Return success response - test2", {"success": true})
    res.send('Test2')
})



app.listen(8081, () => {
    logger.info('Server started! running at 8081')
})