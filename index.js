const express = require('express')
const path = require('path')
const moongose = require('mongoose')
const authRouter = require('./routers/authRouter')
const trackRouter = require('./routers/trackRouter')
const userRouter = require('./routers/userRouter')
const receiptRouter = require('./routers/receiptRouter')
const fileRouter = require('./routers/fileRouter')
const cors = require('cors');
const https = require('https')
const fs = require('fs')
const fileUpload = require('express-fileupload')

const app = express()
app.use(express.json())
app.use(fileUpload({}))

// const url = 'aspan-cargo.kz'
// const url = 'marry-cargo.kz'
// const url = 'aks-cargo.kz'
// const url = 'g-cargo.kz'
// const url = 'ziya-cargo.kz'
// const url = 'dar-logistics.kz'
// const url = 'alan-cargo.kz'
// const url = 'dilya-cargo.kz'
// const url = 'ainar-cargo.kz'
// const url = 'zhan-cargo.kz'
// const url = 'zhappar-cargo.kz'
const url = 'akty-cargo.kz'
// const url = 'tau-cargo.kz'
// const url = 'aru-cargo.kz'
// const url = 'logo-cargo.kz'

// Certificate
const privateKey = fs.readFileSync(`/etc/letsencrypt/live/${url}/privkey.pem`, 'utf8');
const certificate = fs.readFileSync(`/etc/letsencrypt/live/${url}/cert.pem`, 'utf8');
const ca = fs.readFileSync(`/etc/letsencrypt/live/${url}/chain.pem`, 'utf8');

const credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca
};

const corsOptions ={
    origin:'*',
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
}
// app.use(express.static(path.join(__dirname, 'frontend')))

app.use(cors(corsOptions))
app.use('/api/auth', authRouter)
app.use('/api/track', trackRouter)
app.use('/api/user', userRouter)
app.use('/api/receipt', receiptRouter)
app.use('/api/file', fileRouter)
app.get('/', (req, res) => {
    res.end('Welcome!')
})

// app.use('/*', function (req, res) {
//     res.sendFile(path.join(__dirname + '/frontend/index.html'))
// })

const PORT = process.env.PORT || 5000

moongose.set('strictQuery', true);

const DB_URL = 'mongodb://127.0.0.1:27017/nodeproject'

async function startApp() {
    try {
        await moongose.connect(DB_URL).then(() => {
            console.log('MongoDB is connected...')
        })
        // app.listen(PORT, () => {
        //     console.log(`App started on port ${PORT} http`)
        // })
        https
            .createServer(credentials, app)
            .listen(PORT, ()=>{
                console.log('server is runing at port 5000 https')
            })
    } catch (e) {
        console.log(e)
    }
}

startApp()
