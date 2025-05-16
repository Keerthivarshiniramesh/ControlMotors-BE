const Express = require('express')
require('dotenv').config()
const mongoose = require('mongoose')
const session = require('express-session')
const mongodb_session = require('connect-mongodb-session')(session)
const cors = require('cors')


const SignUp = require('./Routers/SignUp')
const Login = require('./Routers/Login')
const Control = require('./Routers/ConrolMotor')


const app = Express()
app.use(Express.json())
app.use(Express.urlencoded({ extended: true }))


app.use(cors({
    origin: ['http://localhost:3001', 'http://localhost:3002', 'http://localhost:3000', 'https://zgn3hlb1-3000.inc1.devtunnels.ms'],
    credentials: true
}))
app.set('trust proxy', 1)
const port = process.env.port

mongoose.connect(process.env.MONGO_DB)
    .then(() => console.log("MongoDb Connected Successfully"))
    .catch((err) => console.log("Error in Connection between DB and express", (err)))



const Store = new mongodb_session({
    uri: process.env.MONGO_DB,
    collection: 'Sessions'
})

app.use(session({
    saveUninitialized: false,
    secret: process.env.Secret_Key,
    resave: false,
    store: Store,
    cookie: {
        httpOnly: true,
        sameSite: 'none',
        secure: true

    }
}))


app.use(SignUp)
app.use(Login)
app.use(Control)

app.listen(port, () => {
    console.log("Server is running in", port)
})